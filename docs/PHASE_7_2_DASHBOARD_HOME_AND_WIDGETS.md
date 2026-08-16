# Phase 7.2 — Dashboard Home & Widgets Documentation

## Executive Overview
Phase 7.2 delivers the complete **Dashboard Home & Widgets** system for **AI Anime Studio**, adhering to design standards comparable to Linear, Notion, and Cursor. Built with React Query for server state management and Tailwind CSS for visual hierarchy, this view serves as the primary landing page after user authentication.

---

## Component Hierarchy & Widget Architecture

```
Dashboard.tsx (Main Dashboard Shell View)
 ├── WelcomeCard.tsx (Greeting Banner & High-Level Studio Stats)
 ├── QuickActionsWidget.tsx (5 Primary Quick Action Shortcuts)
 ├── ProjectStatisticsWidget.tsx (Production Pipeline Metric Blocks)
 │
 ├── Main Grid Area (12-Column Responsive Layout)
 │    ├── Left Column (8/12)
 │    │    ├── RecentProjectsWidget.tsx (Grid/List View, Progress Bar, Star Favorites)
 │    │    ├── AiUsageCard.tsx (Gemini 1.5 Pro Telemetry, Token Metrics, 7-Day Trend Chart)
 │    │    └── ActivityFeedWidget.tsx (Real-Time Studio Timeline with Category Filters)
 │    │
 │    └── Right Column (4/12)
 │         ├── FavoritesWidget.tsx (Pinned Favorites & Reordering Simulation)
 │         ├── StorageWidget.tsx (Cloud Asset Vault Storage Segmented Progress Meter)
 │         ├── NotificationsSummaryWidget.tsx (Unread Alerts & System Notifications)
 │         └── TipsAndUpdatesPanel.tsx (Feature Announcements & Studio Direct Links)
```

---

## API Endpoints Reference

The backend Express routes in `server.ts` expose the following JSON endpoints for server-state synchronization:

| Endpoint | Method | Description | Response Schema |
| :--- | :--- | :--- | :--- |
| `/api/dashboard/summary` | `GET` | Returns user greeting, org, team, and high-level production counts | `{ success: boolean, summary: DashboardSummaryResponse }` |
| `/api/dashboard/recent-projects` | `GET` | Returns list of recent anime, manga, and novel projects | `{ success: boolean, projects: RecentProjectItem[] }` |
| `/api/dashboard/projects/:id/favorite` | `POST` | Toggles favorite pin status for a project | `{ success: boolean, id: string, isFavorite: boolean, project: RecentProjectItem }` |
| `/api/dashboard/usage-stats` | `GET` | Returns AI request counts, token usage, credit quota, model distribution & 7-day trend | `{ success: boolean, usage: AiUsageStatsResponse }` |
| `/api/dashboard/storage-usage` | `GET` | Returns cloud asset vault storage usage and multi-category breakdown | `{ success: boolean, storage: StorageUsageResponse }` |
| `/api/dashboard/activity-feed` | `GET` | Returns real-time studio activity stream items | `{ success: boolean, activities: ActivityFeedItem[] }` |
| `/api/dashboard/notifications-summary` | `GET` | Returns unread alerts count and recent security/system notifications | `{ success: boolean, unreadCount: number, recentAlerts: NotificationItem[] }` |
| `/api/dashboard/tips` | `GET` | Returns product feature announcements, pro tips, and studio direct links | `{ success: boolean, tips: TipOrAnnouncement[] }` |

---

## Data Flow & React Query Integration

1. **Client Request Layer (`useDashboardData.ts`)**:
   - Custom React Query hooks (`useDashboardSummary`, `useRecentProjects`, `useAiUsageStats`, `useStorageUsage`, `useActivityFeed`, `useNotificationsSummary`, `useDashboardTips`) consume the Express API endpoints.
   - Built-in caching (`staleTime: 5 min`) ensures fast transitions without unnecessary network refetches.
2. **Mutation & Invalidation (`useToggleFavoriteProject`)**:
   - Toggling a project's favorite state sends a `POST` request to `/api/dashboard/projects/:id/favorite` and automatically invalidates the `['dashboard', 'recent-projects']` query key to re-sync all widgets.
3. **Loading & Error Graceful States**:
   - Each widget incorporates `WidgetSkeleton` for shimmer loading placeholders and `WidgetError` for isolated retry handlers.

---

## Verification & Testing

- Unit & logic test suite implemented in `/src/__tests__/dashboard_widgets.test.ts`.
- Linter verification passed cleanly with zero errors (`npm run lint`).
- Production build compilation verified via `compile_applet`.
