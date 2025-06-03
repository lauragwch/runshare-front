import { useNavigate } from 'react-router-dom';
import '../../Styles/Runs/RunCard.css';

const RunCard = ({ run, className = '' }) => {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/runs/${run.id_run}`);
  };

  return (
    <div className={`runCard ${className}`} onClick={handleClick}>
      <div className="runCardHeader">
        <div className="runMeta">
          <div className="runDate">
            <i className="fa-solid fa-calendar-alt"></i>
            {formatDate(run.date)}
          </div>
          {run.is_private && (
            <span className="privateLabel">
              <i className="fa-solid fa-lock"></i>
              Privée
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
      
      {run.description && (
        <p className="runDescription">
          {run.description.substring(0, 100)}
          {run.description.length > 100 ? '...' : ''}
        </p>
      )}
      
      <div className="runInfo">
        {run.distance && (
          <div className="runDistance">
            <i className="fa-solid fa-route"></i>
            {run.distance} km
          </div>
        )}
        
        <div className="runParticipants">
          <i className="fa-solid fa-users"></i>
          {run.participants_count || 0} participant{(run.participants_count || 0) > 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="runFooter">
        <div className="runOrganizer">
          <img 
            src={run.organizer_picture ? `http://localhost:3000${run.organizer_picture}` : '/images/default-avatar.png'} 
            alt={run.organizer_name}
            className="organizerPicture"
          />
          <span className="organizerName">{run.organizer_name}</span>
        </div>
        
        <div className="runCardAction">
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    </div>
  );
};

export default RunCard;