// src/pages/AddNewClass.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft, Save } from 'lucide-react';
import axios from '../api/axios';
import Layout from './Layout.jsx';

const AddNewClass = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    classname: '',
    capacity: 20,
    head_teacher_id: ''
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/users');
        // Based on ClassesController, we need a valid user ID for head_teacher_id
        const teacherUsers = response.data.filter(u => u.role === 'teacher' || u.role === 'admin');
        setTeachers(teacherUsers);
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classname || !form.capacity || !form.head_teacher_id) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/classes', form);
      alert('Class created successfully!');
      navigate('/class-management');
    } catch (err) {
      console.error("Error creating class:", err);
      alert("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <Layout headerContent={headerContent}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Class</h1>
              <p className="text-gray-500 mt-1">Setup a new nursery class and assign a lead teacher.</p>
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
                  placeholder="e.g. Kindergarten 1 - A"
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
                onClick={() => navigate('/class-management')}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : (
                  <>
                    <Save size={20} />
                    Create Class
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

export default AddNewClass;