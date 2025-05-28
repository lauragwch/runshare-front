import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { runService } from '../Services/api';
import '../Styles/Pages/RunsListPage.css';

const RunsListPage = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    date: '',
    level: '',
    distance: '',
    search: ''
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRuns = async () => {
      try {
        setLoading(true);
        const response = await runService.getAll(filters);
        setRuns(response.data);
      } catch (err) {
        setError('Impossible de récupérer les courses');
        console.error('Erreur lors de la récupération des courses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRuns();
  }, [filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      city: '',
      date: '',
      level: '',
      distance: '',
      search: ''
    });
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="runsListPage">
      <div className="container">
        <div className="pageHeader">
          <div className="headerLeft">
            <h1>Toutes les courses</h1>
            <p className="subtitle">Trouvez des partenaires de course dans votre région</p>
          </div>
          <button 
            className="createRunBtn"
            onClick={() => navigate('/runs/create')}
          >
            <i className="fa-solid fa-plus"></i> Organiser une course
          </button>
        </div>
        
        <div className="filtersSection">
          <div className="searchFilter">
            <input 
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Rechercher une course par titre ou lieu..."
              className="searchInput"
            />
            <i className="fa-solid fa-search searchIcon"></i>
          </div>
          
          <div className="filters">
            <div className="filterItem">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Toutes les villes"
              />
            </div>
            
            <div className="filterItem">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filterItem">
              <label htmlFor="level">Niveau</label>
              <select
                id="level"
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
              >
                <option value="">Tous les niveaux</option>
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="avancé">Avancé</option>
              </select>
            </div>
            
            <div className="filterItem">
              <label htmlFor="distance">Distance</label>
              <select
                id="distance"
                name="distance"
                value={filters.distance}
                onChange={handleFilterChange}
              >
                <option value="">Toutes les distances</option>
                <option value="0-5">0 - 5 km</option>
                <option value="5-10">5 - 10 km</option>
                <option value="10-15">10 - 15 km</option>
                <option value="15">15+ km</option>
              </select>
            </div>
            
            <button 
              className="clearFiltersBtn"
              onClick={clearFilters}
            >
              Effacer les filtres
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loadingIndicator">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Chargement des courses...</span>
          </div>
        ) : error ? (
          <div className="errorMessage">{error}</div>
        ) : runs.length === 0 ? (
          <div className="emptyState">
            <h2>Aucune course ne correspond à votre recherche</h2>
            <p>Essayez de modifier vos filtres ou créez votre propre course !</p>
            <button 
              className="createRunBtn"
              onClick={() => navigate('/runs/create')}
            >
              <i className="fa-solid fa-plus"></i> Organiser une course
            </button>
          </div>
        ) : (
          <div className="runsList">
            {runs.map(run => (
              <div key={run.id_run} className="runCard" onClick={() => navigate(`/runs/${run.id_run}`)}>
                <div className="runCardHeader">
                  <div className="runDate">
                    {formatDate(run.date)}
                    {run.is_private && (
                      <span className="privateLabel">
                        <i className="fa-solid fa-lock"></i> Privée
                      </span>
                    )}
                  </div>
                  <div className="runLevel" data-level={run.level}>
                    {run.level}
                  </div>
                </div>
                
                <h3 className="runTitle">{run.title}</h3>
                
                <div className="runLocation">
                  <i className="fa-solid fa-location-dot"></i>
                  {run.location}
                </div>
                
                <div className="runInfo">
                  {run.distance && (
                    <div className="runDistance">
                      <i className="fa-solid fa-route"></i>
                      {run.distance} km
                    </div>
                  )}
                  
                  <div className="runParticipants">
                    <i className="fa-solid fa-users"></i>
                    {run.participants_count || 0} participant(s)
                  </div>
                </div>
                
                <div className="runOrganizer">
                  <img 
                    src={run.organizer_picture ? `http://localhost:3000${run.organizer_picture}` : '/images/default-avatar.png'} 
                    alt={run.organizer_name}
                    className="organizerPicture"
                  />
                  <span className="organizerName">Organisé par {run.organizer_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RunsListPage;