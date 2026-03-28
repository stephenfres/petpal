import api from './axiosConfig';

export const login = (credentials) => api.post('/auth/login', credentials);

export const register = (userData) => {
  // Ensure all required fields are sent including username and terms acceptance
  return api.post('/auth/register', {
    username: userData.username,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || '',
    preferredLanguage: userData.preferredLanguage || 'en',
    acceptTerms: userData.acceptTerms || false
  });
};

export const getMe = () => api.get('/auth/me');

export const updateProfile = (data) => api.put('/auth/profile', data);

export const updateFcmToken = (token) => api.put('/auth/fcm-token', { fcmToken: token });