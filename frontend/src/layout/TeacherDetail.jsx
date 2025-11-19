// src/pages/TeacherDetail.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Edit2, X, Save, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const TeacherDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingTeacher = location.state?.teacher;

  const defaultTeacher = {
    id: 0,
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

  const [teacher, setTeacher] = useState(() => {
    if (incomingTeacher) return incomingTeacher;
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return defaultTeacher;
    const saved = JSON.parse(localStorage.getItem('teachers') || '[]');
    return saved.find(t => t.id === Number(id)) || defaultTeacher;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState(teacher);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('teachers') || '[]');
    const current = saved.find(t => t.id === teacher.id);
    if (current) {
      setTeacher(current);
      if (!isEditing) setEditedTeacher(current);
    }
  }, [teacher.id, isEditing]);

  const cardAnimationVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
  };

  const handleSave = () => {
    const savedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const updatedTeachers = savedTeachers.map(t =>
      t.id === teacher.id ? { ...t, ...editedTeacher } : t
    );
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
    setTeacher(editedTeacher);
    setIsEditing(false);
    window.dispatchEvent(new CustomEvent('teachers-updated'));
  };

  const handleCancel = () => {
    setEditedTeacher(teacher);
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove ${teacher.name}?`)) {
      const savedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const updatedTeachers = savedTeachers.filter(t => t.id !== teacher.id);
      localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
      navigate('/teachers', { replace: true });
    }
  };

  // Message Modal Functions
  const openMessageModal = () => {
    if (teacher.status !== 'Active') return;
    setMessageText('');
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    // Simulate sending (you can replace with API call)
    console.log(`Message sent to ${teacher.name}:`, messageText);
    alert(`Message sent to ${teacher.name}!`);
    setShowMessageModal(false);
    setMessageText('');
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageText('');
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <button
            onClick={() => navigate('/teachers')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Teachers
          </button>
        </header>

        <main className="pt-8">
          <motion.div className="max-w-3xl mx-auto" variants={cardAnimationVariants} initial="initial" animate="animate">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {/* Header */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTeacher.image}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, image: e.target.value })}
                      placeholder="Image URL"
                      className="w-full h-full text-xs p-2 border rounded"
                    />
                  ) : (
                    <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTeacher.name}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, name: e.target.value })}
                      className="text-3xl font-bold w-full px-2 py-1 border rounded mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{teacher.name}</h1>
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTeacher.subject}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, subject: e.target.value })}
                      className="text-lg w-full px-2 py-1 border rounded mb-3"
                    />
                  ) : (
                    <p className="text-lg text-gray-600 mb-3">{teacher.subject}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-gray-600">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editedTeacher.room}
                            onChange={(e) => setEditedTeacher({ ...editedTeacher, room: e.target.value })}
                            className="px-2 py-1 border rounded w-24"
                            placeholder="Room"
                          />
                          <input
                            type="text"
                            value={editedTeacher.experience}
                            onChange={(e) => setEditedTeacher({ ...editedTeacher, experience: e.target.value })}
                            className="px-2 py-1 border rounded w-32"
                            placeholder="Experience"
                          />
                        </>
                      ) : (
                        <>
                          <span>{teacher.room}</span>
                          <span>{teacher.experience}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <select
                          value={editedTeacher.status}
                          onChange={(e) => setEditedTeacher({ ...editedTeacher, status: e.target.value })}
                          className="text-sm px-3 py-1 border rounded"
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      ) : (
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            teacher.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {teacher.status}
                        </span>
                      )}

                      {/* Message Button */}
                      {teacher.status === 'Active' && !isEditing && (
                        <button
                          onClick={openMessageModal}
                          className="text-green-700 hover:text-green-800 transition-colors"
                          title="Send Message"
                        >
                          <MessageCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[
                  { label: 'Class', key: 'class' },
                  { label: 'Email', key: 'email' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Joined Date', key: 'joinedDate' },
                  { label: 'Qualifications', key: 'qualifications' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-sm text-gray-600 mb-1"><strong>{label}:</strong></p>
                    {isEditing ? (
                      <input
                        type={key === 'joinedDate' ? 'date' : 'text'}
                        value={editedTeacher[key]}
                        onChange={(e) => setEditedTeacher({ ...editedTeacher, [key]: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-lg">{teacher[key] || 'N/A'}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1"><strong>Bio:</strong></p>
                {isEditing ? (
                  <textarea
                    value={editedTeacher.bio}
                    onChange={(e) => setEditedTeacher({ ...editedTeacher, bio: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  />
                ) : (
                  <p className="text-lg text-gray-700">{teacher.bio}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      <Save size={18} /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                      <X size={18} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                    >
                      <Edit2 size={18} /> Edit Profile
                    </button>
                    <button
                      onClick={handleRemove}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      Remove Teacher
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Message {teacher.name}</h3>
              <button
                onClick={closeMessageModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Send size={16} />
                Send
              </button>
              <button
                onClick={closeMessageModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherDetail;