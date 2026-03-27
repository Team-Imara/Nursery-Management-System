import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check, X, Users, Loader2, Save, ArrowLeft,
    Calendar, Filter, TrendingUp, UserCheck, UserX,
    Percent, Activity
} from 'lucide-react';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const StudentAttendanceManagement = () => {
    const navigate = useNavigate();

    // States
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [stats, setStats] = useState({
        present_today: 0,
        absent_today: 0,
        today_percentage: '0%',
        weekly_avg: '0%',
        monthly_avg: '0%'
    });
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);

    // Filter states
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Initial load: Classes and Stats
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [classesRes, statsRes] = await Promise.all([
                    axios.get('/classes'),
                    axios.get('/attendances/get-management-summary')
                ]);
                setClasses(classesRes.data);
                setStats(statsRes.data);

                // Set initial class if available
                if (classesRes.data.length > 0) {
                    setSelectedClassId(classesRes.data[0].id);
                    // Trigger section update manually for the first class
                    const firstClass = classesRes.data[0];
                    if (firstClass.sections && Array.isArray(firstClass.sections)) {
                        setSections(firstClass.sections);
                        if (firstClass.sections.length > 0) {
                            setSelectedSection(firstClass.sections[0]);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Update sections when class changes
    useEffect(() => {
        if (selectedClassId) {
            const cls = classes.find(c => c.id == selectedClassId);
            if (cls && cls.sections && Array.isArray(cls.sections)) {
                setSections(cls.sections);
                if (cls.sections.length > 0) {
                    setSelectedSection(cls.sections[0]);
                } else {
                    setSelectedSection('');
                }
            } else {
                setSections([]);
                setSelectedSection('');
            }
        }
    }, [selectedClassId, classes]);

    // Fetch students when filters change
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedClassId) return;
            try {
                const params = {
                    class_id: selectedClassId,
                    attendance_date: selectedDate
                };
                if (selectedSection && selectedSection !== 'No Section') {
                    params.section = selectedSection;
                }
                const response = await axios.get('/attendances/get-students-for-attendance', { params });
                setStudents(response.data);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };
        fetchStudents();
    }, [selectedClassId, selectedSection, selectedDate]);

    const toggleStudentStatus = (id) => {
        setStudents(prev => prev.map(s => {
            if (s.id === id) {
                const nextStatus = s.status === 'present' ? 'absent' : 'present';
                return { ...s, status: nextStatus };
            }
            return s;
        }));
    };

    const submitAttendance = async () => {
        try {
            setIsSaving(true);
            await axios.post('/attendances/bulk-store', {
                class_id: selectedClassId,
                attendance_date: selectedDate,
                attendances: students.map(s => ({
                    student_id: s.id,
                    status: s.status || 'absent',
                    notes: s.notes
                }))
            });

            // Refresh stats after save
            const statsRes = await axios.get('/attendances/get-management-summary');
            setStats(statsRes.data);

            alert("Attendance records updated successfully!");
        } catch (err) {
            console.error("Error saving attendance:", err);
            alert("Failed to update attendance records.");
        } finally {
            setIsSaving(false);
        }
    };

    const cardVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/students')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group px-1"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Back to Students Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Attendance Center</h1>
                        <p className="text-gray-500 font-semibold mt-1">Manage, view, and update dynamic student attendance records</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                    <motion.div variants={cardVariants} initial="initial" animate="animate" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition border-l-4 border-l-green-500">
                        <div className="flex items-center gap-4 mb-4 text-green-600">
                            <div className="p-3 bg-green-50 rounded-xl"><UserCheck size={24} /></div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Present Today</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.present_today}</p>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="initial" animate="animate" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition border-l-4 border-l-red-500">
                        <div className="flex items-center gap-4 mb-4 text-red-600">
                            <div className="p-3 bg-red-50 rounded-xl"><UserX size={24} /></div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Absent Today</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.absent_today}</p>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="initial" animate="animate" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-4 mb-4 text-blue-600">
                            <div className="p-3 bg-blue-50 rounded-xl"><Percent size={24} /></div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Today's %</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.today_percentage}</p>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="initial" animate="animate" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-4 mb-4 text-purple-600">
                            <div className="p-3 bg-purple-50 rounded-xl"><Activity size={24} /></div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Weekly Avg</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.weekly_avg}</p>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="initial" animate="animate" className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl shadow-slate-200">
                        <div className="flex items-center gap-4 mb-4 text-slate-300">
                            <div className="p-3 bg-slate-800 rounded-xl text-white"><TrendingUp size={24} /></div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Monthly Avg</p>
                        </div>
                        <p className="text-3xl font-black text-white">{stats.monthly_avg}</p>
                    </motion.div>
                </div>

                {/* Filters Section - Leave Request Style */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                    <div className="p-8 border-b border-gray-100 flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Filter size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Search Filters</h3>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Class</label>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                                >
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.classname}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Section</label>
                                <select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                                    disabled={sections.length === 0}
                                >
                                    {sections.length > 0 ? (
                                        sections.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))
                                    ) : (
                                        <option value="">No Section</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Attendance Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 transition-all cursor-pointer"
                                    />
                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student Details</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Roll Number</th>
                                    <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Manual Attendance Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <AnimatePresence mode="wait">
                                    {students.map((student) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50/80 transition-colors group"
                                        >
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100 shadow-sm transition-colors">
                                                        {student.fullname.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block text-lg">{student.fullname}</span>

                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-gray-400">
                                                # {student.id < 10 ? `0${student.id}` : student.id}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex items-center justify-center gap-4">
                                                    <button
                                                        onClick={() => toggleStudentStatus(student.id)}
                                                        className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border-2 ${student.status === 'present'
                                                            ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-100 scale-105'
                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-green-200 hover:text-green-500'
                                                            }`}
                                                    >
                                                        <Check size={18} strokeWidth={3} />
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStudentStatus(student.id)}
                                                        className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border-2 ${student.status === 'absent'
                                                            ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-100 scale-105'
                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:text-red-500'
                                                            }`}
                                                    >
                                                        <X size={18} strokeWidth={3} />
                                                        Absent
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-24 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                                                    <Users size={40} />
                                                </div>
                                                <p className="text-gray-900 text-xl font-black mb-2">No Students Found</p>
                                                <p className="text-gray-400 font-bold text-sm">Please select a class and section to begin marking attendance.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Action Section - Leave Request Style */}
                    <div className="p-10 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-6">

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/students')}
                                className="flex-1 sm:flex-none px-8 py-4 bg-white text-gray-500 border border-gray-200 rounded-2xl hover:bg-gray-100 transition font-bold text-sm"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={submitAttendance}
                                disabled={isSaving || students.length === 0}
                                className={`flex-1 sm:flex-none px-12 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-2xl ${isSaving || students.length === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-indigo-700 text-white hover:bg-indigo-800 shadow-indigo-200 hover:-translate-y-1'
                                    }`}
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Update Attendance Database
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentAttendanceManagement;
