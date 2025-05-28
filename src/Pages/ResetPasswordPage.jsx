import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../Services/api';
import '../Styles/Pages/ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer et vérifier le token de l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      setError('Token de réinitialisation manquant');
      setIsLoading(false);
      return;
    }

    setToken(tokenParam);

    // Vérifier la validité du token
    const verifyToken = async () => {
      try {
        await authService.verifyResetToken(tokenParam);
        setTokenValid(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Token invalide ou expiré');
        setTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await authService.resetPassword(token, password);

      setSuccess(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/auth');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="resetPasswordPage">
      <div className="resetPasswordContainer">
        <h1>Réinitialisation du mot de passe</h1>

        {error && <div className="errorMessage">{error}</div>}

        {isLoading ? (
          <div className="loadingMessage">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Vérification du token de réinitialisation...</p>
          </div>
        ) : success ? (
          <div className="successMessage">
            <i className="fa-solid fa-check-circle successIcon"></i>
            <h2>Mot de passe réinitialisé !</h2>
            <p>Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.</p>
          </div>
        ) : !tokenValid ? (
          <div className="invalidTokenMessage">
            <i className="fa-solid fa-exclamation-circle errorIcon"></i>
            <h2>Lien invalide ou expiré</h2>
            <p>Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.</p>
            <button 
              className="requestNewLinkBtn"
              onClick={() => navigate('/auth')}
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="password">Nouveau mot de passe</label>
              <div className="passwordInputContainer">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre nouveau mot de passe"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="passwordToggleBtn"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                  <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="passwordInputContainer">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="passwordToggleBtn"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                  <i className={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="resetPasswordBtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Traitement...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;