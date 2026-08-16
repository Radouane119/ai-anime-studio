import React from 'react';
import { ChevronRight, Home, Folder, Layers, Sparkles } from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';
import { StudioTab } from '../../types';

export const Breadcrumbs: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeWorkspace, 
    activeProjectName 
  } = useShellStore();

  const getTabLabel = (tab: StudioTab): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'projects': return 'Projects Workspace';
      case 'novel': return 'Novel Studio';
      case 'characters': return 'Character Studio';
      case 'world': return 'World Builder';
      case 'storyboard': return 'Cinematic Storyboard';
      case 'manga': return 'Manga Studio';
      case 'anime': return 'Animation Engine';
      case 'prompt': return 'Prompt Generator';
      case 'voice': return 'Voice & Dubbing';
      case 'music': return 'Soundtrack Engine';
      case 'video': return 'Video Editor';
      case 'assets': return 'Asset Library';
      case 'marketplace': return 'Marketplace';
      case 'community': return 'Creator Community';
      case 'analytics': return 'Production Analytics';
      case 'billing': return 'Billing & Credits';
      case 'settings': return 'Account Settings';
      case 'admin': return 'RBAC Security Admin';
      case 'profile': return 'Creator Profile';
      case 'publish': return 'Publishing Hub';
      default: return 'Studio Module';
    }
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
      {/* Root Workspace */}
      <button 
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-1 hover:text-indigo-300 transition-colors font-medium text-slate-300"
      >
        <Home className="w-3.5 h-3.5 text-indigo-400" />
        <span>{activeWorkspace.name}</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

      {/* Active Project */}
      <button 
        onClick={() => setActiveTab('projects')}
        className="flex items-center gap-1 hover:text-indigo-300 transition-colors text-slate-400"
      >
        <Folder className="w-3.5 h-3.5 text-slate-500" />
        <span className="truncate max-w-[140px]">{activeProjectName}</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

      {/* Active Tab Page */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span>{getTabLabel(activeTab)}</span>
      </div>
    </nav>
  );
};
