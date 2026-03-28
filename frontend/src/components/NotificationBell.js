import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

export const NotificationBell = ({ mobile = false }) => {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  if (mobile) {
    return (
      <button className="w-full text-left hover:bg-white/20 px-3 py-2 rounded-md flex items-center">
        <Bell className="h-4 w-4 mr-2" />
        Notifications {unreadCount > 0 && `(${unreadCount})`}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-red-500 hover:text-red-700 flex items-center"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};