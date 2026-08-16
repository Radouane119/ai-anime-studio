import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  FolderPlus, 
  Users, 
  BookOpen, 
  Film, 
  Mic, 
  Palette, 
  Wand2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';
import { StudioTab } from '../../types';

export const QuickCreateModal: React.FC = () => {
  const { quickCreateOpen, setQuickCreateOpen, setActiveTab } = useShellStore();

  const options: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    tab: StudioTab;
    badge: string;
  }> = [
    {
      id: 'qc_project',
      title: 'New Anime Project',
      description: 'Initialize a full 4K anime series, film, or webtoon pipeline.',
      icon: <FolderPlus className="w-5 h-5 text-indigo-400" />,
      tab: 'projects',
      badge: 'Full Suite'
    },
    {
      id: 'qc_character',
      title: 'Anime Character Rig',
      description: 'Design 2D/3D character models, costumes, and voice profiles.',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      tab: 'characters',
      badge: 'Character Engine'
    },
    {
      id: 'qc_novel',
      title: 'Light Novel Chapter',
      description: 'Draft AI-assisted light novel chapters with illustration hooks.',
      icon: <BookOpen className="w-5 h-5 text-amber-400" />,
      tab: 'novel',
      badge: 'Writer Studio'
    },
    {
      id: 'qc_storyboard',
      title: 'Cinematic Storyboard',
      description: 'Compose scene sequences, camera angles, and shot timing.',
      icon: <Film className="w-5 h-5 text-rose-400" />,
      tab: 'storyboard',
      badge: 'Director Suite'
    },
    {
      id: 'qc_voice',
      title: 'AI Voice & Dubbing Track',
      description: 'Synthesize Japanese & English anime dubs with emotional pitch.',
      icon: <Mic className="w-5 h-5 text-sky-400" />,
      tab: 'voice',
      badge: 'Neural Audio'
    },
    {
      id: 'qc_manga',
      title: 'Manga Comic Page',
      description: 'Layout panel grids, screentones, and speech bubbles.',
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      tab: 'manga',
      badge: 'Comic Studio'
    },
    {
      id: 'qc_prompt',
      title: 'AI Prompt Template',
      description: 'Craft reproducible Gemini 1.5 Pro image & video prompts.',
      icon: <Wand2 className="w-5 h-5 text-indigo-400" />,
      tab: 'prompt',
      badge: 'Prompt Lab'
    }
  ];

  const handleSelect = (tab: StudioTab) => {
    setActiveTab(tab);
    setQuickCreateOpen(false);
  };

  return (
    <AnimatePresence>
      {quickCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickCreateOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 z-10 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Quick Create Asset</h3>
                  <p className="text-xs text-slate-400">Launch a new production element directly into its dedicated studio.</p>
                </div>
              </div>
              <button 
                onClick={() => setQuickCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Creation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt.tab)}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850/80 cursor-pointer transition-all group flex items-start justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors">
                      {opt.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {opt.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-medium">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">Ctrl + N</kbd> anytime to open Quick Create</span>
              <button 
                onClick={() => setQuickCreateOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
