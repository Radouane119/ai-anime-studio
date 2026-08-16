import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
  Shield, 
  Pin, 
  Star, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  X,
  Share2,
  User
} from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';
import { StudioTab, PinnedItem } from '../../types';

interface NavItem {
  id: StudioTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const ResponsiveSidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    pinnedItems,
    recentItems,
    toggleFavoriteItem
  } = useShellStore();

  const sections: NavSection[] = [
    {
      title: 'Main Navigation',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" />, badge: 'Core' }
      ]
    },
    {
      title: 'Creation Studios',
      items: [
        { id: 'novel', label: 'Novel Studio', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'characters', label: 'Character Studio', icon: <Users className="w-4 h-4" /> },
        { id: 'world', label: 'World Builder', icon: <Globe className="w-4 h-4" /> },
        { id: 'storyboard', label: 'Storyboard', icon: <Film className="w-4 h-4" /> },
        { id: 'manga', label: 'Manga Studio', icon: <Palette className="w-4 h-4" /> },
        { id: 'anime', label: 'Animation Studio', icon: <Video className="w-4 h-4" />, badge: '4K AI' },
        { id: 'prompt', label: 'Prompt Generator', icon: <Wand2 className="w-4 h-4" /> },
        { id: 'voice', label: 'Voice Studio', icon: <Mic className="w-4 h-4" /> },
        { id: 'music', label: 'Music Studio', icon: <Music className="w-4 h-4" /> },
        { id: 'video', label: 'Video Editor', icon: <Clapperboard className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Assets & Guild',
      items: [
        { id: 'assets', label: 'Asset Library', icon: <Package className="w-4 h-4" /> },
        { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
        { id: 'community', label: 'Community', icon: <MessageSquare className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Analytics & Management',
      items: [
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'billing', label: 'Billing & Credits', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
        { id: 'admin', label: 'RBAC Security Admin', icon: <Shield className="w-4 h-4" />, badge: 'Admin' },
        { id: 'publish', label: 'Publishing', icon: <Share2 className="w-4 h-4" /> },
        { id: 'profile', label: 'Creator Profile', icon: <User className="w-4 h-4" /> }
      ]
    }
  ];

  const renderSidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
        <div 
          onClick={() => { setActiveTab('dashboard'); if (isMobile) setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400 font-bold">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <div>
              <h1 className="text-sm font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
                AI ANIME STUDIO
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v7.1
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Next-Gen Production Engine</p>
            </div>
          )}
        </div>

        {isMobile && (
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {(!sidebarCollapsed || isMobile) && (
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) setMobileMenuOpen(false);
                  }}
                  title={sidebarCollapsed && !isMobile ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </div>
                    {(!sidebarCollapsed || isMobile) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {(!sidebarCollapsed || isMobile) && item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Pinned & Favorites Section */}
        {(!sidebarCollapsed || isMobile) && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Pin className="w-3 h-3 text-indigo-400" />
                Pinned & Favorites
              </span>
              <span className="text-[10px] text-slate-400 font-normal">{pinnedItems.length}</span>
            </div>

            <div className="space-y-1">
              {pinnedItems.map((pin) => (
                <div
                  key={pin.id}
                  onClick={() => {
                    setActiveTab(pin.tab);
                    if (isMobile) setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-900 cursor-pointer group"
                >
                  <span className="truncate max-w-[140px] text-[11px]">{pin.title}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteItem(pin.id);
                    }}
                    className="text-slate-600 group-hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-3.5 h-3.5 ${pin.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Opened Section */}
        {(!sidebarCollapsed || isMobile) && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              Recently Opened
            </div>

            <div className="space-y-1">
              {recentItems.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setActiveTab(rec.tab);
                    if (isMobile) setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-900 cursor-pointer truncate"
                >
                  {rec.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Pro Badge */}
      {(!sidebarCollapsed || isMobile) && (
        <div className="p-3 border-t border-slate-800/80 shrink-0">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Studio Pro License</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Gemini 1.5 Pro & Imagen 3 models active with unlimited 4K renders.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside 
        className={`hidden lg:block h-screen sticky top-0 shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-full"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
