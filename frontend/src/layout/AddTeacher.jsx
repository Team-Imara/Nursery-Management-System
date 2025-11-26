import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection'; // ← THIS WAS MISSING!

const AddTeacher = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    class: '',
    room: '',
    experience: '',
    status: 'Active',
    image: '',
    email: '',
    phone: '',
    joinedDate: '',
    qualifications: '',
    bio: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => setShowPreview(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/teachers', { state: { newTeacher: formData } });

    // Reset form
    setFormData({
      name: '', subject: '', class: '', room: '', experience: '',
      status: 'Active', image: '', email: '', phone: '', joinedDate: '',
      qualifications: '', bio: ''
    });
    setPreviewImage(null);
    setShowPreview(false);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        {/* Fixed Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
          <div className="flex justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=scrib&cs=tinysrgb&w=100"
              name="Admin"
            />
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Rest of your form — unchanged but cleaned */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name, Subject, Class, Room, Experience, Status */}
                {['name', 'subject', 'class', 'room', 'experience'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field === 'class' ? 'Assigned Class' : field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl shadow-md" />
                  )}
                </div>

                {/* Email, Phone, Joined Date, Qualifications */}
                {['email', 'phone', 'joinedDate', 'qualifications'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === 'joinedDate' ? 'Joined Date' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : field === 'joinedDate' ? 'date' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-xl hover:from-slate-900 hover:to-black transition shadow-lg"
                >
                  Create Teacher
                </button>
              </div>
            </form>

            {/* Preview Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-8">
                  <h2 className="text-2xl font-bold mb-6">Teacher Preview</h2>
                  <div className="flex gap-6 mb-6">
                    <img
                      src={previewImage || 'https://via.placeholder.com/150'}
                      alt="Teacher"
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                    />
                    <div>
                      <h3 className="text-2xl font-bold">{formData.name}</h3>
                      <p className="text-lg text-gray-600">{formData.subject} Teacher</p>
                      <p className="text-sm text-gray-500 mt-2">{formData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Class:</strong> {formData.class}</div>
                    <div><strong>Room:</strong> {formData.room}</div>
                    <div><strong>Experience:</strong> {formData.experience}</div>
                    <div><strong>Status:</strong> <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{formData.status}</span></div>
                  </div>
                  <p className="mt-4 text-gray-700"><strong>Bio:</strong> {formData.bio}</p>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTeacher;