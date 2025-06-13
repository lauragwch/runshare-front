import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Contextes/AuthContext';
import { messageService } from '../Services/api';

export const useMessages = () => {
  const { currentUser } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await messageService.getUserConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

 const fetchMessageCount = async () => {
  if (!currentUser) {
    setMessageCount(0);
    return;
  }

  try {
    const response = await messageService.getMessageCount();
    const totalMessages = response.data.count;
    
    // Comparer avec la dernière visite
    const lastVisit = localStorage.getItem('lastMessageVisit');
    const lastVisitTime = lastVisit ? new Date(lastVisit) : new Date(0);
    
    // Compter seulement les messages plus récents que la dernière visite
    const recentMessages = conversations.filter(conv => {
      const messageTime = new Date(conv.last_message_time);
      return messageTime > lastVisitTime;
    }).length;
    
    setMessageCount(recentMessages);
  } catch (error) {
    console.error('Erreur lors du comptage des messages:', error);
    setMessageCount(0);
  }
};

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      fetchMessageCount();
    }
  }, [currentUser]);

  // Rafraîchir automatiquement toutes les 10 secondes
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      fetchConversations();
      fetchMessageCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  return {
    conversations,
    messageCount,
    loading,
    refreshConversations: fetchConversations,
    refreshMessageCount: fetchMessageCount
  };
};