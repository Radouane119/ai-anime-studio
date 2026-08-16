# Phase 7.1 — Dashboard Shell Architecture Documentation

## Executive Overview
Phase 7.1 establishes the unified, persistent **Dashboard Shell** for **AI Anime Studio**. Inspired by modern productivity powerhouses like Notion, Linear, Cursor, and Adobe Creative Cloud, this layout shell serves as the immutable structural foundation for all current and future studio modules.

---

## Component Tree

```
App.tsx (Root Provider & Shell Container)
 ├── TopBar.tsx (Sticky Header - 64px)
 │    ├── WorkspaceSelector.tsx (Workspace, Team, and Organization Switcher)
 │    ├── Breadcrumbs.tsx (Dynamic Route Location Hierarchy)
 │    ├── Global Search Input (Triggers Command Palette)
 │    ├── Credits Counter Badge (14,850 Credits)
 │    ├── AI Provider Operational Badge (Gemini 1.5 Pro - 38ms)
 │    ├── Quick Create Button ("+ Create")
 │    ├── Notifications Drawer Trigger
 │    ├── Theme Toggle (Dark / Light / System)
 │    └── Profile Avatar & Dropdown Menu
 │
 ├── Main Layout Body
 │    ├── ResponsiveSidebar.tsx (Collapsible 64px / 280px Sidebar & Mobile Drawer)
 │    │    ├── Brand Header & Logo
 │    │    ├── Navigation Sections (Main, Creation Studios, Assets, Analytics & Admin)
 │    │    ├── Pinned Items & Favorites
 │    │    ├── Recently Opened Items
 │    │    └── Pro License Footer Badge
 │    │
 │    └── Active Page Container (`<main>`)
 │         ├── Dashboard.tsx (Dashboard Overview)
 │         ├── CharacterStudio.tsx (Anime Character Rigging)
 │         ├── NovelWriter.tsx (AI Light Novel Studio)
 │         ├── AnimeStoryboard.tsx (Cinematic Storyboard)
 │         ├── MangaStudio.tsx (Manga & Comic Studio)
 │         ├── VoiceStudio.tsx (AI Voice & Dubbing Engine)
 │         ├── VideoStudio.tsx (Non-Linear Video Editor)
 │         ├── UserProfileView.tsx (Creator Profile)
 │         ├── RbacStudio.tsx (RBAC Security Admin)
 │         ├── AccountSettingsStudio.tsx (Account & Security Settings)
 │         └── GenericStudioView.tsx (Modular Studio Wrapper for World, Prompt, Music, Assets, Marketplace, Community, Analytics, Billing)
 │
 ├── Footer.tsx (System Status Bar - 32px)
 │    ├── Cluster Operational Telemetry
 │    ├── Auth & Security Guard Badges
 │    └── Keyboard Shortcut Hints (Cmd+K, ?)
 │
 └── Modals & Drawers Overlay Cluster
      ├── CommandPalette.tsx (Cmd+K Global Search & Quick Actions Engine)
      ├── QuickCreateModal.tsx (Ctrl+N Quick Creation Pipeline)
      ├── NotificationsDrawer.tsx (Slide-Out Real-Time Alert Drawer)
      └── KeyboardShortcutsModal.tsx (? Keyboard Cheat Sheet Modal)
```

---

## Folder Structure

```
/src
 ├── /components
 │    ├── /shell
 │    │    ├── TopBar.tsx
 │    │    ├── ResponsiveSidebar.tsx
 │    │    ├── Breadcrumbs.tsx
 │    │    ├── WorkspaceSelector.tsx
 │    │    ├── CommandPalette.tsx
 │    │    ├── QuickCreateModal.tsx
 │    │    ├── NotificationsDrawer.tsx
 │    │    ├── KeyboardShortcutsModal.tsx
 │    │    ├── Footer.tsx
 │    │    ├── LoadingSkeleton.tsx
 │    │    └── EmptyState.tsx
 │    └── /studios
 │         └── GenericStudioView.tsx
 │
 ├── /store
 │    └── useShellStore.ts (Zustand Global Shell Store)
 │
 ├── /__tests__
 │    └── dashboard_shell.test.ts (Unit & Shell State Test Suite)
 │
 ├── types.ts (Expanded StudioTab & Shell Interfaces)
 └── App.tsx (Main Integration Entry Point)
```

---

## State Management Strategy

1. **Zustand Shell Store (`useShellStore.ts`)**:
   - Manages shell-wide layout state: `activeTab`, `sidebarCollapsed`, `mobileMenuOpen`.
   - Manages multi-tenant scope: `activeWorkspace`, `activeOrganization`, `activeTeam`, `activeProjectName`.
   - Manages overlays & drawers: `commandPaletteOpen`, `quickCreateOpen`, `keyboardShortcutsOpen`, `notificationsDrawerOpen`.
   - Manages system telemetry & state: `creditsRemaining`, `aiProviderStatus`, `pinnedItems`, `recentItems`, `notifications`.

2. **React Context (`AuthContext.tsx`)**:
   - Manages user session tokens, Clerk auth state, and RBAC permissions (`Super Admin`, `Showrunner`, `Animator`, `Guest`).

3. **Persistent Browser Storage (`localStorage`)**:
   - Automatically saves sidebar collapse preference and selected theme mode (`dark` / `light` / `system`).

---

## Routing Strategy & Tab Navigation

Navigation across the 19 Studio modules is handled via typed state transitions on `StudioTab`:

| Section | Studio Tab ID | Description |
| :--- | :--- | :--- |
| **Main** | `dashboard` | Dashboard Overview & Quick Stats |
| | `projects` | Projects Workspace & Multi-Format Pipelines |
| **Creation** | `novel` | AI Light Novel Studio & Writer Suite |
| | `characters` | Character Studio & 2D/3D Rigging |
| | `world` | World Builder & Faction Lore DB |
| | `storyboard` | Cinematic Storyboard & Director Suite |
| | `manga` | Manga Studio & Panel Grids |
| | `anime` | 4K Animation Studio & Neural Engine |
| | `prompt` | Prompt Engineering Lab & Matrix Tester |
| | `voice` | AI Voice & Dubbing Engine |
| | `music` | Soundtrack & BGM Generator |
| | `video` | Non-Linear Video Editor |
| **Assets & Guild** | `assets` | Global Asset Library |
| | `marketplace` | Rig & Prompt Marketplace |
| | `community` | Creator Guild & Co-Working Rooms |
| **Analytics & Mgmt** | `analytics` | Production Analytics & GPU Metrics |
| | `billing` | Credits & Enterprise Subscriptions |
| | `settings` | Account & Security Settings |
| | `admin` | RBAC Security & Admin Console |
| | `profile` | Creator Profile View |
| | `publish` | Publishing & Distribution Hub |

---

## Future Scalability

1. **Plug-and-Play Studio Extensions**: New creation tools or sub-studios can be added by registering a new `StudioTab` key in `types.ts` and adding a navigation entry in `ResponsiveSidebar.tsx` and `CommandPalette.tsx`.
2. **Server-Side Integration**: State actions in `useShellStore` are structured for straightforward synchronization with backend REST/GraphQL or WebSocket endpoints.
3. **Micro-Frontend Ready**: The page container isolations allow sub-studios to be lazily loaded as separate micro-frontend bundles when needed.
