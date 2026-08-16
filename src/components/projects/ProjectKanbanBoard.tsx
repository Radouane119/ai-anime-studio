import React from 'react';
import { 
  Film, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { WorkspaceProject, useUpdateWorkspaceProject } from '../../hooks/useProjectsData';
import { StudioTab } from '../../types';

interface ProjectKanbanBoardProps {
  projects: WorkspaceProject[];
  onTabChange: (tab: StudioTab) => void;
  onSelectProject?: (id: string) => void;
  onOpenCreateModal: () => void;
}

export const ProjectKanbanBoard: React.FC<ProjectKanbanBoardProps> = ({
  projects,
  onTabChange,
  onSelectProject,
  onOpenCreateModal
}) => {
  const updateProject = useUpdateWorkspaceProject();

  const columns = [
    { id: 'Pre-Production', label: '1. Pre-Production & Planning', color: 'border-slate-700 bg-slate-950/60' },
    { id: 'Scripting', label: '2. Light Novel & Scripting', color: 'border-purple-500/30 bg-purple-950/10' },
    { id: 'Storyboarding', label: '3. Storyboard & Rigging', color: 'border-pink-500/30 bg-pink-950/10' },
    { id: '4K Animation', label: '4. Keyframe 4K Render', color: 'border-indigo-500/30 bg-indigo-950/10' },
    { id: 'Release', label: '5. Published Release', color: 'border-emerald-500/30 bg-emerald-950/10' }
  ];

  const handleMoveStage = (projectId: string, currentStage: string, direction: 'next' | 'prev') => {
    const stageIds = columns.map(c => c.id);
    const currentIndex = stageIds.indexOf(currentStage);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= stageIds.length) return;

    const newStage = stageIds[targetIndex] as any;
    const newStatus = newStage === 'Release' ? 'Published' : newStage === '4K Animation' ? 'In Production' : newStage === 'Scripting' ? 'Scripting' : newStage === 'Storyboarding' ? 'Rendering' : 'Planning';

    updateProject.mutate({
      id: projectId,
      updates: {
        pipelineStage: newStage,
        status: newStatus,
        progressPercent: Math.min(100, (targetIndex + 1) * 20)
      }
    });
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colProjects = projects.filter(p => p.pipelineStage === col.id || (col.id === 'Pre-Production' && p.pipelineStage === undefined));

        return (
          <div
            key={col.id}
            className={`border ${col.color} rounded-2xl p-3 flex flex-col space-y-3 min-w-[260px] shadow-lg backdrop-blur-sm`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 truncate">{col.label}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                {colProjects.length}
              </span>
            </div>

            {/* Kanban Cards */}
            <div className="flex-1 space-y-3 min-h-[400px]">
              {colProjects.map((p) => {
                const targetTab = getTargetTabForFormat(p.format);
                return (
                  <div
                    key={p.id}
                    className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3 space-y-2.5 transition-all shadow-md"
                  >
                    <div className="flex items-start space-x-2.5">
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                          {p.title}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-400 block truncate mt-0.5">
                          {p.genre}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>

                    {/* Stage Navigation & Launch */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMoveStage(p.id, col.id, 'prev')}
                          disabled={col.id === 'Pre-Production'}
                          title="Move to previous pipeline stage"
                          className="px-1.5 py-0.5 text-[10px] bg-slate-950 text-slate-400 disabled:opacity-30 hover:text-white rounded border border-slate-800 cursor-pointer"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => handleMoveStage(p.id, col.id, 'next')}
                          disabled={col.id === 'Release'}
                          title="Advance to next pipeline stage"
                          className="px-1.5 py-0.5 text-[10px] bg-slate-950 text-slate-400 disabled:opacity-30 hover:text-white rounded border border-slate-800 cursor-pointer"
                        >
                          →
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (onSelectProject) onSelectProject(p.id);
                          onTabChange(targetTab);
                        }}
                        className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Open Studio</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {colProjects.length === 0 && (
                <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center p-4 text-center">
                  <span className="text-[10px] text-slate-500 font-mono">No rigs in this stage</span>
                </div>
              )}
            </div>

            {/* Quick Add at bottom */}
            <button
              onClick={onOpenCreateModal}
              className="w-full py-1.5 bg-slate-950 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-white flex items-center justify-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Rig to Stage</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
