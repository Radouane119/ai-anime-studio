import React from 'react';
import { Sparkles, Plus, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-4 max-w-lg mx-auto my-8">
      <div className="p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
