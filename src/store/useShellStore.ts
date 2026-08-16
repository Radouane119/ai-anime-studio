import { create } from 'zustand';
import { 
  StudioTab, 
  WorkspaceItem, 
  OrganizationItem, 
  TeamItem, 
  PinnedItem, 
  AiProviderStatus, 
  StudioNotification 
} from '../types';

interface ShellState {
  // Navigation & Sidebar
  activeTab: StudioTab;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  
  // Workspace & Switchers
  activeWorkspace: WorkspaceItem;
  activeOrganization: OrganizationItem;
  activeTeam: TeamItem;
  activeProjectName: string;
  
  workspaces: WorkspaceItem[];
  organizations: OrganizationItem[];
  teams: TeamItem[];
  
  // Pinned & Favorites
  pinnedItems: PinnedItem[];
  recentItems: PinnedItem[];
  
  // System Metrics & Status
  creditsRemaining: number;
  aiProviderStatus: AiProviderStatus;
  notifications: StudioNotification[];
  
  // Modals & Drawers
  commandPaletteOpen: boolean;
  quickCreateOpen: boolean;
  keyboardShortcutsOpen: boolean;
  notificationsDrawerOpen: boolean;
  
  // Theme
  theme: 'dark' | 'light' | 'system';
  
  // Actions
  setActiveTab: (tab: StudioTab) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  setActiveWorkspace: (workspace: WorkspaceItem) => void;
  setActiveOrganization: (org: OrganizationItem) => void;
  setActiveTeam: (team: TeamItem) => void;
  setActiveProjectName: (name: string) => void;
  
  togglePinItem: (item: PinnedItem) => void;
  toggleFavoriteItem: (itemId: string) => void;
  
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickCreateOpen: (open: boolean) => void;
  setKeyboardShortcutsOpen: (open: boolean) => void;
  setNotificationsDrawerOpen: (open: boolean) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  deductCredits: (amount: number) => void;
}

const INITIAL_WORKSPACES: WorkspaceItem[] = [
  { id: 'ws_prod_01', name: 'Studio AI Production', slug: 'studio-ai-prod', plan: 'Enterprise Studio', role: 'Owner' },
  { id: 'ws_labs_02', name: 'Kyoto Anime Labs', slug: 'kyoto-anime-labs', plan: 'Pro Creator', role: 'Admin' },
  { id: 'ws_union_03', name: 'Indie Anime Creators Union', slug: 'indie-anime-union', plan: 'Free Tier', role: 'Member' },
];

const INITIAL_ORGS: OrganizationItem[] = [
  { id: 'org_01', name: 'Cyberpunk Animation Alliance', membersCount: 128 },
  { id: 'org_02', name: 'Studio Trigger Guild', membersCount: 42 },
  { id: 'org_03', name: 'Global Manga Syndicate', membersCount: 310 },
];

const INITIAL_TEAMS: TeamItem[] = [
  { id: 'team_01', name: 'Lead Directors & Showrunners', department: 'Executive', iconName: 'Crown' },
  { id: 'team_02', name: 'Key Animation & Rigging Unit', department: 'Production', iconName: 'Layers' },
  { id: 'team_03', name: 'AI Voice & Audio Dubbing Ops', department: 'Post-Production', iconName: 'Mic' },
  { id: 'team_04', name: 'World Building & Scriptwriters', department: 'Creative', iconName: 'BookOpen' },
];

const INITIAL_PINNED: PinnedItem[] = [
  { id: 'pin_01', title: 'Cyberpunk 2099 Ep 1', type: 'project', tab: 'anime', isFavorite: true },
  { id: 'pin_02', title: 'Ren (Protagonist Rig)', type: 'character', tab: 'characters', isFavorite: true },
  { id: 'pin_03', title: 'Shadows of Neo Tokyo Novel', type: 'novel', tab: 'novel', isFavorite: false },
  { id: 'pin_04', title: 'Neo Tokyo Alley Storyboard', type: 'storyboard', tab: 'storyboard', isFavorite: true },
];

