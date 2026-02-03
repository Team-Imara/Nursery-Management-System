// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { Pencil, X, Save, Camera } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Layout from '../components/Layout.jsx';

export default function ProfilePage() {
  const { settings, updateAdminSettings } = useSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(settings.admin);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(settings.admin);
    setPreviewUrl(settings.admin.profile_photo_url);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('fullname', form.fullname || '');
    formData.append('email', form.email || '');
    formData.append('contact', form.contact || '');
    formData.append('address', form.address || '');

    // We don't have bio in the backend yet, but keeping the field in UI if needed, 
    // though backend won't save it unless we add it. 
    // Based on previous files, admin only has fullname, address, contact, email, profile_photo.

    if (selectedFile) {
      formData.append('profile_picture', selectedFile);
    }

    try {
      await updateAdminSettings(formData);
      setIsEditing(false);
      setSelectedFile(null); // Clear selected file after upload
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setForm(settings.admin);
    setPreviewUrl(settings.admin.profile_photo_url);
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-6">
        {/* Header with Title + Edit Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={previewUrl || 'https://via.placeholder.com/120'}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer hover:bg-black/50 transition">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{form.fullname}</h2>
                <p className="text-slate-200">{form.email}</p>
                <p className="text-slate-300 text-sm capitalize">{form.role}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullname" // Changed from full_name to fullname to match backend/settings
                    value={form.fullname || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="contact" // Changed from phone to contact to match backend/settings
                    value={form.contact || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows={3}
                    value={form.address || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-500 w-24">Full Name:</span>
                  <span className="text-gray-900">{form.fullname}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-500 w-24">Email:</span>
                  <span className="text-gray-900">{form.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-500 w-24">Phone:</span>
                  <span className="text-gray-900">{form.contact || '—'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium text-gray-500 w-24 mt-0.5">Address:</span>
                  <span className="text-gray-900">{form.address || '—'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}