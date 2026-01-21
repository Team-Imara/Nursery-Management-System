// src/pages/AddNewClass.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, HelpCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection';
import axios from '../api/axios';
import { ArrowLeft } from 'lucide-react';
import Layout from './Layout.jsx';

const AddNewClass = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    classname: '',
    capacity: 20,
    head_teacher_id: ''
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/users');
        const teacherUsers = response.data.filter(u => u.role === 'teacher' || u.role === 'admin');
        setTeachers(teacherUsers);
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async () => {
    if (!form.classname || !form.capacity || !form.head_teacher_id) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await axios.post('/classes', form);
      navigate('/class-management');
    } catch (err) {
      console.error("Error creating class:", err);
      alert("Failed to create class. Check network or server.");
    }
  };

  const headerContent = (
    <div className="flex items-center justify-start">
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
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


        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
              <div className="flex gap-2">

                <button onClick={() => navigate('/class-management')} className="px-4 py-2 border rounded-lg text-gray-700">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                  Add Class
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Kindergarten 1 - C"
                  value={form.classname}
                  onChange={e => setForm({ ...form, classname: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Teacher *</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.head_teacher_id}
                    onChange={e => setForm({ ...form, head_teacher_id: e.target.value })}
                  >
                    <option value="">Select a Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.fullname}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
</div>
</main>
</div>
            <div className="mt-8 flex justify-end gap-3">
    <Layout headerContent={headerContent}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
            <div className="flex gap-2">

              <button onClick={() => navigate('/class-management')} className="px-4 py-2 border rounded-lg text-gray-700">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Add Class
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g. Kindergarten 1 - C"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. 305"
                  value={form.room}
                  onChange={e => setForm({ ...form, room: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.ageGroup}
                  onChange={e => setForm({ ...form, ageGroup: e.target.value })}
                >
                  <option value="4-5">4-5 yrs</option>
                  <option value="5-6">5-6 yrs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Teacher *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Aisha Perera"
                  value={form.teacher.name}
                  onChange={e => setForm({ ...form, teacher: { ...form.teacher, name: e.target.value } })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Photo URL (optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://randomuser.me/api/portraits/women/..."
                value={form.teacher.avatar}
                onChange={e => setForm({ ...form, teacher: { ...form.teacher, avatar: e.target.value } })}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => navigate('/class-management')} className="px-4 py-2 border rounded-lg text-gray-700">
              Back to Classes
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              Create Class
            </button>
          </div>
        </div>
      </main>
    </Layout>
    </div>
    </div>
  );
};

export default AddNewClass;