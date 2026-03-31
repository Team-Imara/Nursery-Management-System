import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Loader2, Calendar as CalendarIcon, Users as UsersIcon, GraduationCap, TrendingUp, AlertCircle } from 'lucide-react';
import HeaderRightSection from '../components/HeaderRightSection.jsx';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';

const Dashboard = () => {
    // Get user info from localStorage
    const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const userRole = localStorage.getItem('role') || 'admin';
    const userName = savedUser ? savedUser.fullname : (userRole === 'admin' ? 'Admin' : 'Tutor');

    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/dashboard');
                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard. Please refresh to try again.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cardDetails = {
        totalStudents: dashboardData ? `Total number of students enrolled: ${dashboardData.stats.total_students} (+${dashboardData.stats.new_students_this_week} this week).` : '',
        totalTeachers: dashboardData ? `Total active teachers: ${dashboardData.stats.total_teachers}, all currently active.` : '',
    };

    // Animation variants
    const cardVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        initial: { scale: 1 },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    const cardAnimationVariants = {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const itemVariants = {
        hover: { scale: 1.02, x: 5, transition: { duration: 0.2 } },
        initial: { scale: 1, x: 0 },
    };

    // Search Bar for Header
    const searchBar = (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                placeholder="Search students, teachers, events"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
            />
        </div>
    );

    if (loading) {
        return (
            <Layout headerContent={searchBar}>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-semibold text-lg">Preparing your dashboard...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout headerContent={searchBar}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 rounded-3xl p-8 border border-red-100">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-700 text-center max-w-md mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        Retry
                    </button>
                </div>
            </Layout>
        );
    }

    // Gender Distribution Circle Math
    const totalGender = (dashboardData?.gender_distribution.male || 0) + (dashboardData?.gender_distribution.female || 0);
    const malePercent = totalGender > 0 ? (dashboardData?.gender_distribution.male / totalGender) : 0.5;
    const dashArrayValue = Math.round(malePercent * 440);

    // Performance Chart Multi-line Generation
    const chartWidth = 900; // Increased width for 12 months
    const chartHeight = 250;
    const padding = 50;

    const getX = (idx, total) => (idx / (total - 1)) * (chartWidth - 2 * padding) + padding;
    const getY = (val) => chartHeight - ((val / 100) * (chartHeight - 2 * padding) + padding);

    const generatePolylinePoints = (data) => {
        if (!data || data.length === 0) return "";
        return data.map((val, idx) => `${getX(idx, data.length)},${getY(val)}`).join(" ");
    };

    const performanceColors = [
        '#6366f1', '#f59e0b', '#ec4899', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6', '#14b8a6'
    ];

    return (
        <Layout headerContent={searchBar}>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                        {userRole === 'admin' ? 'Admin Dashboard' : 'Tutor Dashboard'}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Welcome back, {userName}! Monitoring nursery operations.</p>
                </div>
                <div className="bg-slate-100 px-5 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Top Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Students Card */}
                <motion.div
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative group overflow-hidden"
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative">
                        <div className="p-3 bg-blue-50 w-fit rounded-xl mb-6">
                            <UsersIcon className="text-blue-500" size={20} />
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Students</div>
                        <div className="text-4xl font-bold text-slate-900 mb-3 tracking-tighter">{dashboardData.stats.total_students}</div>
                        <div className="inline-flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wide">
                            <TrendingUp size={14} />
                            +{dashboardData.stats.new_students_this_week} this week
                        </div>
                    </div>
                </motion.div>

                {/* Total Teachers Card */}
                <motion.div
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative group overflow-hidden"
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative">
                        <div className="p-3 bg-emerald-50 w-fit rounded-xl mb-6">
                            <GraduationCap className="text-emerald-500" size={20} />
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Teachers</div>
                        <div className="text-4xl font-bold text-slate-900 mb-3 tracking-tighter">{dashboardData.stats.total_teachers}</div>
                        <div className="inline-flex items-center gap-2 text-emerald-600 text-[11px] font-bold uppercase tracking-wide">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Active Staff
                        </div>
                    </div>
                </motion.div>

                {/* Student Distribution Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Gender Split</div>
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <svg width="120" height="120" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                                <circle
                                    cx="80" cy="80" r="70" fill="none" stroke="#ffcb20" strokeWidth="20"
                                    strokeDasharray="440" strokeLinecap="round" transform="rotate(-90 80 80)"
                                />
                                <motion.circle
                                    cx="80" cy="80" r="70" fill="none" stroke="#312E81" strokeWidth="20"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ strokeDasharray: "0 440" }}
                                    animate={{ strokeDasharray: `${440 - dashArrayValue} 440` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    transform="rotate(-90 80 80)"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-slate-900">{totalGender}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-900 rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">G: {dashboardData.gender_distribution.female}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">M: {dashboardData.gender_distribution.male}</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <motion.div
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col"
                    variants={cardAnimationVariants}
                    initial="initial"
                    animate="animate"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Events</h2>
                        <CalendarIcon size={16} className="text-slate-300" />
                    </div>
                    <div className="space-y-3 grow">
                        {dashboardData.upcoming_events.length > 0 ? (
                            dashboardData.upcoming_events.slice(0, 3).map((event) => (
                                <motion.div
                                    key={event.id}
                                    className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all"
                                    variants={itemVariants}
                                    initial="initial"
                                    whileHover="hover"
                                >
                                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm shrink-0">
                                        <span className="text-xs font-bold text-indigo-600 block text-center leading-none">
                                            {new Date(event.date).getDate()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <div className="text-xs font-bold text-slate-800 truncate mb-0.5">{event.title}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 opacity-30">
                                <CalendarIcon size={32} className="text-slate-400 mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest italic">No Upoming</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Overall Performance Chart (Jan to Dec Full Year) */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-100/50 border border-slate-100 mb-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Yearly Academic Performance</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Class-wise monthly progress summary (Jan - Dec)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 px-4 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
                            <TrendingUp size={16} className="inline mr-2" />
                            <span className="text-xs font-bold uppercase tracking-widest">Yearly Trend</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-12">
                    {dashboardData.performance_trends.map((trend, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 py-2 px-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: performanceColors[idx % performanceColors.length] }}></div>
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{trend.label}</span>
                        </div>
                    ))}
                </div>

                <div className="h-80 flex items-end justify-between relative">
                    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-[0.05]">
                        {[25, 50, 75, 100].map(val => (
                            <div key={val} className="w-full border-t border-slate-900 origin-bottom" style={{ height: `${val}%` }}></div>
                        ))}
                    </div>
                    <div className="absolute left-0 h-full w-[40px] flex flex-col justify-between text-[10px] font-bold text-slate-300 py-2">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                    </div>

                    <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="z-10 overflow-visible ml-10">
                        <defs>
                            {performanceColors.map((color, i) => (
                                <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                                </linearGradient>
                            ))}
                        </defs>

                        {dashboardData.performance_trends.map((trend, idx) => {
                            const points = generatePolylinePoints(trend.data);
                            return (
                                <g key={`group-${idx}`}>
                                    <motion.path
                                        d={`M ${points}`}
                                        fill="none"
                                        stroke={performanceColors[idx % performanceColors.length]}
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 2, delay: idx * 0.1 }}
                                    />
                                    <path
                                        d={`M ${points} V ${chartHeight} H ${padding} Z`}
                                        fill={`url(#grad-${idx})`}
                                        className="opacity-10 pointer-events-none"
                                    />
                                    {trend.data.map((val, ptIdx) => (
                                        <g key={`pt-${idx}-${ptIdx}`}>
                                            <motion.circle
                                                cx={getX(ptIdx, trend.data.length)}
                                                cy={getY(val)}
                                                r="15"
                                                className="fill-transparent cursor-pointer"
                                                onMouseEnter={() => setHoveredPoint({
                                                    class: trend.label,
                                                    percentage: val,
                                                    month: trend.months[ptIdx],
                                                    x: getX(ptIdx, trend.data.length),
                                                    y: getY(val),
                                                    color: performanceColors[idx % performanceColors.length]
                                                })}
                                                onMouseLeave={() => setHoveredPoint(null)}
                                            />
                                            <circle
                                                cx={getX(ptIdx, trend.data.length)}
                                                cy={getY(val)}
                                                r="4"
                                                className="pointer-events-none"
                                                fill="white"
                                                stroke={performanceColors[idx % performanceColors.length]}
                                                strokeWidth="2.5"
                                            />
                                        </g>
                                    ))}
                                </g>
                            );
                        })}
                    </svg>

                    <AnimatePresence>
                        {hoveredPoint && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    left: `${(hoveredPoint.x / (chartWidth)) * 100}%`,
                                    top: `${(hoveredPoint.y / chartHeight) * 100 - 10}%`,
                                    transform: 'translate(-50%, -100%)'
                                }}
                            >
                                <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 min-w-[140px]">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{hoveredPoint.month}</p>
                                    <p className="text-xs font-bold leading-tight mb-3">{hoveredPoint.class}</p>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                        <span className="text-xl font-bold italic" style={{ color: hoveredPoint.color }}>{hoveredPoint.percentage}%</span>
                                        <div className="p-1 px-2 bg-white/10 rounded-lg">
                                            <span className="text-[8px] font-bold uppercase tracking-tighter">Avg Record</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-3 h-3 bg-slate-900 absolute left-1/2 -translate-x-1/2 -bottom-1.5 rotate-45 border-r border-b border-white/10"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-between mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-10 ml-5 italic">
                    {dashboardData.performance_trends[0]?.months.map(m => (
                        <span key={m}>{m}</span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Global Notifications Section */}
                <motion.div
                    className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 overflow-hidden relative"
                    variants={cardAnimationVariants}
                    initial="initial"
                    animate="animate"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Wing Notifications</h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">Pending actions and important wing updates</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] group hover:border-indigo-300 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600">
                                    <MoreVertical size={20} />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800 mb-1">Queue Placeholder</p>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider italic">Integration coming in next patch</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-indigo-100">Standby</div>
                        </div>
                    </div>
                </motion.div>

                {/* Class Dynamic Summary Table */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Units Summary</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Current state of all operational nursery classes</p>
                    </div>
                    <div className="overflow-x-auto grow">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-5 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Class Identity</th>
                                    <th className="px-5 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pupils</th>
                                    <th className="px-5 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Staff</th>
                                    <th className="px-5 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Attendance</th>
                                    <th className="px-5 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {dashboardData.class_summary.map((cls) => (
                                    <tr key={cls.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-500 transition-all"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{cls.classname} - {cls.section}</span>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-center text-base font-semibold text-slate-600 tracking-tighter">{cls.students_count}</td>
                                        <td className="px-5 py-3 text-center text-base font-semibold text-slate-600 tracking-tighter">{cls.teachers_count}</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`inline-block font-bold text-xs px-4 py-2 rounded-2xl uppercase tracking-widest italic border ${cls.attendance_percentage > 90 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                cls.attendance_percentage > 80 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {cls.attendance_percentage}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => window.location.href = `/class/${cls.id}`}
                                                className="p-2 bg-slate-50 text-slate-300 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all border border-slate-100 group/btn shadow-inner"
                                            >
                                                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default Dashboard;
