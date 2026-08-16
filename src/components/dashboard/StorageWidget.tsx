import React from 'react';
import { HardDrive, Image as ImageIcon, Film, Music, FileText, ArrowUpRight } from 'lucide-react';
import { useStorageUsage } from '../../hooks/useDashboardData';
import { WidgetSkeleton, WidgetError } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface StorageWidgetProps {
  onTabChange: (tab: StudioTab) => void;
}

export const StorageWidget: React.FC<StorageWidgetProps> = ({ onTabChange }) => {
  const { data: storage, isLoading, isError, refetch } = useStorageUsage();

  if (isLoading) return <WidgetSkeleton height="h-56" />;
  if (isError || !storage) return <WidgetError message="Failed to load storage telemetry" onRetry={refetch} />;

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const usedGb = (storage.totalStorageBytes / (1024 * 1024 * 1024)).toFixed(1);
  const quotaGb = (storage.maxStorageQuotaBytes / (1024 * 1024 * 1024)).toFixed(0);
  const usedPercent = Math.round((storage.totalStorageBytes / storage.maxStorageQuotaBytes) * 100);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Images':
        return <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Videos':
        return <Film className="w-3.5 h-3.5 text-purple-400" />;
      case 'Audio':
        return <Music className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Cloud Asset Vault Storage
          </h3>
        </div>

        <button
          onClick={() => onTabChange('assets')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
        >
          <span>Asset Vault</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Storage Meter Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">
            <strong className="text-white text-sm">{usedGb} GB</strong> used of {quotaGb} GB Enterprise Quota
          </span>
          <span className="text-purple-300 font-bold">{usedPercent}% Used</span>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          {storage.breakdown.map((cat, i) => (
            <div
              key={i}
              className="h-full transition-all duration-500"
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
              }}
              title={`${cat.category}: ${formatBytes(cat.bytes)} (${cat.percentage}%)`}
            />
          ))}
        </div>

        {/* Legend Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {storage.breakdown.map((item, i) => (
            <div key={i} className="flex items-center space-x-2 bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
              {getCategoryIcon(item.category)}
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-mono block truncate">{item.category}</span>
                <span className="text-xs font-bold text-slate-200 font-mono">{formatBytes(item.bytes)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
