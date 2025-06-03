import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { runService } from '../Services/api';
import '../Styles/Pages/RunsListPage.css';
import RunCard from '../Components/Runs/RunCard';

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
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="runsListPage">
      <div className="container">
        {/* En-tête avec titre et description */}
        <div className="pageHeader">
          <h1>Découvrez les courses près de chez vous</h1>
          <p className="subtitle">Rejoignez une communauté de coureurs passionnés et trouvez vos prochains partenaires d'entraînement</p>
        </div>

        {/* Bouton de création déplacé ici - au-dessus des filtres */}
        <div className="createRunSection">
          <button
            className="createRunBtn"
            onClick={() => navigate('/runs/create')}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Organiser une course</span>
          </button>
        </div>

        {/* Section des filtres */}
        <div className="filtersSection">
          <div className="searchFilter">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Rechercher par titre, lieu ou organisateur..."
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
              <i className="fa-solid fa-refresh"></i>
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Résultats - runCards en dessous des filtres */}
        <div className="resultsSection">
          {loading ? (
            <div className="loadingIndicator">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Chargement des courses...</span>
            </div>
          ) : error ? (
            <div className="errorMessage">
              <i className="fa-solid fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          ) : runs.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">
                <i className="fa-solid fa-running"></i>
              </div>
              <h2>Aucune course trouvée</h2>
              <p>Il semble qu'aucune course ne corresponde à vos critères de recherche. Pourquoi ne pas en créer une ?</p>
              <button
                className="createRunBtn secondary"
                onClick={() => navigate('/runs/create')}
              >
                <i className="fa-solid fa-plus"></i>
                Créer ma première course
              </button>
            </div>
          ) : (
            <>
              <div className="resultsHeader">
                <h2>{runs.length} course{runs.length > 1 ? 's' : ''} trouvée{runs.length > 1 ? 's' : ''}</h2>
              </div>

              <div className="runsList">
                {runs.map(run => (
                  <RunCard key={run.id_run} run={run} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunsListPage;