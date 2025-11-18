import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherCard from '../components/TeacherCard';
import HeaderRightSection from '../components/HeaderRightSection';
import Sidebar from '../components/Sidebar';

const Teachers = () => {
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            name: 'Aarav Patel',
            subject: 'Math',
            class: 'Kindergarten 1',
            room: 'Room A1',
            experience: '5 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'aarav.patel@nursery.com',
            phone: '+91-9876543210',
            joinedDate: '2020-06-15',
            qualifications: 'B.Ed, M.Sc. Mathematics',
            bio: 'A dedicated math teacher with a passion for making numbers fun for young learners.',
        },
        {
            id: 2,
            name: 'Priya Sharma',
            subject: 'English',
            class: 'Kindergarten 2',
            room: 'Room B3',
            experience: '4 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'priya.sharma@nursery.com',
            phone: '+91-8765432109',
            joinedDate: '2021-03-10',
            qualifications: 'B.A. English, M.Ed',
            bio: 'An enthusiastic English teacher who loves storytelling and creative writing.',
        },
        {
            id: 3,
            name: 'Saanvi Iyer',
            subject: 'Science',
            class: 'Kindergarten 1',
            room: 'Lab 1',
            experience: '6 yrs exp',
            status: 'On Leave',
            image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'saanvi.iyer@nursery.com',
            phone: '+91-7654321098',
            joinedDate: '2019-09-01',
            qualifications: 'B.Sc. Physics, B.Ed',
            bio: 'A science enthusiast who enjoys conducting simple experiments with kids.',
        },
        {
            id: 4,
            name: 'Rohan Gupta',
            subject: 'Art',
            class: 'Kindergarten 2',
            room: 'Studio',
            experience: '3 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'rohan.gupta@nursery.com',
            phone: '+91-6543210987',
            joinedDate: '2022-01-20',
            qualifications: 'B.F.A., Diploma in Art Education',
            bio: 'A creative art teacher who inspires children with colorful projects.',
        },
        {
            id: 5,
            name: 'Meera Nair',
            subject: 'Music',
            class: 'Kindergarten 1',
            room: 'Room C2',
            experience: '7 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'meera.nair@nursery.com',
            phone: '+91-5432109876',
            joinedDate: '2018-08-05',
            qualifications: 'B.Mus, M.Ed',
            bio: 'A passionate music teacher who teaches kids to sing and play instruments.',
        },
        {
            id: 6,
            name: 'Arjun Mehta',
            subject: 'Sports',
            class: 'Kindergarten 2',
            room: 'Gym',
            experience: '2 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'arjun.mehta@nursery.com',
            phone: '+91-4321098765',
            joinedDate: '2023-04-15',
            qualifications: 'B.P.Ed',
            bio: 'An energetic sports coach who promotes physical fitness in young children.',
        },
        {
            id: 7,
            name: 'Kugan Ramesh',
            subject: 'Music',
            class: 'Kindergarten 2',
            room: 'Room A2',
            experience: '5 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'aarav.patel@nursery.com',
            phone: '+91-9876543210',
            joinedDate: '2020-06-15',
            qualifications: 'B.Ed, M.Sc. Mathematics',
            bio: 'A dedicated math teacher with a passion for making numbers fun for young learners.',
        },
        {
            id: 8,
            name: 'Faizal Ameer',
            subject: 'Sports',
            class: 'Kindergarten 2',
            room: 'Room B3',
            experience: '4 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'priya.sharma@nursery.com',
            phone: '+91-8765432109',
            joinedDate: '2021-03-10',
            qualifications: 'B.A. English, M.Ed',
            bio: 'An enthusiastic English teacher who loves storytelling and creative writing.',
        },
        {
            id: 9,
            name: 'Zainab  Fatima',
            subject: 'Science',
            class: 'Kindergarten 1',
            room: 'Lab 1',
            experience: '6 yrs exp',
            status: 'On Leave',
            image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'saanvi.iyer@nursery.com',
            phone: '+91-7654321098',
            joinedDate: '2019-09-01',
            qualifications: 'B.Sc. Physics, B.Ed',
            bio: 'A science enthusiast who enjoys conducting simple experiments with kids.',
        },
        {
            id: 10,
            name: 'Nuha Aaysha',
            subject: 'Art',
            class: 'Kindergarten 1',
            room: 'Studio',
            experience: '3 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'rohan.gupta@nursery.com',
            phone: '+91-6543210987',
            joinedDate: '2022-01-20',
            qualifications: 'B.F.A., Diploma in Art Education',
            bio: 'A creative art teacher who inspires children with colorful projects.',
        },
        {
            id: 11,
            name: 'Sajeela Samiu',
            subject: 'Music',
            class: 'Kindergarten 2',
            room: 'Room C2',
            experience: '7 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'meera.nair@nursery.com',
            phone: '+91-5432109876',
            joinedDate: '2018-08-05',
            qualifications: 'B.Mus, M.Ed',
            bio: 'A passionate music teacher who teaches kids to sing and play instruments.',
        },
        {
            id: 12,
            name: 'Kumari Perera',
            subject: 'Sports',
            class: 'Kindergarten 2',
            room: 'Gym',
            experience: '2 yrs exp',
            status: 'Active',
            image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
            email: 'arjun.mehta@nursery.com',
            phone: '+91-4321098765',
            joinedDate: '2023-04-15',
            qualifications: 'B.P.Ed',
            bio: 'An energetic sports coach who promotes physical fitness in young children.',
        },
    ]);

    const [highlightedTeacher, setHighlightedTeacher] = useState(teachers[0] || null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input

    const cardAnimationVariants = {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10, duration: 0.6 } },
    };

    const navigate = useNavigate();
    const location = useLocation();
    const newTeacher = location.state?.newTeacher;

    useEffect(() => {
        if (newTeacher) {
            setTeachers((prevTeachers) => [
                ...prevTeachers,
                { ...newTeacher, id: prevTeachers.length + 1 },
            ]);
        }
    }, [newTeacher]);

    const handleCardClick = (teacherId) => {
        const teacher = teachers.find((t) => t.id === teacherId);
        navigate(`/teacher/${teacherId}`, { state: { teacher } });
    };

    // Filter teachers based on search term
    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.room.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64">
                  {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
              onNotificationClick={() => alert('Notifications clicked!')}
            />
          </div>
        </header>

                <main className="p-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/add-teacher')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                            >
                                <Plus size={20} />
                                Add Teacher
                            </button>
                            <button
                                onClick={() => navigate('/manage-leave-requests')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                <Calendar size={20} />
                                Manage Leave Requests
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative flex-1 min-w-[300px] max-w-md">
                            <Search className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" size={17} />
                            <input
                                type="text"
                                placeholder="Search teacher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                            <option>Subject: All</option>
                            <option>Math</option>
                            <option>English</option>
                            <option>Science</option>
                            <option>Art</option>
                            <option>Music</option>
                            <option>Sports</option>
                        </select>
                        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                            <option>Class: All</option>
                            <option>Kindergarten 1</option>
                            <option>Kindergarten 2</option>
                        </select>
                        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                            <option>Status: Active</option>
                            <option>On Leave</option>
                            <option>All</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                                variants={cardAnimationVariants}
                                initial="initial"
                                animate="animate"
                            >
                                {filteredTeachers.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        onClick={() => handleCardClick(teacher.id)}
                                        className="cursor-pointer"
                                    >
                                        <TeacherCard teacher={teacher} onSelect={setHighlightedTeacher} />
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <motion.div
                            className="lg:col-span-1"
                            variants={cardAnimationVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Highlighted Teacher</h2>
                                {highlightedTeacher && (
                                    <>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                                <img
                                                    src={highlightedTeacher.image}
                                                    alt={highlightedTeacher.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-1">{highlightedTeacher.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {highlightedTeacher.subject} <span className="text-gray-400">•</span>{' '}
                                                    {highlightedTeacher.class}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span>{highlightedTeacher.room}</span>
                                                        <span>{highlightedTeacher.experience}</span>
                                                    </div>
                                                    <span
                                                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                                                            highlightedTeacher.status === 'Active'
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}
                                                    >
                                                        {highlightedTeacher.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
                                                Message
                                            </button>
                                            <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                                Assign Class
                                            </button>
                                        </div>
                                    </>
                                )}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
                                    <div className="grid grid-cols-3 gap-1">
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <p className="text-sm text-gray-600 mb-2">Total Teachers</p>
                                            <p className="text-4xl font-bold text-gray-900">{teachers.length}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <p className="text-sm text-gray-600 mb-2">Active Teachers</p>
                                            <p className="text-4xl font-bold text-gray-900">
                                                {teachers.filter((t) => t.status === 'Active').length}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <p className="text-sm text-gray-600 mb-2">On Leave</p>
                                            <p className="text-4xl font-bold text-gray-900">
                                                {teachers.filter((t) => t.status === 'On Leave').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Teachers;