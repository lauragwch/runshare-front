import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { runService } from '../Services/api';
import '../Styles/Pages/RunDetailPage.css';

const RunDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [ratingData, setRatingData] = useState({ rating: 5, comment: '' });
  const [showRatingForm, setShowRatingForm] = useState(false);

  // États pour déterminer les relations avec la course
  const [isParticipant, setIsParticipant] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  // Fonction helper pour vérifier si la course est passée
  const isCoursePast = (dateString) => {
    const courseDate = new Date(dateString);
    const now = new Date();
    return courseDate < now;
  };

  const formatDate = (dateString) => {
    // Traiter comme heure locale
    const isoString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const date = new Date(isoString);

    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchRunDetails = async () => {
      try {
        setLoading(true);
        const response = await runService.getById(id);
        setRun(response.data);

        // Vérifier si l'utilisateur actuel est l'organisateur
        if (currentUser && response.data.id_user === currentUser.id_user) {
          setIsOrganizer(true);
        }

        // Vérifier si l'utilisateur est un participant
        if (currentUser && response.data.participants) {
          const participant = response.data.participants.find(
            p => p.id_user === currentUser.id_user
          );
          setIsParticipant(!!participant);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement de la course');
      } finally {
        setLoading(false);
      }
    };

    fetchRunDetails();
  }, [id, currentUser]);

  const handleDeleteRun = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette course ? Cette action est irréversible.')) {
      return;
    }

    try {
      setActionLoading(true);
      await runService.delete(id);
      navigate('/runs');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de la course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinRun = async () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    try {
      setActionLoading(true);
      await runService.join(id);

      // Mettre à jour l'état pour refléter que l'utilisateur est maintenant inscrit
      setIsParticipant(true);

      // Mettre à jour la liste des participants
      const response = await runService.getById(id);
      setRun(response.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription à la course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveRun = async () => {
    try {
      setActionLoading(true);
      await runService.leave(id);

      // Mettre à jour l'état pour refléter que l'utilisateur n'est plus inscrit
      setIsParticipant(false);

      // Mettre à jour la liste des participants
      const response = await runService.getById(id);
      setRun(response.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du départ de la course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleRateRun = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      await runService.rate(id, ratingData);

      // Fermer le formulaire et actualiser les détails de la course
      setShowRatingForm(false);
      const response = await runService.getById(id);
      setRun(response.data);

      // Réinitialiser le formulaire
      setRatingData({ rating: 5, comment: '' });

      alert('Évaluation ajoutée avec succès !');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'évaluation de la course';
      setError(errorMessage);

      // Fermer le formulaire si c'est une erreur de logique métier
      if (errorMessage.includes('après sa réalisation') || errorMessage.includes('participé')) {
        setShowRatingForm(false);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Contacter l'organisateur (pour les participants)
  const handleContactOrganizer = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    navigate(`/messages/${run.id_user}`);
  };

  // Contacter un participant (pour l'organisateur)
  const handleContactParticipant = (participantId) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    navigate(`/messages/${participantId}`);
  };

  if (loading) {
    return (
      <div className="runDetailPage loading">
        <div className="container">
          <div className="loadingIndicator">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Chargement des détails de la course...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="runDetailPage error">
        <div className="container">
          <div className="errorMessage">{error}</div>
          <button className="backButton" onClick={() => navigate('/runs')}>
            <i className="fa-solid fa-arrow-left"></i> Retour à la liste des courses
          </button>
        </div>
      </div>
    );
  }

  if (!run) {
    return null;
  }

  return (
    <div className="runDetailPage">
      <div className="runHeader">
        <div className="runHeaderContent">
          <button className="backButton" onClick={() => navigate('/runs')}>
            <i className="fa-solid fa-arrow-left"></i> Retour
          </button>

          <div className="runMeta">
            <div className="runDate">
              <i className="fa-solid fa-calendar"></i>
              {formatDate(run.date)}
            </div>

            <div className="runLevel" data-level={run.level}>
              {run.level}
            </div>

            {run.is_private && (
              <div className="privateLabel">
                <i className="fa-solid fa-lock"></i> Privée
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="runContent">
          <div className="runMainInfo">
            <h1 className="runTitle">{run.title}</h1>

            <div className="runLocationDistance">
              <div className="runLocation">
                <i className="fa-solid fa-location-dot"></i>
                {run.location}
              </div>

              {run.distance && (
                <div className="runDistance">
                  <i className="fa-solid fa-route"></i>
                  {run.distance} km
                </div>
              )}
            </div>

            <div className="runOrganizer">
              <img
                src={run.organizer_picture ? `http://localhost:3000${run.organizer_picture}` : '/images/default-avatar.png'}
                alt={run.organizer_name}
                className="organizerPicture"
              />
              <div className="organizerInfo">
                <div className="organizerName">{run.organizer_name}</div>
                <div className="organizerLabel">Organisateur</div>
              </div>
            </div>

            {run.description && (
              <div className="runDescription">
                <h2>À propos de cette course</h2>
                <p>{run.description}</p>
              </div>
            )}

            {isOrganizer && (
              <div className="organizerActions">
                <button
                  className="editRunBtn"
                  onClick={() => navigate(`/runs/${run.id_run}/edit`)}
                >
                  <i className="fa-solid fa-pen"></i>
                  Modifier cette course
                </button>

                <button
                  className="deleteRunBtn"
                  onClick={handleDeleteRun}
                >
                  <i className="fa-solid fa-trash"></i>
                  Supprimer
                </button>
              </div>
            )}

            {!isOrganizer && (
              <div className="runActions">
                {!isParticipant ? (
                  <button
                    className="joinRunBtn"
                    onClick={handleJoinRun}
                    disabled={actionLoading}
                  >
                    <i className="fa-solid fa-running"></i>
                    {actionLoading ? 'En cours...' : 'Rejoindre cette course'}
                  </button>
                ) : (
                  <div className="participantActionsGroup">
                    <button
                      className="leaveRunBtn"
                      onClick={handleLeaveRun}
                      disabled={actionLoading}
                    >
                      <i className="fa-solid fa-sign-out-alt"></i>
                      {actionLoading ? 'En cours...' : 'Quitter cette course'}
                    </button>

                    <button
                      className="contactBtn"
                      onClick={handleContactOrganizer}
                    >
                      <i className="fa-solid fa-envelope"></i>
                      Contacter l'organisateur
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="runSidebar">
            <div className="sidebarCard">
              <h2>Participants ({run.participants?.length || 0})</h2>

              {run.participants && run.participants.length > 0 ? (
                <ul className="participantsList">
                  {run.participants.map(participant => (
                    <li
                      key={participant.id_user}
                      className="participantItem"
                    >
                      <img
                        src={participant.profile_picture ? `http://localhost:3000${participant.profile_picture}` : '/images/default-avatar.png'}
                        alt={participant.username}
                        className="participantPicture"
                        onClick={() => navigate(`/users/${participant.id_user}`)}
                      />
                      <div className="participantInfo">
                        <span
                          className="participantName"
                          onClick={() => navigate(`/users/${participant.id_user}`)}
                        >
                          {participant.username}
                        </span>
                        {participant.status === 'pending' && (
                          <span className="pendingStatus">En attente</span>
                        )}
                      </div>

                      {/* Bouton contacter pour l'organisateur mais en excluant l'organisateur lui-même*/}
                      {isOrganizer && participant.id_user !== currentUser.id_user && (
                        <button
                          className="contactParticipantBtn"
                          onClick={() => handleContactParticipant(participant.id_user)}
                          title={`Contacter ${participant.username}`}
                        >
                          <i className="fa-solid fa-envelope"></i>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="noParticipants">Aucun participant pour le moment</p>
              )}
            </div>

            {run.ratings && run.ratings.length > 0 && (
              <div className="sidebarCard">
                <h2>Avis ({run.ratings.length})</h2>
                <div className="ratingsList">
                  {run.ratings.map(rating => (
                    <div key={rating.id_rating} className="ratingItem">
                      <div className="ratingHeader">
                        <div className="ratingUser">
                          <img
                            src={rating.user_picture ? `http://localhost:3000${rating.user_picture}` : '/images/default-avatar.png'}
                            alt={rating.username}
                            className="ratingUserPicture"
                          />
                          <span className="ratingUsername">{rating.username}</span>
                        </div>
                        <div className="ratingStars">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <i
                              key={index}
                              className={index < rating.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                            ></i>
                          ))}
                        </div>
                      </div>
                      {rating.comment && (
                        <div className="ratingComment">
                          {rating.comment}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton évaluer - condition avec vérification date passée */}
            {isParticipant && !isOrganizer && !showRatingForm && isCoursePast(run.date) && (
              <div className="sidebarCard">
                <button
                  className="rateRunBtn"
                  onClick={() => setShowRatingForm(true)}
                >
                  <i className="fa-solid fa-star"></i>
                  Évaluer cette course
                </button>
              </div>
            )}

            {/* Message si course non terminée */}
            {isParticipant && !isOrganizer && !isCoursePast(run.date) && (
              <div className="sidebarCard">
                <div className="infoMessage">
                  <i className="fa-solid fa-clock"></i>
                  <span>Vous pourrez évaluer cette course après sa réalisation</span>
                </div>
              </div>
            )}

            {showRatingForm && (
              <div className="sidebarCard">
                <div className="ratingForm">
                  <h3>Évaluer cette course</h3>
                  <form onSubmit={handleRateRun}>
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
                              onChange={handleRatingChange}
                            />
                            <i className="fa-solid fa-star"></i>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="formGroup">
                      <label htmlFor="comment">Commentaire (optionnel)</label>
                      <textarea
                        name="comment"
                        value={ratingData.comment}
                        onChange={handleRatingChange}
                        placeholder="Partagez votre expérience..."
                        rows="3"
                      />
                    </div>

                    <div className="formActions">
                      <button
                        type="button"
                        className="cancelBtn"
                        onClick={() => {
                          setShowRatingForm(false);
                          setRatingData({ rating: 5, comment: '' });
                        }}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="submitBtn"
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Envoi...' : 'Envoyer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetailPage;