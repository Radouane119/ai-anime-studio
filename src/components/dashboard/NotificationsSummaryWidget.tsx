import React from 'react';
import { Bell, ShieldAlert, Users, CheckCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useNotificationsSummary } from '../../hooks/useDashboardData';
import { WidgetSkeleton } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface NotificationsSummaryWidgetProps {
  onTabChange: (tab: StudioTab) => void;
  onOpenNotificationsDrawer: () => void;
}

export const NotificationsSummaryWidget: React.FC<NotificationsSummaryWidgetProps> = ({
  onTabChange,
  onOpenNotificationsDrawer
}) => {
  const { data: notifData, isLoading } = useNotificationsSummary();

  if (isLoading) return <WidgetSkeleton height="h-64" />;

  const alerts = notifData?.recentAlerts || [];
  const unreadCount = notifData?.unreadCount || 0;

  const getBadgeForCategory = (category: string) => {
    switch (category) {
      case 'alert':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'security':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'team':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-indigo-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            )}
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Notifications & System Alerts
          </h3>
        </div>

        <button
          onClick={onOpenNotificationsDrawer}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
        >
          <span>View All ({unreadCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {alerts.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            className={`bg-slate-950/80 border ${
              !alert.read ? 'border-indigo-500/40 bg-indigo-950/10' : 'border-slate-800/80'
            } rounded-xl p-3 flex items-start justify-between gap-3 transition-colors`}
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getBadgeForCategory(alert.category)}`}>
                  {alert.category.toUpperCase()}
                </span>
                <h4 className="text-xs font-bold text-slate-100 truncate">{alert.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">{alert.message}</p>
              <span className="text-[9px] text-slate-500 font-mono block">{alert.timestamp}</span>
            </div>

            {!alert.read && (
              <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
