import { useNavigate } from 'react-router-dom';
import '../../Styles/Runs/RunCard.css';

const RunCard = ({
    run,
    className = '',
    showJoinButton = true,
    isOwner = false,
    showOrganizerInfo = true
}) => {
    const navigate = useNavigate();


    // Fonction pour formater la date SANS conversion de fuseau
    const formatDate = (dateString) => {
        const isoString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');

        // Forcer l'interprétation en heure locale
        const date = new Date(isoString + (isoString.includes('Z') ? '' : ''));

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

    const handleEditClick = (e) => {
        e.stopPropagation(); // Empêcher la navigation
        navigate(`/runs/edit/${run.id_run}`);
    };

    const handleJoinClick = (e) => {
        e.stopPropagation(); // Empêcher la navigation
        // Logique pour rejoindre la course
        console.log('Rejoindre la course:', run.id_run);
    };

    return (
        <div className={`runCard ${className}`} onClick={handleClick}>
            <div className="runCardHeader">
                <div className="runMeta">
                    <div className="runDate">
                        <i className="fa-solid fa-calendar-alt"></i>
                        {formatDate(run.date)}
                    </div>
                    {run.is_private === 1 && (
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

            {/* Footer avec structure verticale */}
            <div className="runFooter">
                <div className="runFooterLeft">
                    {showOrganizerInfo && (
                        <div className="runOrganizer">
                            {run.organizer_picture ? (
                                <img
                                    src={`http://localhost:3000${run.organizer_picture}`}
                                    alt={run.organizer_name || 'Organisateur'}
                                    className="organizerPicture"
                                    onError={(e) => {
                                        // ⬅️ Cacher l'image et afficher l'icône
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                // ⬅️ Icône par défaut si pas d'image
                                <div className="organizerPictureDefault">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            )}

                            <span className="organizerName">
                                {isOwner ? 'Vous' : `Organisé par ${run.organizer_name || 'Inconnu'}`}
                            </span>
                        </div>
                    )}

                    {/* Boutons directement en dessous */}
                    <div className="runActions">
                        {/* Bouton voir détails - toujours présent */}
                        <button
                            className="viewDetailsBtn"
                            onClick={handleClick}
                            title="Voir les détails"
                        >
                            <i className="fa-solid fa-eye"></i>
                            Détails
                        </button>

                        {/* Bouton rejoindre - conditionnel */}
                        {showJoinButton && !isOwner && (
                            <button
                                className="joinBtn"
                                onClick={handleJoinClick}
                                title="Rejoindre cette course"
                            >
                                <i className="fa-solid fa-plus"></i>
                                Rejoindre
                            </button>
                        )}

                        {/* Bouton modifier - pour le propriétaire */}
                        {isOwner && (
                            <button
                                className="editBtn"
                                onClick={handleEditClick}
                                title="Modifier cette course"
                            >
                                <i className="fa-solid fa-pen"></i>
                                Modifier
                            </button>
                        )}
                    </div>
                </div>

                {/* Flèche d'action - à droite */}
                <div className="runCardAction">
                    <i className="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        </div>
    );
};

export default RunCard;