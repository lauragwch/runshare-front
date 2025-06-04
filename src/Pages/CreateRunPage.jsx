import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { runService } from '../Services/api';
import RunForm from '../Components/Runs/RunForm';
// import '../Styles/Pages/CreateRunPage.css';

const CreateRunPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await runService.create(formData);
      navigate(`/runs/${response.data.id_run}`);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      // Gérer l'erreur selon vos besoins
    }
  };

  const handleCancel = () => {
    navigate('/runs');
  };

  return (
    <div className="createRunPage">
      <div className="createRunContainer">
        <h1>Organiser une course</h1>
        <RunForm 
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateRunPage;