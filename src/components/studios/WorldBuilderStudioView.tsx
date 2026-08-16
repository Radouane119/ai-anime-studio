import React, { useState } from 'react';
import { 
  useWorldFactions, 
  useWorldLoreEntries, 
  useWorldLocations, 
  useWorldTimelineEvents, 
  useWorldBuildingStats 
} from '../../hooks/useWorldBuildingData';
import { WorldBuilderHeader, WorldSubTab } from '../world/WorldBuilderHeader';
import { FactionHierarchyView } from '../world/FactionHierarchyView';
import { LoreCodexView } from '../world/LoreCodexView';
import { WorldMapCanvasView } from '../world/WorldMapCanvasView';
import { TimelineEngineView } from '../world/TimelineEngineView';
import { AiLoreGeneratorModal } from '../world/AiLoreGeneratorModal';
import { Project } from '../../types';
import { Globe, BookOpen, Users, History, Sparkles, MapPin } from 'lucide-react';
import { WidgetSkeleton, WidgetError } from '../dashboard/WidgetSkeleton';

interface WorldBuilderStudioViewProps {
  project?: Project;
}

export const WorldBuilderStudioView: React.FC<WorldBuilderStudioViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<WorldSubTab>('map');
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [activeModalEntity, setActiveModalEntity] = useState<'faction' | 'lore' | 'location' | 'event' | null>(null);

  const { data: factions, isLoading: isFactionsLoading, isError: isFactionsError, refetch: refetchFactions } = useWorldFactions();
  const { data: loreEntries, isLoading: isLoreLoading, isError: isLoreError, refetch: refetchLore } = useWorldLoreEntries();
  const { data: locations, isLoading: isLocationsLoading, isError: isLocationsError, refetch: refetchLocations } = useWorldLocations();
  const { data: timelineEvents, isLoading: isTimelineLoading, isError: isTimelineError, refetch: refetchTimeline } = useWorldTimelineEvents();
  const { data: stats } = useWorldBuildingStats();

  const isLoading = isFactionsLoading || isLoreLoading || isLocationsLoading || isTimelineLoading;
  const isError = isFactionsError || isLoreError || isLocationsError || isTimelineError;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <WorldBuilderHeader
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenCreateEntity={(type) => setActiveModalEntity(type)}
      />

      {/* Production Telemetry Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Locations</span>
              <p className="text-lg font-bold text-white font-mono">{stats.totalLocations}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Factions</span>
              <p className="text-lg font-bold text-white font-mono">{stats.totalFactions}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Lore Entries</span>
              <p className="text-lg font-bold text-white font-mono">{stats.totalLoreEntries}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 shadow-md backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Magic Rules</span>
              <p className="text-lg font-bold text-white font-mono">{stats.magicSystemsCount}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 shadow-md backdrop-blur-sm col-span-2 sm:col-span-1">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Timeline Eras</span>
              <p className="text-lg font-bold text-white font-mono">{stats.timelineEventsCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area based on Sub-Tab */}
      {isLoading ? (
        <WidgetSkeleton height="h-96" />
      ) : isError ? (
        <WidgetError 
          message="Failed to load world building records" 
          onRetry={() => {
            refetchFactions();
            refetchLore();
            refetchLocations();
            refetchTimeline();
          }} 
        />
      ) : activeSubTab === 'factions' ? (
        <FactionHierarchyView
          factions={factions || []}
          isCreateModalOpen={activeModalEntity === 'faction'}
          onCloseCreateModal={() => setActiveModalEntity(null)}
        />
      ) : activeSubTab === 'codex' ? (
        <LoreCodexView
          loreEntries={loreEntries || []}
          isCreateModalOpen={activeModalEntity === 'lore'}
          onCloseCreateModal={() => setActiveModalEntity(null)}
        />
      ) : activeSubTab === 'timeline' ? (
        <TimelineEngineView
          events={timelineEvents || []}
          isCreateModalOpen={activeModalEntity === 'event'}
          onCloseCreateModal={() => setActiveModalEntity(null)}
        />
      ) : (
        <WorldMapCanvasView
          locations={locations || []}
          isCreateModalOpen={activeModalEntity === 'location'}
          onCloseCreateModal={() => setActiveModalEntity(null)}
        />
      )}

      {/* Gemini Lore Generator AI Modal */}
      <AiLoreGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
      />
    </div>
  );
};
