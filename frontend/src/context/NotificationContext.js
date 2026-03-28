import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, BellOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notificationApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      if (user && isOpen) {
        fetchNotifications();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(20);
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      await fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await fetchNotifications();
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'vaccination_reminder':
        return '💉';
      case 'feeding_reminder':
        return '🍽️';
      case 'vet_appointment':
        return '🏥';
      case 'health_alert':
        return '⚠️';
      case 'weekly_report':
        return '📊';
      default:
        return '📢';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg hover:bg-gray-100 transition-colors
          focus:outline-none focus:ring-2 focus:ring-teal-500
        `}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-teal-600 hover:text-teal-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellOff className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-3 border-b hover:bg-gray-50 transition-colors
                    ${!notification.isRead ? 'bg-teal-50' : ''}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          onClick={() => {
                            handleMarkAsRead(notification.id);
                            setIsOpen(false);
                          }}
                          className="text-xs text-teal-600 hover:underline mt-1 inline-block"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3 text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};