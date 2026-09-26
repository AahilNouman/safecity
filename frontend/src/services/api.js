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

// Auth endpoints (Citizen & Admin)
export const userRegister = (data) => api.post('/auth/register', data).then(res => res.data);
export const userLogin = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data);
export const googleAuth = (data) => api.post('/auth/google', data).then(res => res.data);
export const getMe = () => api.get('/auth/me').then(res => res.data);
export const updateEmergencyContact = (data) => api.put('/auth/emergency-contact', data).then(res => res.data);

// Safest Route & Geospatial Navigation endpoints
export const analyzeRoutes = (data) => api.post('/routes/analyze', data).then(res => res.data);
export const getRoutePresets = () => api.get('/routes/presets').then(res => res.data);

// Virtual Walk With Me & Emergency SOS endpoints
export const triggerEmergencyAlert = (data) => api.post('/safety/emergency-alert', data).then(res => res.data);
export const resolveEmergencyAlert = (id, data) => api.patch(`/safety/alerts/${id}/resolve`, data).then(res => res.data);
export const getEmergencyAlerts = () => api.get('/safety/alerts').then(res => res.data);

// Admin endpoints
export const adminLogin = (email, password) => api.post('/admin/login', { email, password }).then(res => res.data);
export const getDashboard = () => api.get('/admin/dashboard').then(res => res.data);
export const getAdminIncidents = (params) => api.get('/admin/incidents', { params }).then(res => res.data);
export const verifyIncident = (id) => api.patch(`/admin/incidents/${id}/verify`).then(res => res.data);
export const rejectIncident = (id, reason) => api.patch(`/admin/incidents/${id}/reject`, { reason, rejection_reason: reason }).then(res => res.data);
export const overrideCategory = (id, newCategory, reason) => api.patch(`/admin/incidents/${id}/category`, { category: newCategory, new_category: newCategory, reason, override_reason: reason }).then(res => res.data);

export default api;
