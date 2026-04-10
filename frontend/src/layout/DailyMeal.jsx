import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Utensils, 
  Save, 
  AlertCircle,
  FileText,
  User,
  Filter,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function DailyMeals() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [existingRecords, setExistingRecords] = useState([]);
  const [currentTab, setCurrentTab] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, classesRes, plansRes] = await Promise.all([
          axios.get('/students'),
          axios.get('/classes'),
          axios.get('/meal-plans')
        ]);
        setStudents(studentsRes.data || []);
        setClasses(classesRes.data || []);
        setMealPlans(plansRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load initial data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch records for the selected date
  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/student-meals?date=${selectedDate}`);
      setExistingRecords(response.data || []);
      
      // Initialize form data with existing records
      const initialForm = {};
      response.data.forEach(record => {
        // Assume status is stored as "CompletionStatus|PlanStatus"
        const [completion, plan] = (record.status || '|').split('|');
        initialForm[record.student_id] = {
          completion: completion || 'Not Completed',
          plan: plan || 'Not Following Plan',
          notes: record.notes || '',
          recordId: record.id
        };
      });
      
      // Fill in defaults for students with no records
      students.forEach(student => {
        if (!initialForm[student.id]) {
          initialForm[student.id] = {
            completion: 'Not Completed',
            plan: 'Not Following Plan',
            notes: ''
          };
        }
      });
      setFormData(initialForm);
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  useEffect(() => {
    if (students.length > 0) {
      fetchRecords();
    }
  }, [selectedDate, students]);

  const updateForm = (studentId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  // Get current meal plan for selection (based on the day of week)
  const currentDayName = useMemo(() => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }, [selectedDate]);

  const todaysMealPlan = useMemo(() => {
    return mealPlans.find(p => p.day === currentDayName) || mealPlans[0];
  }, [currentDayName, mealPlans]);

  const handleSaveAll = async () => {
    if (!todaysMealPlan) {
      setError('No meal plan found for today. Please create a meal plan first.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const savePromises = students.map(async (student) => {
        const data = formData[student.id];
        const statusString = `${data.completion}|${data.plan}`;
        
        const payload = {
          student_id: student.id,
          class_id: student.class_id || student.classe?.id,
          meal_plan_id: todaysMealPlan.id,
          date: selectedDate,
          status: statusString,
          notes: data.notes,
          suitable: true // Default to true, backend logic handles allergens
        };

        if (data.recordId) {
          return axios.put(`/student-meals/${data.recordId}`, payload);
        } else {
          return axios.post('/student-meals', payload);
        }
      });

      await Promise.all(savePromises);
      setSuccess('All daily meal records have been successfully updated.');
      fetchRecords(); // Refresh data
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error saving records:', err);
      setError('Failed to save some records. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesTab = currentTab === 'All Students' || s.classe?.classname === currentTab;
      const matchesSearch = s.fullname.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [students, currentTab, searchQuery]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading daily meal logs...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <div className="flex items-center justify-start mb-6">
          <button
            onClick={() => navigate('/meal-plan')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium"
          >
            <ArrowLeft size={20} />
            Back to Meal Plan
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Utensils className="text-blue-600" size={32} />
              Daily Meal Management
            </h1>
            <p className="text-gray-500 font-medium max-w-xl">
              Monitor and record student meal consumption and adherence to the daily plan.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
              />
            </div>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save All Records
            </button>
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 text-sm font-bold shadow-sm"
            >
              <CheckCircle2 size={20} className="text-green-500" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold shadow-sm"
            >
              <AlertCircle size={20} className="text-red-500" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Tabs */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setCurrentTab('All Students')}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  currentTab === 'All Students' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                All Students
              </button>
              {classes.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setCurrentTab(cls.classname)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    currentTab === cls.classname 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {cls.classname}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Find a student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all w-full md:w-64"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Daily Meal Status</th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Meal Plan Adherence</th>
                  <th className="px-8 py-5 text-xs font-semibold text-gray-400 uppercase tracking-widest">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                  <motion.tr 
                    layout
                    key={student.id} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border-2 shadow-sm transition-transform group-hover:scale-110 ${
                          student.gender === 'Female' ? 'bg-pink-50 text-pink-500 border-pink-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                        }`}>
                          {student.image ? (
                             <img src={student.image} alt="" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                             student.fullname.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{student.fullname}</div>
                          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{student.classe?.classname} {student.section && `• ${student.section}`}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateForm(student.id, 'completion', 'Completed')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-2 transition-all ${
                            formData[student.id]?.completion === 'Completed'
                              ? 'bg-green-100 border-green-200 text-green-700 shadow-sm'
                              : 'bg-white border-gray-100 text-gray-400 hover:border-green-100 hover:text-green-400'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          Completed
                        </button>
                        <button
                          onClick={() => updateForm(student.id, 'completion', 'Not Completed')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-2 transition-all ${
                            formData[student.id]?.completion === 'Not Completed'
                              ? 'bg-red-100 border-red-200 text-red-700 shadow-sm'
                              : 'bg-white border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-400'
                          }`}
                        >
                          <XCircle size={16} />
                          Not Completed
                        </button>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateForm(student.id, 'plan', 'Following Plan')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-2 transition-all ${
                            formData[student.id]?.plan === 'Following Plan'
                              ? 'bg-blue-100 border-blue-200 text-blue-700 shadow-sm'
                              : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100 hover:text-blue-400'
                          }`}
                        >
                          Following
                        </button>
                        <button
                          onClick={() => updateForm(student.id, 'plan', 'Not Following Plan')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-2 transition-all ${
                            formData[student.id]?.plan === 'Not Following Plan'
                              ? 'bg-amber-100 border-amber-200 text-amber-700 shadow-sm'
                              : 'bg-white border-gray-100 text-gray-400 hover:border-amber-100 hover:text-amber-400'
                          }`}
                        >
                          Off Plan
                        </button>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 focus-within:bg-white focus-within:border-blue-200 transition-all">
                        <FileText size={14} className="text-gray-300" />
                        <input
                          type="text"
                          placeholder="Quick observations..."
                          value={formData[student.id]?.notes || ''}
                          onChange={(e) => updateForm(student.id, 'notes', e.target.value)}
                          className="bg-transparent border-none text-sm font-medium focus:outline-none w-full text-gray-600 placeholder:text-gray-300 placeholder:font-bold italic"
                        />
                       </div>
                    </td>
                  </motion.tr>
                )) : (
                   <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                           <Search className="text-gray-200" size={32} />
                        </div>
                        <p className="text-gray-400 font-bold italic tracking-wide">No students found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Log Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full -ml-20 -mb-20"></div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">Today's Consumption Log</h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                  {selectedDate}
                </span>
                <span className="text-slate-400 text-sm font-bold flex items-center gap-1.5">
                   <ArrowRight size={14} /> 
                   Total Records Recorded: {existingRecords.length}
                </span>
              </div>
            </div>
            {todaysMealPlan && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                   <Utensils size={20} className="text-blue-400" />
                </div>
                <div>
                   <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Currently Serving</div>
                   <div className="text-sm font-bold">{todaysMealPlan.meal_name}</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingRecords.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <p className="text-slate-500 font-bold italic">Waiting for records to be submitted...</p>
              </div>
            ) : existingRecords.map(record => {
              const student = students.find(s => s.id === record.student_id);
              const [comp, plan] = (record.status || '|').split('|');
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={record.id} 
                  className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:translate-y-[-4px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
                          {student?.fullname.charAt(0)}
                       </div>
                       <strong className="text-sm font-bold tracking-tight uppercase">{student?.fullname}</strong>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${comp === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {comp}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${plan === 'Following Plan' ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
                       <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{plan}</span>
                    </div>
                    {record.notes && (
                      <p className="text-xs text-slate-400 font-medium italic leading-relaxed border-l-2 border-slate-700 pl-3">
                        "{record.notes}"
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}