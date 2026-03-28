import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PetProfile } from './pages/PetProfile';
import { HealthHistory } from './pages/HealthHistory';
import { FeedingSchedule } from './pages/FeedingSchedule';
import { VaccinationTracker } from './pages/VaccinationTracker';
import { WeeklyReport } from './pages/WeeklyReport';
import { VetFinder } from './pages/VetFinder';
import { AIHelper } from './pages/AIHelper';
import { Settings } from './pages/Settings';
import { Accessibility } from './pages/Accessibility';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';
import { NotificationBell } from './components/NotificationBell';
import { useAuth } from './hooks/useAuth';
import { Home, Heart, Calendar, Utensils, MapPin, Settings as SettingsIcon, Menu, X, User, LogOut, Moon, Sun, FileText, Bot } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { settings } = useAccessibility();
  const { darkMode } = useDarkMode();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/health', icon: Heart, label: 'Health' },
    { path: '/feeding', icon: Utensils, label: 'Feeding' },
    { path: '/vaccinations', icon: Calendar, label: 'Vaccines' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/ai-helper', icon: Bot, label: 'AI Assistant' },
    { path: '/vet-finder', icon: MapPin, label: 'Find Vet' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  if (!user) return null;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden dark:bg-black/70"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full shadow-xl z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64
        ${darkMode ? 'bg-gray-900 border-r border-gray-700' : 'bg-white'}
        ${settings.highContrast ? 'border-r-4 border-black' : ''}
      `}>
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
          <div>
            <span className={`font-bold text-xl ${darkMode ? 'text-teal-400' : 'text-teal-600'} ${settings.largeText ? 'text-2xl' : ''}`}>
              🐾 PetPal
            </span>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${settings.largeText ? 'text-sm' : ''}`}>
              Your Pet's Digital Care Companion
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className={`
              p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100'}
              ${settings.keyboardNavigation ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : ''}
            `}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? darkMode 
                      ? 'bg-teal-900/50 text-teal-300' 
                      : 'bg-teal-100 text-teal-700'
                    : darkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }
                  ${settings.largeText ? 'text-lg py-4' : ''}
                  ${settings.highContrast ? 'border-2 border-transparent hover:border-black' : ''}
                  ${settings.keyboardNavigation ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : ''}
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { settings } = useAccessibility();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const isHomePage = location.pathname === '/';
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };
    
    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showProfileDropdown]);
  
  return (
    <header className={`
      sticky top-0 z-30 shadow-sm
      ${darkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white'}
      ${settings.highContrast ? 'border-b-4 border-black' : ''}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {user && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`
                p-2 rounded-lg transition-colors
                ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}
                ${settings.keyboardNavigation ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : ''}
              `}
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className={`${settings.largeText ? 'text-3xl' : 'text-2xl'}`}>🐾</span>
              <span className={`font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'} ${settings.largeText ? 'text-3xl' : 'text-2xl'}`}>
                PetPal
              </span>
            </Link>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${settings.largeText ? 'text-base' : 'text-sm'}`}>
              Your Pet's Digital Care Companion
            </p>
          </div>
          
          <div className="flex items-center gap-2 profile-dropdown-container relative">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`
                p-2 rounded-lg transition-colors
                ${darkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}
              `}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user && isHomePage && (
              <>
                <NotificationBell />
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-transform hover:scale-110
                    ${settings.highContrast 
                      ? 'bg-black text-white border-2 border-white' 
                      : darkMode
                        ? 'bg-gray-800 text-teal-400 hover:bg-gray-700'
                        : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                    }
                    ${settings.keyboardNavigation ? 'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2' : ''}
                    ${showProfileDropdown ? 'ring-2 ring-teal-500 ring-offset-2' : ''}
                  `}
                  title="Profile Menu"
                  aria-label="Open profile menu"
                  aria-expanded={showProfileDropdown}
                >
                  <User className="h-5 w-5" />
                </button>
                
                {showProfileDropdown && (
                  <div className={`
                    absolute right-0 top-12 w-56 rounded-xl shadow-xl border z-50
                    ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
                    ${settings.highContrast ? 'border-2 border-black' : ''}
                  `}>
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${settings.highContrast ? 'bg-black text-white' : darkMode ? 'bg-gray-800 text-teal-400' : 'bg-teal-100 text-teal-600'}
                        `}>
                          <User className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            @{user?.username || user?.name || 'User'}
                          </p>
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}></div>
                    
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const GlobalStyles = () => {
  const { settings } = useAccessibility();

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    body.classList.toggle('high-contrast', settings.highContrast);
    body.classList.toggle('large-text', settings.largeText);
    body.classList.toggle('reduce-motion', settings.reduceMotion);
    body.classList.toggle('screen-reader-mode', settings.screenReader);
    body.classList.toggle('keyboard-navigation', settings.keyboardNavigation);
    
    if (settings.highContrast) {
      body.style.filter = 'contrast(1.5)';
      html.style.setProperty('--focus-color', '#000');
    } else {
      body.style.filter = '';
      html.style.setProperty('--focus-color', '#0d9488');
    }
    
    if (settings.largeText) {
      html.style.fontSize = '125%';
    } else {
      html.style.fontSize = '';
    }
    
    if (settings.reduceMotion) {
      html.style.setProperty('--animation-duration', '0.01ms');
    } else {
      html.style.removeProperty('--animation-duration');
    }
  }, [settings]);

  return (
    <style>{`
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      .reduce-motion .animate-spin,
      .reduce-motion .animate-pulse,
      .reduce-motion .animate-bounce {
        animation: none !important;
      }
      
      .high-contrast img,
      .high-contrast video {
        filter: contrast(1.2);
      }
      
      .keyboard-navigation *:focus-visible {
        outline: 3px solid var(--focus-color, #0d9488) !important;
        outline-offset: 2px !important;
      }
      
      .keyboard-navigation button:focus-visible,
      .keyboard-navigation a:focus-visible,
      .keyboard-navigation input:focus-visible {
        box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.3) !important;
      }
      
      .screen-reader-mode .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 9999;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `}</style>
  );
};

const FloatingAccessibilityButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useAccessibility();
  const { darkMode } = useDarkMode();
  
  if (!user) return null;
  
  return (
    <button
      onClick={() => navigate('/accessibility')}
      className={`
        fixed bottom-6 right-6 z-50 
        w-14 h-14 rounded-full shadow-lg 
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        ${settings.highContrast 
          ? 'bg-black text-white border-4 border-white' 
          : darkMode
            ? 'bg-teal-700 text-white hover:bg-teal-600'
            : 'bg-teal-600 text-white hover:bg-teal-700'
        }
        ${settings.reduceMotion ? '' : 'animate-bounce'}
        focus:outline-none focus:ring-4 focus:ring-teal-300
      `}
      style={{
        animationPlayState: settings.reduceMotion ? 'paused' : 'running',
        animationDuration: settings.reduceMotion ? '0s' : '1s'
      }}
      title="Accessibility Settings"
      aria-label="Open accessibility settings"
    >
      <span className="text-2xl">♿</span>
      
      {(settings.highContrast || settings.largeText || settings.reduceMotion) && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {Object.values(settings).filter(Boolean).length}
        </span>
      )}
    </button>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pets/:id" element={<ProtectedRoute><PetProfile /></ProtectedRoute>} />
            <Route path="/health" element={<ProtectedRoute><HealthHistory /></ProtectedRoute>} />
            <Route path="/feeding" element={<ProtectedRoute><FeedingSchedule /></ProtectedRoute>} />
            <Route path="/vaccinations" element={<ProtectedRoute><VaccinationTracker /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><WeeklyReport /></ProtectedRoute>} />
            <Route path="/vet-finder" element={<ProtectedRoute><VetFinder /></ProtectedRoute>} />
            <Route path="/ai-helper" element={<ProtectedRoute><AIHelper /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/accessibility" element={<ProtectedRoute><Accessibility /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <FloatingAccessibilityButton />
        <ScreenReaderAnnouncer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DarkModeProvider>
            <AccessibilityProvider>
              <Router>
                <AppContent />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
                      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                    },
                  }}
                />
              </Router>
            </AccessibilityProvider>
          </DarkModeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;