import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DashboardSummaryResponse,
  RecentProjectItem,
  AiUsageStatsResponse,
  StorageUsageResponse,
  ActivityFeedItem,
  NotificationsSummaryResponse,
  TipOrAnnouncement
} from '../types';

// Helper for JSON fetching with error handling
async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `HTTP ${res.status} error fetching ${url}`);
  }
  return data;
}

// 1. Dashboard Summary
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; summary: DashboardSummaryResponse }>('/api/dashboard/summary');
      return data.summary;
    },
  });
}

// 2. Recent Projects
export function useRecentProjects() {
  return useQuery({
    queryKey: ['dashboard', 'recent-projects'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; projects: RecentProjectItem[] }>('/api/dashboard/recent-projects');
      return data.projects;
    },
  });
}

// Toggle Favorite Project Mutation
export function useToggleFavoriteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/dashboard/projects/${projectId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to toggle favorite status');
      }
      return data.project as RecentProjectItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'recent-projects'] });
    },
  });
}

// 3. AI Usage Stats
export function useAiUsageStats() {
  return useQuery({
    queryKey: ['dashboard', 'usage-stats'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; usage: AiUsageStatsResponse }>('/api/dashboard/usage-stats');
      return data.usage;
    },
  });
}

// 4. Storage Usage
export function useStorageUsage() {
  return useQuery({
    queryKey: ['dashboard', 'storage-usage'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; storage: StorageUsageResponse }>('/api/dashboard/storage-usage');
      return data.storage;
    },
  });
}

// 5. Activity Feed
export function useActivityFeed() {
  return useQuery({
    queryKey: ['dashboard', 'activity-feed'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; activities: ActivityFeedItem[] }>('/api/dashboard/activity-feed');
      return data.activities;
    },
  });
}

// 6. Notifications Summary
export function useNotificationsSummary() {
  return useQuery({
    queryKey: ['dashboard', 'notifications-summary'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; unreadCount: number; recentAlerts: NotificationsSummaryResponse['recentAlerts'] }>('/api/dashboard/notifications-summary');
      return {
        unreadCount: data.unreadCount,
        recentAlerts: data.recentAlerts,
      };
    },
  });
}

// 7. Product Tips & Announcements
export function useDashboardTips() {
  return useQuery({
    queryKey: ['dashboard', 'tips'],
    queryFn: async () => {
      const data = await fetchApi<{ success: boolean; tips: TipOrAnnouncement[] }>('/api/dashboard/tips');
      return data.tips;
    },
  });
}
