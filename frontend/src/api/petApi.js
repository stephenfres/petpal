import api from './axiosConfig';

export const getPets = () => api.get('/pets');
export const getPet = (id) => api.get(`/pets/${id}`);
export const createPet = (data) => api.post('/pets', data);
export const updatePet = (id, data) => api.put(`/pets/${id}`, data);
export const deletePet = (id) => api.delete(`/pets/${id}`);