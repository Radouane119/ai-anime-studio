import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Sparkles, 
  ShieldAlert, 
  UserPlus, 
  Coins, 
  Info, 
  CheckCircle2 
} from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';

export const NotificationsDrawer: React.FC = () => {
  const { 
    notificationsDrawerOpen, 
    setNotificationsDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useShellStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'render_complete': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'security': return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'team_invite': return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'credit_low': return <Coins className="w-4 h-4 text-rose-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      {notificationsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-slate-100">Studio Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold text-[10px]">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setNotificationsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Subheader */}
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all font-medium ${
                      activeFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button 
                    onClick={() => setActiveFilter('unread')}
                    className={`px-3 py-1 rounded-lg transition-all font-medium ${
                      activeFilter === 'unread' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredNotifications.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs">
                    No notifications to show.
                  </div>
                ) : (
                  filteredNotifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        item.read 
                          ? 'bg-slate-900/50 border-slate-800/80 text-slate-400' 
                          : 'bg-indigo-950/20 border-indigo-500/30 text-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-slate-800 shrink-0 mt-0.5">
                          {renderIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                            <span className="text-[10px] text-slate-500 shrink-0">{item.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
                AI Studio Real-Time Alert Pipeline Active
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
