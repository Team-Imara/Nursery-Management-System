import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Layout = ({ children, headerContent }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
                <Header>
                    {headerContent}
                </Header>
                <main className="p-6 flex-1 w-full">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
