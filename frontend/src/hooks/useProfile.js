// src/hooks/useProfile.js
import { useState, useEffect } from 'react';

const DEFAULT_PROFILE = {
  full_name: 'Admin User',
  email: 'admin@nursery.com',
  phone: '+91 98765 43210',
  avatar_url: 'https://via.placeholder.com/40?text=U',
  bio: 'Managing nursery operations with care.',
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, []);

  const updateProfile = (newData) => {
    const updated = { ...profile, ...newData };
    setProfile(updated);
    try {
      localStorage.setItem('userProfile', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  return { profile, updateProfile };
}