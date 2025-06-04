import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { runService } from '../Services/api';
import RunForm from '../Components/Runs/RunForm';
import '../Styles/Pages/EditRunPage.css';

const EditRunPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await runService.getById(id);
        const runData = response.data;
        
        // Vérifier que l'utilisateur est bien l'organisateur
        if (!currentUser || runData.id_user !== currentUser.id_user) {
          navigate('/runs');
          return;
        }
        
        setRun(runData);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setError('Course introuvable');
        setTimeout(() => navigate('/runs'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchRun();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await runService.update(id, formData);
      navigate(`/runs/${id}`);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Erreur lors de la modification de la course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/runs/${id}`);
  };

 if (loading) {
    return (
      <div className="editRunPage">
        <div className="editRunContainer"> 
          <div className="loadingIndicator">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="editRunPage"> 
        <div className="editRunContainer"> 
          <div className="errorMessage">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!run) {
    return null;
  }
   return (
    <div className="editRunPage"> 
      <div className="editRunContainer"> 
        <h1>Modifier la course</h1>
        <RunForm 
          mode="edit"
          initialData={run}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditRunPage;