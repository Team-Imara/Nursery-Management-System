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
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const timeSlots = [
        '08:00 - 08:30',
        '08:30 - 09:00',
        '09:00 - 09:30',
        '09:30 - 10:00', // Interval row
        '10:00 - 10:30',
        '10:30 - 11:00',
        '11:00 - 11:30',
        '11:30 - 12:00',
        '12:00 - 12:30',
        '12:30 - 01:00'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const activities = [
        'Free drawing',
        'Language (intro, tracing, revision)',
        'Number (counting, tracing, activity)',
        'ERA activities',
        'Outdoor play',
        'Storytelling',
        'Craft',
        'Action song',
        'Audio / Video',
        'Interval'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, timetableRes] = await Promise.all([
                    axios.get(`/classes/${id}`),
                    axios.get(`/timetables/${id}`)
                ]);
                setClassData(classRes.data);
                setTimetable(timetableRes.data || []);
            } catch (err) {
                console.error("Error fetching class details:", err);
                setError("Failed to load class details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleTimetableChange = (day, slot, value) => {
        setTimetable(prev => {
            const index = prev.findIndex(item => item.day === day && item.time_slot === slot);
            if (index > -1) {
                const newTimetable = [...prev];
                newTimetable[index] = { ...newTimetable[index], activity: value };
                return newTimetable;
            } else {
                return [...prev, { day, time_slot: slot, activity: value }];
            }
        });
    };

    const saveTimetable = async () => {
        try {
            setSaving(true);
            await axios.post(`/timetables/sync/${id}`, { timetable });
            alert('Timetable saved successfully!');
        } catch (err) {
            console.error("Error saving timetable:", err);
            alert("Failed to save timetable");
        } finally {
            setSaving(false);
        }
    };

    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <button
                onClick={() => navigate('/class-management')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Classes
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
                    <h2 className="text-2xl font-bold text-gray-900">{error || "Class not found"}</h2>
                    <button onClick={() => navigate('/class-management')} className="mt-6 text-indigo-600 font-semibold hover:underline">
                        Return to class list
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout headerContent={headerContent}>
            <main className="flex-1 p-8 overflow-auto bg-gray-50">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Class Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2">{classData.classname}</h1>
                                <div className="flex gap-2">
                                    {(classData.sections || []).map(s => (
                                        <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold ring-1 ring-indigo-100">
                                            Section {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/class/edit/${id}`)}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm font-bold"
                            >
                                <Edit size={18} />
                                Edit Class
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Head Teacher</p>
                                <p className="text-lg font-bold text-gray-900">{classData.head_teacher?.fullname || classData.headTeacher?.fullname || 'Not Assigned'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Class Incharge</p>
                                <p className="text-lg font-bold text-gray-900">{classData.class_incharge?.fullname || classData.classIncharge?.fullname || 'Not Assigned'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assistant Teachers</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {((classData.assistant_teachers || classData.assistantTeachers)?.length > 0)
                                        ? (classData.assistant_teachers || classData.assistantTeachers).map(t => t.fullname).join(', ')
                                        : 'None'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capacity</p>
                                <p className="text-lg font-bold text-gray-900">{classData.total_students || 0} / {classData.capacity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Timetable Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <Calendar className="text-indigo-600" />
                                    Weekly Timetable
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Manage weekly lesson plans and activities</p>
                            </div>
                            <button
                                onClick={saveTimetable}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Timetable'}
                            </button>
                        </div>

                        <div className="overflow-x-auto -mx-8 px-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 bg-gray-50 border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest text-left w-32">Time</th>
                                        {days.map(day => (
                                            <th key={day} className="p-4 bg-gray-50 border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest text-center">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map(slot => {
                                        const isInterval = slot === '09:30 - 10:00';
                                        return (
                                            <tr key={slot}>
                                                <td className="p-4 border border-gray-100 text-sm font-bold text-gray-500 bg-gray-50/30 whitespace-nowrap">
                                                    {slot}
                                                </td>
                                                {days.map(day => {
                                                    const currentActivity = timetable.find(t => t.day === day && t.time_slot === slot)?.activity || '';
                                                    return (
                                                        <td key={`${day}-${slot}`} className={`p-1 border border-gray-100 ${isInterval ? 'bg-amber-50' : 'hover:bg-indigo-50/30'} transition-colors`}>
                                                            {isInterval ? (
                                                                <div className="text-center py-2 text-amber-600 font-black text-xs uppercase tracking-widest">Interval Break</div>
                                                            ) : (
                                                                <select
                                                                    className="w-full p-2 bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer focus:bg-white rounded-lg"
                                                                    value={currentActivity}
                                                                    onChange={(e) => handleTimetableChange(day, slot, e.target.value)}
                                                                >
                                                                    <option value="">-- Select Activity --</option>
                                                                    {activities.map(act => (
                                                                        <option key={act} value={act}>{act}</option>
                                                                    ))}
                                                                    {currentActivity && !activities.includes(currentActivity) && (
                                                                        <option value={currentActivity}>{currentActivity}</option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
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
