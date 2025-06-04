import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Contextes/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService, runService } from '../Services/api';
import '../Styles/Pages/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier les droits admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [currentUser, navigate]);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger selon l'onglet actif
        if (activeTab === 'users') {
          const usersResponse = await userService.getAllUsers();
          setUsers(usersResponse.data);
        } else if (activeTab === 'runs') {
          const runsResponse = await runService.getAllForAdmin();
          setRuns(runsResponse.data);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === 'admin') {
      fetchData();
    }
  }, [activeTab, currentUser]);

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id_user !== userId));
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Modifier le rôle d'un utilisateur
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id_user === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      setError('Erreur lors de la modification du rôle');
    }
  };

  // Supprimer une course
  const handleDeleteRun = async (runId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette course ?')) {
      return;
    }
    
    try {
      await runService.deleteAsAdmin(runId);
      setRuns(runs.filter(run => run.id_run !== runId));
    } catch (error) {
      setError('Erreur lors de la suppression de la course');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="adminDashboard">
      <div className="adminContainer">
        <div className="adminHeader">
          <h1>
            <i className="fa-solid fa-shield-alt"></i>
            Panel d'Administration
          </h1>
          <p>Gestion des utilisateurs et des courses</p>
        </div>

        {error && (
          <div className="errorAlert">
            <i className="fa-solid fa-exclamation-triangle"></i>
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="adminTabs">
          <button 
            className={`tabBtn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fa-solid fa-users"></i>
            Utilisateurs ({users.length})
          </button>
          <button 
            className={`tabBtn ${activeTab === 'runs' ? 'active' : ''}`}
            onClick={() => setActiveTab('runs')}
          >
            <i className="fa-solid fa-running"></i>
            Courses ({runs.length})
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="adminContent">
          {loading ? (
            <div className="loadingIndicator">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Chargement...</span>
            </div>
          ) : (
            <>
              {/* Onglet Utilisateurs */}
              {activeTab === 'users' && (
                <div className="usersContent">
                  <div className="tableContainer">
                    <table className="adminTable">
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th>Email</th>
                          <th>Ville</th>
                          <th>Niveau</th>
                          <th>Rôle</th>
                          <th>Inscription</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id_user}>
                            <td>
                              <div className="userInfo">
                                <img 
                                  src={user.profile_picture 
                                    ? `http://localhost:3000${user.profile_picture}` 
                                    : '/images/default-avatar.png'
                                  }
                                  alt={user.username}
                                  className="userAvatar"
                                />
                                <span>{user.username}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.city || '-'}</td>
                            <td>
                              <span className={`levelBadge ${user.level}`}>
                                {user.level}
                              </span>
                            </td>
                            <td>
                              <select 
                                value={user.role || 'user'}
                                onChange={(e) => handleUpdateRole(user.id_user, e.target.value)}
                                className="roleSelect"
                              >
                                <option value="user">Utilisateur</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            <td>
                              <div className="actionButtons">
                                <button 
                                  className="viewBtn"
                                  onClick={() => navigate(`/users/${user.id_user}`)}
                                  title="Voir le profil"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button 
                                  className="deleteBtn"
                                  onClick={() => handleDeleteUser(user.id_user)}
                                  title="Supprimer"
                                  disabled={user.id_user === currentUser.id_user}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Onglet Courses */}
              {activeTab === 'runs' && (
                <div className="runsContent">
                  <div className="tableContainer">
                    <table className="adminTable">
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Organisateur</th>
                          <th>Date</th>
                          <th>Lieu</th>
                          <th>Participants</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {runs.map(run => (
                          <tr key={run.id_run}>
                            <td>
                              <div className="runInfo">
                                <strong>{run.title}</strong>
                                {run.is_private && (
                                  <span className="privateBadge">
                                    <i className="fa-solid fa-lock"></i>
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>{run.organizer_name}</td>
                            <td>{new Date(run.date).toLocaleDateString()}</td>
                            <td>{run.location}</td>
                            <td>{run.participants_count || 0}</td>
                            <td>
                              <span className={`statusBadge ${new Date(run.date) > new Date() ? 'upcoming' : 'past'}`}>
                                {new Date(run.date) > new Date() ? 'À venir' : 'Passée'}
                              </span>
                            </td>
                            <td>
                              <div className="actionButtons">
                                <button 
                                  className="viewBtn"
                                  onClick={() => navigate(`/runs/${run.id_run}`)}
                                  title="Voir les détails"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button 
                                  className="editBtn"
                                  onClick={() => navigate(`/runs/${run.id_run}/edit`)}
                                  title="Modifier"
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button 
                                  className="deleteBtn"
                                  onClick={() => handleDeleteRun(run.id_run)}
                                  title="Supprimer"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;