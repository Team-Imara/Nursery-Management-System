// src/pages/ClassDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, Users, MapPin, Edit, ArrowLeft, Calendar } from 'lucide-react';
import axios from '../api/axios';
import Layout from './Layout.jsx';

const ClassDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`/classes/${id}`);
                setClassData(response.data);
            } catch (err) {
                console.error("Error fetching class details:", err);
                setError("Failed to load class details");
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [id]);

    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <button
                onClick={() => navigate('/class-management')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Classes
            </button>
            <button
                onClick={() => navigate(`/class/edit/${id}`)}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
            >
                <Edit size={18} />
                Edit Class
            </button>
        </div>
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    if (error || !classData) {
        return (
            <Layout headerContent={headerContent}>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
                        <X size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{error || "Class not found"}</h2>
                    <button
                        onClick={() => navigate('/class-management')}
                        className="mt-6 text-indigo-600 font-semibold hover:underline"
                    >
                        Return to class list
                    </button>
                </div>
            </Layout>
        );
    }

    const teacherName = classData.head_teacher?.fullname || classData.headTeacher?.fullname || 'Not Assigned';
    const teacherAvatar = classData.head_teacher?.avatar || classData.headTeacher?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=random`;
    const enrolledCount = classData.total_students || 0;

    return (
        <Layout headerContent={headerContent}>
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <div className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-40 bg-gradient-to-r from-indigo-600 to-indigo-800"></div>
                        <div className="px-8 pb-8">
                            <div className="relative -top-12 flex flex-col md:flex-row md:items-end gap-6">
                                <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-xl">
                                    <div className="w-full h-full rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-5xl font-black">
                                        {classData.classname?.charAt(0) || 'C'}
                                    </div>
                                </div>
                                <div className="md:mb-2">
                                    <h1 className="text-4xl font-bold text-gray-900">{classData.classname}</h1>
                                    <div className="flex items-center gap-4 mt-2 text-gray-500 font-medium">
                                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                            Room {classData.room || 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                            Age {classData.ageGroup || '4-6'} yrs
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <p className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">Lead Teacher</p>
                                    <div className="flex items-center gap-3">
                                        <img src={teacherAvatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={teacherName} />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{teacherName}</h4>
                                            <p className="text-xs text-indigo-600 font-medium">Head Teacher</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Enrollment</p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <h4 className="text-2xl font-bold text-gray-900">{enrolledCount} / {classData.capacity}</h4>
                                            <p className="text-xs text-amber-600 font-medium">Students Enrolled</p>
                                        </div>
                                        <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full"
                                                style={{ width: `${Math.min(100, (enrolledCount / classData.capacity) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <p className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-1">Schedule</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Mon - Fri</h4>
                                            <p className="text-xs text-emerald-600 font-medium">08:00 AM - 01:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timetable Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="text-indigo-600" />
                                Class Weekly Schedule
                            </h2>
                            <button
                                onClick={() => navigate(`/ViewTimetable?class=${id}`)}
                                className="text-indigo-600 font-bold text-sm hover:underline"
                            >
                                Manage Full Timetable
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                        <th className="pb-4 pr-8">Time</th>
                                        <th className="pb-4 px-4">Mon</th>
                                        <th className="pb-4 px-4">Tue</th>
                                        <th className="pb-4 px-4">Wed</th>
                                        <th className="pb-4 px-4">Thu</th>
                                        <th className="pb-4 px-4">Fri</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { time: '08:00 - 09:30', subjects: ['Math', 'Art', 'Play', 'Science', 'Story'] },
                                        { time: '09:30 - 10:00', subjects: ['Snack', 'Snack', 'Snack', 'Snack', 'Snack'], type: 'break' },
                                        { time: '10:00 - 11:30', subjects: ['Garden', 'Math', 'Art', 'Play', 'Science'] },
                                        { time: '11:30 - 13:00', subjects: ['Story', 'Garden', 'Math', 'Art', 'Play'] },
                                    ].map((row, i) => (
                                        <tr key={i} className="group">
                                            <td className="py-4 pr-8 font-bold text-gray-500 text-sm whitespace-nowrap">{row.time}</td>
                                            {row.subjects.map((sub, j) => (
                                                <td key={j} className="py-4 px-2">
                                                    <div className={`
                            px-4 py-3 rounded-2xl text-sm font-bold text-center transition-all
                            ${row.type === 'break'
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : (i + j) % 2 === 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-600'}
                          `}>
                                                        {sub}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default ClassDetail;
