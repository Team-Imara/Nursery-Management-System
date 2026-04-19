import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios.js';

const AddTeacher = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    contactNumber: '',
    subject: '',
    class: '',
    room: '',
    experience: '',
    status: 'Active',
    image: '',
    email: '',
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

  // ✅ FINAL FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Prevent 422 (required fields)
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      alert("Please fill all required fields (Name, Email, Username, Password)");
      return;
    }

    try {
      const payload = {
        fullname: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.contactNumber,
        teaching_subject: formData.subject,
        assigned_class_text: formData.class,
        room_text: formData.room,
        experience: formData.experience,
        status: formData.status,
        profile_photo: formData.image,
        join_date: formData.joinedDate,
        qualification: formData.qualifications,
        bio: formData.bio,
        role: "teacher"
      };

      const response = await axios.post('/users', payload);

      console.log("SUCCESS:", response.data);
      alert("Teacher created successfully!");

      navigate('/teachers');

      // reset form
      setFormData({
        name: '',
        username: '',
        password: '',
        contactNumber: '',
        subject: '',
        class: '',
        room: '',
        experience: '',
        status: 'Active',
        image: '',
        email: '',
        joinedDate: '',
        qualifications: '',
        bio: '',
      });

      setPreviewImage(null);
      setShowPreview(false);

    } catch (error) {
      console.log("FULL ERROR:", error.response);

      if (error.response?.status === 422) {
        alert("Validation Error:\n" + JSON.stringify(error.response.data.errors, null, 2));
      } else {
        alert("Server error. Check backend.");
      }
    }
  };

  const headerContent = (
    <div className="flex items-center justify-start">
      <button
        onClick={() => navigate('/teachers')}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Teachers
      </button>
    </div>
  );

  return (
    <Layout headerContent={headerContent}>
      <div className="pt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Teacher</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {['name', 'username', 'password', 'subject', 'class', 'room', 'experience'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {field === 'class' ? 'Assigned Class' : field}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}

              <div>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-xl">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {previewImage && <img src={previewImage} className="mt-2 w-24 h-24 rounded-full" />}
              </div>

              {['email', 'contactNumber', 'joinedDate', 'qualifications'].map((field) => (
                <div key={field}>
                  <label>{field}</label>
                  <input
                    type={field === 'email' ? 'email' : field === 'joinedDate' ? 'date' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-3 border rounded-xl" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={handlePreview} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                Preview
              </button>
              <button type="submit" className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2">
                Create Teacher
              </button>
            </div>
          </form>

          {/* Preview */}
          {showPreview && (
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
              <div className="flex items-start gap-6 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={previewImage || formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Teacher')}&background=random`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formData.name || 'Teacher Name'}
                  </h3>
                  <p className="text-lg text-gray-600 mb-3">
                    {formData.subject || 'Subject'} Teacher
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <span>Class / Room: {formData.class || 'N/A'} - {formData.room || 'N/A'}</span>
                      <span>Contact: {formData.contactNumber || 'N/A'}</span>
                      <span>Email: {formData.email || 'N/A'}</span>
                    </div>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${formData.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}
                    >
                      {formData.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <strong>Bio:</strong> {formData.bio || 'No bio provided.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddTeacher;