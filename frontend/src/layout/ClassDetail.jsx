import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, Users, MapPin, Edit, ArrowLeft, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection';
import axios from '../api/axios';

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

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (error || !classData) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <div className="text-red-500">{error || "Class not found"}</div>
                <button onClick={() => navigate('/class-management')} className="text-blue-500 underline">
                    Back to Classes
                </button>
            </div>
        );
    }

    const teacherName = classData.head_teacher?.fullname || classData.headTeacher?.fullname || 'Not Assigned';
    const teacherAvatar = classData.head_teacher?.avatar || classData.headTeacher?.avatar || 'https://via.placeholder.com/150';
    const enrolledCount = classData.total_students || 0;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex justify-end">
                        <HeaderRightSection
                            notificationCount={3}
                            imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
                            name="Admin"
                        />
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-auto">
                    <button
                        onClick={() => navigate('/class-management')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Classes
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                            <div className="absolute -bottom-10 left-8">
                                <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                                        {classData.classname?.charAt(0) || 'C'}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => navigate(`/class/edit/${classData.id}`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all"
                                >
                                    <Edit size={18} />
                                    Edit Class
                                </button>
                            </div>
                        </div>

                        <div className="pt-14 px-8 pb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.classname}</h1>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Stats & Info */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Class Overview</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Capacity</span>
                                                <span className="font-medium">{classData.capacity} Students</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Currently Enrolled</span>
                                                <span className="font-medium">{enrolledCount} Students</span>
                                            </div>
                                            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full"
                                                    style={{ width: `${(enrolledCount / classData.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={teacherAvatar}
                                                alt={teacherName}
                                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                            />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{teacherName}</h4>
                                                <p className="text-sm text-blue-600">Class Teacher</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Timetable */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                                                <Calendar size={24} />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Weekly Timetable</h2>
                                        </div>

                                        <div className="grid grid-cols-5 gap-2 mb-4 text-center text-sm font-medium text-gray-500">
                                            <div>Mon</div>
                                            <div>Tue</div>
                                            <div>Wed</div>
                                            <div>Thu</div>
                                            <div>Fri</div>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Mock Timetable Rows - Frontend Only for now */}
                                            {['08:00 AM', '10:00 AM', '12:00 PM'].map((time, i) => (
                                                <div key={i} className="flex items-center text-sm">
                                                    <div className="w-20 font-medium text-gray-400">{time}</div>
                                                    <div className="flex-1 grid grid-cols-5 gap-2">
                                                        {[1, 2, 3, 4, 5].map(j => (
                                                            <div key={j} className={`p-2 rounded text-center text-xs ${(i + j) % 3 === 0 ? 'bg-indigo-50 text-indigo-700' :
                                                                (i + j) % 2 === 0 ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                                                                }`}>
                                                                {(i + j) % 3 === 0 ? 'Math' : (i + j) % 2 === 0 ? 'Art' : 'Play'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 text-center">
                                            <button className="text-indigo-600 font-medium hover:text-indigo-800 text-sm">
                                                View Full Schedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ClassDetail;
