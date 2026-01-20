import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        nursery: {
            name: 'Nursery Name',
            logo_url: null,
            address: '',
            contact: '',
            email: ''
        },
        admin: {
            fullname: 'Admin User',
            profile_photo_url: null,
            address: '',
            contact: '',
            email: ''
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get('/settings');
            setSettings(response.data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateNurserySettings = async (formData) => {
        try {
            const response = await api.post('/settings/nursery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSettings(prev => ({
                ...prev,
                nursery: { ...prev.nursery, ...response.data, logo_url: response.data.logo_url || prev.nursery.logo_url }
            }));
            // Also update in prev if the response only returns partial
            fetchSettings(); // Refresh to be sure
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    const updateAdminSettings = async (formData) => {
        try {
            const response = await api.post('/settings/admin', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSettings(prev => ({
                ...prev,
                admin: { ...prev.admin, ...response.data, profile_photo_url: response.data.profile_photo_url || prev.admin.profile_photo_url }
            }));
            fetchSettings();
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{
            settings,
            loading,
            fetchSettings,
            updateNurserySettings,
            updateAdminSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
