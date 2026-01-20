import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Users, Search, Eye, EyeOff, Home } from 'lucide-react';
import axios from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import SplashScreen from './SplashScreen';

export default function LoginPage() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSplash, setShowSplash] = useState(false);

    const navigate = useNavigate();
    const { fetchSettings } = useSettings();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/login', {
                username: userId,
                password: password,
            });

            const { token, user } = response.data;

            // Store auth data
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('user', JSON.stringify(user));

            // Fetch settings for the logged-in tenant
            await fetchSettings();

            // Show Splash Screen
            setShowSplash(true);

            // Navigation happens in onSplashFinish
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Invalid username or password.');
            } else {
                setError('An error occurred. Please try again later.');
            }
            console.error('Login error:', err);
            setLoading(false);
        }
    };

    const handleSplashFinish = () => {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
            navigate('/dashboard');
        } else if (role === 'teacher') {
            navigate('/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    if (showSplash) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

    return (
        <div className="min-h-screen bg-[#e8e9eb] flex items-center justify-center p-4 fixed inset-0 overflow-hidden">
            <div className="flex max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Panel - Dark Navy */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#0a1929] p-12 flex-col justify-center text-white relative">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <Home className="w-6 h-6" />
                            <span className="text-xl font-semibold tracking-wide">Nursery Management System</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-6 leading-tight text-left">Welcome back</h1>
                    <p className="text-gray-400 mb-10 text-base leading-relaxed text-left">Manage student profiles with ease. Secure access only.</p>
                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                            <span className="text-gray-200 text-base">View and organize student profiles</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Search className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                            <span className="text-gray-200 text-base">Powerful search and filters</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                            <span className="text-gray-200 text-base">Institutional login — no signups</span>
                        </div>
                    </div>
                </div>
                {/* Right Panel - Light */}
                <div className="w-full lg:w-1/2 p-8 flex items-center ">
                    <div className="w-full max-w-md mx-auto rounded-3xl shadow-2xl ">
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 bg-[#e3f2fd] rounded-tl-3xl rounded-tr-3xl px-4 py-3 mb-6 mt-0">
                                <Lock className="w-5 h-5 text-gray-800" />
                                <span className="font-semibold text-gray-900 text-lg">Login</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 mb-4 px-4" >
                                <Shield className="w-5 h-5 text-gray-700" />
                                <h2 className="text-xl font-bold text-gray-900">Secure Access Portal</h2>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-5 px-4">
                            {/* User ID Field */}
                            <div>
                                <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2 text-left">Username</label>
                                <input id="userId" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter your assigned Username" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900 placeholder:text-gray-400" required />
                            </div>
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 text-left">Password</label>
                                <div className="relative">
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none pr-10 text-gray-900" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            {/* Remember Me & Notice */}
                            <div className="flex items-center justify-between text-sm pt-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400" />
                                    <span className="text-gray-800 font-medium group-hover:text-gray-900">Remember me</span>
                                </label>
                                <span className="text-gray-500 text-xs font-medium">Authorized users only</span>
                            </div>
                            {/* Error Message */}
                            {error && (
                                <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}
                            {/* Login Button */}
                            <button type="submit" disabled={loading} className="w-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-semibold py-3 px-5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-base">{loading ? 'Logging in...' : 'Login'}</span>
                            </button>
                            {/* Footer Notice */}
                            <p className="text-sm text-gray-500 text-center mt-4">Use your institutional credentials to login. No self-registration is available.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}