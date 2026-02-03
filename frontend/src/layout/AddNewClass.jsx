// src/pages/AddNewClass.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft, Save } from 'lucide-react';
import axios from '../api/axios';
import Layout from '../components/Layout.jsx';

const AddNewClass = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    classname: '',
    sections: [],
    capacity: 20,
    head_teacher_id: '',
    class_incharge_id: '',
    assistant_teacher_ids: []
  });

  const classOptions = ['KG1', 'KG2'];
  const sectionOptions = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/users');
        // Filter for only 'teacher' role as requested
        const teacherUsers = response.data.filter(u => u.role === 'teacher');
        setTeachers(teacherUsers);
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleSectionToggle = (section) => {
    setForm(prev => {
      const isSelected = prev.sections.includes(section);
      if (isSelected) {
        return { ...prev, sections: prev.sections.filter(s => s !== section) };
      } else {
        return { ...prev, sections: [...prev.sections, section] };
      }
    });
  };

  const handleAssistantToggle = (teacherId) => {
    setForm(prev => {
      const isSelected = prev.assistant_teacher_ids.includes(teacherId);
      if (isSelected) {
        return { ...prev, assistant_teacher_ids: prev.assistant_teacher_ids.filter(id => id !== teacherId) };
      } else {
        return { ...prev, assistant_teacher_ids: [...prev.assistant_teacher_ids, teacherId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    if (loading) {
      console.log("Already loading, preventing duplicate submission.");
      return;
    }

    if (!form.classname || !form.capacity || !form.head_teacher_id) {
      alert('Please fill all required fields (Class Name, Capacity, Head Teacher)');
      return;
    }

    if (form.capacity <= 0) {
      alert('Maximum Capacity must be a positive number');
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Class</h1>
              <p className="text-gray-500 mt-1">Setup a new nursery class and assign teacher roles.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              {/* Class Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-50 pb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class Name *</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                    value={form.classname}
                    onChange={e => setForm({ ...form, classname: e.target.value })}
                  >
                    <option value="">Select Level</option>
                    {classOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

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
              </div>

              {/* Sections Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Available Sections</label>
                <div className="flex flex-wrap gap-4">
                  {sectionOptions.map(section => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => handleSectionToggle(section)}
                      className={`px-6 py-3 rounded-xl border-2 transition-all font-semibold ${form.sections.includes(section)
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                    >
                      Section {section}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">Select one or more sections for this class</p>
              </div>

              {/* Teacher Assignments */}
              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">Teacher Assignments</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Head Teacher *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                      value={form.head_teacher_id}
                      onChange={e => setForm({ ...form, head_teacher_id: e.target.value })}
                    >
                      <option value="">Assign Head Teacher</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.fullname}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class Incharge</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                      value={form.class_incharge_id}
                      onChange={e => setForm({ ...form, class_incharge_id: e.target.value })}
                    >
                      <option value="">Assign Class Incharge</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.fullname}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Assistant Teachers</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {teachers.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleAssistantToggle(t.id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${form.assistant_teacher_ids.includes(t.id)
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300'
                          }`}
                      >
                        <span className="truncate mr-2">{t.fullname}</span>
                        {form.assistant_teacher_ids.includes(t.id) && <Plus size={16} className="rotate-45" />}
                      </button>
                    ))}
                  </div>
                  {teachers.length === 0 && <p className="text-sm text-gray-400">No teachers found in the database.</p>}
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
                {loading ? 'Processing...' : (
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