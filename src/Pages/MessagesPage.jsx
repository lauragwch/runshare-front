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

  // Charger la conversation si targetUserId est fourni
  useEffect(() => {
    if (targetUserId && conversations.length > 0) {
      const user = conversations.find(c => c.other_user_id === parseInt(targetUserId));
      if (user) {
        setSelectedUser(user);
        loadConversation(targetUserId);
      }
    }
  }, [targetUserId, conversations]);

  const loadConversation = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageService.getConversation(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la conversation:', error);
      setError('Erreur lors du chargement de la conversation');
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
      
      // Recharger la conversation
      await loadConversation(selectedUser.other_user_id);
      refreshConversations();
      refreshMessageCount();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError('Erreur lors de l\'envoi du message');
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
                      <p>Chargement...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="emptyState">
                      <p>Aucun message dans cette conversation</p>
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
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </form>
              </>
            ) : (
              <div className="noSelection">
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