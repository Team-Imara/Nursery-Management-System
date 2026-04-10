
// src/pages/ClassManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Trash2, Table, Clock, Edit, Users, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import Layout from '../components/Layout.jsx';

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
  const [classes, setClasses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/classes');
      setClasses(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    }
  };

  const filtered = useMemo(() => {
    if (!classes || !Array.isArray(classes)) return [];
    
    return classes.filter(c => {
      const teacherName = c.head_teacher?.fullname || c.headTeacher?.fullname || 'Unknown';
      const matchesSearch =
        (c.classname || '').toLowerCase().includes(search.toLowerCase()) ||
        teacherName.toLowerCase().includes(search.toLowerCase());

      const totalStudents = c.students_count ?? c.total_students ?? 0;
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
          </div>
          <button
            onClick={() => navigate('/AddNewClass')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-md"
          >
            <Plus size={20} />
            Add New Class
          </button>
        </div>


        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchClasses} className="underline font-medium">Retry</button>
          </div>
        )}

        {/* Class List */}
        <div className="grid grid-cols-1 gap-4">
            {classes !== null && (
              filtered.length === 0 ? (
                <div
                  className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No classes found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter keywords.</p>
                </div>
              ) : (
                filtered.map(cls => (
                  <motion.div
                    key={cls.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    onClick={() => navigate(`/class/${cls.id}`)}
                    className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <Building2 size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {cls.classname} - {cls.sections}
                            </h3>
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
                              {cls.students_count ?? cls.total_students ?? 0} / {cls.capacity}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, ((cls.students_count ?? cls.total_students ?? 0) / cls.capacity) * 100)}%` }}
                              className={`h-full rounded-full ${((cls.students_count ?? cls.total_students ?? 0) >= cls.capacity) ? 'bg-amber-500' : 'bg-indigo-600'}`}
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
              )
            )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default ClassManagement;

