// src/components/HeaderRightSection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
// src/components/HeaderRightSection.jsx
import { useProfile } from '../hooks/useProfile'; // Correct

const HeaderRightSection = ({ notificationCount = 0, onNotificationClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile(); // Get latest name & avatar

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);

  const go = (path) => () => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <button
        onClick={onNotificationClick}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {profile.full_name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={go('/profile')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Profile
            </button>
            <button
              onClick={go('/settings')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Settings
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');
                localStorage.removeItem('userProfile');
                navigate('/');
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderRightSection;