import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { messageService } from '../Services/api';
import { useMessages } from '../hooks/useMessages';
import '../Styles/Pages/MessagesPage.css';

const MessagesPage = () => {
  const { userId: targetUserId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { conversations, refreshConversations, refreshMessageCount } = useMessages();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (targetUserId) {
      // MARQUER LA VISITE quand on ouvre une conversation
      localStorage.setItem('lastMessageVisit', new Date().toISOString());

      const existingUser = conversations.find(c => c.other_user_id === parseInt(targetUserId));

      if (existingUser) {
        setSelectedUser(existingUser);
        loadConversation(targetUserId);
      } else {
        createTempUserForNewConversation(targetUserId);
      }
       // Rafraîchir le compteur après marquage
    refreshMessageCount();
    }
  }, [targetUserId, conversations]);

  const createTempUserForNewConversation = async (userId) => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const userData = await response.json();

        setSelectedUser({
          other_user_id: parseInt(userId),
          other_user_name: userData.username,
          other_user_picture: userData.profile_picture,
          last_message: '',
          last_message_time: new Date().toISOString()
        });
        setMessages([]);
        setError(null);
      } else {
        setError('Utilisateur non trouvé');
      }
    } catch (error) {
      setError('Impossible de démarrer la conversation');
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await messageService.getConversation(userId);
      setMessages(response.data);
    } catch (error) {
      setError('Erreur lors du chargement de la conversation');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedUser) return;

    try {
      setSending(true);
      setError(null);

      await messageService.sendMessage(selectedUser.other_user_id, newMessage.trim());
      setNewMessage('');

      await loadConversation(selectedUser.other_user_id);
      refreshConversations();
      refreshMessageCount();

    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedUser(conversation);
    navigate(`/messages/${conversation.other_user_id}`);
    loadConversation(conversation.other_user_id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="messagesPage">
      <div className="container">
        <h1>Messages</h1>

        <div className="messagesLayout">
          {/* Liste des conversations */}
          <div className="conversationsList">
            <h2>Conversations</h2>
            {conversations.length === 0 ? (
              <div className="emptyState">
                <p>Aucune conversation</p>
                <p>Contactez un organisateur depuis une course pour commencer !</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.other_user_id}
                  className={`conversationItem ${selectedUser?.other_user_id === conversation.other_user_id ? 'active' : ''}`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <img
                    src={conversation.other_user_picture ? `http://localhost:3000${conversation.other_user_picture}` : '/images/default-avatar.png'}
                    alt={conversation.other_user_name}
                    className="userAvatar"
                  />
                  <div className="conversationInfo">
                    <h3>{conversation.other_user_name}</h3>
                    <p>{conversation.last_message || 'Aucun message'}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Zone de chat */}
          <div className="chatZone">
            {selectedUser ? (
              <>
                <div className="chatHeader">
                  <img
                    src={selectedUser.other_user_picture ? `http://localhost:3000${selectedUser.other_user_picture}` : '/images/default-avatar.png'}
                    alt={selectedUser.other_user_name}
                    className="userAvatar"
                  />
                  <h2>{selectedUser.other_user_name}</h2>
                </div>

                {error && (
                  <div className="errorMessage">
                    {error}
                  </div>
                )}

                <div className="messagesContainer">
                  {loading ? (
                    <div className="loadingState">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <p>Chargement...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="emptyState">
                      <i className="fa-solid fa-comments"></i>
                      <p>Aucun message dans cette conversation</p>
                      <p>Envoyez votre premier message !</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id_message}
                        className={`message ${message.id_sender === currentUser.id_user ? 'sent' : 'received'}`}
                      >
                        <div className="messageContent">
                          <p>{message.content}</p>
                          <span className="messageTime">
                            {formatTime(message.sent_at)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="messageForm">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    disabled={sending}
                    className="messageInput"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="sendButton"
                  >
                    {sending ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-paper-plane"></i>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="noSelection">
                <i className="fa-solid fa-envelope-open"></i>
                <h2>Sélectionnez une conversation</h2>
                <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;