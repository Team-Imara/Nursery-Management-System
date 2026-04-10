import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MealPlanForm from '../components/MealplanForm';
import { UserPlus, BriefcaseMedical, Utensils, Loader2, Search, Bell, CheckCircle, Notebook, Filter, MessageSquare, ShieldAlert, Heart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';

/* -------------------------------------------------
   Animation variants
   ------------------------------------------------- */

const cardAnimationVariants = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 10, duration: 0.6 },
  },
};


/* -------------------------------------------------
   Meal Plan Table
   ------------------------------------------------- */
function MealCell({ meal }) {
  return (
    <td className="px-4 py-4 border-r border-gray-200 last:border-r-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{meal || '—'}</span>
      </div>
    </td>
  );
}

function MealRow({ type, days }) {
  return (
    <tr className="border-b border-gray-200 last:border-b-0">
      <td className="px-4 py-4 border-r border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
        {type}
      </td>
      {days.map((day, idx) => (
        <MealCell key={idx} meal={day.meal_name} />
      ))}
    </tr>
  );
}

function MealPlanTable({ data, loading }) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const MEAL_TYPES = ['Breakfast', 'Snack'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-sm text-gray-400 font-medium">Fetching weekly meal plan...</p>
      </div>
    );
  }

  // Transform flat API array into rows/cells
  const getRowData = (type) => {
    if (!Array.isArray(data)) return DAYS.map(() => ({ meal_name: '—' }));
    return DAYS.map(dayKey => {
      const match = data.find(m => m.meal_type === type && m.day === dayKey);
      return match ? { meal_name: match.meal_name } : { meal_name: '—' };
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Meal Type
            </th>
            {DAYS.map(day => (
              <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                {day.substring(0, 3).toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEAL_TYPES.map(type => (
            <MealRow key={type} type={type} days={getRowData(type)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------
   Student Meal Tracking Log
   ------------------------------------------------- */
function StudentMealTrackingLog({ students, classes, loading }) {
  const [activeTab, setActiveTab] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = useMemo(() => {
    if (!classes) return ['All Students'];
    return ['All Students', ...classes.map(c => c.classname)];
  }, [classes]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    
    return students.filter(s => {
      const matchesTab = activeTab === 'All Students' || s.classe?.classname === activeTab;
      const matchesSearch = s.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (s.allergies && s.allergies.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [students, activeTab, searchQuery]);

  const getStatusInfo = (student) => {
    if (student.allergies) return { label: 'Risk', color: 'bg-red-100 text-red-700 border-red-200', note: `Skipped due to ${student.allergies}` };
    if (student.special_needs) return { label: 'Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', note: 'Ate 70% - Monitor behavior' };
    return { label: 'Healthy', color: 'bg-green-100 text-green-700 border-green-200', note: 'Ate 100% - Finished all' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400 font-medium italic">Preparing student tracking log...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-gray-100 overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Student Meal Tracking Log</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Daily monitoring of student nutritional intake and safety.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-y-[-1px]' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Meal</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Notes</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => {
              const status = getStatusInfo(student);
              return (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={student.id} 
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-transform group-hover:scale-105 ${
                        student.gender === 'Female' ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {student.image ? (
                           <img src={student.image} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                           student.fullname.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{student.fullname}</div>
                        <div className="text-xs text-gray-500 font-medium">{student.classe?.classname} {student.section && `• ${student.section}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-700">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                      <Utensils size={12} />
                      Lunch
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs leading-relaxed font-medium">
                        {status.note}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 ${status.color}`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${status.label === 'Risk' ? 'bg-red-500' : status.label === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button title="Notify Parent" className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                        <Bell size={18} />
                      </button>
                      <button title="Mark Follow-up" className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm">
                        <CheckCircle size={18} />
                      </button>
                      <button title="Add Note" className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                        <Notebook size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            }) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                       <Search className="text-gray-200" size={32} />
                    </div>
                    <p className="text-gray-400 font-medium italic">No students found matching your filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Warnings & Suggestions (right column)
   ------------------------------------------------- */
function WarningsAndSuggestions({ students }) {
  const allergyList = useMemo(() => {
    if (!students) return [];
    return students.filter(s => s.allergies).map(s => ({
        name: s.fullname,
        issue: s.allergies
    }));
  }, [students]);

  return (
    <motion.div variants={cardAnimationVariants} className="space-y-6">
      {/* Warnings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BriefcaseMedical className="text-red-500 w-5 h-5" />
            Critical Health Warnings
        </h3>
        <div className="space-y-3 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
          {allergyList.length > 0 ? allergyList.map((item, idx) => (
            <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-4 text-sm">
              <span className="font-bold text-red-800">{item.name}:</span>
              <p className="text-red-700 mt-1">{item.issue}</p>
            </div>
          )) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 text-sm text-green-700">
                No critical allergies reported in current records.
            </div>
          )}
          
          {students?.filter(s => s.special_needs).map((s, idx) => (
             <div key={`sn-${idx}`} className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm text-amber-800">
                <span className="font-bold">{s.fullname} (Special Needs):</span>
                <p className="mt-1">{s.special_needs}</p>
             </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function QuickActions() {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={cardAnimationVariants}
      className="bg-white rounded-xl border border-gray-200 py-3 px-6"
    >
      <div className="grid grid-rows-3 gap-3">
        <button onClick={() => navigate('/daily-meal')} className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <UserPlus className="w-6 h-6 text-blue-800" />
          </div>
          <span className="text-sm font-medium text-gray-900">Daily Meal</span>
        </button>
        <button onClick={() => navigate('/student-health')} className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <BriefcaseMedical className="w-6 h-6 text-blue-800" />
          </div>
          <span className="text-sm font-medium text-gray-900">Student Health Issues</span>
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------
   Main App
   ------------------------------------------------- */
export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [mealData, setMealData] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/meal-plans');
      setMealData(response.data || []);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await axios.get('/students');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await axios.get('/classes');
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
    fetchStudents();
    fetchClasses();
  }, []);

  return (
    <Layout>
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN – 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + button */}
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <Utensils className="w-8 h-8 text-gray-900" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Meal Plan</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Plan meals for the week for all classes.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 flex items-center gap-2"
                >
                  <Utensils size={16} />
                  Add/Update Meal Plan
                </button>
              </div>
            </div>

            {/* Meal Table */}
            <MealPlanTable data={mealData} loading={loading} />
          </div>

          {/* RIGHT COLUMN – 1/3 */}
          <div>
            <WarningsAndSuggestions students={students} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-3">
            <StudentMealTrackingLog 
               students={students} 
               classes={classes}
               loading={loadingStudents || loadingClasses} 
            />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>


      </main>
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <MealPlanForm
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                  fetchMealPlan();
                  setShowForm(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