const INITIAL_RECENT: PinnedItem[] = [
  { id: 'rec_01', title: 'Episode 1 Opening Scene', type: 'storyboard', tab: 'storyboard' },
  { id: 'rec_02', title: 'Katsuro AI Voice Trial', type: 'character', tab: 'voice' },
  { id: 'rec_03', title: 'Chrono Rift Manga Ch 4', type: 'manga', tab: 'manga' },
];

const INITIAL_NOTIFICATIONS: StudioNotification[] = [
  {
    id: 'notif_01',
    title: '4K Anime Render Completed',
    message: 'Scene 04 - Cyberpunk Alley Chase (60fps) finished rendering with Gemini 1.5 Pro.',
    timestamp: '2 mins ago',
    read: false,
    type: 'render_complete'
  },
  {
    id: 'notif_02',
    title: 'New Collaboration Invite',
    message: 'Director Kenji invited you to join "Kyoto Animation Labs" as Lead Animator.',
    timestamp: '1 hour ago',
    read: false,
    type: 'team_invite'
  },
  {
    id: 'notif_03',
    title: 'Security Alert: New API Key',
    message: 'API Key "Studio Production Engine" generated from IP 192.168.1.102.',
    timestamp: '3 hours ago',
    read: true,
    type: 'security'
  },
  {
    id: 'notif_04',
    title: 'Credits Balance Status',
    message: 'Your monthly enterprise credit grant added 15,000 AI generation credits.',
    timestamp: '1 day ago',
    read: true,
    type: 'system'
  }
];

export const useShellStore = create<ShellState>((set) => ({
  activeTab: 'dashboard',
  sidebarCollapsed: false,
  mobileMenuOpen: false,

  activeWorkspace: INITIAL_WORKSPACES[0],
  activeOrganization: INITIAL_ORGS[0],
  activeTeam: INITIAL_TEAMS[0],
  activeProjectName: 'Cyberpunk 2099: Neon Horizon',

  workspaces: INITIAL_WORKSPACES,
  organizations: INITIAL_ORGS,
  teams: INITIAL_TEAMS,

  pinnedItems: INITIAL_PINNED,
  recentItems: INITIAL_RECENT,

  creditsRemaining: 14850,
  aiProviderStatus: {
    provider: 'Gemini 1.5 Pro',
    status: 'operational',
    latencyMs: 38
  },

  notifications: INITIAL_NOTIFICATIONS,

  commandPaletteOpen: false,
  quickCreateOpen: false,
  keyboardShortcutsOpen: false,
  notificationsDrawerOpen: false,

  theme: 'dark',

  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  setActiveOrganization: (org) => set({ activeOrganization: org }),
  setActiveTeam: (team) => set({ activeTeam: team }),
  setActiveProjectName: (name) => set({ activeProjectName: name }),

  togglePinItem: (item) =>
    set((state) => {
      const exists = state.pinnedItems.some((p) => p.id === item.id);
      if (exists) {
        return { pinnedItems: state.pinnedItems.filter((p) => p.id !== item.id) };
      } else {
        return { pinnedItems: [...state.pinnedItems, item] };
      }
    }),

  toggleFavoriteItem: (itemId) =>
    set((state) => ({
      pinnedItems: state.pinnedItems.map((p) =>
        p.id === itemId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setQuickCreateOpen: (open) => set({ quickCreateOpen: open }),
  setKeyboardShortcutsOpen: (open) => set({ keyboardShortcutsOpen: open }),
  setNotificationsDrawerOpen: (open) => set({ notificationsDrawerOpen: open }),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    })),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    })),

  setTheme: (theme) => set({ theme }),

  deductCredits: (amount) =>
    set((state) => ({
      creditsRemaining: Math.max(0, state.creditsRemaining - amount)
    }))
}));
