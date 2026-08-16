import React from 'react';
import { Project, StudioTab } from '../types';
import { useShellStore } from '../store/useShellStore';

// Phase 7.2 Dashboard Home Widgets
import { WelcomeCard } from './dashboard/WelcomeCard';
import { QuickActionsWidget } from './dashboard/QuickActionsWidget';
import { RecentProjectsWidget } from './dashboard/RecentProjectsWidget';
import { FavoritesWidget } from './dashboard/FavoritesWidget';
import { AiUsageCard } from './dashboard/AiUsageCard';
import { StorageWidget } from './dashboard/StorageWidget';
import { ProjectStatisticsWidget } from './dashboard/ProjectStatisticsWidget';
import { ActivityFeedWidget } from './dashboard/ActivityFeedWidget';
import { NotificationsSummaryWidget } from './dashboard/NotificationsSummaryWidget';
import { TipsAndUpdatesPanel } from './dashboard/TipsAndUpdatesPanel';

interface DashboardProps {
  project: Project;
  onTabChange: (tab: StudioTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ project, onTabChange }) => {
  const { setQuickCreateOpen, setNotificationsDrawerOpen } = useShellStore();

  const handleOpenNewProject = () => {
    // Navigate to projects tab or trigger create
    onTabChange('projects');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto selection:bg-indigo-500 selection:text-white">
      {/* 1. Welcome Header Banner */}
      <WelcomeCard
        onTabChange={onTabChange}
        onOpenQuickCreate={() => setQuickCreateOpen(true)}
      />

      {/* 2. Studio Quick Actions Bar */}
      <QuickActionsWidget
        onTabChange={onTabChange}
        onOpenQuickCreate={() => setQuickCreateOpen(true)}
        onOpenNewProject={handleOpenNewProject}
      />

      {/* 3. High-Level Studio Statistics Row */}
      <ProjectStatisticsWidget onTabChange={onTabChange} />

      {/* 4. Main Two-Column Layout (Primary Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8/12) — Primary Workspace Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Projects Section */}
          <RecentProjectsWidget onTabChange={onTabChange} />

          {/* AI Usage & Telemetry Card */}
          <AiUsageCard onTabChange={onTabChange} />

          {/* Activity Stream Feed */}
          <ActivityFeedWidget onTabChange={onTabChange} />
        </div>

        {/* Right Column (4/12) — Favorites, Vault Storage, Alerts & Tips */}
        <div className="lg:col-span-4 space-y-6">
          {/* Favorite & Pinned Projects */}
          <FavoritesWidget onTabChange={onTabChange} />

          {/* Cloud Storage Vault Widget */}
          <StorageWidget onTabChange={onTabChange} />

          {/* Notifications & System Alerts Summary */}
          <NotificationsSummaryWidget
            onTabChange={onTabChange}
            onOpenNotificationsDrawer={() => setNotificationsDrawerOpen(true)}
          />

          {/* Feature Announcements & Pro Tips Panel */}
          <TipsAndUpdatesPanel onTabChange={onTabChange} />
        </div>
      </div>
    </div>
  );
};
