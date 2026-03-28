import api from './axiosConfig';

// Get health records - can get all or filter by petId
export const getHealthRecords = (petId) => {
  if (petId) {
    return api.get(`/health?petId=${petId}`);
  }
  return api.get('/health');
};

export const createHealthRecord = (data) => api.post('/health', data);
export const updateHealthRecord = (id, data) => api.put(`/health/${id}`, data);
export const deleteHealthRecord = (id) => api.delete(`/health/${id}`);