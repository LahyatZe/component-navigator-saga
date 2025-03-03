
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationContextType } from '@/types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        // Parse notifications from localStorage and convert string dates back to Date objects
        return JSON.parse(savedNotifications).map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }));
      } catch (error) {
        console.error('Failed to parse notifications from localStorage', error);
        return [];
      }
    }
    return [];
  });

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date()
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    // Show toast notification
    toast[notification.type || 'info'](notification.title, {
      description: notification.message,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
