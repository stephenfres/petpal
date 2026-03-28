import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notificationApi';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await getNotifications(50);
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await markAsRead(id);
      await fetchNotifications(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchNotifications(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error marking all as read:', err);
      return false;
    }
  };

  const deleteNotificationById = async (id) => {
    try {
      await deleteNotification(id);
      await fetchNotifications(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteNotificationById,
  };
};