import React, { useState } from 'react';
import { 
  Activity, 
  Film, 
  Package, 
  Mic, 
  ShoppingBag, 
  Users, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { useActivityFeed } from '../../hooks/useDashboardData';
import { WidgetSkeleton, WidgetError } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface ActivityFeedWidgetProps {
  onTabChange: (tab: StudioTab) => void;
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ onTabChange }) => {
  const { data: activities, isLoading, isError, refetch } = useActivityFeed();
  const [filterType, setFilterType] = useState<string>('all');

  if (isLoading) return <WidgetSkeleton height="h-72" />;
  if (isError || !activities) return <WidgetError message="Failed to load activity feed" onRetry={refetch} />;

  const filteredActivities = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'render':
        return <Film className="w-3.5 h-3.5 text-indigo-400" />;
      case 'asset':
        return <Package className="w-3.5 h-3.5 text-purple-400" />;
      case 'voice':
        return <Mic className="w-3.5 h-3.5 text-emerald-400" />;
      case 'marketplace':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Users className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Real-Time Studio Stream
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'render', 'asset', 'voice', 'marketplace', 'team'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider capitalize transition-colors cursor-pointer shrink-0 ${
                filterType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Timeline List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">No recent activity for this category filter.</p>
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800/80">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="relative flex items-start space-x-3 bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 transition-colors"
            >
              {/* User Avatar with Type Overlay */}
              <div className="relative shrink-0 z-10">
                <img
                  src={act.userAvatar}
                  alt={act.userName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-700">
                  {getActivityIcon(act.type)}
                </div>
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-200 truncate">{act.userName}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>{act.timestamp}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-0.5">
                  {act.action} on <strong className="text-indigo-300 font-semibold">{act.targetName}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
