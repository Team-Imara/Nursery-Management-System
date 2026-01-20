// src/pages/SettingsPage.jsx
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Palette, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import Layout from './Layout.jsx';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateNurserySettings } = useSettings();

  // Local state for nursery form
  const [nurseryForm, setNurseryForm] = useState(settings.nursery);
  const [nurseryFile, setNurseryFile] = useState(null);

  useEffect(() => {
    setNurseryForm(settings.nursery);
  }, [settings]);

  // Load settings from localStorage
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('settings_notifications') === 'true';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('settings_darkMode') === 'true';
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('settings_darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('settings_darkMode', 'false');
    }
  }, [darkMode]);

  const handleNotificationToggle = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    localStorage.setItem('settings_notifications', newVal);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNurseryChange = (e) => {
    setNurseryForm({ ...nurseryForm, [e.target.name]: e.target.value });
  };

  const handleNurseryFileChange = (e) => {
    if (e.target.files[0]) setNurseryFile(e.target.files[0]);
  };

  const saveNursery = async () => {
    const formData = new FormData();
    formData.append('nursery_name', nurseryForm.name || '');
    formData.append('nursery_address', nurseryForm.address || '');
    formData.append('nursery_contact', nurseryForm.contact || '');
    formData.append('nursery_email', nurseryForm.email || '');
    if (nurseryFile) {
      formData.append('nursery_logo', nurseryFile);
    }
    const result = await updateNurserySettings(formData);
    alert(result.message);
  };

  return (
    <Layout>
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="space-y-12">

          {/* Nursery Settings */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Home size={24} className="text-blue-600" /> Nursery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border mr-auto">
                    {nurseryFile ? (
                      <img src={URL.createObjectURL(nurseryFile)} className="w-full h-full object-cover" />
                    ) : settings.nursery.logo_url ? (
                      <img src={settings.nursery.logo_url} className="w-full h-full object-cover" />
                    ) : (
                      <Home className="text-gray-400" size={40} />
                    )}
                  </div>
                  <label className="cursor-pointer text-sm text-blue-600 hover:underline mr-auto">
                    Change Logo
                    <input type="file" className="hidden" accept="image/*" onChange={handleNurseryFileChange} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nursery Name</label>
                  <input
                    name="name"
                    value={nurseryForm.name || ''}
                    onChange={handleNurseryChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={nurseryForm.email || ''}
                    onChange={handleNurseryChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <textarea
                    name="address"
                    value={nurseryForm.address || ''}
                    onChange={handleNurseryChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                  <input
                    name="contact"
                    value={nurseryForm.contact || ''}
                    onChange={handleNurseryChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={saveNursery} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Save size={18} /> Save Nursery Changes
                  </button>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Preferences */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Palette size={24} className="text-purple-600" /> Application Preferences
            </h2>
            <div className="space-y-6">
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={22} className="text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for new events</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={handleNotificationToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a5f]"></div>
                </label>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette size={22} className="text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch to dark theme</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a5f]"></div>
                </label>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}