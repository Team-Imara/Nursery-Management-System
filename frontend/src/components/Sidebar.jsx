import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    Utensils,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
} from 'lucide-react';

const NavItem = ({ icon, label, to }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive
                        ? 'bg-white/10 text-white border-l-4 border-blue-400'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`
            }
        >
            <span className="w-5 h-5">{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
};

const Sidebar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const mainNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
        { icon: <GraduationCap size={20} />, label: 'Teachers', to: '/teachers' },
        { icon: <Users size={20} />, label: 'Students', to: '/students' },
        { icon: <BookOpen size={20} />, label: 'Classes', to: '/class-management' },
        { icon: <Calendar size={20} />, label: 'Events & Calendar', to: '/events' },
        { icon: <BookOpen size={20} />, label: 'Classes', to: '/classes' },
        { icon: <Calendar size={20} />, label: 'Events & Calendar', to: '/event-management' },
        { icon: <Utensils size={20} />, label: 'Meal Plan', to: '/meal-plan' },
        { icon: <FileText size={20} />, label: 'Reports', to: '/reports' },
    ];

    const bottomNavItems = [
        { icon: <Settings size={20} />, label: 'Settings', to: '/settings' },
        { icon: <LogOut size={20} />, label: 'Logout', to: '/logout' },
    ];

    const handleMobileToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={handleMobileToggle}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={handleMobileToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Home size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">ABC Nursery</h1>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-hide">
                    <div className="mb-4">
                        <p className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Main
                        </p>
                        <div className="space-y-1">
                            {mainNavItems.map((item) => (
                                <NavItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    to={item.to}
                                />
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Bottom Navigation */}
                <div className="px-3 py-4 border-t border-slate-800 space-y-1">
                    {bottomNavItems.map((item) => (
                        <NavItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            to={item.to}
                        />
                    ))}
                </div>
            </aside>

            {/* CSS to hide scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </>
    );
};

export default Sidebar;
