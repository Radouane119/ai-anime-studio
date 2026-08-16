import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse p-6">
      <div className="h-8 bg-slate-800/80 rounded-2xl w-1/3" />
      <div className="h-4 bg-slate-800/60 rounded-xl w-1/2" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-40 bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 space-y-3">
            <div className="h-5 bg-slate-800 rounded-xl w-2/3" />
            <div className="h-3 bg-slate-800/60 rounded-lg w-full" />
            <div className="h-3 bg-slate-800/60 rounded-lg w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
};
