import { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const HeaderRightSection = ({ notificationCount = 3, imageSrc = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', name = 'Admin', onNotificationClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfileClick = () => {
        alert('Profile clicked!');
        setIsDropdownOpen(false);
    };

    const handleLogoutClick = () => {
        alert('Logout clicked!');
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onNotificationClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell size={20} className="text-gray-650" />
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                    {notificationCount}
                </span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="font-medium text-gray-900">{name}</span>

                <button onClick={toggleDropdown} className="ml-2 focus:outline-none">
                    <ChevronDown size={16} className="text-gray-600" />
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <button onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                Profile
                            </button>
                            <button onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                Settings
                            </button>

                            <button onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">

                            </button>


                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HeaderRightSection;