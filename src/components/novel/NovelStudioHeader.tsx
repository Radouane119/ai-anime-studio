import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  FileText, 
  Image, 
  MessageSquare, 
  Layers 
} from 'lucide-react';

export type NovelStudioSubTab = 'editor' | 'scene_breakdown' | 'illustrations' | 'outline';

interface NovelStudioHeaderProps {
  activeSubTab: NovelStudioSubTab;
  onSubTabChange: (tab: NovelStudioSubTab) => void;
  onOpenAiGenerator: () => void;
  onOpenCreateChapter: () => void;
}

export const NovelStudioHeader: React.FC<NovelStudioHeaderProps> = ({
  activeSubTab,
  onSubTabChange,
  onOpenAiGenerator,
  onOpenCreateChapter
}) => {
  const tabs = [
    { id: 'editor', label: 'Chapter Script Editor', icon: FileText },
    { id: 'scene_breakdown', label: 'Dialogue Scene Breakdown', icon: MessageSquare },
    { id: 'illustrations', label: 'Illustration Anchor Spreads', icon: Image },
    { id: 'outline', label: 'Chapter Volume Outline', icon: Layers },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span>Light Novel AI Scriptwriter Studio</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
              Script Engine v7.6
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author Japanese Light Novel scripts, tag dialogue nodes, insert key visual illustration anchors, and generate volume outlines with Gemini 1.5 Pro.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenAiGenerator}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Gemini Chapter Writer</span>
          </button>

          <button
            onClick={onOpenCreateChapter}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chapter Draft</span>
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
              onClick={() => onSubTabChange(tab.id as NovelStudioSubTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
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
