import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { userService } from '../Services/api';
import RunCard from '../Components/Runs/RunCard'; 
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
        
        // Déterminer l'ID à utiliser
        const targetUserId = id || currentUser?.id_user;
        
        if (!targetUserId) {
          navigate('/auth');
          return;
        }
        
        // Vérifier si c'est le profil de l'utilisateur connecté
        setIsOwnProfile(!id || (currentUser && parseInt(id) === currentUser.id_user));
        
        // Récupérer les données du profil
        const response = await userService.getUser(targetUserId);
        setUser(response.data);
        
        // Pré-remplir les données d'édition si c'est le profil de l'utilisateur connecté
        if (!id || (currentUser && parseInt(id) === currentUser.id_user)) {
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

  // Fonction pour gérer l'upload de photo de profil
  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await userService.uploadProfilePicture(formData);
      
      // Mettre à jour l'image dans l'état local
      setUser(prev => ({
        ...prev,
        profile_picture: response.data.profilePicture
      }));

    } catch (err) {
      setError('Erreur lors du téléchargement de l\'image');
      console.error(err);
    }
  };

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <div className="userProfilePage">
        <div className="userProfileContainer">
          <div className="loadingIndicator">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Chargement du profil...</span>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'état d'erreur
  if (error) {
    return (
      <div className="userProfilePage">
        <div className="userProfileContainer">
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
      <div className="userProfileContainer">
        {/* En-tête du profil */}
        <div className="profileHeader">
          <div className="profilePictureContainer">
            <img
              src={user.profile_picture ? `http://localhost:3000${user.profile_picture}` : '/images/default-avatar.png'}
              alt={user.username}
              className="profilePicture"
            />
            {isOwnProfile && (
              <>
                <input
                  type="file"
                  id="pictureUpload"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="changePictureBtn"
                  onClick={() => document.getElementById('pictureUpload').click()}
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </>
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
              <h1>{user.username}</h1>
            )}
            
            <div className="profileMeta">
              {editMode ? (
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  placeholder="Ville"
                  className="cityInput"
                />
              ) : (
                <span className="location">
                  <i className="fa-solid fa-location-dot"></i>
                  {user.city || 'Ville non renseignée'}
                </span>
              )}
              
              {editMode ? (
                <select
                  name="level"
                  value={profileData.level}
                  onChange={handleChange}
                  className="levelSelect"
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              ) : (
                <span className={`level ${user.level}`}>
                  {user.level}
                </span>
              )}
            </div>

            <div className="profileStats">
              <div className="stat">
                <span className="statValue">{user.averageRating ? user.averageRating.toFixed(1) : '0.0'}</span>
                <span className="statLabel">Note moyenne</span>
              </div>
              <div className="stat">
                <span className="statValue">{user.organizedRuns?.length || 0}</span>
                <span className="statLabel">Courses organisées</span>
              </div>
              <div className="stat">
                <span className="statValue">{user.participatedRuns?.length || 0}</span>
                <span className="statLabel">Participations</span>
              </div>
            </div>

            {isOwnProfile && (
              <div className="profileActions">
                {editMode ? (
                  <>
                    <button onClick={handleSubmit} className="saveBtn">
                      <i className="fa-solid fa-check"></i>
                      Sauvegarder
                    </button>
                    <button onClick={() => setEditMode(false)} className="cancelBtn">
                      <i className="fa-solid fa-times"></i>
                      Annuler
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditMode(true)} className="editBtn">
                    <i className="fa-solid fa-pen"></i>
                    Modifier le profil
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="profileSection">
          <h3>À propos</h3>
          {editMode ? (
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              placeholder="Parlez-nous de vous..."
              className="bioTextarea"
            />
          ) : (
            <p className="bio">{user.bio || 'Aucune description disponible.'}</p>
          )}
        </div>

        {/* Évaluations */}
        {user.ratings && user.ratings.length > 0 && (
          <div className="profileSection">
            <h3>Évaluations ({user.ratings.length})</h3>
            <div className="ratingsList">
              {user.ratings.map(rating => (
                <div key={rating.id_rating} className="ratingItem">
                  <div className="ratingHeader">
                    <div className="ratingInfo">
                      <img
                        src={rating.from_profile_picture ? `http://localhost:3000${rating.from_profile_picture}` : '/images/default-avatar.png'}
                        alt={rating.from_username}
                        className="ratingAvatar"
                      />
                      <div>
                        <span className="ratingUsername">{rating.from_username}</span>
                        <div className="ratingStars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${i < rating.rating ? 'filled' : ''}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="ratingDate">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="ratingComment">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses organisées - AVEC showOrganizerInfo */}
        {user.organizedRuns && user.organizedRuns.length > 0 && (
          <div className="profileSection">
            <h3>Courses organisées</h3>
            <div className="runsList">
              {user.organizedRuns.map(run => (
                <RunCard 
                  key={run.id_run}
                  run={run}
                  showJoinButton={false}
                  isOwner={true}
                  showOrganizerInfo={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Participations - UTILISER RunCard */}
        {user.participatedRuns && user.participatedRuns.length > 0 && (
          <div className="profileSection">
            <h3>Participations</h3>
            <div className="runsList">
              {user.participatedRuns.map(run => (
                <RunCard 
                  key={run.id_run}
                  run={run}
                  showJoinButton={false}
                  showOrganizerInfo={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;