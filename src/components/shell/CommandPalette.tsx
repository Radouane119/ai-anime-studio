import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  LayoutDashboard, 
  FolderKanban, 
  BookOpen, 
  Users, 
  Globe, 
  Film, 
  Palette, 
  Video, 
  Wand2, 
  Mic, 
  Music, 
  Clapperboard, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Key, 
  ArrowRight,
  Command,
  X
} from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';
import { StudioTab, CommandPaletteItem } from '../../types';

export const CommandPalette: React.FC = () => {
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    setActiveTab, 
    setQuickCreateOpen,
    setKeyboardShortcutsOpen,
    activeProjectName
  } = useShellStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K or Cmd+K key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const allItems: CommandPaletteItem[] = [
    // Navigation
    { id: 'nav_dash', title: 'Dashboard Shell Overview', category: 'Navigation', icon: 'LayoutDashboard', tab: 'dashboard', shortcut: 'G D' },
    { id: 'nav_proj', title: 'Projects Workspace', category: 'Navigation', icon: 'FolderKanban', tab: 'projects', shortcut: 'G P' },
    { id: 'nav_novel', title: 'AI Light Novel Studio', category: 'Navigation', icon: 'BookOpen', tab: 'novel', shortcut: 'G N' },
    { id: 'nav_char', title: 'Anime Character Studio', category: 'Navigation', icon: 'Users', tab: 'characters', shortcut: 'G C' },
    { id: 'nav_world', title: 'World Builder & Lore DB', category: 'Navigation', icon: 'Globe', tab: 'world', shortcut: 'G W' },
    { id: 'nav_sb', title: 'Cinematic Storyboard Engine', category: 'Navigation', icon: 'Film', tab: 'storyboard', shortcut: 'G S' },
    { id: 'nav_manga', title: 'Manga & Comic Studio', category: 'Navigation', icon: 'Palette', tab: 'manga', shortcut: 'G M' },
    { id: 'nav_anime', title: '4K Anime Video Generator', category: 'Navigation', icon: 'Video', tab: 'anime', shortcut: 'G A' },
    { id: 'nav_prompt', title: 'Prompt Engineering Lab', category: 'Navigation', icon: 'Wand2', tab: 'prompt', shortcut: 'G R' },
    { id: 'nav_voice', title: 'AI Voice & Dubbing Studio', category: 'Navigation', icon: 'Mic', tab: 'voice', shortcut: 'G V' },
    { id: 'nav_music', title: 'Soundtrack & BGM Engine', category: 'Navigation', icon: 'Music', tab: 'music', shortcut: 'G U' },
    { id: 'nav_video', title: 'Non-Linear Video Editor', category: 'Navigation', icon: 'Clapperboard', tab: 'video', shortcut: 'G E' },
    { id: 'nav_assets', title: 'Global Asset Library', category: 'Navigation', icon: 'Package', tab: 'assets', shortcut: 'G L' },
    { id: 'nav_market', title: 'Prompt & Rig Marketplace', category: 'Navigation', icon: 'ShoppingBag', tab: 'marketplace', shortcut: 'G K' },
    { id: 'nav_comm', title: 'Creator Guild & Community', category: 'Navigation', icon: 'MessageSquare', tab: 'community', shortcut: 'G O' },
    { id: 'nav_analytics', title: 'Production Analytics', category: 'Navigation', icon: 'BarChart3', tab: 'analytics', shortcut: 'G Y' },
    { id: 'nav_billing', title: 'Credits & Billing Hub', category: 'Navigation', icon: 'CreditCard', tab: 'billing', shortcut: 'G B' },
    { id: 'nav_settings', title: 'Account & Security Settings', category: 'Navigation', icon: 'Settings', tab: 'settings', shortcut: 'G S' },
    { id: 'nav_admin', title: 'RBAC Security & Admin Console', category: 'Navigation', icon: 'ShieldCheck', tab: 'admin', shortcut: 'G Z' },

    // Projects
    { id: 'proj_01', title: activeProjectName, subtitle: 'Active Anime Series Project', category: 'Projects', icon: 'FolderKanban', tab: 'anime' },
    { id: 'proj_02', title: 'Shadows of Neo Tokyo', subtitle: 'Light Novel & Storyboard', category: 'Projects', icon: 'BookOpen', tab: 'novel' },
    { id: 'proj_03', title: 'Chrono Rift Manga Series', subtitle: 'Manga Studio Asset', category: 'Projects', icon: 'Palette', tab: 'manga' },

    // Characters
    { id: 'char_01', title: 'Ren Sato (Cyberpunk Protagonist)', subtitle: '3D Rig & Voice Preset Attached', category: 'Characters', icon: 'Users', tab: 'characters' },
    { id: 'char_02', title: 'Katsuro (Antagonist Shinobi)', subtitle: 'Neural Voice JP-02 Active', category: 'Characters', icon: 'Users', tab: 'characters' },
    { id: 'char_03', title: 'Aoi (Mecha Pilot Lead)', subtitle: 'Cyberpunk Concept Art Set', category: 'Characters', icon: 'Users', tab: 'characters' },

    // Quick Actions
    { id: 'act_create', title: 'Quick Create New Asset / Project', category: 'Quick Actions', shortcut: 'Ctrl + N', icon: 'Plus', action: () => setQuickCreateOpen(true) },
    { id: 'act_keys', title: 'View Keyboard Shortcuts Cheat Sheet', category: 'Quick Actions', shortcut: '?', icon: 'Command', action: () => setKeyboardShortcutsOpen(true) },
  ];

  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    }
  };

  const executeItem = (item: CommandPaletteItem) => {
    if (item.action) {
      item.action();
    } else if (item.tab) {
      setActiveTab(item.tab);
    }
    setCommandPaletteOpen(false);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className="w-4 h-4" />;
      case 'FolderKanban': return <FolderKanban className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'Film': return <Film className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Wand2': return <Wand2 className="w-4 h-4" />;
      case 'Mic': return <Mic className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'Clapperboard': return <Clapperboard className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4" />;
      case 'Settings': return <Settings className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Plus': return <Plus className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
          >
            {/* Search Bar Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
              <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
              <input 
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownInInput}
                placeholder="Type a command or search pages, projects, characters..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button 
                onClick={() => setCommandPaletteOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No matching commands, projects, or studio pages found for "{searchQuery}".
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/40' 
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                          {renderIcon(item.icon)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {item.shortcut && (
                          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-400">
                            {item.shortcut}
                          </kbd>
                        )}
                        <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Key Hints */}
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">ESC</kbd>
                  Close
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Command className="w-3 h-3 text-indigo-400" />
                <span>AI Studio Command Engine v7.1</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
