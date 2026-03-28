import api from './axiosConfig';

export const getNotifications = (limit = 50, offset = 0) => 
  api.get(`/notifications?limit=${limit}&offset=${offset}`);

export const markAsRead = (id) => 
  api.put(`/notifications/${id}/read`);

export const markAllAsRead = () => 
  api.put('/notifications/read-all');

export const deleteNotification = (id) => 
  api.delete(`/notifications/${id}`);