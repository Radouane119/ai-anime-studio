import React from 'react';
import { 
  Film, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  Star, 
  Copy, 
  Trash2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { WorkspaceProject, useCloneWorkspaceProject, useDeleteWorkspaceProject } from '../../hooks/useProjectsData';
import { useToggleFavoriteProject } from '../../hooks/useDashboardData';
import { StudioTab } from '../../types';

interface ProjectTableViewProps {
  projects: WorkspaceProject[];
  onTabChange: (tab: StudioTab) => void;
  onSelectProject?: (id: string) => void;
}

export const ProjectTableView: React.FC<ProjectTableViewProps> = ({
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
        return { label: 'Anime Series', icon: Film, color: 'text-indigo-400 bg-indigo-500/10' };
      case 'light_novel':
        return { label: 'Light Novel', icon: BookOpen, color: 'text-purple-400 bg-purple-500/10' };
      case 'manga_comic':
        return { label: 'Manga / Comic', icon: Layers, color: 'text-pink-400 bg-pink-500/10' };
      case 'youtube_short':
        return { label: 'YouTube Short', icon: PlaySquare, color: 'text-amber-400 bg-amber-500/10' };
      default:
        return { label: 'Studio Rig', icon: Film, color: 'text-slate-400 bg-slate-800' };
    }
  };

  const getTargetTabForFormat = (format: string): StudioTab => {
    switch (format) {
      case 'light_novel': return 'novel';
      case 'manga_comic': return 'manga';
      case 'youtube_short': return 'video';
      case 'anime_series': default: return 'anime';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Project & Rig Info</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">Pipeline Stage</th>
              <th className="py-3 px-4">Completion %</th>
              <th className="py-3 px-4">Assets Metric</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {projects.map((p) => {
              const fmtInfo = getFormatBadge(p.format);
              const FmtIcon = fmtInfo.icon;
              const targetTab = getTargetTabForFormat(p.format);

              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                  {/* Title & Cover */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleFavorite.mutate(p.id)}
                        className={`text-slate-600 hover:text-amber-400 ${p.isFavorite ? 'text-amber-400' : ''}`}
                      >
                        <Star className={`w-4 h-4 ${p.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>

                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                      />

                      <div className="min-w-0 max-w-xs">
                        <h4 className="font-bold text-white group-hover:text-indigo-300 truncate transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{p.genre} • {p.tagline}</p>
                      </div>
                    </div>
                  </td>

                  {/* Format */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${fmtInfo.color} flex items-center space-x-1.5 w-fit`}>
                      <FmtIcon className="w-3 h-3" />
                      <span>{fmtInfo.label}</span>
                    </span>
                  </td>

                  {/* Stage */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-indigo-300">
                    {p.pipelineStage}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 w-36">
                      <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-200">{p.progressPercent}%</span>
                    </div>
                  </td>

                  {/* Assets Count */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {p.episodesCount} Ep / {p.charactersCount} Chars / {p.voiceTracksCount} Voices
                  </td>

                  {/* Team Avatars */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center -space-x-1">
                      {p.teamMembers.map((m, idx) => (
                        <img
                          key={idx}
                          src={m.avatar}
                          alt={m.name}
                          title={m.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full border border-slate-900 object-cover"
                        />
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => cloneProject.mutate(p.id)}
                        title="Duplicate Rig"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteProject.mutate(p.id)}
                        title="Archive Project"
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (onSelectProject) onSelectProject(p.id);
                          onTabChange(targetTab);
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Launch Studio</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
