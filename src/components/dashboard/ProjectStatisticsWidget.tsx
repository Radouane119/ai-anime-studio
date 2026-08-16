import React from 'react';
import { BarChart3, Users, BookOpen, Film, Mic, Layers } from 'lucide-react';
import { useDashboardSummary } from '../../hooks/useDashboardData';
import { WidgetSkeleton } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface ProjectStatisticsWidgetProps {
  onTabChange: (tab: StudioTab) => void;
}

export const ProjectStatisticsWidget: React.FC<ProjectStatisticsWidgetProps> = ({ onTabChange }) => {
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading) return <WidgetSkeleton height="h-44" />;

  const metrics = [
    {
      label: 'Active Series',
      value: summary?.activeSeriesCount || 3,
      subtitle: 'Anime & OVA Production',
      icon: Film,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      tab: 'anime' as StudioTab
    },
    {
      label: 'Script Chapters',
      value: summary?.episodesInProduction || 18,
      subtitle: 'Light Novel & Scripting',
      icon: BookOpen,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      tab: 'novel' as StudioTab
    },
    {
      label: '4K Rendered Scenes',
      value: summary?.renderedScenesCount || 342,
      subtitle: 'Keyframe Interpolation',
      icon: Layers,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      tab: 'video' as StudioTab
    },
    {
      label: 'Character Roster',
      value: summary?.characterRosterCount || 44,
      subtitle: '2D/3D Rigged Lorebooks',
      icon: Users,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      tab: 'characters' as StudioTab
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Studio Production Telemetry
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Real-time Pipeline</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <button
              key={i}
              onClick={() => onTabChange(m.tab)}
              className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-3.5 text-left transition-all hover:-translate-y-0.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-mono font-medium">{m.label}</span>
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <p className="text-2xl font-extrabold text-white font-mono group-hover:text-indigo-200 transition-colors">
                {m.value}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 truncate">{m.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
