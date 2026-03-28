import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { 
  Bell, Shield, Moon, Globe, 
  ChevronRight, Sun
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { t, i18n } = useTranslation();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    language: 'en',
    privacyMode: false,
  });

  // Load saved notification settings from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('emailNotifications');
    const savedPush = localStorage.getItem('pushNotifications');
    const savedLanguage = localStorage.getItem('language');
    const savedPrivacy = localStorage.getItem('privacyMode');
    
    if (savedEmail !== null) {
      setSettings(prev => ({ ...prev, emailNotifications: savedEmail === 'true' }));
    }
    if (savedPush !== null) {
      setSettings(prev => ({ ...prev, pushNotifications: savedPush === 'true' }));
    }
    if (savedLanguage !== null) {
      setSettings(prev => ({ ...prev, language: savedLanguage }));
      i18n.changeLanguage(savedLanguage);
    }
    if (savedPrivacy !== null) {
      setSettings(prev => ({ ...prev, privacyMode: savedPrivacy === 'true' }));
    }
  }, [i18n]);

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(newSettings);
    localStorage.setItem(key, !settings[key]);
    toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSettings(prev => ({
      ...prev,
      language: newLanguage
    }));
    localStorage.setItem('language', newLanguage);
    
    // Update i18n language globally
    i18n.changeLanguage(newLanguage);
    
    // Show success message in the new language
    const messages = {
      en: 'Language updated to English',
      sw: 'Lugha imebadilishwa hadi Kiswahili',
      fr: 'Langue changée en français',
      es: 'Idioma cambiado a español',
      de: 'Sprache auf Deutsch geändert'
    };
    toast.success(messages[newLanguage] || 'Language updated');
  };

  const handleSaveAll = () => {
    localStorage.setItem('emailNotifications', settings.emailNotifications);
    localStorage.setItem('pushNotifications', settings.pushNotifications);
    localStorage.setItem('language', settings.language);
    localStorage.setItem('privacyMode', settings.privacyMode);
    
    // Also save language preference for the backend
    if (user?.id) {
      fetch('/api/users/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ language: settings.language })
      }).catch(err => console.error('Failed to save language to backend:', err));
    }
    
    toast.success('All settings saved successfully');
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {t('settings.title', 'Settings')}
      </h1>

      {/* Notifications */}
      <div className={`rounded-xl shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-6">
          <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
            <Bell className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.notifications', 'Notifications')}
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.notificationsDesc', 'Choose what you receive')}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className={`flex justify-between items-center py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.emailNotifications', 'Email Notifications')}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('settings.emailNotificationsDesc', 'Updates via email')}
              </p>
            </div>
            <button 
              onClick={() => handleToggle('emailNotifications')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-teal-600' : 'bg-gray-300'}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className={`flex justify-between items-center py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.pushNotifications', 'Push Notifications')}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('settings.pushNotificationsDesc', 'Device notifications')}
              </p>
            </div>
            <button 
              onClick={() => handleToggle('pushNotifications')}
              className={`w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-teal-600' : 'bg-gray-300'}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className={`rounded-xl shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-6">
          <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
            {darkMode ? (
              <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
              <Moon className="h-6 w-6 text-purple-600" />
            )}
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.appearance', 'Appearance')}
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.appearanceDesc', 'Customize your experience')}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className={`flex justify-between items-center py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.darkMode', 'Dark Mode')}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('settings.darkModeDesc', 'Switch to dark theme')}
              </p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-teal-600' : 'bg-gray-300'}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className={`flex items-center justify-between py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div className="flex items-center">
              <Globe className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('settings.language', 'Language')}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('settings.languageDesc', 'Select preferred language')}
                </p>
              </div>
            </div>
            <select 
              value={settings.language}
              onChange={handleLanguageChange}
              className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="en">🇺🇸 English</option>
              <option value="sw">🇹🇿 Kiswahili</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className={`rounded-xl shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-6">
          <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
            <Shield className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.privacy', 'Privacy')}
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.privacyDesc', 'Manage your privacy')}
            </p>
          </div>
        </div>
        
        <div className={`flex justify-between items-center py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.privacyMode', 'Privacy Mode')}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.privacyModeDesc', 'Hide sensitive info in notifications')}
            </p>
          </div>
          <button 
            onClick={() => handleToggle('privacyMode')}
            className={`w-12 h-6 rounded-full transition-colors ${settings.privacyMode ? 'bg-teal-600' : 'bg-gray-300'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${settings.privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className={`bg-gradient-to-r ${darkMode ? 'from-teal-900/50 to-cyan-900/50' : 'from-teal-50 to-cyan-50'} rounded-xl shadow-md p-6 border ${darkMode ? 'border-teal-800' : 'border-teal-100'}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('settings.quickLinks', 'Quick Links')}
        </h3>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/accessibility')}
            className={`w-full flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-shadow group ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">♿</span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.accessibility', 'Accessibility')}
              </span>
            </div>
            <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-500 group-hover:text-teal-400' : 'text-gray-400 group-hover:text-teal-600'}`} />
          </button>
          
          <button 
            onClick={() => toast(t('settings.helpComingSoon', 'Help center coming soon!'))}
            className={`w-full flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-shadow group ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.helpSupport', 'Help & Support')}
              </span>
            </div>
            <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-500 group-hover:text-teal-400' : 'text-gray-400 group-hover:text-teal-600'}`} />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button 
          onClick={handleSaveAll}
          className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
        >
          {t('settings.save', 'Save Changes')}
        </button>
      </div>
    </div>
  );
};