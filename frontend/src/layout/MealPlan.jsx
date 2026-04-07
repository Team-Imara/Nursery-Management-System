import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MealPlanForm from '../components/MealplanForm';
import { UserPlus, BriefcaseMedical, Utensils, Loader2 } from 'lucide-react';
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
   Student Tracking Log
   ------------------------------------------------- */
function StudentTrackingLog() {
  const students = [
    {
      name: 'Aarav Patel',
      class: 'Kindergarten',
      avatar: 'boy',
      date: '12 Oct 2025',
      meal: 'Lunch',
      notes: 'Skipped due to allergy risk',
      status: 'risk',
      action: 'Notify Parent',
    },
    {
      name: 'Sara Khan',
      class: 'LKG',
      avatar: 'girl',
      date: '12 Oct 2025',
      meal: 'Breakfast',
      notes: 'Ate 80%',
      status: 'healthy',
      action: 'Mark Follow-up',
    },
    {
      name: 'Rohan Das',
      class: 'UKG',
      avatar: 'boy',
      date: '12 Oct 2025',
      meal: 'Snack',
      notes: 'Requested extra milk',
      status: 'review',
      action: 'Add Note',
    },
  ];

  const getStatusStyle = status =>
    status === 'risk'
      ? 'bg-red-100 text-red-800'
      : status === 'healthy'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Student Meal Tracking Log</h3>
        <div className="flex gap-2 mt-3">
          {['All Students', 'Kindergarten1', 'Kindergarten2'].map(filter => (
            <button
              key={filter}
              className={`px-4 py-2 text-sm rounded-md font-medium ${filter === 'All Students'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Student', 'Date', 'Meal', 'Notes', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.class}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.meal}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{student.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(student.status)}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${student.status === 'risk'
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {student.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Warnings & Suggestions (right column)
   ------------------------------------------------- */
function WarningsAndSuggestions() {
  return (
    <motion.div variants={cardAnimationVariants} className="space-y-6">
      {/* Warnings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health & Allergy Warnings</h3>
        <div className="space-y-3">
          <div className="bg-red-500 text-white rounded-lg p-4 text-sm">
            Contains peanuts — not suitable for Aarav.
          </div>
          <div className="bg-yellow-500 text-gray-900 rounded-lg p-4 text-sm">
            Too sugary for Sara — consider alternative
          </div>
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
  const [loading, setLoading] = useState(true);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/meal-plans');
      console.log('Meal plan API data:', response.data);
      setMealData(response.data || []);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
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
            <WarningsAndSuggestions />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-3">
            <StudentTrackingLog />
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
