import React from 'react';
import { Sparkles, Building2, Users2, Film, Clapperboard, ArrowUpRight } from 'lucide-react';
import { useDashboardSummary } from '../../hooks/useDashboardData';
import { WidgetSkeleton, WidgetError } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface WelcomeCardProps {
  onTabChange: (tab: StudioTab) => void;
  onOpenQuickCreate: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onTabChange, onOpenQuickCreate }) => {
  const { data: summary, isLoading, isError, refetch } = useDashboardSummary();

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) return <WidgetSkeleton height="h-44" />;
  if (isError || !summary) return <WidgetError message="Failed to load welcome overview" onRetry={refetch} />;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 rounded-2xl p-6 lg:p-7 shadow-2xl shadow-indigo-950/30">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium tracking-wide">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span>Studio Engine v2.4 Active</span>
            </span>

            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] font-medium">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{summary.organization}</span>
            </span>

            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-medium">
              <Users2 className="w-3 h-3 text-purple-400" />
              <span>{summary.teamName}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {getGreetingTime()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">{summary.userName}</span> 👋
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            You have <strong className="text-white font-semibold">{summary.totalProjects} active projects</strong> across your studio pipelines. <span className="text-indigo-300 font-medium">{summary.episodesInProduction} episodes</span> are currently in script and keyframe render.
          </p>
        </div>

        {/* Quick Launch & Metrics Group */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0 w-full sm:w-auto">
          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Clapperboard className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-400">Pipeline:</span>
              <span className="text-white font-mono font-bold">{summary.renderedScenesCount} Frames</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Roster:</span>
              <span className="text-white font-mono font-bold">{summary.characterRosterCount} Rigs</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenQuickCreate}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <span>+ Create Asset</span>
            </button>
            <button
              onClick={() => onTabChange('projects')}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-1 transition-all cursor-pointer"
            >
              <span>Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
