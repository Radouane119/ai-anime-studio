import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Users2, 
  ChevronDown, 
  Check, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';

export const WorkspaceSelector: React.FC = () => {
  const { 
    activeWorkspace, 
    setActiveWorkspace, 
    workspaces,
    activeOrganization,
    setActiveOrganization,
    organizations,
    activeTeam,
    setActiveTeam,
    teams
  } = useShellStore();

  const [openDropdown, setOpenDropdown] = useState<'workspace' | 'org' | 'team' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {/* Workspace Switcher */}
      <button 
        onClick={() => setOpenDropdown(openDropdown === 'workspace' ? null : 'workspace')}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-xs"
      >
        <div className="w-5 h-5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-[10px]">
          {activeWorkspace.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-semibold text-slate-200 leading-none truncate max-w-[120px]">
            {activeWorkspace.name}
          </div>
          <div className="text-[10px] text-indigo-400 font-medium">
            {activeWorkspace.plan}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Workspace Dropdown */}
      {openDropdown === 'workspace' && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
            Switch Workspace
          </div>
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => {
                setActiveWorkspace(ws);
                setOpenDropdown(null);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                ws.id === activeWorkspace.id ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="font-medium text-slate-200">{ws.name}</div>
                <div className="text-[10px] text-slate-400">{ws.plan} • {ws.role}</div>
              </div>
              {ws.id === activeWorkspace.id && <Check className="w-4 h-4 text-indigo-400" />}
            </div>
          ))}
          <div className="pt-1 border-t border-slate-800/80">
            <button className="w-full text-left px-3 py-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Create New Workspace
            </button>
          </div>
        </div>
      )}

      {/* Team Switcher */}
      <button 
        onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-xs text-slate-300"
      >
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span className="truncate max-w-[110px]">{activeTeam.name}</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {/* Team Dropdown */}
      {openDropdown === 'team' && (
        <div className="absolute top-full left-28 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
            Switch Production Team
          </div>
          {teams.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setActiveTeam(t);
                setOpenDropdown(null);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                t.id === activeTeam.id ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="font-medium text-slate-200">{t.name}</div>
                <div className="text-[10px] text-slate-400">{t.department}</div>
              </div>
              {t.id === activeTeam.id && <Check className="w-4 h-4 text-indigo-400" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
