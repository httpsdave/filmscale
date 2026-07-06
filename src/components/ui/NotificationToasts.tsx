'use client';

import { useNotifications, type NotificationKind } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

const KIND_STYLES = {
  success: {
    wrapper: 'border-emerald-500/20 bg-[#141414] text-white',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    Icon: CheckCircle2,
  },
  warning: {
    wrapper: 'border-amber-500/20 bg-[#141414] text-white',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    Icon: AlertCircle,
  },
  error: {
    wrapper: 'border-rose-500/20 bg-[#141414] text-white',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
    Icon: XCircle,
  },
} as const;

export function NotificationToasts() {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-auto max-w-[400px] flex-col gap-3 pointer-events-none">
      {notifications.map(notification => {
        const styles = KIND_STYLES[notification.kind];
        const Icon = styles.Icon;

        return (
          <div
            key={notification.id}
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex items-start gap-4 rounded-xl border border-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl animate-slide-up bg-[#0a0a0a]',
              styles.wrapper
            )}
          >
            <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', styles.iconBg, styles.iconColor)}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 pt-1 min-w-[200px]">
              <p className="text-sm font-semibold text-white/90 leading-tight">
                {notification.title}
              </p>
              {notification.message && (
                <p className="mt-1 text-xs text-white/50 leading-snug">
                  {notification.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="mt-1 shrink-0 rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}