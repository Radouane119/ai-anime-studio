import React from 'react';

interface WidgetSkeletonProps {
  height?: string;
  className?: string;
}

export const WidgetSkeleton: React.FC<WidgetSkeletonProps> = ({ height = 'h-48', className = '' }) => {
  return (
    <div className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 animate-pulse ${height} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-12" />
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-800/60 rounded w-full" />
        <div className="h-3 bg-slate-800/60 rounded w-4/5" />
        <div className="h-3 bg-slate-800/60 rounded w-2/3" />
      </div>
    </div>
  );
};

export const WidgetError: React.FC<{ message?: string; onRetry?: () => void }> = ({ 
  message = 'Failed to load widget data', 
  onRetry 
}) => {
  return (
    <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 py-8">
      <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
        !
      </div>
      <p className="text-xs text-rose-300 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Retry Load
        </button>
      )}
    </div>
  );
};
