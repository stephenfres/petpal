import api from './axiosConfig';

export const getReports = (petId) => api.get(`/reports?petId=${petId}`);
export const getReport = (id) => api.get(`/reports/${id}`);
export const generateReport = (petId) => api.post('/reports/generate', { petId });