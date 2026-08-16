import React from 'react';
import { Cpu, Zap, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useAiUsageStats } from '../../hooks/useDashboardData';
import { WidgetSkeleton, WidgetError } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface AiUsageCardProps {
  onTabChange: (tab: StudioTab) => void;
}

export const AiUsageCard: React.FC<AiUsageCardProps> = ({ onTabChange }) => {
  const { data: usage, isLoading, isError, refetch } = useAiUsageStats();

  if (isLoading) return <WidgetSkeleton height="h-72" />;
  if (isError || !usage) return <WidgetError message="Failed to load AI usage metrics" onRetry={refetch} />;

  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const creditPercentage = Math.round((usage.remainingCredits / usage.maxCreditsQuota) * 100);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>AI Neural Telemetry</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                Gemini 1.5 Pro
              </span>
            </h3>
            <p className="text-xs text-slate-400">Token consumption & GPU inference credits</p>
          </div>
        </div>

        <button
          onClick={() => onTabChange('billing')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
        >
          <span>Manage Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono block">Requests Today</span>
          <p className="text-xl font-bold text-white font-mono">{usage.requestsToday.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 font-mono">+12.4% vs yesterday</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono block">Requests This Month</span>
          <p className="text-xl font-bold text-white font-mono">{usage.requestsThisMonth.toLocaleString()}</p>
          <p className="text-[10px] text-indigo-300 font-mono">3.8K successful runs</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono block">Tokens Used (Month)</span>
          <p className="text-xl font-bold text-purple-300 font-mono">{formatTokens(usage.tokensUsedThisMonth)}</p>
          <p className="text-[10px] text-slate-400 font-mono">Context window avg 92%</p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono block">Remaining Credits</span>
          <p className="text-xl font-bold text-emerald-400 font-mono">{usage.remainingCredits.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-mono">{creditPercentage}% of enterprise quota</p>
        </div>
      </div>

      {/* Credits Quota Progress Bar */}
      <div className="space-y-1.5 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>GPU Credit Balance</span>
          </span>
          <span className="text-slate-200">
            <strong className="text-white">{usage.remainingCredits.toLocaleString()}</strong> / {usage.maxCreditsQuota.toLocaleString()} Credits
          </span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${creditPercentage}%` }}
          />
        </div>
      </div>

      {/* Daily Trend & Model Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Daily Requests Sparkline / Bar Chart */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>7-Day Request Activity</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Inference Calls</span>
          </div>

          <div className="h-20 flex items-end justify-between gap-2 pt-2">
            {usage.dailyTrend.map((d, i) => {
              const maxReq = Math.max(...usage.dailyTrend.map(t => t.requests));
              const heightPercent = Math.round((d.requests / maxReq) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-slate-900 rounded-t-sm overflow-hidden h-16 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300 rounded-t-sm"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{d.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
          <span className="text-xs text-slate-300 font-bold block">Model Utilization Distribution</span>
          <div className="space-y-2">
            {usage.modelBreakdown.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span>{m.model}</span>
                  </span>
                  <span className="text-slate-400">{m.percentage}%</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${m.percentage}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
