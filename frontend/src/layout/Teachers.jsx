import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherCard from '../components/TeacherCard';
import HeaderRightSection from '../components/HeaderRightSection';
import Sidebar from '../components/Sidebar';
import WeeklyAttendanceSummary from '../components/WeeklyAttendanceSummary';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    // Your 12 teachers (keep as-is)
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const newTeacher = location.state?.newTeacher;

  useEffect(() => {
    if (newTeacher) {
      setTeachers(prev => [...prev, { ...newTeacher, id: prev.length + 1 }]);
    }
  }, [newTeacher]);

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = teachers.length;
  const active = teachers.filter(t => t.status === 'Active').length;
  const onLeave = teachers.filter(t => t.status === 'On Leave').length;

  const teacherAttendanceData = [
    { name: "Aarav Patel", days: [{ day: "Mon", percentage: "100%" }, { day: "Tue", percentage: "100%" }, { day: "Wed", percentage: "100%" }, { day: "Thu", percentage: "100%" }, { day: "Fri", percentage: "100%" }] },
    { name: "Priya Sharma", days: [{ day: "Mon", percentage: "100%" }, { day: "Tue", percentage: "100%" }, { day: "Wed", percentage: "100%" }, { day: "Thu", percentage: "100%" }, { day: "Fri", percentage: "100%" }] },
    { name: "Saanvi Iyer", days: [{ day: "Mon", percentage: "-" }, { day: "Tue", percentage: "-" }, { day: "Wed", percentage: "-" }, { day: "Thu", percentage: "100%" }, { day: "Fri", percentage: "100%" }] },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
          <div className="flex justify-end">
            <HeaderRightSection notificationCount={3} imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100" name="Admin" />
          </div>
        </header>

        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
            <div className="flex gap-4">
              <button onClick={() => navigate('/add-teacher')} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-medium shadow-md">
                <Plus size={20} /> Add Teacher
              </button>
              <button  onClick={() => navigate('/manage-leave-requests')} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                <Calendar size={20} /> Leave Requests
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
              <p className="text-indigo-100 text-sm font-medium">Total Teachers</p>
              <p className="text-5xl font-bold mt-2">{total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
              <p className="text-green-100 text-sm font-medium">Active</p>
              <p className="text-5xl font-bold mt-2">{active}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg">
              <p className="text-amber-100 text-sm font-medium">On Leave</p>
              <p className="text-5xl font-bold mt-2">{onLeave}</p>
            </div>
          </div>

          <WeeklyAttendanceSummary title="Teacher Attendance – This Week" type="teacher" data={teacherAttendanceData} />

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} onClick={() => navigate(`/teacher/${teacher.id}`, { state: { teacher } })} className="cursor-pointer group">
                <div className="transform group-hover:scale-105 transition duration-300">
                  <TeacherCard teacher={teacher} />
                </div>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Teachers;