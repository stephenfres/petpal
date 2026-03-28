import api from './axiosConfig';

export const getAdvice = (question, petId) => api.post('/ai/advice', { question, petId });
export const getNutritionAdvice = (petId) => api.get(`/ai/nutrition/${petId}`);
export const analyzeSymptoms = (symptoms, petId) => api.post('/ai/symptoms', { symptoms, petId });