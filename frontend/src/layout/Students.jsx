import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import StudentCard from '../components/StudentCard';
import HeaderRightSection from '../components/HeaderRightSection';
import Sidebar from '../components/Sidebar';
import WeeklyAttendanceSummary from '../components/WeeklyAttendanceSummary';

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Aarav Kumar',
      class: 'KG1',
      section: 'A',
      guardian: 'Raj Kumar',
      status: 'Present',
      roll: '01',
      image: 'https://images.pexels.com/photos/414503/pexels-photo-414503.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 2,
      name: 'Sara Ali',
      class: 'KG2',
      section: 'B',
      guardian: 'Amina Ali',
      status: 'Present',
      roll: '02',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 3,
      name: 'Adam Perera',
      class: 'KG1',
      section: 'A',
      guardian: 'Rashid Perera',
      status: 'Absent',
      roll: '03',
      image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=150',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();
  const location = useLocation();
  const newStudent = location.state?.newStudent;

  useEffect(() => {
    if (newStudent) {
      setStudents((prev) => [
        ...prev,
        { ...newStudent, id: prev.length + 1 },
      ]);
    }
  }, [newStudent]);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardian.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = classFilter === 'All' || s.class === classFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

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

  // Attendance Summary Data
  const studentWeeklyAttendance = [
    {
      className: 'KG1',
      days: [
        { day: 'Mon', date: '24 Nov', percentage: '95%' },
        { day: 'Tue', date: '25 Nov', percentage: '94%' },
        { day: 'Wed', date: '26 Nov', percentage: '96%' },
        { day: 'Thu', date: '27 Nov', percentage: '95%' },
        { day: 'Fri', date: '28 Nov', percentage: '97%' },
      ],
    },
    {
      className: 'KG2',
      days: [
        { day: 'Mon', percentage: '88%' },
        { day: 'Tue', percentage: '91%' },
        { day: 'Wed', percentage: '89%' },
        { day: 'Thu', percentage: '92%' },
        { day: 'Fri', percentage: '90%' },
      ],
    },
  ];

  // Overview Stats
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.status === 'Present').length;
  const absentStudents = students.filter(s => s.status === 'Absent').length;

  /* -------------------------------------------------
     Framer Motion Variants
     ------------------------------------------------- */
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
              notificationCount={2}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
            />
          </div>
        </header>

        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <button
              onClick={() => navigate('/add-student')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-md"
            >
              <Plus size={20} />
              Add Student
            </button>
          </div>

          {/* Overview Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={cardVariants} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-blue-100 text-sm font-medium">Overall Students</p>
              <p className="text-4xl font-bold mt-2">{totalStudents}</p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-green-100 text-sm font-medium">Present Today</p>
              <p className="text-4xl font-bold mt-2">{presentStudents}</p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-red-100 text-sm font-medium">Absent Today</p>
              <p className="text-4xl font-bold mt-2">{absentStudents}</p>
            </motion.div>
          </motion.div>

          
          <motion.div
            variants={attendanceVariants}
            initial="initial"
            animate="animate"
          >
            <WeeklyAttendanceSummary
              title="Student Attendance – This Week"
              type="student"
              data={studentWeeklyAttendance}
            />
          </motion.div>


          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, class, or guardian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Classes</option>
              <option value="KG1">KG1</option>
              <option value="KG2">KG2</option>
              <option value="Grade 1">Grade 1</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          {/* Student Cards */}
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  exit="exit"
                  onClick={() => navigate('/students/detail', { state: { student } })}
                  className="cursor-pointer"
                >
                  <StudentCard student={student} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredStudents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg font-medium">No students found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Students;
