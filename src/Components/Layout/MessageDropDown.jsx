import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import '../../Styles/Layout/MessageDropdown.css';

const MessageDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { conversations, messageCount, loading } = useMessages();

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConversationClick = (otherUserId) => {
    setIsOpen(false);
    navigate(`/messages/${otherUserId}`);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return 'Aucun message';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <div className="messageDropdown" ref={dropdownRef}>
      <button 
        className="messageDropdownToggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Messages"
      >
        <Badge 
          badgeContent={messageCount} 
          color="error"
          max={99}
          showZero={false}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              height: '18px',
              minWidth: '18px',
              fontWeight: 'bold',
              top: 2,
              right: 2
            }
          }}
        >
          <MailIcon 
            sx={{ 
              color: 'white', 
              fontSize: '1.2rem' 
            }} 
          />
        </Badge>
      </button>

      {isOpen && (
        <div className="messageDropdownMenu">
          <div className="messageDropdownHeader">
            <h3>Messages</h3>
            <button 
              className="viewAllBtn"
              onClick={() => {
                setIsOpen(false);
                navigate('/messages');
              }}
            >
              Voir tout
            </button>
          </div>

          <div className="messageDropdownContent">
            {loading ? (
              <div className="messageDropdownLoading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Chargement...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="messageDropdownEmpty">
                <i className="fa-solid fa-envelope-open"></i>
                <span>Aucun message</span>
              </div>
            ) : (
              conversations.slice(0, 5).map((conversation) => (
                <div 
                  key={conversation.other_user_id}
                  className="messageDropdownItem"
                  onClick={() => handleConversationClick(conversation.other_user_id)}
                >
                  <img 
                    src={conversation.other_user_picture ? `http://localhost:3000${conversation.other_user_picture}` : '/images/default-avatar.png'} 
                    alt={conversation.other_user_name}
                    className="messageUserAvatar"
                  />
                  <div className="messageContent">
                    <div className="messageUserName">
                      {conversation.other_user_name}
                    </div>
                    <div className="messagePreview">
                      {truncateMessage(conversation.last_message)}
                    </div>
                  </div>
                  <div className="messageTime">
                    {formatTime(conversation.last_message_time)}
                  </div>
                </div>
              ))
            )}
          </div>

          {conversations.length > 5 && (
            <div className="messageDropdownFooter">
              <button 
                className="viewAllMessagesBtn"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/messages');
                }}
              >
                Voir tous les messages ({conversations.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;