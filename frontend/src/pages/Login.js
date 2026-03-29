import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../context/DarkModeContext';
import { Cat, Mail, Lock, Eye, EyeOff, User, CheckSquare, Square, Check, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    name: '', 
    email: '', 
    password: '', 
    phone: '' 
  });
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Password validation rules
  const passwordRules = [
    { id: 'length', label: 'At least 12 characters', test: (pwd) => pwd.length >= 12 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'One number (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
    { id: 'special', label: 'One special character (!@#$%^&*)', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];

  // Username validation
  const validateUsername = (username) => {
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return null;
  };

  const getPasswordStrength = () => {
    const passed = passwordRules.filter(rule => rule.test(formData.password)).length;
    if (passed === 0) return { label: '', color: '' };
    if (passed <= 2) return { label: 'Weak', color: 'text-red-500' };
    if (passed <= 4) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);

    try {
      let success;
      
      if (isRegister) {
        // Validate username
        const usernameError = validateUsername(formData.username);
        if (usernameError) {
          setError(usernameError);
          setLoading(false);
          return;
        }

        // Validate password strength
        const failedRules = passwordRules.filter(rule => !rule.test(formData.password));
        if (failedRules.length > 0) {
          setError(`Password must: ${failedRules.map(r => r.label).join(', ')}`);
          setLoading(false);
          return;
        }

        // Check terms agreement for registration
        if (!agreeToTerms) {
          setError('You must agree to the Terms and Conditions to register');
          setLoading(false);
          return;
        }

        if (!formData.username || !formData.name || !formData.email || !formData.password) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        
        // Include terms acceptance and username in registration
        const registerData = {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          acceptTerms: agreeToTerms
        };
        
        success = await register(registerData);
      } else {
        if (!formData.email || !formData.password) {
          setError('Please enter email and password');
          setLoading(false);
          return;
        }
        
        success = await login({ email: formData.email, password: formData.password });
      }

      if (success) {
        navigate('/');
      } else {
        setError(isRegister ? 'Registration failed' : 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setAgreeToTerms(false);
    setFormData({ username: '', name: '', email: '', password: '', phone: '' });
  };

  const strength = getPasswordStrength();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-teal-50 to-cyan-50'
    }`}>
      <div className={`rounded-2xl shadow-xl w-full max-w-md p-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            darkMode ? 'bg-teal-900/50' : 'bg-teal-100'
          }`}>
            <Cat className={`h-8 w-8 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {isRegister ? 'Create Account' : t('auth.welcome')}
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isRegister ? 'Sign up to manage your pets' : 'Sign in to manage your pets'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              {/* Username Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Username *
                </label>
                <div className="relative">
                  <AtSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="e.g., stephen_mwangi"
                  />
                </div>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Letters, numbers, and underscores only. 3-30 characters.
                </p>
              </div>

              {/* Name Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Your full name"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('auth.email')} *
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('auth.password')} *
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator - Only show during registration */}
            {isRegister && formData.password && (
              <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password Strength:</span>
                  <span className={`text-xs font-bold ${strength.color}`}>{strength.label}</span>
                </div>
                <div className="space-y-1">
                  {passwordRules.map((rule) => {
                    const isPassed = rule.test(formData.password);
                    return (
                      <div key={rule.id} className="flex items-center text-xs">
                        {isPassed ? (
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <div className={`h-3 w-3 rounded-full border mr-2 flex-shrink-0 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                        )}
                        <span className={isPassed ? 'text-green-600' : (darkMode ? 'text-gray-500' : 'text-gray-500')}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isRegister && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('auth.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="+1 234 567 890"
              />
            </div>
          )}

          {/* TERMS AND CONDITIONS CHECKBOX - ONLY FOR REGISTRATION */}
          {isRegister && (
            <div className={`flex items-start space-x-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <button
                type="button"
                onClick={() => setAgreeToTerms(!agreeToTerms)}
                className="mt-0.5 flex-shrink-0"
              >
                {agreeToTerms ? (
                  <CheckSquare className="h-5 w-5 text-teal-600" />
                ) : (
                  <Square className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                )}
              </button>
              <div className="text-sm">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  I agree to the{' '}
                  <Link 
                    to="/terms" 
                    target="_blank"
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link 
                    to="/privacy" 
                    target="_blank"
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  By creating an account, you acknowledge our medical disclaimer and data practices.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              isRegister ? 'Create Account' : t('auth.login')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-teal-600 font-semibold hover:underline"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
