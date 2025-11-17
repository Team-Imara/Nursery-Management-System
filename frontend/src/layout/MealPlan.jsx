import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderRightSection from '../components/HeaderRightSection';
import Sidebar from '../components/Sidebar';
import MealPlanForm from '../components/MealplanForm';
import {UserPlus, BriefcaseMedical, FileBarChart} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {Utensils} from 'lucide-react';

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
   Small Filters Box (inline next to title)
   ------------------------------------------------- */
function FiltersBox() {
  return (
    <motion.div
      variants={cardAnimationVariants}
      className="flex items-center gap-4"
    >
      <div>
        <label className="text-md font-medium text-gray-600">Class:</label>
        <select className="ml-1 text-md px-4 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-800">
          <option>All</option>
          <option>Kindergarten1</option>
          <option>Kindergarten2</option>
         
        </select>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------
   Meal Plan Table
   ------------------------------------------------- */
function MealCell({ meal, indicator }) {
  const color =
    indicator === 'healthy' ? 'bg-green-500' :
    indicator === 'review' ? 'bg-yellow-500' :
    indicator === 'allergy' ? 'bg-red-500' : '';

  return (
    <td className="px-4 py-4 border-r border-gray-200 last:border-r-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{meal}</span>
        {indicator && <div className={`w-2 h-2 rounded-full ${color}`} />}
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
        <MealCell key={idx} meal={day.meal} indicator={day.indicator} />
      ))}
    </tr>
  );
}

function MealPlanTable() {
  const breakfastData = [
    { day: 'Mon', meal: 'Fruit salad', indicator: 'healthy' },
    { day: 'Tue', meal: 'Idli & milk', indicator: 'healthy' },
    { day: 'Wed', meal: 'Upma', indicator: 'healthy' },
    { day: 'Thu', meal: 'Oat porridge', indicator: 'healthy' },
    { day: 'Fri', meal: '—' },
  ];

  const snackData = [
    { day: 'Mon', meal: 'Banana', indicator: 'healthy' },
    { day: 'Tue', meal: 'Yogurt', indicator: 'healthy' },
    { day: 'Wed', meal: 'Apple slices', indicator: 'review' },
    { day: 'Thu', meal: 'Chickpea salad', indicator: 'healthy' },
    { day: 'Fri', meal: '—' },
  ];

  return (
    <motion.div variants={cardAnimationVariants} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Meal Type
            </th>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <MealRow type="Breakfast" days={breakfastData} />
          <MealRow type="Snack" days={snackData} />
        </tbody>
      </table>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-600">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-gray-600">Needs review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-600">Allergy risk</span>
        </div>
      </div>
    </motion.div>
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
    <motion.div variants={cardAnimationVariants} className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Student Meal Tracking Log</h3>
        <div className="flex gap-2 mt-3">
          {['All Students', 'Kindergarten1','Kindergarten2'].map(filter => (
            <button
              key={filter}
              className={`px-4 py-2 text-sm rounded-md font-medium ${
                filter === 'All Students'
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
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      student.status === 'risk'
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
    </motion.div>
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

      {/* Suggestions 
      <div className="bg-slate-800 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Predictions & Suggestions</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span>•</span>
            <span>Banana smoothie instead of peanut butter sandwich.</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Use whole wheat wrap instead of fried snack.</span>
          </li>
        </ul>
      </div>*/}
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
            <UserPlus className="w-6 h-6 text-blue-800"/>
          </div>
          <span className="text-sm font-medium text-gray-900">Daily Meal</span>
        </button>
        <button  onClick={() => navigate('/student-health')} className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
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
  
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
              onNotificationClick={() => alert('Notifications clicked!')}
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* LEFT COLUMN – 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title + Filters (inline) */}
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                <Utensils className="w-8 h-8 text-gray-900" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Meal Plan</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Plan meals for the week.
                  </p>

                </div>
                </div>
                <div className="flex items-center gap-4">
                <FiltersBox /> {/* This is the small box next to title */}
                  <button  onClick={() => setShowForm(true)} className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700">
                  Add/Update Meal Plan
                </button>
                </div>
              </div>
               

              {/* Meal Table */}
              <MealPlanTable />

              {/* Action Buttons */}
               


          
            </div>

            {/* RIGHT COLUMN – 1/3 */}
            <div>
              <WarningsAndSuggestions />
            </div>
               {/* Student Log */}

          </motion.div>
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.15 } },
            }} className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
               <div className="lg:col-span-3">
              <StudentTrackingLog/>
              </div>
              <div>
              <QuickActions />
              </div>
            </motion.div>
           
         
        </main>
      </div>
       {showForm && (
 <AnimatePresence>
  {showForm && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }} 
      transition={{
        duration: 0.4,
        scale: { type: "spring", duration: 0.4, bounce: 0.3 },
        opacity: { duration: 0.3 }, 
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" // Overlay with centering
      onClick={() => setShowForm(false)} 
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        <MealPlanForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            alert('Meal plan saved successfully!');
            setShowForm(false);
          }}
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
)}
    </div>
  );
}