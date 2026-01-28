// src/pages/ClassManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Trash2, Table, Clock, Edit, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import Layout from './Layout.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 }
};

const ClassManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/classes');
      setClasses(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return classes.filter(c => {
      const teacherName = c.head_teacher?.fullname || c.headTeacher?.fullname || 'Unknown';
      const matchesSearch =
        (c.classname || '').toLowerCase().includes(search.toLowerCase()) ||
        teacherName.toLowerCase().includes(search.toLowerCase());

      const totalStudents = c.total_students || 0;
      const matchesCapacity =
        capacityFilter === 'All' ||
        (capacityFilter === 'Full' && totalStudents >= c.capacity) ||
        (capacityFilter === 'Available' && totalStudents < c.capacity);

      return matchesSearch && matchesCapacity;
    });
  }, [search, capacityFilter, classes]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this class? This will also affect student assignments.')) {
      try {
        await axios.delete(`/classes/${id}`);
        setClasses(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error("Error deleting class:", err);
        alert("Failed to delete class. It might have students or other dependencies.");
      }
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-8 overflow-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
            <p className="text-gray-500 mt-1">Manage nursery classes, teachers, and student capacity.</p>
          </div>
          <button
            onClick={() => navigate('/AddNewClass')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-md"
          >
            <Plus size={20} />
            Add New Class
          </button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-center border border-gray-100"
        >
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by class name or head teacher..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter By Capacity:</span>
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={capacityFilter}
              onChange={e => setCapacityFilter(e.target.value)}
            >
              <option value="All">All Capacities</option>
              <option value="Full">Full (At capacity)</option>
              <option value="Available">Available Space</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/ViewTimetable')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition shadow-sm font-medium"
          >
            <Table size={18} />
            Global Timetable
          </button>
        </motion.div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchClasses} className="underline font-medium">Retry</button>
          </div>
        )}

        {/* Class List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4"
        >
          <AnimatePresence mode='wait'>
            {filtered.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No classes found</h3>
                <p className="text-gray-500">Try adjusting your search or filter keywords.</p>
              </motion.div>
            ) : (
              filtered.map(cls => (
                <motion.div
                  key={cls.id}
                  variants={cardVariants}
                  layout
                  onClick={() => navigate(`/class/${cls.id}`)}
                  className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                          <Users size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {cls.classname}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                              Room: {cls.room || 'N/A'}
                            </span>
                            <span className="text-sm font-medium text-gray-400">•</span>
                            <span className="text-sm font-medium text-gray-500">
                              Age: {cls.ageGroup || '4-6'} yrs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Teacher Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={cls.head_teacher?.avatar || cls.headTeacher?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cls.headTeacher?.fullname || 'No Teacher')}&background=random`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          alt="Teacher"
                        />
                        <div className="hidden sm:block">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Head Teacher</p>
                          <p className="text-sm font-medium text-gray-700">
                            {cls.head_teacher?.fullname || cls.headTeacher?.fullname || 'Unassigned'}
                          </p>
                        </div>
                      </div>

                      {/* Enrollment Meter */}
                      <div className="w-48 hidden md:block">
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-xs font-semibold text-gray-500">ENROLLMENT</span>
                          <span className="text-xs font-bold text-indigo-600">
                            {cls.total_students || 0} / {cls.capacity}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((cls.total_students || 0) / cls.capacity) * 100)}%` }}
                            className={`h-full rounded-full ${((cls.total_students || 0) >= cls.capacity) ? 'bg-amber-500' : 'bg-indigo-600'}`}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ViewTimetable?class=${cls.id}`);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Timetable"
                        >
                          <Clock size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/class/edit/${cls.id}`);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Class"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, cls.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Class"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ClassManagement;
