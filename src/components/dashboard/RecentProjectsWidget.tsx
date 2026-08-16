import React, { useState } from 'react';
import { 
  FolderKanban, 
  Star, 
  Clock, 
  Sparkles, 
  LayoutGrid, 
  List, 
  ArrowRight,
  Eye,
  Film,
  BookOpen
} from 'lucide-react';
import { useRecentProjects, useToggleFavoriteProject } from '../../hooks/useDashboardData';
import { WidgetSkeleton, WidgetError } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface RecentProjectsWidgetProps {
  onTabChange: (tab: StudioTab) => void;
}

export const RecentProjectsWidget: React.FC<RecentProjectsWidgetProps> = ({ onTabChange }) => {
  const { data: projects, isLoading, isError, refetch } = useRecentProjects();
  const toggleFavorite = useToggleFavoriteProject();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterGenre, setFilterGenre] = useState<string>('all');

  if (isLoading) return <WidgetSkeleton height="h-80" />;
  if (isError || !projects) return <WidgetError message="Failed to load recent projects" onRetry={refetch} />;

  const filteredProjects = filterGenre === 'all' 
    ? projects 
    : projects.filter(p => p.genre.toLowerCase().includes(filterGenre.toLowerCase()));

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Production':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Scripting':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Rendering':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Published':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg backdrop-blur-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>Recent Production Projects</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                {projects.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-400">Continue work on active anime, manga & light novel pipelines</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {/* Genre Filter */}
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Genres</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="fantasy">Dark Fantasy</option>
            <option value="sci-fi">Sci-Fi / Mecha</option>
            <option value="shonen">Action / Shonen</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onTabChange('projects')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Projects Display Area */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-10 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">No projects found matching current filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group relative bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-36 overflow-hidden bg-slate-900">
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={() => toggleFavorite.mutate(p.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/70 border border-white/10 text-slate-300 hover:text-amber-400 hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>

                  {/* Format Tag & Status Badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full font-medium border ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                    <span className="bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {p.genre}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{p.tagline}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Production Progress</span>
                      <span className="text-indigo-300 font-bold">{p.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Stats Row */}
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(p.lastModified)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>{p.viewsCount?.toLocaleString()} renders</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Launch Bar */}
              <div className="px-4 pb-4 pt-1 flex items-center space-x-2">
                <button
                  onClick={() => onTabChange('characters')}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Film className="w-3 h-3 text-indigo-400" />
                  <span>Open Studio</span>
                </button>
                <button
                  onClick={() => onTabChange('storyboard')}
                  className="py-1.5 px-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Storyboard
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl p-3 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300">
                      {p.title}
                    </h4>
                    <span className={`text-[9px] font-mono px-2 py-0.2 rounded border ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{p.tagline}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 shrink-0">
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Progress</span>
                  <span className="text-xs font-bold text-indigo-300 font-mono">{p.progressPercent}%</span>
                </div>

                <div className="hidden md:block text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Last Edit</span>
                  <span className="text-xs text-slate-300 font-mono">{formatRelativeTime(p.lastModified)}</span>
                </div>

                <button
                  onClick={() => toggleFavorite.mutate(p.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 cursor-pointer"
                >
                  <Star className={`w-4 h-4 ${p.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => onTabChange('anime')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Launch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
