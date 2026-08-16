import React from 'react';
import { Lightbulb, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import { useDashboardTips } from '../../hooks/useDashboardData';
import { WidgetSkeleton } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface TipsAndUpdatesPanelProps {
  onTabChange: (tab: StudioTab) => void;
}

export const TipsAndUpdatesPanel: React.FC<TipsAndUpdatesPanelProps> = ({ onTabChange }) => {
  const { data: tips, isLoading } = useDashboardTips();

  if (isLoading) return <WidgetSkeleton height="h-64" />;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Feature Announcements & Pro Tips
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          v2.4.0 Release
        </span>
      </div>

      <div className="space-y-3">
        {tips?.map((tip) => (
          <div
            key={tip.id}
            className="group bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-xl p-3.5 space-y-2 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                {tip.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-500">{tip.date}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-200 transition-colors">
                {tip.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{tip.description}</p>
            </div>

            {tip.actionTab && (
              <button
                onClick={() => onTabChange(tip.actionTab!)}
                className="pt-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>Try Feature in Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
