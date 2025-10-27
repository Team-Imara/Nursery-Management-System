import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const TeacherDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const teacher = location.state?.teacher; // Get teacher data from state

    // Fallback if no teacher data is passed
    const defaultTeacher = {
        id: 1,
        name: 'Unknown Teacher',
        subject: 'N/A',
        class: 'N/A',
        room: 'N/A',
        experience: 'N/A',
        status: 'N/A',
        image: 'https://via.placeholder.com/150',
        email: 'N/A',
        phone: 'N/A',
        joinedDate: 'N/A',
        qualifications: 'N/A',
        bio: 'No bio available.',
    };
    const displayTeacher = teacher || defaultTeacher;

    const cardAnimationVariants = {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10, duration: 0.6 } },
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-start">
                        <button
                            onClick={() => navigate('/teachers')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Teachers
                        </button>
                    </div>
                </header>

                <main className="pt-8">
                    <motion.div
                        className="max-w-3xl mx-auto"
                        variants={cardAnimationVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={displayTeacher.image}
                                        alt={displayTeacher.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayTeacher.name}</h1>
                                    <p className="text-lg text-gray-600 mb-3">{displayTeacher.subject}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>{displayTeacher.room}</span>
                                            <span>{displayTeacher.experience}</span>
                                        </div>
                                        <span
                                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                                                displayTeacher.status === 'Active'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-amber-50 text-amber-700'
                                            }`}
                                        >
                                            {displayTeacher.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Class:</strong></p>
                                    <p className="text-lg">{displayTeacher.class}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Room:</strong></p>
                                    <p className="text-lg">{displayTeacher.room}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Experience:</strong></p>
                                    <p className="text-lg">{displayTeacher.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Status:</strong></p>
                                    <p className="text-lg">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                displayTeacher.status === 'Active'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-amber-50 text-amber-700'
                                            }`}
                                        >
                                            {displayTeacher.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong></p>
                                    <p className="text-lg">{displayTeacher.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong></p>
                                    <p className="text-lg">{displayTeacher.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Joined Date:</strong></p>
                                    <p className="text-lg">{displayTeacher.joinedDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>Qualifications:</strong></p>
                                    <p className="text-lg">{displayTeacher.qualifications}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm text-gray-600 mb-1"><strong>Bio:</strong></p>
                                <p className="text-lg text-gray-700">{displayTeacher.bio}</p>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
                                    Message
                                </button>
                                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                    Assign Class
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-gray-50 rounded-xl p-5 text-center">
                                    <p className="text-sm text-gray-600 mb-2">Total Teachers</p>
                                    <p className="text-4xl font-bold text-gray-900">12</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 text-center">
                                    <p className="text-sm text-gray-600 mb-2">Active Teachers</p>
                                    <p className="text-4xl font-bold text-green-600">10</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 text-center">
                                    <p className="text-sm text-gray-600 mb-2">On Leave</p>
                                    <p className="text-4xl font-bold text-amber-600">2</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default TeacherDetail;