// src/pages/ClassManagement.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Table, Edit, Trash2, Clock, Check, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection';

const defaultClasses = [
  {
    id: 1,
    name: 'Kindergarten 1 - A',
    room: '102',
    ageGroup: '4-5',
    teacher: { name: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    capacity: 20,
    enrolled: 18,
  },
  {
    id: 2,
    name: 'Kindergarten 1 - B',
    room: '201',
    ageGroup: '4-5',
    teacher: { name: 'Rohit Mehta', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    capacity: 20,
    enrolled: 11,
  },
];

const ClassManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [teacherFilter, setTeacherFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('nursery-classes');
    return saved ? JSON.parse(saved) : defaultClasses;
  });

  useEffect(() => {
    localStorage.setItem('nursery-classes', JSON.stringify(classes));
  }, [classes]);

  const filtered = useMemo(() => {
    return classes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.teacher.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || c.ageGroup === typeFilter;
      const matchesCapacity = capacityFilter === 'All' || 
        (capacityFilter === 'Full' && c.enrolled === c.capacity) ||
        (capacityFilter === 'Available' && c.enrolled < c.capacity);
      const matchesTeacher = teacherFilter === 'All' || c.teacher.name === teacherFilter;
      return matchesSearch && matchesType && matchesCapacity && matchesTeacher;
    });
  }, [search, typeFilter, capacityFilter, teacherFilter, classes]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) {
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  };

  const startEdit = (cls) => {
    setEditingId(cls.id);
    setEditForm({ ...cls });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    setClasses(prev =>
      prev.map(c => (c.id === editingId ? { ...editForm, id: editingId } : c))
    );
    cancelEdit();
  };

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
            />
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Class Management</h1>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[250px] relative">
              <input
                type="text"
                placeholder="Search by class name or teacher"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">Class Type: All</option>
              <option value="4-5">4-5 yrs</option>
              <option value="5-6">5-6 yrs</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg" value={capacityFilter} onChange={e => setCapacityFilter(e.target.value)}>
              <option value="All">Capacity: All</option>
              <option value="Full">Full</option>
              <option value="Available">Available</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg" value={teacherFilter} onChange={e => setTeacherFilter(e.target.value)}>
              <option value="All">Teacher: All</option>
              {[...new Set(classes.map(c => c.teacher.name))].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigate('/AddNewClass')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2 hover:bg-green-200"
            >
              <Plus className="w-5 h-5" /> Add New Class
            </button>
            <button
              onClick={() => navigate('/ViewTimetable')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200"
            >
              <Table className="w-5 h-5" /> Timetable
            </button>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No classes found.</p>
                <button onClick={() => navigate('/classes/new')} className="mt-4 text-indigo-600 hover:underline">
                  Add your first class
                </button>
              </div>
            ) : (
              filtered.map(cls => (
                <div key={cls.id} className="bg-white p-6 rounded-lg shadow-sm">
                  {editingId === cls.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Class Name" className="px-3 py-2 border rounded-lg" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        <input type="text" placeholder="Room" className="px-3 py-2 border rounded-lg" value={editForm.room} onChange={e => setEditForm({ ...editForm, room: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <select className="px-3 py-2 border rounded-lg" value={editForm.ageGroup} onChange={e => setEditForm({ ...editForm, ageGroup: e.target.value })}>
                          <option value="4-5">4-5 yrs</option>
                          <option value="5-6">5-6 yrs</option>
                        </select>
                        <input type="number" placeholder="Capacity" className="px-3 py-2 border rounded-lg" value={editForm.capacity} onChange={e => setEditForm({ ...editForm, capacity: e.target.value })} />
                        <input type="number" placeholder="Enrolled" className="px-3 py-2 border rounded-lg" value={editForm.enrolled} onChange={e => setEditForm({ ...editForm, enrolled: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Teacher Name" className="px-3 py-2 border rounded-lg" value={editForm.teacher.name} onChange={e => setEditForm({ ...editForm, teacher: { ...editForm.teacher, name: e.target.value } })} />
                        <input type="text" placeholder="Avatar URL" className="px-3 py-2 border rounded-lg" value={editForm.teacher.avatar} onChange={e => setEditForm({ ...editForm, teacher: { ...editForm.teacher, avatar: e.target.value } })} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1">
                          <Check className="w-4 h-4" /> Save
                        </button>
                        <button onClick={cancelEdit} className="px-4 py-2 border rounded-lg text-gray-700 flex items-center gap-1">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {cls.name} <span className="text-sm text-gray-500">• Room {cls.room} • Age {cls.ageGroup}</span>
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <img src={cls.teacher.avatar} alt={cls.teacher.name} className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-medium">{cls.teacher.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }} />
                            </div>
                            <span className="text-sm text-gray-600">{cls.enrolled}/{cls.capacity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/ViewTimetable?class=${cls.id}`}
                          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-pink-200"
                        >
                          <Clock className="w-4 h-4" /> View timetable
                        </Link>
                        <button onClick={() => startEdit(cls)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(cls.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex justify-center items-center gap-2">
            <button className="px-3 py-1 border rounded-lg text-sm">Prev</button>
            <button className="px-3 py-1 bg-indigo-700 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border rounded-lg text-sm">Next</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassManagement;