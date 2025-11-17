import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import HeaderRightSection from '../components/HeaderRightSection.jsx';


const Dashboard = () => {
    // State to track which card is being hovered
    const [hoveredCard, setHoveredCard] = useState(null);

    const cardDetails = {
        totalStudents: 'Total number of students enrolled: 248 (increased by 5 this week).',
        totalTeachers: 'Total active teachers: 32, all currently active.',
    };

    // Animation variants for the card
    const cardVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        initial: { scale: 1 },
    };

    // Animation variants for the overlay
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    // Animation variants for Upcoming Events and Notifications cards with new 3D motion
    const cardAnimationVariants = {
        initial: { x: -100, opacity: 0, rotateY: -30 },
        animate: { x: 0, opacity: 1, rotateY: 0, transition: { type: 'spring', stiffness: 80, damping: 15, duration: 0.8 } },
    };

    const itemVariants = {
        hover: { scale: 1.03, rotateY: 15, transition: { duration: 0.4, ease: 'easeOut' } },
        initial: { scale: 1, rotateY: 0 },
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search students, teachers, events"
                                className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            <HeaderRightSection
                                notificationCount={3}
                                imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                                name="Admin"
                                onNotificationClick={() => alert('Notifications clicked!')}
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6 flex-1">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                        {/* Top Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                            {/* Total Students Card */}
                            <motion.div
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative"
                                variants={cardVariants}
                                initial="initial"
                                whileHover="hover"
                                onMouseEnter={() => setHoveredCard('totalStudents')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="text-sm text-gray-600 mb-2">Total Students</div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">248</div>
                                <div className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                                    +5 this week
                                </div>
                                {hoveredCard === 'totalStudents' && (
                                    <motion.div
                                        className="absolute inset-0 bg-white bg-opacity-90 border-2 border-blue-300 rounded-xl flex items-center justify-center text-sm text-gray-800 p-2"
                                        variants={overlayVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {cardDetails.totalStudents}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Total Teachers Card */}
                            <motion.div
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative"
                                variants={cardVariants}
                                initial="initial"
                                whileHover="hover"
                                onMouseEnter={() => setHoveredCard('totalTeachers')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="text-sm text-gray-600 mb-2">Total Teachers</div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">32</div>
                                <div className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                    Active
                                </div>
                                {hoveredCard === 'totalTeachers' && (
                                    <motion.div
                                        className="absolute inset-0 bg-white bg-opacity-90 border-2 border-green-300 rounded-xl flex items-center justify-center text-sm text-gray-800 p-2"
                                        variants={overlayVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {cardDetails.totalTeachers}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Student Distribution Card */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="text-lg font-semibold text-gray-900 mb-4">Student Distribution</div>
                                <div className="flex items-center justify-center mb-4">
                                    <svg width="160" height="160" viewBox="0 0 160 160">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke="#FCD34D"
                                            strokeWidth="30"
                                            strokeDasharray="220 440"
                                            transform="rotate(-90 80 80)"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke="#312E81"
                                            strokeWidth="30"
                                            strokeDashoffset="-220"
                                            transform="rotate(-90 80 80)"
                                        />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                                        <span className="text-sm text-gray-600">Boys</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-indigo-900 rounded"></div>
                                        <span className="text-sm text-gray-600">Girls</span>
                                    </div>
                                </div>
                            </div>
                            {/* Upcoming Events */}
                            <motion.div
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                variants={cardAnimationVariants}
                                initial="initial"
                                animate="animate"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                                <div className="space-y-3">
                                    <motion.div
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        variants={itemVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900">Sports Day</div>
                                            <div className="text-sm text-gray-500">12 Oct</div>
                                        </div>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            Details
                                        </button>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        variants={itemVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900">Parent Meeting</div>
                                            <div className="text-sm text-gray-500">18 Oct</div>
                                        </div>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            Details
                                        </button>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        variants={itemVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-900">Diwali Holiday</div>
                                            <div className="text-sm text-gray-500">1 Nov</div>
                                        </div>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            Details
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Overall Performance Chart */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Overall Performance</h2>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreVertical size={20} className="text-gray-600" />
                                </button>
                            </div>
                            <div className="flex items-center gap-6 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                                    <span className="text-sm text-gray-600">Kindergarten 1</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-indigo-900 rounded"></div>
                                    <span className="text-sm text-gray-600">Kindergarten 2</span>
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-4">
                                <svg width="100%" height="100%" viewBox="0 0 700 250" preserveAspectRatio="none">
                                    <polyline
                                        points="0,190 100,170 200,200 300,90 400,150 500,210 600,170 700,140"
                                        fill="none"
                                        stroke="#312E81"
                                        strokeWidth="3"
                                    />
                                    <polyline
                                        points="0,150 100,160 200,180 300,165 400,195 500,180 600,160 700,140"
                                        fill="none"
                                        stroke="#FCD34D"
                                        strokeWidth="3"
                                    />
                                </svg>
                            </div>
                            <div className="flex justify-between mt-4 text-sm text-gray-500">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-6">
                            {/* Notifications Section with new 3D motion */}
                            <motion.div
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
                                variants={cardAnimationVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                                style={{ perspective: '1000px' }} // Enable 3D perspective
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                                <div className="space-y-3">
                                    <motion.div
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        variants={itemVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">Leave request from Priya Sharma</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                                                Approve
                                            </button>
                                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                                                Reject
                                            </button>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        variants={itemVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">New student added: Aarav</div>
                                        </div>
                                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                                            Review
                                        </button>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        variants={itemVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">Meal allergy update</div>
                                        </div>
                                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                                            View
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Class Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <table className="">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Class</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Students</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Teachers</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Attendance Today</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">Kindergarten 1</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">124</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">16</td>
                                        <td className="px-6 py-4">
                                                <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                                                    96%
                                                </span>
                                        </td>
                                        <td className="px-3 py-1">
                                            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">Kindergarten 2</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">124</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">16</td>
                                        <td className="px-6 py-4">
                                                <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                                                    91%
                                                </span>
                                        </td>
                                        <td className="px-3 py-1">
                                            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;