// src/pages/Students.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Loader2, Check, X, Filter, Calendar, Users, Info, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';

import StudentCard from '../components/StudentCard';
import WeeklyAttendanceSummary from '../components/WeeklyAttendanceSummary';
import Layout from '../components/Layout.jsx';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Today'); // Today, This Week, This Month

  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present_today: 0,
    absent_today: 0,
    weekly_avg: '0%',
    monthly_avg: '0%'
  });
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [markingAttendance, setMarkingAttendance] = useState(null); // { class_id, className, date, students: [] }
  const [isMarking, setIsMarking] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, statsRes, weeklyRes] = await Promise.all([
        axios.get('/students'),
        axios.get('/attendances/get-overall-summary'),
        axios.get('/attendances/get-weekly-summary')
      ]);

      setStudents(studentsRes.data);
      setAttendanceStats(statsRes.data);
      setWeeklyAttendance(weeklyRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCellClick = async (row, day) => {
    try {
      const params = {
        class_id: row.id,
        attendance_date: day.full_date
      };

      if (row.sections && row.sections !== 'No Section') {
        params.section = row.sections;
      }

      const response = await axios.get('/attendances/get-students-for-attendance', { params });

      setMarkingAttendance({
        class_id: row.id,
        className: row.className,
        section: row.sections !== 'No Section' ? row.sections : null,
        date: day.full_date,
        displayDate: day.date,
        students: response.data
      });
    } catch (err) {
      console.error("Error loading class students:", err);
      alert("Failed to load students for this class.");
    }
  };

  const submitAttendance = async () => {
    try {
      setIsMarking(true);
      await axios.post('/attendances/bulk-store', {
        class_id: markingAttendance.class_id,
        attendance_date: markingAttendance.date,
        attendances: markingAttendance.students.map(s => ({
          student_id: s.id,
          status: s.status || 'absent',
          notes: s.notes
        }))
      });

      alert("Attendance saved successfully!");
      setMarkingAttendance(null);
      fetchData(); // Refresh summary
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to save attendance.");
    } finally {
      setIsMarking(false);
    }
  };

  const toggleStudentStatus = (id) => {
    setMarkingAttendance(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'present' ? 'absent' : 'present';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    }));
  };

  const filteredStudents = students.filter((s) => {
    const s_fullname = s.fullname || s.name || '';
    const s_class = s.classe?.classname || s.class || '';
    const s_section = s.section || '';
    const s_guardian = (s.guardian || s.father_name || s.mother_name || s.guardian_name || '');

    const matchesSearch =
      s_fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s_section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s_guardian.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = classFilter === 'All' || s_class === classFilter;
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



  if (loading && students.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading Attendance Center...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 px-4 max-w-md mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-6 shadow-sm border border-red-100">
            <Info className="mx-auto mb-4" size={40} />
            <p className="text-lg font-bold">Something went wrong</p>
            <p className="mt-2 text-red-500 opacity-80">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-100"
          >
            Retry Fetching Data
          </button>
        </div>
      </Layout>
    );
  }

  // Overview Stats derived from API
  const totalStudents = attendanceStats.total;
  const presentToday = attendanceStats.present_today;
  const absentToday = attendanceStats.absent_today;
  const currentAvg = timeFilter === 'This Week' ? attendanceStats.weekly_avg : (timeFilter === 'This Month' ? attendanceStats.monthly_avg : 'N/A');

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
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
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
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={cardVariants} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-3 text-blue-600">
            <div className="p-3 bg-blue-50 rounded-xl"><Users size={24} /></div>
            <p className="text-gray-500 text-xs font-semibold">Total Students</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-3 text-green-600">
            <div className="p-3 bg-green-50 rounded-xl"><Check size={24} /></div>
            <p className="text-gray-500 text-xs font-semibold">Present Today</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{presentToday}</p>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-3 text-red-600">
            <div className="p-3 bg-red-50 rounded-xl"><X size={24} /></div>
            <p className="text-gray-500 text-xs font-semibold">Absent Today</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{absentToday}</p>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg shadow-slate-200">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-slate-800 rounded-xl"><Calendar size={24} /></div>
            <p className="text-slate-400 text-xs font-semibold">Avg Attendance</p>
          </div>
          <p className="text-2xl font-bold text-white">{currentAvg}</p>
          <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide">Based on {timeFilter} filter</p>
        </motion.div>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Performance</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {['Today', 'This Week', 'This Month'].map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${timeFilter === filter ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={attendanceVariants}
        initial="initial"
        animate="animate"
      >
        <WeeklyAttendanceSummary
          title="Student Attendance Matrix"
          type="student"
          data={weeklyAttendance}
          loading={loading}
          onCellClick={handleCellClick}
          onTitleClick={() => fetchData()}
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
          {Array.from(new Set(students.map(s => s.classe?.classname || s.class))).filter(Boolean).map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
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
              exit="exit"
            >
              <StudentCard 
                student={student} 
                onSelect={() => navigate(`/student/${student.id}`)} 
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Info className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg font-medium">No students match your criteria.</p>
        </div>
      )}

      {/* Attendance Marking Modal */}
      <AnimatePresence>
        {markingAttendance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMarkingAttendance(null)}
            />
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
                  <p className="text-slate-400 mt-2 font-semibold flex items-center gap-2">
                    <span>Class {markingAttendance.className}</span>
                    {markingAttendance.section && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300 text-xs uppercase tracking-wider">
                        Section {markingAttendance.section}
                      </span>
                    )}
                    <span className="text-gray-600">•</span>
                    <span className="text-indigo-400 font-bold">{markingAttendance.displayDate}</span>
                  </p>
                </div>
                <button
                  onClick={() => setMarkingAttendance(null)}
                  className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-white/70 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-4">
                  {markingAttendance.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center font-bold text-blue-600">
                          {student.fullname.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{student.fullname}</p>
                          <p className="text-sm text-gray-500 font-medium">Roll: #{student.id}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStudentStatus(student.id)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${student.status === 'present'
                              ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                              : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-green-200'
                            }`}
                        >
                          <Check size={18} />
                          Present
                        </button>
                        <button
                          onClick={() => toggleStudentStatus(student.id)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${student.status === 'absent'
                              ? 'bg-red-600 text-white shadow-lg shadow-red-100'
                              : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-red-200'
                            }`}
                        >
                          <X size={18} />
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                  {markingAttendance.students.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-gray-500 font-bold">No students registered in this class.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => setMarkingAttendance(null)}
                  className="flex-1 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-100 transition font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAttendance}
                  disabled={isMarking || markingAttendance.students.length === 0}
                  className="flex-3 flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-bold shadow-xl shadow-blue-100 disabled:opacity-50"
                >
                  {isMarking ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={20} />}
                  Save Attendance Records
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Students;
