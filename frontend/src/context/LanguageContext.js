import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateProfile } from '../api/authApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== currentLanguage) {
      changeLanguage(user.preferredLanguage);
    }
  }, [user]);

  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      
      if (user && user.preferredLanguage !== lang) {
        await updateProfile({ preferredLanguage: lang });
        updateUser({ preferredLanguage: lang });
      }
    } catch (error) {
      toast.error('Failed to change language');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);