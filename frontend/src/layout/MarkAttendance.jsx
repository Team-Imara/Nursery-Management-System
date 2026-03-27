import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, Users, Loader2, Save, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const MarkAttendance = () => {
    const { classId, date, section } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isMarking, setIsMarking] = useState(false);
    const [students, setStudents] = useState([]);
    const [classInfo, setClassInfo] = useState({ name: '', section: section || null });
    const [displayDate, setDisplayDate] = useState(date);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const params = {
                    class_id: classId,
                    attendance_date: date
                };
                if (section && section !== 'undefined' && section !== 'null') {
                    params.section = section;
                }

                const response = await axios.get('/attendances/get-students-for-attendance', { params });
                setStudents(response.data);

                // Fetch class name if needed, or we can assume it's passed or fetch it
                // For now, let's just use what we have or fetch class details
                const classRes = await axios.get(`/classes`);
                const cls = classRes.data.find(c => c.id == classId);
                if (cls) {
                    setClassInfo({ name: cls.classname, section: section || null });
                }

                // Format display date
                const d = new Date(date);
                setDisplayDate(d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

            } catch (err) {
                console.error("Error loading students:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [classId, date, section]);

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
            setIsMarking(true);
            await axios.post('/attendances/bulk-store', {
                class_id: classId,
                attendance_date: date,
                attendances: students.map(s => ({
                    student_id: s.id,
                    status: s.status || 'absent',
                    notes: s.notes
                }))
            });

            alert("Attendance saved successfully!");
            navigate('/students');
        } catch (err) {
            console.error("Error saving attendance:", err);
            alert("Failed to save attendance.");
        } finally {
            setIsMarking(false);
        }
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
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate('/students')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Back to Students</span>
                </button>

                {/* Page Header - Leave Request Style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Mark Attendance</h2>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-gray-500 font-medium">Class {classInfo.name}</span>
                                {classInfo.section && (
                                    <span className="text-gray-500 font-medium">
                                        - {classInfo.section}
                                    </span>
                                )}
                                <span className="text-gray-300">•</span>
                                <span className="text-indigo-600 font-semibold">{displayDate}</span>
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-semibold mb-2">
                                Total Students: {students.length}
                            </div>
                        </div>
                    </div>

                    {/* Status Summary - Leave Request Style */}
                    <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-4">
                        <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-sm font-semibold">
                            Present: {students.filter(s => s.status === 'present').length}
                        </div>
                        <div className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-sm font-semibold">
                            Absent: {students.filter(s => s.status === 'absent').length}
                        </div>
                        <div className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-lg text-sm font-semibold">
                            Unmarked: {students.filter(s => !s.status).length}
                        </div>
                    </div>

                    {/* Student Table - Leave Request Style */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Roll Number</th>
                                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Mark Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shadow-sm">
                                                    {student.fullname.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-900 text-lg">{student.fullname}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-semibold text-gray-500">
                                            #{student.id}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => toggleStudentStatus(student.id)}
                                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${student.status === 'present'
                                                        ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm scale-110'
                                                        : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:border-green-200'
                                                        }`}
                                                >
                                                    <Check size={16} />
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => toggleStudentStatus(student.id)}
                                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${student.status === 'absent'
                                                        ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm scale-110'
                                                        : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:border-red-200'
                                                        }`}
                                                >
                                                    <X size={16} />
                                                    Absent
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-24 text-center">
                                            <Users className="mx-auto text-gray-300 mb-4" size={64} />
                                            <p className="text-gray-500 text-xl font-bold">No students registered in this class.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Bar */}
                    <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-white">
                        <button
                            onClick={() => navigate('/students')}
                            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitAttendance}
                            disabled={isMarking || students.length === 0}
                            className={`px-12 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl ${isMarking || students.length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                : 'bg-indigo-700 text-white hover:bg-indigo-800 shadow-indigo-100'
                                }`}
                        >
                            {isMarking ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Attendance Records
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MarkAttendance;
