import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Star, ArrowLeft, Loader2, Filter, Calendar,
    ChevronRight, Save, X, Info, CheckCircle2,
    LayoutGrid, Users, BookOpen, Brain, Calculator, Palette,
    Smile, Activity
} from 'lucide-react';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const SkillCategories = [
    {
        id: 'psychomotor',
        name: 'Development of Psychomotor Skills',
        icon: <Activity className="text-blue-500" />,
        skills: ['Fine Motor Skills', 'Gross Motor Skills']
    },
    {
        id: 'social_emotional',
        name: 'Development of Social & Emotional Skills',
        icon: <Smile className="text-pink-500" />,
        skills: [
            'Interact with others',
            'Participates in group activities',
            'Follow simple rules',
            'Demonstrate self-confidence',
            'Play & share with others',
            'Happy & cheerful at school'
        ]
    },
    {
        id: 'language',
        name: 'Development of Language Skills',
        icon: <BookOpen className="text-indigo-500" />,
        skills: [
            'Listens attentively',
            'Development of pre-reading skills',
            'Development of pre-writing skills',
            'Express ideas clearly',
            'Asks & answers questions',
            'Observe instructions'
        ]
    },
    {
        id: 'mathematical',
        name: 'Development of Mathematical Skills',
        icon: <Calculator className="text-green-500" />,
        skills: [
            'Sort objects into sets',
            'Identify basic shapes, colours & sizes',
            'Count from 1 to 10',
            'Make simple patterns',
            'Arrange sizes in order'
        ]
    },
    {
        id: 'aesthetic',
        name: 'Development of Aesthetic Skills',
        icon: <Palette className="text-orange-500" />,
        skills: [
            'Creativity',
            'Drawing skills',
            'Participate in singing activities',
            'Participate in and appreciate movement & dance',
            'Model objects using available materials'
        ]
    }
];

const RatingLevels = [
    { label: 'Excellent', color: 'bg-blue-500', value: 100, dot: 'text-blue-500' },
    { label: 'Very Good', color: 'bg-green-500', value: 75, dot: 'text-green-500' },
    { label: 'Good', color: 'bg-yellow-500', value: 50, dot: 'text-yellow-500' },
    { label: 'Needs Improvement', color: 'bg-red-500', value: 25, dot: 'text-red-500' }
];

