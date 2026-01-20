import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SplashScreen = ({ onFinish }) => {
    const { settings } = useSettings();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-500">
            <div className="animate-bounce mb-6">
                <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                    {settings.nursery.logo_url ? (
                        <img src={settings.nursery.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <Home size={48} className="text-white" />
                    )}
                </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white animate-pulse">
                {settings.nursery.name || 'Loading...'}
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Welcome Back</p>
        </div>
    );
};

export default SplashScreen;
