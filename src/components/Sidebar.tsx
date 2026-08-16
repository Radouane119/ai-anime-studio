import React from 'react';
import { StudioTab } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Image as ImageIcon, 
  Film, 
  Mic, 
  Video, 
  Share2,
  Plus,
  User,
  Shield,
  Sliders
} from 'lucide-react';
import { PermissionGate } from './PermissionGate';

interface SidebarProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  onNewProject?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onNewProject }) => {
  const menuItems = [
    { id: 'dashboard' as StudioTab, label: 'Studio Overview', icon: LayoutDashboard },
    { id: 'manga' as StudioTab, label: 'Manga Editor', icon: ImageIcon },
    { id: 'anime' as StudioTab, label: 'Anime Engine', icon: Film },
    { id: 'characters' as StudioTab, label: 'Character Lab', icon: Users },
    { id: 'novel' as StudioTab, label: 'Script & Lore', icon: BookOpen },
    { id: 'voice' as StudioTab, label: 'Music & Voice', icon: Mic },
    { id: 'video' as StudioTab, label: 'Video Generator', icon: Video },
    { id: 'publish' as StudioTab, label: 'Publishing', icon: Share2 },
    { id: 'profile' as StudioTab, label: 'Creator Profile', icon: User },
    { id: 'rbac' as StudioTab, label: 'RBAC Security', icon: Shield },
    { id: 'settings' as StudioTab, label: 'Account Settings', icon: Sliders },
  ];

  return (
    <aside className="w-16 lg:w-64 bg-[#080808] border-r border-white/5 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 lg:p-4 space-y-6">
        {/* Top New Project Callout Button (Permission Guarded) */}
        {onNewProject && (
          <PermissionGate permission="project.create">
            <button
              onClick={onNewProject}
              className="w-full bg-white text-black text-xs font-bold py-2.5 rounded hover:bg-zinc-200 transition-colors uppercase tracking-widest hidden lg:flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </PermissionGate>
        )}

        <div>
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-3 hidden lg:block">
            Studios & Tools
          </label>
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 text-xs font-bold tracking-wider uppercase p-2.5 rounded transition-all cursor-pointer ${
                      isActive 
                        ? 'text-white bg-white/5 border border-white/10' 
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'opacity-70'}`} />
                    <span className="hidden lg:inline truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Quote / Status Footer Box */}
      <div className="p-4 border-t border-white/5 hidden lg:block">
        <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <p className="text-[11px] text-indigo-300 font-medium leading-relaxed italic">
            "Everything integrates seamlessly with neural story engines."
          </p>
        </div>
      </div>
    </aside>
  );
};

