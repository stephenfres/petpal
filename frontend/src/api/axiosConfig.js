import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const language = localStorage.getItem('i18nextLng') || 'en';
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if already on login page or if it's an auth check
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    const isLoginPage = window.location.pathname === '/login';
    
    if (error.response?.status === 401 && !isAuthEndpoint && !isLoginPage) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;