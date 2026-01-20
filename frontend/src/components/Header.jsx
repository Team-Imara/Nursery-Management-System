import HeaderRightSection from './HeaderRightSection';

const Header = ({ children }) => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex-1 max-w-xl relative">
                    {children}
                </div>
                <div className="flex items-center space-x-4">
                    <HeaderRightSection
                        notificationCount={3}
                        onNotificationClick={() => alert('Notifications clicked!')}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
