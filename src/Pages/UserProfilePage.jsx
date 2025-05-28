import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { userService } from '../Services/api';
import '../Styles/Pages/UserProfilePage.css';

const UserProfilePage = () => {
  // Récupérer l'ID depuis l'URL ou utiliser l'ID de l'utilisateur connecté
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // États pour stocker les données et gérer les états UI
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // États pour le mode édition
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    city: '',
    level: 'débutant',
    bio: ''
  });
  
  // Effet pour charger les données du profil
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Si on est sur /profile sans paramètre id, c'est le profil de l'utilisateur connecté
        const userId = id || currentUser?.id_user;
        
        // Si aucun utilisateur n'est connecté et pas d'ID dans l'URL
        if (!userId) {
          navigate('/auth');
          return;
        }
        
        // Déterminer si c'est le profil de l'utilisateur connecté
        setIsOwnProfile(!id || (currentUser && id === currentUser.id_user.toString()));
        
        // Charger les données du profil
        const response = await userService.getUser(userId);
        setUser(response.data);
        
        // Préremplir le formulaire d'édition
        if (response.data) {
          setProfileData({
            username: response.data.username || '',
            city: response.data.city || '',
            level: response.data.level || 'débutant',
            bio: response.data.bio || ''
          });
        }
      } catch (err) {
        setError('Impossible de charger les données du profil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [id, currentUser, navigate]);

  // Fonction pour gérer la soumission du formulaire d'édition
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      setEditMode(false);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="userProfilePage">
        <div className="container">
          <div className="loadingIndicator">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Chargement du profil...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userProfilePage">
        <div className="container">
          <div className="errorMessage">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="userProfilePage">
      <div className="container">
        {/* En-tête du profil */}
        <div className="profileHeader">
          <div className="profilePictureContainer">
            <img 
              src={user.profile_picture ? `http://localhost:3000${user.profile_picture}` : '/images/default-avatar.png'} 
              alt={user.username}
              className="profilePicture"
            />
            {isOwnProfile && (
              <button className="changePictureBtn">
                <i className="fa-solid fa-camera"></i>
              </button>
            )}
          </div>
          
          <div className="profileInfo">
            {editMode ? (
              <input 
                type="text" 
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="usernameInput"
              />
            ) : (
              <h1 className="username">{user.username}</h1>
            )}
            
            <div className="userAttributes">
              {editMode ? (
                <>
                  <div className="attribute">
                    <i className="fa-solid fa-location-dot"></i>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      placeholder="Votre ville"
                    />
                  </div>
                  <div className="attribute">
                    <i className="fa-solid fa-gauge-high"></i>
                    <select
                      name="level"
                      value={profileData.level}
                      onChange={handleChange}
                    >
                      <option value="débutant">Débutant</option>
                      <option value="intermédiaire">Intermédiaire</option>
                      <option value="avancé">Avancé</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {user.city && (
                    <div className="attribute">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{user.city}</span>
                    </div>
                  )}
                  <div className="attribute">
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>{user.level}</span>
                  </div>
                  <div className="attribute">
                    <i className="fa-solid fa-calendar"></i>
                    <span>Membre depuis {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>

            {isOwnProfile && !editMode && (
              <button
                className="editProfileBtn"
                onClick={() => setEditMode(true)}
              >
                <i className="fa-solid fa-pen"></i> Modifier le profil
              </button>
            )}
            
            {editMode && (
              <div className="editActions">
                <button
                  className="cancelBtn"
                  onClick={() => setEditMode(false)}
                >
                  Annuler
                </button>
                <button
                  className="saveBtn"
                  onClick={handleSubmit}
                >
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Biographie */}
        <div className="profileSection">
          <h2>À propos</h2>
          {editMode ? (
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows="5"
              placeholder="Parlez-nous de vous et de votre expérience en course à pied"
            ></textarea>
          ) : (
            <p className="bio">{user.bio || "Cet utilisateur n'a pas encore ajouté de biographie."}</p>
          )}
        </div>
        
        {/* Courses organisées */}
        {user.organizedRuns && user.organizedRuns.length > 0 && (
          <div className="profileSection">
            <h2>Courses organisées</h2>
            <div className="runsList">
              {user.organizedRuns.map(run => (
                <div 
                  key={run.id_run} 
                  className="runCard"
                  onClick={() => navigate(`/runs/${run.id_run}`)}
                >
                  <div className="runDate">{new Date(run.date).toLocaleDateString()}</div>
                  <h3>{run.title}</h3>
                  <div className="runLocation">
                    <i className="fa-solid fa-location-dot"></i> {run.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Courses auxquelles l'utilisateur participe */}
        {user.participatedRuns && user.participatedRuns.length > 0 && (
          <div className="profileSection">
            <h2>Courses auxquelles {isOwnProfile ? 'je participe' : `${user.username} participe`}</h2>
            <div className="runsList">
              {user.participatedRuns.map(run => (
                <div 
                  key={run.id_run} 
                  className="runCard"
                  onClick={() => navigate(`/runs/${run.id_run}`)}
                >
                  <div className="runDate">{new Date(run.date).toLocaleDateString()}</div>
                  <h3>{run.title}</h3>
                  <div className="runLocation">
                    <i className="fa-solid fa-location-dot"></i> {run.location}
                  </div>
                  <div className="runOrganizer">
                    Organisé par {run.organizer_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Évaluations reçues */}
        {user.ratings && user.ratings.length > 0 && (
          <div className="profileSection">
            <h2>Évaluations ({user.ratings.length})</h2>
            <div className="averageRating">
              <span className="ratingValue">{user.averageRating.toFixed(1)}</span>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i
                    key={index}
                    className={`fa-${index < Math.round(user.averageRating) ? 'solid' : 'regular'} fa-star`}
                  ></i>
                ))}
              </div>
              <span className="ratingCount">({user.ratings.length})</span>
            </div>
            
            <div className="ratingsList">
              {user.ratings.map(rating => (
                <div key={rating.id_rating} className="ratingItem">
                  <div className="ratingHeader">
                    <div className="raterInfo">
                      <img 
                        src={rating.from_profile_picture ? `http://localhost:3000${rating.from_profile_picture}` : '/images/default-avatar.png'} 
                        alt={rating.from_username}
                        className="raterPicture"
                        onClick={() => navigate(`/users/${rating.from_user_id}`)}
                      />
                      <span 
                        className="raterName"
                        onClick={() => navigate(`/users/${rating.from_user_id}`)}
                      >
                        {rating.from_username}
                      </span>
                    </div>
                    <div className="ratingStars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <i
                          key={index}
                          className={`fa-${index < rating.rating ? 'solid' : 'regular'} fa-star`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  {rating.comment && (
                    <div className="ratingComment">
                      {rating.comment}
                    </div>
                  )}
                  <div className="ratingDate">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;