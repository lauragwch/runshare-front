import { createContext, useState, useEffect } from 'react';
import { authService } from '../Services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getProfile()
        .then(res => setCurrentUser(res.data))
        .catch(err => {
          console.error('Erreur lors de la récupération du profil:', err);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (credentials) => {
    try {
      setLoading(true);
      const res = await authService.login(credentials);
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const res = await authService.register(userData);
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error,
      loginUser,
      registerUser,
      logoutUser,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};