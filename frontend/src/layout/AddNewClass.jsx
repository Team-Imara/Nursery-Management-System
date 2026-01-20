// src/pages/AddNewClass.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from './Layout.jsx';

const AddNewClass = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    room: '',
    ageGroup: '4-5',
    capacity: 20,
    teacher: { name: '', avatar: '' },
  });

  const handleSubmit = () => {
    if (!form.name || !form.room || !form.teacher.name) {
      alert('Please fill all required fields');
      return;
    }

    const newClass = {
      id: Date.now(),
      name: form.name,
      room: form.room,
      ageGroup: form.ageGroup,
      teacher: {
        name: form.teacher.name,
        avatar: form.teacher.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      capacity: Number(form.capacity),
      enrolled: 0,
    };

    // Load existing + add new
    const existing = JSON.parse(localStorage.getItem('nursery-classes') || '[]');
    localStorage.setItem('nursery-classes', JSON.stringify([...existing, newClass]));

    navigate('/class-management');
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
  );
};

export default AddNewClass;