import React from 'react';
import { 
  FolderPlus, 
  BookPlus, 
  UserPlus, 
  Globe2, 
  UploadCloud, 
  Sparkles,
  ChevronRight 
} from 'lucide-react';
import { StudioTab } from '../../types';

interface QuickActionsWidgetProps {
  onTabChange: (tab: StudioTab) => void;
  onOpenQuickCreate: () => void;
  onOpenNewProject: () => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  onTabChange,
  onOpenQuickCreate,
  onOpenNewProject
}) => {
  const actions = [
    {
      id: 'new_project',
      label: 'New Project',
      subtitle: 'Anime, Manga or Novel',
      icon: FolderPlus,
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30 hover:border-indigo-500/60',
      badge: 'Core',
      onClick: onOpenNewProject
    },
    {
      id: 'new_story',
      label: 'New Story',
      subtitle: 'Light Novel & Script',
      icon: BookPlus,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30 hover:border-purple-500/60',
      badge: 'AI Script',
      onClick: () => onTabChange('novel')
    },
    {
      id: 'new_character',
      label: 'New Character',
      subtitle: '2D/3D Rig & Lorebook',
      icon: UserPlus,
      color: 'from-pink-500/20 to-pink-600/10 text-pink-400 border-pink-500/30 hover:border-pink-500/60',
      badge: 'Rigging',
      onClick: () => onTabChange('characters')
    },
    {
      id: 'new_world',
      label: 'New World',
      subtitle: 'Factions, Lore & Maps',
      icon: Globe2,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60',
      badge: 'Lore DB',
      onClick: () => onTabChange('world')
    },
    {
      id: 'import_project',
      label: 'Import Project',
      subtitle: 'Zip, Photoshop, Figma',
      icon: UploadCloud,
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60',
      badge: 'PSD / 3D',
      onClick: onOpenQuickCreate
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Studio Quick Actions
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">5 Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`group relative flex flex-col justify-between p-3.5 rounded-xl border bg-gradient-to-br ${act.color} text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-950/60 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-950/70 border border-white/10 text-slate-300">
                  {act.badge}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors flex items-center justify-between">
                  <span>{act.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-300" />
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{act.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
