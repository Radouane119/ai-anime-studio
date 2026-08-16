import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Kanban, 
  Sparkles, 
  Film, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  SlidersHorizontal 
} from 'lucide-react';
import { ProjectFilters } from '../../hooks/useProjectsData';

interface ProjectsHeaderProps {
  filters: ProjectFilters;
  onFilterChange: (newFilters: ProjectFilters) => void;
  viewMode: 'grid' | 'table' | 'kanban';
  onViewModeChange: (mode: 'grid' | 'table' | 'kanban') => void;
  onOpenCreateModal: () => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreateModal
}) => {
  const formats = [
    { id: 'all', label: 'All Rigs', icon: Sparkles },
    { id: 'anime_series', label: 'Anime Series', icon: Film },
    { id: 'light_novel', label: 'Light Novel', icon: BookOpen },
    { id: 'manga_comic', label: 'Manga / Comic', icon: Layers },
    { id: 'youtube_short', label: 'YouTube Shorts', icon: PlaySquare },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & CTA Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2.5">
            <span>Projects Workspace</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Multi-Format Studio Rigs
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, script, animate, and publish anime series, light novels, and manga from a unified dashboard.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Studio Project</span>
        </button>
      </div>

      {/* Format Filter Tabs & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 shadow-md backdrop-blur-sm">
        {/* Format Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const active = (filters.format || 'all') === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => onFilterChange({ ...filters, format: fmt.id })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{fmt.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Layout Switcher & Quick Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, tag, or lore..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors font-sans"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="scripting">Scripting</option>
            <option value="in_production">In Production</option>
            <option value="rendering">Rendering</option>
            <option value="published">Published</option>
          </select>

          {/* Sort Selector */}
          <select
            value={filters.sortBy || 'lastModified'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="lastModified">Recent Activity</option>
            <option value="title">Alphabetical (A-Z)</option>
            <option value="progress">Completion %</option>
            <option value="views">Popularity Views</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 space-x-1">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              title="Pipeline Kanban"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
