import api from './axiosConfig';

export const getSchedules = (petId) => api.get(`/feeding?petId=${petId}`);
export const createSchedule = (data) => api.post('/feeding', data);
export const updateSchedule = (id, data) => api.put(`/feeding/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/feeding/${id}`);
export const markAsFed = (id) => api.patch(`/feeding/${id}/fed`);