const StudentSkillsRecords = () => {
    const navigate = useNavigate();

    // States
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]); // List of sections for selected class
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState([]);

    // Filters
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSection, setSelectedSection] = useState(''); // New section filter
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [modalRatings, setModalRatings] = useState({}); // { skillName: value }
    const [isSaving, setIsSaving] = useState(false);

    // Initial load: Classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('/classes');
                setClasses(response.data);
                if (response.data.length > 0) {
                    setSelectedClassId(response.data[0].id);
                    // Initial sections
                    const firstClass = response.data[0];
                    if (firstClass.sections && Array.isArray(firstClass.sections)) {
                        setSections(firstClass.sections);
                        if (firstClass.sections.length > 0) {
                            setSelectedSection(firstClass.sections[0]);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        };
        fetchClasses();
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

    // Fetch students and records
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedClassId || !selectedMonth) return;
            try {
                setLoading(true);
                let studentsUrl = `/students?class_id=${selectedClassId}`;
                if (selectedSection) studentsUrl += `&section=${selectedSection}`;

                const [studentsRes, recordsRes] = await Promise.all([
                    axios.get(studentsUrl),
                    axios.get(`/skill-records?class_id=${selectedClassId}&month=${selectedMonth}`)
                ]);
                setStudents(studentsRes.data);
                setRecords(recordsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedClassId, selectedSection, selectedMonth]);

    const openRatingModal = (student, category) => {
        setActiveStudent(student);
        setActiveCategory(category);

        // Populate existing ratings
        const initialRatings = {};
        category.skills.forEach(skillName => {
            const record = records.find(r =>
                r.student_id === student.id &&
                r.category === category.name &&
                r.skill === skillName
            );
            initialRatings[skillName] = record ? record.percentage : 0;
        });
        setModalRatings(initialRatings);
        setIsModalOpen(true);
    };

    const handleSaveRatings = async () => {
        try {
            setIsSaving(true);
            const recordsToSave = Object.entries(modalRatings).map(([skill, percentage]) => ({
                student_id: activeStudent.id,
                class_id: selectedClassId,
                category: activeCategory.name,
                skill: skill,
                percentage: percentage,
                month: selectedMonth
            })).filter(r => r.percentage > 0);

            if (recordsToSave.length === 0) {
                setIsModalOpen(false);
                return;
            }

            await axios.post('/skill-records/bulk-store', { records: recordsToSave });

            // Refresh records
            const recordsRes = await axios.get(`/skill-records?class_id=${selectedClassId}&month=${selectedMonth}`);
            setRecords(recordsRes.data);

            setIsModalOpen(false);
            // Optional: toast success
        } catch (err) {
            console.error("Error saving skills:", err);
            alert("Failed to save skill records.");
        } finally {
            setIsSaving(false);
        }
    };

    const calculateCategoryStars = (studentId, categoryName) => {
        const categorySkills = SkillCategories.find(c => c.name === categoryName).skills;
        const studentCategoryRecords = records.filter(r =>
            r.student_id === studentId &&
            r.category === categoryName
        );

        if (studentCategoryRecords.length === 0) return 0;

        const totalPercentage = studentCategoryRecords.reduce((sum, r) => sum + r.percentage, 0);
        const avgPercentage = totalPercentage / categorySkills.length;

        // Scale 100% to 5 stars
        return Math.min(5, Math.max(0, (avgPercentage / 100) * 5));
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <button
                            onClick={() => navigate('/students')}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm">Back to Students</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Skill Records Center</h1>
                        <p className="text-gray-500 font-semibold mt-1">Assessment of Developmental Progress & Milestone Achievement</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm">
                            <Star size={18} fill="currentColor" />
                            <span>Academic Year 2026</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Target Class</label>
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                                >
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.classname} {c.sections && c.sections.length > 0 ? `- (${c.sections.join(', ')})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Section</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 transition-all appearance-none cursor-pointer"
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
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Assessment Month</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 placeholder:text-gray-300 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex items-end justify-end">
                            <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-gray-400 border-l border-gray-100 pl-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-100"></div>
                                    <span>Excellent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-100"></div>
                                    <span>Very Good</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-100"></div>
                                    <span>Good</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-100"></div>
                                    <span>Needs Help</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid Content */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="sticky left-0 bg-gray-50/50 z-20 px-3 py-3 text-left border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                                <Users size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Student Enrollment</span>
                                        </div>
                                    </th>
                                    {SkillCategories.map(cat => (
                                        <th key={cat.name} className="px-3 py-3 border-b border-l border-gray-100 text-center min-w-[200px]">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-2.5 bg-gray-100 rounded-xl mb-1">
                                                    {cat.icon}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight max-w-[150px]">
                                                    {cat.name}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={SkillCategories.length + 1} className="py-24 text-center">
                                                <Loader2 className="animate-spin text-indigo-600 mx-auto" size={40} />
                                                <p className="text-gray-400 font-bold mt-4 animate-pulse">Synchronizing performance metrics...</p>
                                            </td>
                                        </tr>
                                    ) : students.map((student) => {
                                        const initials = student.fullname.charAt(0);
                                        return (
                                            <motion.tr
                                                key={student.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="group hover:bg-gray-50/30 transition-colors"
                                            >
                                                <td className="sticky left-0 bg-white group-hover:bg-gray-50/30 z-20 px-3 py-3 border-b border-gray-100">
                                                    <div className="flex items-center gap-4">

                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{student.fullname}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"># {student.id < 10 ? `0${student.id}` : student.id}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {SkillCategories.map(cat => {
                                                    const stars = calculateCategoryStars(student.id, cat.name);
                                                    const hasRecords = records.some(r => r.student_id === student.id && r.category === cat.name);

                                                    return (
                                                        <td
                                                            key={cat.id}
                                                            className="px-6 py-6 border-l border-gray-100 text-center cursor-pointer hover:bg-indigo-50/30 transition-all group/cell"
                                                            onClick={() => openRatingModal(student, cat)}
                                                        >
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="flex items-center gap-0.5">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            size={18}
                                                                            className={`${i < Math.floor(stars) ? 'text-yellow-400 fill-yellow-400' : (i < stars ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-gray-200')} transition-all group-hover/cell:scale-110`}
                                                                            style={{ transitionDelay: `${i * 50}ms` }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className={`text-[10px] font-black uppercase tracking-widest ${hasRecords ? 'text-indigo-500' : 'text-gray-300'}`}>
                                                                    {hasRecords ? 'Update Profile' : 'Not Rated'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    )
                                                })}
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                                {!loading && students.length === 0 && (
                                    <tr>
                                        <td colSpan={SkillCategories.length + 1} className="py-32 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                    <Info className="text-gray-300" size={40} />
                                                </div>
                                                <p className="text-gray-900 text-xl font-black mb-2">No active students</p>
                                                <p className="text-gray-400 font-bold text-sm">Please verify the selected target class and try again.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend Modal - Optional Info */}
                <div className="mt-8 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                    <Info size={20} className="text-indigo-400" />
                    <p>Calculations: Category average score is converted into a 5-star visual representation. 100% (Excellent) gives a full 5-star profile.</p>
                </div>
            </div>

            {/* Assessment Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-900 px-6 py-6 text-white flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-slate-800 rounded-lg text-indigo-400 border border-slate-700">
                                            {activeCategory?.icon && React.cloneElement(activeCategory.icon, { size: 14 })}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            {activeCategory?.name}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold">{activeStudent?.fullname}</h2>
                                    <p className="text-slate-400 font-bold text-xs mt-0.5">Class {activeStudent?.classe?.classname || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    {activeCategory.skills.map((skill, index) => (
                                        <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:border-indigo-100 transition-all">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-gray-900 text-sm">{skill}</span>
                                                {modalRatings[skill] > 0 && (
                                                    <CheckCircle2 size={18} className={RatingLevels.find(rl => rl.value === modalRatings[skill])?.dot} />
                                                )}
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                {RatingLevels.map((lvl) => (
                                                    <button
                                                        key={lvl.label}
                                                        onClick={() => setModalRatings(prev => ({ ...prev, [skill]: lvl.value }))}
                                                        className={`py-2 px-1 rounded-xl text-[8px] font-bold uppercase tracking-wider transition-all border flex flex-col items-center gap-1 ${modalRatings[skill] === lvl.value
                                                            ? `${lvl.color} text-white border-transparent shadow shadow-indigo-100`
                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-100 hover:text-indigo-600'
                                                            }`}
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full ${modalRatings[skill] === lvl.value ? 'bg-white' : lvl.color}`}></div>
                                                        {lvl.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-white text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-100 transition shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRatings}
                                    disabled={isSaving}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${isSaving
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-700 text-white hover:bg-indigo-800 shadow-indigo-100'
                                        }`}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                    Commit
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            ` }} />
        </Layout>
    );
};

export default StudentSkillsRecords;
