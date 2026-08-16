import React from 'react';
import { 
  Users, 
  Sparkles, 
  Plus, 
  Mic, 
  Layers, 
  ShieldAlert, 
  Swords, 
  BookOpen 
} from 'lucide-react';

export type CharacterStudioSubTab = 'roster' | 'expressions' | 'voice' | 'stats';

interface CharacterStudioHeaderProps {
  activeSubTab: CharacterStudioSubTab;
  onSubTabChange: (tab: CharacterStudioSubTab) => void;
  onOpenAiGenerator: () => void;
  onOpenCreateCharacter: () => void;
}

export const CharacterStudioHeader: React.FC<CharacterStudioHeaderProps> = ({
  activeSubTab,
  onSubTabChange,
  onOpenAiGenerator,
  onOpenCreateCharacter
}) => {
  const tabs = [
    { id: 'roster', label: 'Character Roster', icon: Users },
    { id: 'expressions', label: 'Expression Sheets Grid', icon: Layers },
    { id: 'voice', label: 'TTS Voice Dubbing Rig', icon: Mic },
    { id: 'stats', label: 'Power & Stats Radar', icon: Swords },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Character Studio & Voice Dubbing Rig</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Anime Rig v7.5
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Design characters, generate multi-angle expression sheets, assign voice models, and synthesize dubbed dialogue lines.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenAiGenerator}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Gemini Character Generator</span>
          </button>

          <button
            onClick={onOpenCreateCharacter}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Character</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-2 shadow-md backdrop-blur-sm overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSubTabChange(tab.id as CharacterStudioSubTab)}
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
