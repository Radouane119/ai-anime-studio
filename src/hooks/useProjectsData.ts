import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectFormat } from '../types';

export interface WorkspaceProject {
  id: string;
  title: string;
  tagline: string;
  genre: string;
  format: ProjectFormat;
  thumbnailUrl: string;
  progressPercent: number;
  lastModified: string;
  isFavorite: boolean;
  status: 'Planning' | 'Scripting' | 'In Production' | 'Rendering' | 'Published' | 'Archived';
  episodesCount: number;
  charactersCount: number;
  mangaPagesCount: number;
  voiceTracksCount: number;
  viewsCount: number;
  tags: string[];
  synopsis: string;
  teamMembers: { name: string; avatar: string; role: string }[];
  pipelineStage: 'Pre-Production' | 'Scripting' | 'Storyboarding' | 'Voice Dubbing' | '4K Animation' | 'Post-Processing' | 'Release';
}

export interface WorkspaceProjectStats {
  totalProjects: number;
  activeSeries: number;
  publishedProjects: number;
  totalEpisodes: number;
  totalCharacters: number;
  avgProgress: number;
}

export interface ProjectFilters {
  format?: string;
  status?: string;
  genre?: string;
  search?: string;
  sortBy?: string;
}

export const useWorkspaceProjects = (filters: ProjectFilters = {}) => {
  return useQuery({
    queryKey: ['workspace-projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.format) params.append('format', filters.format);
      if (filters.status) params.append('status', filters.status);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await fetch(`/api/projects?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch workspace projects');
      const data = await res.json();
      return data.projects as WorkspaceProject[];
    },
    staleTime: 1000 * 60 * 3
  });
};

export const useWorkspaceProjectStats = () => {
  return useQuery({
    queryKey: ['workspace-project-stats'],
    queryFn: async () => {
      const res = await fetch('/api/projects/stats');
      if (!res.ok) throw new Error('Failed to fetch project stats');
      const data = await res.json();
      return data.stats as WorkspaceProjectStats;
    },
    staleTime: 1000 * 60 * 5
  });
};

export const useCreateWorkspaceProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; tagline?: string; format: string; genre: string; synopsis?: string; tags?: string[] }) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-projects'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-project-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

export const useUpdateWorkspaceProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WorkspaceProject> }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-projects'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-project-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

export const useCloneWorkspaceProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}/clone`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to duplicate project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-projects'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-project-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

export const useDeleteWorkspaceProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-projects'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-project-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};
