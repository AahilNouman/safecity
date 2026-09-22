import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safecity_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('safecity_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const submitIncident = (data) => api.post('/incidents', data).then(res => res.data);
export const getIncidents = (params) => api.get('/incidents', { params }).then(res => res.data);
export const getMapIncidents = (params) => api.get('/incidents/map', { params }).then(res => res.data);
export const getHotspots = () => api.get('/incidents/hotspots').then(res => res.data);
export const getIncidentById = (id) => api.get(`/incidents/${id}`).then(res => res.data);

// Admin endpoints
export const adminLogin = (email, password) => api.post('/admin/login', { email, password }).then(res => res.data);
export const getDashboard = () => api.get('/admin/dashboard').then(res => res.data);
export const getAdminIncidents = (params) => api.get('/admin/incidents', { params }).then(res => res.data);
export const verifyIncident = (id) => api.put(`/admin/incidents/${id}/verify`).then(res => res.data);
export const rejectIncident = (id, reason) => api.put(`/admin/incidents/${id}/reject`, { reason }).then(res => res.data);
export const overrideCategory = (id, newCategory, reason) => api.put(`/admin/incidents/${id}/override`, { category: newCategory, reason }).then(res => res.data);

export default api;
