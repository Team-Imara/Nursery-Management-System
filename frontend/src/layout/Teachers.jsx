// src/pages/Teachers.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, X, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherCard from '../components/TeacherCard';
import WeeklyAttendanceSummary from '../components/WeeklyAttendanceSummary';
import Layout from '../components/Layout.jsx';

import axios from '../api/axios.js';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Attendance specific states
  const [teacherAttendanceData, setTeacherAttendanceData] = useState([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();
  const newTeacher = location.state?.newTeacher;

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/users?role=teacher');
      const formattedTeachers = response.data.map(user => ({
        id: user.id,
        name: user.fullname,
        subject: user.teaching_subject || 'N/A',
        class: user.assigned_class_text || 'N/A',
        room: user.room_text || 'N/A',
        experience: user.experience ? `${user.experience}` : 'N/A',
        email: user.email,
        phone: user.phone || 'N/A',
        status: user.status || 'Active',
        image: user.profile_photo_url || user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random`,
        raw: user
      }));
      setTeachers(formattedTeachers);
    } catch (error) {
      console.error('Error fetching teachers', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('/teacher-attendances/get-weekly-summary');
      setTeacherAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance summary', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (newTeacher && teachers.length > 0) {
      fetchTeachers();
      // clear the state to prevent infinite loops if page remounts
      window.history.replaceState({}, document.title)
    }
  }, [newTeacher]);

  const filteredTeachers = teachers.filter(t => {
    const nameMatch = t.name ? t.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const subjectMatch = t.subject ? t.subject.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = nameMatch || subjectMatch;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = teachers.length;
  const active = teachers.filter(t => t.status === 'Active').length;
  const onLeave = teachers.filter(t => t.status === 'On Leave').length;

  const handleOpenAttendance = () => {
    const initialRecords = {};
    teachers.forEach(t => {
      initialRecords[t.id] = t.status === 'Active' ? 'present' : 'absent';
    });
    setAttendanceRecords(initialRecords);
    setShowAttendanceModal(true);
  };

  const handleSaveAttendance = async () => {
    try {
      const payload = {
        date: attendanceDate,
        attendances: Object.entries(attendanceRecords).map(([teacherId, status]) => ({
          teacher_id: teacherId,
          status: status
        }))
      };
      
      await axios.post('/teacher-attendances/bulk-store', payload);
      alert('Attendance saved successfully!');
      setShowAttendanceModal(false);
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance', error);
      alert('Failed to save attendance');
    }
  };

  /* -------------------------------------------------
     Framer Motion Variants (SIMPLE VERSION - like Students)
     ------------------------------------------------- */
  const attendanceVariants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        <div className="flex gap-4">
          <button
            onClick={handleOpenAttendance}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
          >
            <Calendar size={20} /> Mark Attendance
          </button>
          <button
            onClick={() => navigate('/manage-leave-requests')}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <Calendar size={20} /> Leave Requests
          </button>
          <button
            onClick={() => navigate('/add-teacher')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-md"
          >
            <Plus size={20} /> Add Teacher
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-indigo-100 text-sm font-medium">Total Teachers</p>
          <p className="text-4xl font-bold mt-2">{total}</p>
        </motion.div>
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-green-100 text-sm font-medium">Active</p>
          <p className="text-4xl font-bold mt-2">{active}</p>
        </motion.div>
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-amber-100 text-sm font-medium">On Leave</p>
          <p className="text-4xl font-bold mt-2">{onLeave}</p>
        </motion.div>
      </motion.div>

      {/* Attendance Summary */}
      <motion.div
        variants={attendanceVariants}
        initial="initial"
        animate="animate"
      >
        <WeeklyAttendanceSummary
          title="Teacher Attendance – This Week"
          type="teacher"
          data={teacherAttendanceData}
        />
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 min-w-[300px] max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search teachers by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {/* Teacher Cards */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              exit="exit"
              onClick={() =>
                navigate(`/teacher/${teacher.id}`, { state: { teacher } })
              }
              className="cursor-pointer"
            >
              <TeacherCard teacher={teacher} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg font-medium animate-pulse">Loading teachers...</p>
        </div>
      ) : filteredTeachers.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg font-medium">No teachers found.</p>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Mark Teacher Attendance</h2>
              <button onClick={() => setShowAttendanceModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-4">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <img src={teacher.image} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                        <p className="text-sm text-gray-500">{teacher.subject}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAttendanceRecords(prev => ({ ...prev, [teacher.id]: 'present' }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          attendanceRecords[teacher.id] === 'present'
                            ? 'bg-green-100 text-green-700 border-2 border-green-500'
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setAttendanceRecords(prev => ({ ...prev, [teacher.id]: 'absent' }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          attendanceRecords[teacher.id] === 'absent'
                            ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        On Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium flex justify-center items-center gap-2 transition"
              >
                <Save size={20} /> Save Attendance
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Teachers;