import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection';
import axios from '../api/axios';

const EditClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);

    // Default form structure
    const [form, setForm] = useState({
        classname: '',
        capacity: '',
        head_teacher_id: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            // Fetch class data + teachers in parallel ideally, but sequential is safer for ordering
            try {
                // Fetch Available Teachers
                // Assuming there's an endpoint for users or teachers
                // Based on standard Laravel resource from previous steps: /users or /teachers?role=teacher
                // Let's try /users
                const teachersRes = await axios.get('/users');
                // Filter client side if backend returns all users, checking 'role' if available
                const allUsers = teachersRes.data;
                const teacherUsers = allUsers.filter(u => u.role === 'teacher' || u.role === 'admin'); // Allow admin for now if testing
                setTeachers(teacherUsers);

                // Fetch Class Data
                const classRes = await axios.get(`/classes/${id}`);
                const c = classRes.data;
                setForm({
                    classname: c.classname,
                    capacity: c.capacity,
                    head_teacher_id: c.head_teacher_id
                });

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load data");
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        try {
            await axios.put(`/classes/${id}`, form);
            navigate(`/class/${id}`);
        } catch (err) {
            console.error("Error updating class:", err);
            alert("Failed to update class");
        }
    };

    if (loading) return <div>Loading...</div>;

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
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(`/class/${id}`)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft size={24} className="text-gray-600" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Class Details</h1>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={form.classname}
                                        onChange={e => setForm({ ...form, classname: e.target.value })}
                                        placeholder="e.g. Kindergarten 1-A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={form.capacity}
                                        onChange={e => setForm({ ...form, capacity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <h3 className="text-lg font-semibold text-gray-900">Teacher Assignments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Teacher</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={form.head_teacher_id}
                                        onChange={e => setForm({ ...form, head_teacher_id: e.target.value })}
                                    >
                                        <option value="">Select a Teacher</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.fullname} ({t.username})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditClass;
