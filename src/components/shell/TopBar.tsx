import React, { useState, useRef, useEffect } from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Search, 
  Plus, 
  Bell, 
  Coins, 
  Sparkles, 
  Sun, 
  Moon, 
  User, 
  Sliders, 
  Shield, 
  LogOut, 
  ChevronDown,
  Activity,
  Menu
} from 'lucide-react';
import { useShellStore } from '../../store/useShellStore';
import { WorkspaceSelector } from './WorkspaceSelector';
import { Breadcrumbs } from './Breadcrumbs';

export const TopBar: React.FC = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    setMobileMenuOpen,
    setCommandPaletteOpen, 
    setQuickCreateOpen, 
    setNotificationsDrawerOpen,
    notifications,
    creditsRemaining,
    aiProviderStatus,
    theme,
    setTheme,
    setActiveTab
  } = useShellStore();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between gap-3">
      {/* Left Section: Sidebar Toggle, Mobile Menu, Workspace Selector, Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-900 transition-colors"
          title="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-900 transition-colors"
          title="Toggle Sidebar (Cmd+B)"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>

        {/* Workspace Switcher */}
        <WorkspaceSelector />

        <div className="hidden sm:block h-5 w-px bg-slate-800 shrink-0" />

        {/* Breadcrumb Navigation */}
        <div className="hidden lg:block min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Section: Global Search, Credits, AI Status, Quick Create, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Global Search Button */}
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Search or Command...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Credits Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{creditsRemaining.toLocaleString()} Credits</span>
        </div>

        {/* AI Provider Operational Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="truncate">{aiProviderStatus.provider} ({aiProviderStatus.latencyMs}ms)</span>
        </div>

        {/* Quick Create Button */}
        <button 
          onClick={() => setQuickCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notifications Button */}
        <button 
          onClick={() => setNotificationsDrawerOpen(true)}
          className="relative p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-900 transition-colors"
          title="Studio Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-900 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Profile Avatar Dropdown */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-white text-xs shadow-md">
              KS
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="font-bold text-slate-100">Kenji Sato</div>
                <div className="text-[11px] text-slate-400">creator@studio-ai.anime</div>
                <div className="mt-1 inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] rounded-md">
                  Executive Showrunner
                </div>
              </div>

              <button 
                onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                Creator Profile
              </button>

              <button 
                onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Sliders className="w-4 h-4 text-indigo-400" />
                Account Settings
              </button>

              <button 
                onClick={() => { setActiveTab('admin'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                RBAC Admin Console
              </button>

              <div className="pt-1 border-t border-slate-800">
                <button 
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
