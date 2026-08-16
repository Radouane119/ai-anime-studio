import React, { useState } from 'react';
import { 
  useWorkspaceProjects, 
  useWorkspaceProjectStats, 
  ProjectFilters 
} from '../../hooks/useProjectsData';
import { ProjectsHeader } from '../projects/ProjectsHeader';
import { ProjectCardGrid } from '../projects/ProjectCardGrid';
import { ProjectTableView } from '../projects/ProjectTableView';
import { ProjectKanbanBoard } from '../projects/ProjectKanbanBoard';
import { CreateProjectModal } from '../projects/CreateProjectModal';
import { StudioTab, Project } from '../../types';
import { Film, BookOpen, Users, Layers, Sparkles, RefreshCw } from 'lucide-react';
import { WidgetSkeleton, WidgetError } from '../dashboard/WidgetSkeleton';

interface ProjectsWorkspaceViewProps {
  project?: Project;
  onTabChange: (tab: StudioTab) => void;
  onSelectProject?: (id: string) => void;
}

export const ProjectsWorkspaceView: React.FC<ProjectsWorkspaceViewProps> = ({
  onTabChange,
  onSelectProject
}) => {
  const [filters, setFilters] = useState<ProjectFilters>({
    format: 'all',
    status: 'all',
    genre: 'all',
    search: '',
    sortBy: 'lastModified'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'kanban'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: projects, isLoading, isError, refetch } = useWorkspaceProjects(filters);
  const { data: stats } = useWorkspaceProjectStats();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <ProjectsHeader
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Production Telemetry Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Active Series Rigs</span>
              <p className="text-xl font-bold text-white font-mono">{stats.activeSeries}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Total Episodes & Chars</span>
              <p className="text-xl font-bold text-white font-mono">{stats.totalEpisodes} Ep / {stats.totalCharacters} Chars</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Published Releases</span>
              <p className="text-xl font-bold text-white font-mono">{stats.publishedProjects}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Avg Studio Completion</span>
              <p className="text-xl font-bold text-white font-mono">{stats.avgProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area based on Loading/Error/ViewMode */}
      {isLoading ? (
        <WidgetSkeleton height="h-96" />
      ) : isError || !projects ? (
        <WidgetError message="Failed to load projects workspace" onRetry={refetch} />
      ) : projects.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No projects match the current filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or format filter, or launch a brand new studio project.
          </p>
          <button
            onClick={() => setFilters({ format: 'all', status: 'all', genre: 'all', search: '', sortBy: 'lastModified' })}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTableView
          projects={projects}
          onTabChange={onTabChange}
          onSelectProject={onSelectProject}
        />
      ) : viewMode === 'kanban' ? (
        <ProjectKanbanBoard
          projects={projects}
          onTabChange={onTabChange}
          onSelectProject={onSelectProject}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <ProjectCardGrid
          projects={projects}
          onTabChange={onTabChange}
          onSelectProject={onSelectProject}
        />
      )}

      {/* New Project Creation Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
