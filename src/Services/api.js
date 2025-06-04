import axios from 'axios';

// Création d'une instance axios avec une configuration par défaut
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requêtes - exécuté avant chaque requête
api.interceptors.request.use(
  config => {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si un token existe, l'ajouter aux en-têtes de la requête
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses - exécuté après chaque réponse
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Si l'erreur est de type 401 (non autorisé), le token est probablement expiré
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

// Authentification
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetToken: (token) => api.get(`/auth/verify-token/${token}`),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

// Utilisateurs
export const userService = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
  uploadProfilePicture: (formData) => api.post('/users/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  rateUser: (ratingData) => api.post('/users/rate', ratingData)
};

// Courses
export const runService = {
  getAll: (filters = {}) => api.get('/runs', { params: filters }),
  getById: (runId) => api.get(`/runs/${runId}`),
  create: (runData) => api.post('/runs', runData),
   update: (runId, runData) => api.put(`/runs/${runId}`, runData),
  delete: (runId) => api.delete(`/runs/${runId}`),
  join: (runId) => api.post(`/runs/${runId}/join`),
  leave: (runId) => api.delete(`/runs/${runId}/leave`),
  rateRun: (runId, ratingData) => api.post(`/runs/${runId}/rate`, ratingData)
  
};

export default api;