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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetToken: (token) => api.get(`/auth/verify-token/${token}`),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

// Services utilisateur
export const userService = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
  uploadProfilePicture: (formData) => api.post('/users/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Noter un utilisateur
  rateUser: (userId, ratingData) => api.post('/users/rate', {
    userId,
    ...ratingData
  }),
  
  // Récupérer les courses partagées passées avec un utilisateur
  getSharedPastRuns: (userId) => api.get(`/users/${userId}/shared-runs`),
  
  // Méthodes admin
  getAllUsers: () => api.get('/users/admin/all'),
  deleteUser: (userId) => api.delete(`/users/admin/${userId}`),
  updateUserRole: (userId, role) => api.put('/users/admin/role', { userId, role })
};

// Services courses
export const runService = {
  create: (runData) => api.post('/runs', runData),
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/runs?${params}`);
  },
  getById: (id) => api.get(`/runs/${id}`),
  update: (id, runData) => api.put(`/runs/${id}`, runData),
  delete: (id) => api.delete(`/runs/${id}`),
  join: (id) => api.post(`/runs/${id}/join`),
  leave: (id) => api.delete(`/runs/${id}/leave`),
  rate: (id, ratingData) => api.post(`/runs/${id}/rate`, ratingData),
  
  // Méthodes admin
  getAllForAdmin: () => api.get('/runs/admin/all'),
  deleteAsAdmin: (runId) => api.delete(`/runs/admin/${runId}`)
};

// Services messages
export const messageService = {
  // Envoyer un message
  sendMessage: (recipientId, content) => 
    api.post('/messages/send', { recipientId, content }),

  // Récupérer la conversation avec un utilisateur
  getConversation: (userId) => 
    api.get(`/messages/conversation/${userId}`),

  // Récupérer toutes les conversations
  getUserConversations: () => 
    api.get('/messages/conversations'),

  // Compter les messages reçus (pour le badge)
  getMessageCount: () => 
    api.get('/messages/count')
};

export default api;