import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherCard from '../components/TeacherCard';
import HeaderRightSection from '../components/HeaderRightSection';
import Sidebar from '../components/Sidebar';
import WeeklyAttendanceSummary from '../components/WeeklyAttendanceSummary';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Aarav Patel',
      subject: 'Mathematics',
      email: 'aarav.patel@school.com',
      phone: '+91 9876543210',
      status: 'Active',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      subject: 'Science',
      email: 'priya.sharma@school.com',
      phone: '+91 9876543211',
      status: 'Active',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 3,
      name: 'Saanvi Iyer',
      subject: 'English',
      email: 'saanvi.iyer@school.com',
      phone: '+91 9876543212',
      status: 'On Leave',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();
  const newTeacher = location.state?.newTeacher;

  useEffect(() => {
    if (newTeacher) {
      setTeachers(prev => [...prev, { ...newTeacher, id: prev.length + 1 }]);
    }
  }, [newTeacher]);

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = teachers.length;
  const active = teachers.filter(t => t.status === 'Active').length;
  const onLeave = teachers.filter(t => t.status === 'On Leave').length;

  const teacherAttendanceData = [
    { name: "Aarav Patel", days: [
      { day: "Mon", percentage: "100%" }, 
      { day: "Tue", percentage: "100%" }, 
      { day: "Wed", percentage: "100%" }, 
      { day: "Thu", percentage: "100%" }, 
      { day: "Fri", percentage: "100%" }
    ]},
    { name: "Priya Sharma", days: [
      { day: "Mon", percentage: "100%" }, 
      { day: "Tue", percentage: "100%" }, 
      { day: "Wed", percentage: "100%" }, 
      { day: "Thu", percentage: "100%" }, 
      { day: "Fri", percentage: "100%" }
    ]},
    { name: "Saanvi Iyer", days: [
      { day: "Mon", percentage: "-" }, 
      { day: "Tue", percentage: "-" }, 
      { day: "Wed", percentage: "-" }, 
      { day: "Thu", percentage: "100%" }, 
      { day: "Fri", percentage: "100%" }
    ]},
  ];

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
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
          <div className="flex justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
            />
          </div>
        </header>

        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
            <div className="flex gap-4">
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

          {filteredTeachers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg font-medium">No teachers found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Teachers;