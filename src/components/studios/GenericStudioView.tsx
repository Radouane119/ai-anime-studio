import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, Wand2, Plus, Download, Filter, RefreshCw } from 'lucide-react';
import { StudioTab } from '../../types';
import { useShellStore } from '../../store/useShellStore';

interface GenericStudioViewProps {
  tab: StudioTab;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  features: string[];
}

export const GenericStudioView: React.FC<GenericStudioViewProps> = ({
  tab,
  title,
  subtitle,
  icon,
  badge,
  features
}) => {
  const { setQuickCreateOpen, creditsRemaining } = useShellStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-slate-100">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shrink-0">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
                  {badge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase 7.1 Shell Ready</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-100 mt-1 tracking-tight">{title}</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setQuickCreateOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Asset</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative Background Mesh */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Feature Grid & Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xs">
              0{idx + 1}
            </div>
            <h3 className="text-sm font-bold text-slate-200">{feat}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully integrated into the Phase 7.1 Dashboard Shell layout container.
            </p>
            <div className="pt-2 flex items-center text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer gap-1">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Canvas Workspace Area */}
      <div className="min-h-[350px] rounded-3xl bg-slate-900/40 border border-slate-800/80 border-dashed p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-indigo-400">
          <Wand2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-200">{title} Workspace Active</h4>
          <p className="text-xs text-slate-400 max-w-md">
            This module is seamlessly mounted inside the unified AI Anime Studio application shell. Select an existing asset or click Create to begin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setQuickCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
