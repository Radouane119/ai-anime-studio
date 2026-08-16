import React from 'react';
import { Sparkles, Command, ShieldCheck, Keyboard, ExternalLink } from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';

export const Footer: React.FC = () => {
  const { setCommandPaletteOpen, setKeyboardShortcutsOpen } = useShellStore();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
      {/* System Operational Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">AI Engine Cluster: Operational</span>
        </div>
        <span className="hidden sm:inline text-slate-700">|</span>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Clerk Auth & RBAC Guard Active</span>
        </div>
      </div>

      {/* Keyboard Shortcuts Trigger Hints */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Command className="w-3 h-3 text-indigo-400" />
          <span className="text-[11px]">Cmd + K Search</span>
        </button>

        <button 
          onClick={() => setKeyboardShortcutsOpen(true)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Keyboard className="w-3 h-3 text-indigo-400" />
          <span className="text-[11px]">? Shortcuts</span>
        </button>

        <span className="text-slate-700">|</span>

        <span className="text-[11px] font-mono text-slate-500">
          AI Anime Studio v7.1.0-shell
        </span>
      </div>
    </footer>
  );
};
