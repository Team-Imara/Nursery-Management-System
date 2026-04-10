// src/pages/ClassDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, Users, MapPin, Edit, ArrowLeft, Calendar } from 'lucide-react';
import axios from '../api/axios';
import Layout from '../components/Layout.jsx';

const ClassDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [timetable, setTimetable] = useState([]);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
            setIsEditing(false);
            alert('Timetable saved successfully!');
        } catch (err) {
            console.error("Error saving timetable:", err);
            alert("Failed to save timetable");
        } finally {
            setSaving(false);
        }
    };


    if (!classData && error) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
                    <button onClick={() => navigate('/class-management')} className="mt-6 text-indigo-600 font-semibold hover:underline">
                        Return to class list
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className="flex-1 p-8 overflow-auto bg-gray-50">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Back Navigation */}
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/class-management')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-bold"
                        >
                            <ArrowLeft size={20} />
                            Back to Class
                        </button>
                    </div>

                    {/* Class Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData?.classname}</h1>
                                <div className="flex gap-2">
                                    {(classData?.sections || []).map(s => (
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
                                <p className="text-lg font-bold text-gray-900">{classData?.head_teacher?.fullname || classData?.headTeacher?.fullname || 'Not Assigned'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Class Incharge</p>
                                <p className="text-lg font-bold text-gray-900">{classData?.class_incharge?.fullname || classData?.classIncharge?.fullname || 'Not Assigned'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assistant Teachers</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {((classData?.assistant_teachers || classData?.assistantTeachers)?.length > 0)
                                        ? (classData?.assistant_teachers || classData?.assistantTeachers).map(t => t.fullname).join(', ')
                                        : 'None'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capacity</p>
                                <p className="text-lg font-bold text-gray-900">{classData?.students_count ?? classData?.total_students ?? 0} / {classData?.capacity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Timetable Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Calendar className="text-indigo-600" />
                                    Weekly Timetable
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Manage weekly lesson plans and activities</p>
                            </div>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={saveTimetable}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Timetable'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition font-bold shadow-lg shadow-pink-100"
                                    >
                                        <Edit size={18} />
                                        Edit Timetable
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8 px-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest text-left w-32">Time</th>
                                        {days.map(day => (
                                            <th key={day} className="p-4 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">{day}</th>
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
                                                                <div className="text-center py-2 text-amber-600 font-bold text-xs uppercase tracking-widest">Interval Break</div>
                                                            ) : isEditing ? (
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
                                                            ) : (
                                                                <div className="w-full p-2 text-sm font-medium text-gray-700 text-center flex items-center justify-center min-h-[40px]">
                                                                    {currentActivity || '-'}
                                                                </div>
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

                    {/* Student List Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Users className="text-indigo-600" />
                                    Student Roster
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Manage and view students enrolled in this class</p>
                            </div>
                            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-center px-4">
                                    <span className="block text-2xl font-black text-indigo-600">{classData?.students?.length || 0}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                </div>
                                <div className="text-center px-4 border-l border-gray-200">
                                    <span className="block text-2xl font-black text-rose-500">{classData?.students?.filter(s => s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'girl').length || 0}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Girls</span>
                                </div>
                                <div className="text-center px-4 border-l border-gray-200">
                                    <span className="block text-2xl font-black text-blue-500">{classData?.students?.filter(s => s.gender?.toLowerCase() === 'male' || s.gender?.toLowerCase() === 'boy').length || 0}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Boys</span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8 px-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Student Name</th>
                                        <th className="p-4 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Roll No</th>
                                        <th className="p-4 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Gender</th>
                                        <th className="p-4 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(classData?.students && classData?.students.length > 0) ? classData?.students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 border-b border-gray-100 text-sm font-bold text-gray-900 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {student.fullname?.charAt(0) || student.first_name?.charAt(0) || 'U'}
                                                </div>
                                                {student.fullname || `${student.first_name || ''} ${student.last_name || ''}`.trim()}
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-sm text-gray-600">{student.roll_no || student.id}</td>
                                            <td className="p-4 border-b border-gray-100 text-sm text-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    (student.gender?.toLowerCase() === 'female' || student.gender?.toLowerCase() === 'girl')
                                                        ? 'bg-rose-50 text-rose-600'
                                                        : (student.gender?.toLowerCase() === 'male' || student.gender?.toLowerCase() === 'boy')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {student.gender || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-gray-100 text-sm text-right">
                                                <button
                                                    onClick={() => navigate(`/student/${student.id}`)}
                                                    className="text-indigo-600 font-bold hover:underline"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    )) : classData !== null && (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                                                No students enrolled in this class yet.
                                            </td>
                                        </tr>
                                    )}
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
