import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentCard from '../components/StudentCard';
import HeaderRightSection from '../components/HeaderRightSection';
import Sidebar from '../components/Sidebar';

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
            email: 'aarav.kumar@example.com',
            phone: '+91-9876501234',
            admissionDate: '2021-04-10',
            notes: 'Very active and bright student',
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
            email: 'sara.ali@example.com',
            phone: '+91-9876203451',
            admissionDate: '2022-06-12',
            notes: 'Loves painting & reading',
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
            email: 'adam.perera@example.com',
            phone: '+94-771234567',
            admissionDate: '2021-09-20',
            notes: 'Active in sports',
        },
    ]);

    const [highlightedStudent, setHighlightedStudent] = useState(students[0] || null);
    const [searchTerm, setSearchTerm] = useState('');

    const cardAnimationVariants = {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10, duration: 0.6 } },
    };

    const navigate = useNavigate();
    const location = useLocation();
    const newStudent = location.state?.newStudent;

    useEffect(() => {
        if (newStudent) {
            setStudents((prevStudent) => [
                ...prevStudent,
                { ...newStudent, id: prevStudent.length + 1 },
            ]);
        }
    }, [newStudent]);
    

    

    // const handleCardClick = (studentId) => {
    //     const student = students.find((s) => s.id === studentId);
    //     navigate(`/student/${studentId}`, { state: { student } });
    // };
    const handleCardClick = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    // setHighlightedStudent(student);
    navigate(`/students/${studentId}`, { state: { student } });
};

    // const filteredStudents = students.filter((s) =>
    //     s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     s.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     s.guardian.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // Add these state hooks at the top
const [classFilter, setClassFilter] = useState('All');
const [statusFilter, setStatusFilter] = useState('All');

// Update filteredStudents
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


    

    return (
        <div className="flex w-full min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-end">
                        <HeaderRightSection
                            notificationCount={2}
                            imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                            name="Admin"
                        />
                    </div>
                </header>

                <main className="pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Students</h1>

                        <button
                            onClick={() => navigate('/add-student')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                        >
                            <Plus size={20} /> Add Student
                        </button>
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Student List */}
                        <motion.div className="lg:col-span-2" variants={cardAnimationVariants} initial="initial" animate="animate">
                            {/* ✅ Attendance Section */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance (This Week)</h3>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200 text-sm">
                                            <thead>
                                                <tr className="bg-gray-100 text-left text-gray-600 font-semibold">
                                                    <th className="px-4 py-2 border">Class</th>
                                                    <th className="px-4 py-2 border">Mon</th>
                                                    <th className="px-4 py-2 border">Tue</th>
                                                    <th className="px-4 py-2 border">Wed</th>
                                                    <th className="px-4 py-2 border">Thu</th>
                                                    <th className="px-4 py-2 border">Fri</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="text-gray-700">
                                                    <td className="px-4 py-2 border font-medium">KG1</td>
                                                    <td className="px-4 py-2 border">95%</td>
                                                    <td className="px-4 py-2 border">94%</td>
                                                    <td className="px-4 py-2 border">96%</td>
                                                    <td className="px-4 py-2 border">95%</td>
                                                    <td className="px-4 py-2 border">97%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* Search + Filters */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative flex-1 min-w-[300px] max-w-md">
                            <Search className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" size={17} />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg">
                            <option>Class: All</option>
                            <option>KG1</option>
                            <option>KG2</option>
                        </select>

                        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg">
                            <option>Status: All</option>
                            <option>Present</option>
                            <option>Absent</option>
                        </select> */}
                        <select
                          value={classFilter}
                          onChange={(e) => setClassFilter(e.target.value)}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg"
                      >
                          <option value="All">Class: All</option>
                          <option value="KG1">KG1</option>
                          <option value="KG2">KG2</option>
                      </select>

                      <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg"
                      >
                          <option value="All">Status: All</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                      </select>

                    </div>
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {filteredStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="cursor-pointer"
                                    >
                                        <StudentCard
                                          student={student}
                                          onSelect={(s) => {
                                            setHighlightedStudent(s);
                                            navigate(`/students/${s.id}`, { state: { student: s } });
                                          }}
                                        />
                                    </div>
                                ))}
                            </div> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {filteredStudents.map((student) => (
                              <div
                                key={student.id}
                                onClick={() => navigate("/students/detail", { state: { student } })}
                                className="cursor-pointer"
                              >
                                <StudentCard student={student} />
                              </div>
                            ))}
                          </div>

                        </motion.div>

                        {/* Highlight Panel */}
                        <motion.div className="lg:col-span-1" variants={cardAnimationVariants} initial="initial" animate="animate">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">

                                {highlightedStudent && (
                                    <>
                                        {/* Overview */}
                                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
                                    <div className="grid grid-cols-3 gap-1">
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <p className="text-sm text-gray-600 mb-2">Total Teachers</p>
                                            <p className="text-4xl font-bold text-gray-900">{students.length}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <p className="text-sm text-gray-600 mb-2">Active Teachers</p>
                                            <p className="text-4xl font-bold text-gray-900">
                                                {students.filter((t) => t.status === 'Active').length}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <p className="text-sm text-gray-600 mb-2">On Leave</p>
                                            <p className="text-4xl font-bold text-gray-900">
                                                {students.filter((t) => t.status === 'On Leave').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Students;





