import { useState } from 'react';
import { userService } from '../../Services/api';
import '../../Styles/User/UserRatingForm.css';

const UserRatingForm = ({ targetUser, onSuccess, onCancel, sharedRuns = [] }) => {
  const [ratingData, setRatingData] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatingData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await userService.rateUser(targetUser.id_user, ratingData);
      
      // Callback de succès
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'évaluation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="userRatingFormOverlay">
      <div className="userRatingForm">
        <div className="ratingFormHeader">
          <h3>Évaluer {targetUser.username}</h3>
          <button 
            className="closeBtn"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Afficher les courses partagées */}
        {sharedRuns.length > 0 && (
          <div className="sharedRunsInfo">
            <h4>Courses partagées :</h4>
            <ul className="sharedRunsList">
              {sharedRuns.slice(0, 3).map(run => (
                <li key={run.id_run} className="sharedRunItem">
                  <span className="runTitle">{run.title}</span>
                  <span className="runDate">
                    {new Date(run.date).toLocaleDateString('fr-FR')}
                  </span>
                </li>
              ))}
              {sharedRuns.length > 3 && (
                <li className="moreRuns">
                  +{sharedRuns.length - 3} autre{sharedRuns.length - 3 > 1 ? 's' : ''} course{sharedRuns.length - 3 > 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="rating">Note</label>
            <div className="ratingStarsInput">
              {[1, 2, 3, 4, 5].map(star => (
                <label key={star} className="starLabel">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={ratingData.rating === star}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <i className="fa-solid fa-star"></i>
                </label>
              ))}
            </div>
            <div className="ratingText">
              {ratingData.rating === 1 && "Très décevant"}
              {ratingData.rating === 2 && "Décevant"}
              {ratingData.rating === 3 && "Correct"}
              {ratingData.rating === 4 && "Bien"}
              {ratingData.rating === 5 && "Excellent"}
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="comment">Commentaire (optionnel)</label>
            <textarea
              name="comment"
              value={ratingData.comment}
              onChange={handleChange}
              placeholder="Partagez votre expérience avec cet utilisateur..."
              rows="4"
              disabled={loading}
              maxLength={500}
            />
            <div className="characterCount">
              {ratingData.comment.length}/500
            </div>
          </div>

          {error && (
            <div className="errorMessage">
              <i className="fa-solid fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <div className="formActions">
            <button
              type="button"
              className="cancelBtn"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="submitBtn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Envoi...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-star"></i>
                  Évaluer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRatingForm;