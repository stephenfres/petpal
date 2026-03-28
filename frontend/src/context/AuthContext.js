import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth ONCE on mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('=== INIT AUTH ===');
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      
      if (!token) {
        console.log('No token, done');
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        console.log('getMe success:', response.data.data);
        // Store the complete user data including username
        setUser(response.data.data);
      } catch (error) {
        console.error('getMe failed, clearing token');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      console.log('Login response:', response.data);
      const { token, ...userData } = response.data.data;
      
      if (!token) {
        toast.error('No token received');
        return false;
      }
      
      // Save token
      localStorage.setItem('token', token);
      
      // Set user with all data including username
      setUser(userData);
      console.log('User logged in - username:', userData.username);
      
      // Show welcome message with username
      if (userData.username) {
        toast.success(`Welcome back, @${userData.username}!`);
      } else {
        toast.success('Welcome back!');
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerApi(userData);
      console.log('Register response:', response.data);
      const { token, ...newUser } = response.data.data;
      
      if (!token) {
        toast.error('No token received');
        return false;
      }
      
      // Save token
      localStorage.setItem('token', token);
      console.log('New user registered - username:', newUser.username);
      
      // Store complete user data
      setUser(newUser);
      
      // Show welcome message with username
      toast.success(`Welcome to PetPal, @${newUser.username}!`);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Show loading only on initial check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);