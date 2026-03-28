import api from './axiosConfig';

// Get all vaccinations - can get all or filter by petId
export const getVaccinations = (petId) => {
  if (petId) {
    return api.get(`/vaccinations?petId=${petId}`);
  }
  return api.get('/vaccinations');
};

// Get upcoming vaccinations for dashboard
export const getUpcomingVaccinations = () => api.get('/vaccinations/upcoming');

// Create vaccination
export const createVaccination = (data) => api.post('/vaccinations', data);

// Update vaccination
export const updateVaccination = (id, data) => api.put(`/vaccinations/${id}`, data);

// Delete vaccination
export const deleteVaccination = (id) => api.delete(`/vaccinations/${id}`);