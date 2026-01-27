// src/pages/EditClass.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import axios from '../api/axios';
import Layout from './Layout.jsx';

const EditClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [form, setForm] = useState({
        classname: '',
        capacity: '',
        head_teacher_id: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersRes, classRes] = await Promise.all([
                    axios.get('/users'),
                    axios.get(`/classes/${id}`)
                ]);

                const teacherUsers = teachersRes.data.filter(u => u.role === 'teacher' || u.role === 'admin');
                setTeachers(teacherUsers);

                const c = classRes.data;
                setForm({
                    classname: c.classname,
                    capacity: c.capacity,
                    head_teacher_id: c.head_teacher_id
                });
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load class data");
                navigate('/class-management');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await axios.put(`/classes/${id}`, form);
            alert('Class updated successfully');
            navigate(`/class/${id}`);
        } catch (err) {
            console.error("Error updating class:", err);
            alert("Failed to update class");
        } finally {
            setSaving(false);
        }
    };

    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <button
                onClick={() => navigate(`/class/${id}`)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Details
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

    return (
        <Layout headerContent={headerContent}>
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
                            <p className="text-gray-500 mt-1">Update class details and teacher assignments.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Class Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={form.classname}
                                    onChange={e => setForm({ ...form, classname: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Capacity *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={form.capacity}
                                        onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || '' })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Teacher *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                                        value={form.head_teacher_id}
                                        onChange={e => setForm({ ...form, head_teacher_id: e.target.value })}
                                    >
                                        <option value="">Select a Teacher</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.fullname} ({t.role})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/class/${id}`)}
                                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </Layout>
    );
};

export default EditClass;
