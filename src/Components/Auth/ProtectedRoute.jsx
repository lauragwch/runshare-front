import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Contextes/AuthContext';
import '../../Styles/Auth/ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return <div className="loading">Vérification de l'authentification...</div>;
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!currentUser) {
    // On conserve l'URL actuelle pour pouvoir y revenir après connexion
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Si l'utilisateur est connecté, afficher le composant enfant (contenu protégé)
  return children;
};

export default ProtectedRoute;