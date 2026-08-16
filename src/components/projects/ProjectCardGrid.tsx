import React from 'react';
import { 
  Star, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Users, 
  Film, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  MoreVertical,
  ChevronRight,
  Eye
} from 'lucide-react';
import { WorkspaceProject, useCloneWorkspaceProject, useDeleteWorkspaceProject } from '../../hooks/useProjectsData';
import { useToggleFavoriteProject } from '../../hooks/useDashboardData';
import { StudioTab } from '../../types';

interface ProjectCardGridProps {
  projects: WorkspaceProject[];
  onTabChange: (tab: StudioTab) => void;
  onSelectProject?: (id: string) => void;
}

export const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({
  projects,
  onTabChange,
  onSelectProject
}) => {
  const toggleFavorite = useToggleFavoriteProject();
  const cloneProject = useCloneWorkspaceProject();
  const deleteProject = useDeleteWorkspaceProject();

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'anime_series':
        return { label: 'Anime Series', icon: Film, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      case 'light_novel':
        return { label: 'Light Novel', icon: BookOpen, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'manga_comic':
        return { label: 'Manga / Comic', icon: Layers, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
      case 'youtube_short':
        return { label: 'YouTube Short', icon: PlaySquare, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      default:
        return { label: 'Studio Rig', icon: Film, color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const getTargetTabForFormat = (format: string): StudioTab => {
    switch (format) {
      case 'light_novel':
        return 'novel';
      case 'manga_comic':
        return 'manga';
      case 'youtube_short':
        return 'video';
      case 'anime_series':
      default:
        return 'anime';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Production':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Scripting':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Rendering':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/30';
      case 'Published':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Planning':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => {
        const fmtInfo = getFormatBadge(p.format);
        const FmtIcon = fmtInfo.icon;
        const targetTab = getTargetTabForFormat(p.format);

        return (
          <div
            key={p.id}
            className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col backdrop-blur-sm"
          >
            {/* Top Cover Image with Badges & Overlays */}
            <div className="relative h-44 overflow-hidden bg-slate-950">
              <img
                src={p.thumbnailUrl}
                alt={p.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Format Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center space-x-1.5 backdrop-blur-md ${fmtInfo.color}`}>
                  <FmtIcon className="w-3 h-3" />
                  <span>{fmtInfo.label}</span>
                </span>
              </div>

              {/* Favorite Star & Actions */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                <button
                  onClick={() => toggleFavorite.mutate(p.id)}
                  title={p.isFavorite ? 'Unpin Favorite' : 'Pin Favorite'}
                  className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                    p.isFavorite
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              {/* Status & Views Pill */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getStatusBadge(p.status)}`}>
                  {p.status}
                </span>

                <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                  <Eye className="w-3 h-3 text-indigo-400" />
                  <span>{p.viewsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {p.synopsis || p.tagline}
                </p>
              </div>

              {/* Tags Row */}
              <div className="flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[9px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Completion Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Pipeline Stage: <strong className="text-indigo-300">{p.pipelineStage}</strong></span>
                  <span className="text-slate-300 font-bold">{p.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Footer Meta & Controls */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                {/* Team Avatars */}
                <div className="flex items-center -space-x-1.5">
                  {p.teamMembers.map((m, idx) => (
                    <img
                      key={idx}
                      src={m.avatar}
                      alt={m.name}
                      title={`${m.name} (${m.role})`}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 font-mono ml-2">
                    {p.episodesCount} Ep
                  </span>
                </div>

                {/* Actions Row */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => cloneProject.mutate(p.id)}
                    title="Duplicate Studio Rig"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteProject.mutate(p.id)}
                    title="Archive / Remove Project"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectProject) onSelectProject(p.id);
                      onTabChange(targetTab);
                    }}
                    className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <span>Open Rig</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
