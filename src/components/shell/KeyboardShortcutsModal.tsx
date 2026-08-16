import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, X, Keyboard, Sparkles } from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';

export const KeyboardShortcutsModal: React.FC = () => {
  const { keyboardShortcutsOpen, setKeyboardShortcutsOpen } = useShellStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setKeyboardShortcutsOpen(!keyboardShortcutsOpen);
      }
      if (e.key === 'Escape' && keyboardShortcutsOpen) {
        setKeyboardShortcutsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcutsOpen, setKeyboardShortcutsOpen]);

  const shortcutsList = [
    {
      category: 'Global Shell Commands',
      items: [
        { label: 'Open Command Palette & Search', shortcut: 'Ctrl + K  /  ⌘ + K' },
        { label: 'Toggle Sidebar Collapse', shortcut: 'Ctrl + B  /  ⌘ + B' },
        { label: 'Quick Create New Asset / Project', shortcut: 'Ctrl + N' },
        { label: 'Open Keyboard Shortcuts Guide', shortcut: '?' },
        { label: 'Close Active Modal or Drawer', shortcut: 'Esc' },
      ]
    },
    {
      category: 'Studio Navigation Shortcuts (G then Key)',
      items: [
        { label: 'Go to Dashboard Shell', shortcut: 'G D' },
        { label: 'Go to Projects Workspace', shortcut: 'G P' },
        { label: 'Go to Character Studio', shortcut: 'G C' },
        { label: 'Go to Light Novel Studio', shortcut: 'G N' },
        { label: 'Go to Cinematic Storyboard', shortcut: 'G S' },
        { label: 'Go to Manga Studio', shortcut: 'G M' },
        { label: 'Go to 4K Anime Video Studio', shortcut: 'G A' },
        { label: 'Go to Voice & Dubbing Studio', shortcut: 'G V' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {keyboardShortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setKeyboardShortcutsOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 z-10 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Keyboard Shortcuts Cheat Sheet</h3>
                  <p className="text-xs text-slate-400">Navigate AI Anime Studio with professional speed.</p>
                </div>
              </div>
              <button 
                onClick={() => setKeyboardShortcutsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts Content */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {shortcutsList.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider">
                    {group.category}
                  </h4>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2 divide-y divide-slate-800/50">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center justify-between py-2 px-3 text-xs">
                        <span className="text-slate-300">{item.label}</span>
                        <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-indigo-300 font-semibold shadow-sm">
                          {item.shortcut}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full screen accessibility support enabled</span>
              </div>
              <button 
                onClick={() => setKeyboardShortcutsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
