'use client';
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(13);
  const hasNotification = unreadCount > 0;

  const clearNotifications = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, hasNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
