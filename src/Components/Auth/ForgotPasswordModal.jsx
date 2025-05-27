import { useState } from 'react';
import { authService } from '../../Services/api';
import '../../Styles/Auth/ForgotPasswordModal.css';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
      
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur s'est produite lors de l'envoi de votre demande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>
        
        {!isSubmitted ? (
          <>
            <h2>Réinitialisation du mot de passe</h2>
            <p className="modalDescription">
              Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            
            {error && <div className="errorMessage">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="reset-email">Email</label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className="submitBtn"
                disabled={isLoading}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          </>
        ) : (
          <div className="successMessage">
            <i className="fa-solid fa-check-circle successIcon"></i>
            <h2>E-mail envoyé</h2>
            <p>
              Si un compte est associé à cette adresse email, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe.
            </p>
            <button className="closeModalBtn" onClick={onClose}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;