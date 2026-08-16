import React from 'react';
import { Project, StudioTab } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Clapperboard, 
  Plus, 
  Download, 
  Layers, 
  ChevronDown,
  User,
  Shield,
  Sliders,
  LogOut,
  Building2,
  Key
} from 'lucide-react';

interface NavbarProps {
  currentProject: Project;
  projects: Project[];
  onSelectProject: (proj: Project) => void;
  onNewProject: () => void;
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProject,
  activeTab,
  onTabChange,
  onOpenExport
}) => {
  const { user, openAuthModal, signOut } = useAuth();

  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a] px-4 lg:px-6 flex items-center justify-between shrink-0 select-none z-40">
      {/* Brand & Project Selector */}
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight uppercase leading-none text-white">AI Anime Studio</h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-0.5 hidden sm:block">
              Create. Animate. Publish.
            </p>
          </div>
        </div>

        <div className="h-5 w-px bg-white/10 hidden md:block" />

        {/* Project Switcher Dropdown */}
        <div className="relative group hidden sm:block">
          <div className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-zinc-200 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer transition-all">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <div className="text-left max-w-[160px] truncate">
              <p className="text-xs font-bold text-white truncate">{currentProject.title}</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{currentProject.genre.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </div>

          {/* Project List Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
            <div className="px-3 py-1.5 border-b border-white/10 text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              Switch Project ({projects.length})
            </div>
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors ${
                  proj.id === currentProject.id ? 'bg-indigo-900/30 text-indigo-300 font-semibold' : 'text-zinc-300'
                }`}
              >
                <div className="truncate">
                  <p className="text-xs truncate font-medium">{proj.title}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{proj.format.replace('_', ' ')}</p>
                </div>
                {proj.id === currentProject.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            ))}
            <div className="p-1 border-t border-white/10">
              <button
                onClick={onNewProject}
                className="w-full flex items-center justify-center space-x-1.5 text-xs font-bold text-white uppercase tracking-widest bg-white/5 hover:bg-white/10 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Create New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls & User Auth Badge */}
      <div className="flex items-center space-x-3">
        {/* Token Availability Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">1,240 Tokens</span>
        </div>

        <button
          onClick={onNewProject}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors uppercase tracking-widest hidden sm:flex items-center space-x-1 border border-white/10"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>New</span>
        </button>

        <button
          onClick={onOpenExport}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 flex items-center space-x-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* User Profile / Auth Button */}
        {user ? (
          <div className="relative group">
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 transition-all text-xs"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full border border-indigo-400" />
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">{user.name.split(' ')[0]}</p>
                <p className="text-[9px] text-indigo-400 font-mono font-semibold uppercase">{user.role}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            <div className="absolute top-full right-0 mt-1 w-56 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
              <div className="p-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">{user.organizationName}</span>
                </div>
              </div>
              
              <button
                onClick={() => onTabChange('profile')}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl flex items-center gap-2 transition-colors mt-1"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Creator Profile
              </button>

              <button
                onClick={() => onTabChange('rbac')}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl flex items-center gap-2 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                RBAC Governance & Roles
              </button>

              <button
                onClick={() => onTabChange('settings')}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl flex items-center gap-2 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Account Settings & Security
              </button>

              <button
                onClick={openAuthModal}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl flex items-center gap-2 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Session & Permissions
              </button>

              <button
                onClick={signOut}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-colors mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/30"
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};


