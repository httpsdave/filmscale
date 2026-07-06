'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type NotificationKind = 'success' | 'error' | 'warning';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  message?: string;
}

interface NotificationInput {
  kind: NotificationKind;
  title: string;
  message?: string;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  showNotification: (notification: NotificationInput) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((notification: NotificationInput) => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setNotifications(prev => [...prev, { id, ...notification }]);

    window.setTimeout(() => {
      dismissNotification(id);
    }, 3200);
  }, [dismissNotification]);

  useEffect(() => {
    return () => setNotifications([]);
  }, []);

  const value = useMemo(() => ({
    notifications,
    showNotification,
    dismissNotification,
  }), [notifications, showNotification, dismissNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}