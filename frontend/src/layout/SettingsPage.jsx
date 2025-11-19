// src/pages/SettingsPage.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Globe, Shield, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const navigate = useNavigate();

  // Load settings from localStorage (or use defaults)
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('settings_notifications') === 'true';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('settings_darkMode') === 'true';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('settings_language') || 'en';
  });

  // Apply dark mode to <html> when changed
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('settings_darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('settings_darkMode', 'false');
    }
  }, [darkMode]);

  // Save other settings
  const saveSetting = (key, value) => {
    localStorage.setItem(key, value);
  };

  const handleNotificationToggle = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    saveSetting('settings_notifications', newVal);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    saveSetting('settings_language', newLang);
    // Optional: trigger i18n reload here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="space-y-8">
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a5f] dark:peer-checked:bg-[#1e3a5f]"></div>
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

          

          {/* Security Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={22} className="text-gray-700 dark:text-gray-300" />
              <p className="font-medium text-gray-900 dark:text-white">Security</p>
            </div>
           <button
  onClick={() => alert('Feature coming soon!')}
  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
>
  Change Password
</button>
          </div>
        </div>
      </div>
    </div>
  );
}