import React, { useState } from 'react';
import { Star, GripVertical, ExternalLink, Sparkles, Pin, Trash2 } from 'lucide-react';
import { useRecentProjects, useToggleFavoriteProject } from '../../hooks/useDashboardData';
import { WidgetSkeleton } from './WidgetSkeleton';
import { StudioTab } from '../../types';

interface FavoritesWidgetProps {
  onTabChange: (tab: StudioTab) => void;
}

export const FavoritesWidget: React.FC<FavoritesWidgetProps> = ({ onTabChange }) => {
  const { data: projects, isLoading } = useRecentProjects();
  const toggleFavorite = useToggleFavoriteProject();

  const favoriteProjects = projects ? projects.filter(p => p.isFavorite) : [];
  const [orderedFavorites, setOrderedFavorites] = useState(favoriteProjects);

  // Sync if underlying project query updates
  React.useEffect(() => {
    if (projects) {
      setOrderedFavorites(projects.filter(p => p.isFavorite));
    }
  }, [projects]);

  // Drag and drop reordering simulation architecture
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newItems = [...orderedFavorites];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setOrderedFavorites(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index >= orderedFavorites.length - 1) return;
    const newItems = [...orderedFavorites];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setOrderedFavorites(newItems);
  };

  if (isLoading) return <WidgetSkeleton height="h-56" />;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Favorite & Pinned Rigs
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {orderedFavorites.length} Pinned
        </span>
      </div>

      {orderedFavorites.length === 0 ? (
        <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2">
          <Pin className="w-6 h-6 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">No favorite projects pinned yet.</p>
          <p className="text-[10px] text-slate-500">Star any project card to keep it pinned to your primary dashboard dock.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {orderedFavorites.map((p, index) => (
            <div
              key={p.id}
              className="group bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Drag Handle simulation */}
                <div className="flex flex-col text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing">
                  <button onClick={() => handleMoveUp(index)} title="Move Up" className="hover:text-amber-400">
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                />

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {p.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="font-mono text-indigo-300">{p.genre}</span>
                    <span>•</span>
                    <span>{p.episodesCount} Episodes</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onTabChange('storyboard')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md text-[11px] font-semibold border border-slate-800 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={() => toggleFavorite.mutate(p.id)}
                  title="Unpin Favorite"
                  className="p-1 rounded-md text-amber-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
