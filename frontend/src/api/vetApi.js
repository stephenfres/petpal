import api from './axiosConfig';

export const getNearbyVets = (lat, lng, radius = 10) => 
  api.get(`/vets/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);

export const getAllVets = () => api.get('/vets');
export const getVetById = (id) => api.get(`/vets/${id}`);
export const createVet = (data) => api.post('/vets', data);
export const updateVet = (id, data) => api.put(`/vets/${id}`, data);
export const deleteVet = (id) => api.delete(`/vets/${id}`);