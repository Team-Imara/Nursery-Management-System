// src/pages/ClassManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2 } from 'lucide-react';
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
    if (window.confirm('Delete this class?')) {
      try {
        await axios.delete(`/classes/${id}`);
        setClasses(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error("Error deleting class:", err);
        alert("Failed to delete class");
      }
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading classes...</div>;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-8 overflow-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <button
            onClick={() => navigate('/AddNewClass')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-md"
          >
            <Plus size={20} />
            Add New Class
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-3"
        >
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by class or teacher"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={capacityFilter}
            onChange={e => setCapacityFilter(e.target.value)}
          >
            <option value="All">Capacity: All</option>
            <option value="Full">Full</option>
            <option value="Available">Available</option>
          </select>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {error && <div className="text-red-500 text-center">{error}</div>}

          <AnimatePresence>
            {!loading && filtered.length === 0 ? (
              <motion.div
                key="no-classes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-500"
              >
                No classes found.
              </motion.div>
            ) : (
              filtered.map(cls => (
                <motion.div
                  key={cls.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(`/class/${cls.id}`)}
                  className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-indigo-100"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cls.classname}
                      </h3>

                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={cls.head_teacher?.avatar || cls.headTeacher?.avatar || 'https://via.placeholder.com/32'}
                            className="w-8 h-8 rounded-full border border-gray-200"
                            alt="Teacher"
                          />
                          <span className="text-sm text-gray-600">
                            {cls.head_teacher?.fullname || cls.headTeacher?.fullname || 'No Teacher'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, ((cls.total_students || 0) / cls.capacity) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {cls.total_students || 0}/{cls.capacity} students
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => handleDelete(e, cls.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
