import React from 'react';
import { 
  Globe, 
  ShieldAlert, 
  BookOpen, 
  History, 
  Sparkles, 
  Plus, 
  Compass, 
  MapPin, 
  Users 
} from 'lucide-react';

export type WorldSubTab = 'map' | 'factions' | 'codex' | 'timeline';

interface WorldBuilderHeaderProps {
  activeSubTab: WorldSubTab;
  onSubTabChange: (tab: WorldSubTab) => void;
  onOpenAiGenerator: () => void;
  onOpenCreateEntity: (type: 'faction' | 'lore' | 'location' | 'event') => void;
}

export const WorldBuilderHeader: React.FC<WorldBuilderHeaderProps> = ({
  activeSubTab,
  onSubTabChange,
  onOpenAiGenerator,
  onOpenCreateEntity
}) => {
  const tabs = [
    { id: 'map', label: 'Interactive World Map', icon: MapPin },
    { id: 'factions', label: 'Faction Hierarchy Rigs', icon: Users },
    { id: 'codex', label: 'Lore & Magic Systems', icon: BookOpen },
    { id: 'timeline', label: 'History Timeline', icon: History },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2.5">
            <Globe className="w-6 h-6 text-indigo-400" />
            <span>World Builder & Lore Database</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Anime Lore Studio
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Design interactive maps, magic system rules, faction relationship matrices, and chronological histories.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenAiGenerator}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Gemini Lore Generator</span>
          </button>

          <button
            onClick={() => {
              if (activeSubTab === 'factions') onOpenCreateEntity('faction');
              else if (activeSubTab === 'map') onOpenCreateEntity('location');
              else if (activeSubTab === 'timeline') onOpenCreateEntity('event');
              else onOpenCreateEntity('lore');
            }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeSubTab === 'factions' ? 'New Faction' : activeSubTab === 'map' ? 'New Location' : activeSubTab === 'timeline' ? 'New Historical Event' : 'New Lore Entry'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-2 shadow-md backdrop-blur-sm overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSubTabChange(tab.id as WorldSubTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
