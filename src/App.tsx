import React, { Suspense, lazy, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Project, StudioTab } from './types';
import { PRESET_PROJECTS } from './data/presetProjects';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { ExportModal } from './components/ExportModal';
import { NewProjectModal } from './components/NewProjectModal';

// Phase 7.1 Dashboard Shell Components & Store
import { useShellStore } from './store/useShellStore';
import { TopBar } from './components/shell/TopBar';
import { ResponsiveSidebar } from './components/shell/ResponsiveSidebar';
import { Footer } from './components/shell/Footer';
import { CommandPalette } from './components/shell/CommandPalette';
import { QuickCreateModal } from './components/shell/QuickCreateModal';
import { NotificationsDrawer } from './components/shell/NotificationsDrawer';
import { KeyboardShortcutsModal } from './components/shell/KeyboardShortcutsModal';
import { GenericStudioView } from './components/studios/GenericStudioView';
import { LoadingSkeleton } from './components/shell/LoadingSkeleton';

// Studio Icons for generic studio views
import { 
  FolderKanban, 
  Globe, 
  Film, 
  Video, 
  Wand2, 
  Music, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  CreditCard 
} from 'lucide-react';

const ProjectsWorkspaceView = lazy(() => import('./components/studios/ProjectsWorkspaceView').then(({ ProjectsWorkspaceView }) => ({ default: ProjectsWorkspaceView })));
const CharacterStudioView = lazy(() => import('./components/studios/CharacterStudioView').then(({ CharacterStudioView }) => ({ default: CharacterStudioView })));
const NovelStudioView = lazy(() => import('./components/studios/NovelStudioView').then(({ NovelStudioView }) => ({ default: NovelStudioView })));
const WorldBuilderStudioView = lazy(() => import('./components/studios/WorldBuilderStudioView').then(({ WorldBuilderStudioView }) => ({ default: WorldBuilderStudioView })));
const AnimeStoryboard = lazy(() => import('./components/AnimeStoryboard').then(({ AnimeStoryboard }) => ({ default: AnimeStoryboard })));
const MangaStudio = lazy(() => import('./components/MangaStudio').then(({ MangaStudio }) => ({ default: MangaStudio })));
const VoiceStudio = lazy(() => import('./components/VoiceStudio').then(({ VoiceStudio }) => ({ default: VoiceStudio })));
const VideoStudio = lazy(() => import('./components/VideoStudio').then(({ VideoStudio }) => ({ default: VideoStudio })));
const PublishStudio = lazy(() => import('./components/PublishStudio').then(({ PublishStudio }) => ({ default: PublishStudio })));
const UserProfileView = lazy(() => import('./components/UserProfileView').then(({ UserProfileView }) => ({ default: UserProfileView })));
const RbacStudio = lazy(() => import('./components/RbacStudio').then(({ RbacStudio }) => ({ default: RbacStudio })));
const AccountSettingsStudio = lazy(() => import('./components/AccountSettingsStudio').then(({ AccountSettingsStudio }) => ({ default: AccountSettingsStudio })));

const StudioSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSkeleton rows={3} />}>{children}</Suspense>
);

export default function App() {
  const [projects, setProjects] = useState<Project[]>(PRESET_PROJECTS);
  const [currentProjectId, setCurrentProjectId] = useState<string>(PRESET_PROJECTS[0].id);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const { activeTab, setActiveTab, setActiveProjectName } = useShellStore();

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  useEffect(() => {
    if (currentProject) {
      setActiveProjectName(currentProject.title);
    }
  }, [currentProject, setActiveProjectName]);

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setActiveTab('dashboard');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">

        {/* Phase 7.1 Top Navigation Bar */}
        <TopBar />

        {/* Phase 7.1 Main Application Shell Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Phase 7.1 Responsive Collapsible Sidebar */}
          <ResponsiveSidebar />

          {/* Studio View Content Area Container */}
          <main className="flex-1 overflow-y-auto bg-slate-950 relative">
            {activeTab === 'dashboard' && (
              <Dashboard project={currentProject} onTabChange={setActiveTab} />
            )}

            {activeTab === 'projects' && (
              <StudioSuspense>
                <ProjectsWorkspaceView
                  project={currentProject}
                  onTabChange={setActiveTab}
                  onSelectProject={(id) => setCurrentProjectId(id)}
                />
              </StudioSuspense>
            )}

            {activeTab === 'characters' && (
              <StudioSuspense><CharacterStudioView project={currentProject} onUpdateProject={handleUpdateProject} /></StudioSuspense>
            )}

            {activeTab === 'novel' && (
              <StudioSuspense><NovelStudioView project={currentProject} onUpdateProject={handleUpdateProject} /></StudioSuspense>
            )}

            {activeTab === 'world' && (
              <StudioSuspense><WorldBuilderStudioView project={currentProject} /></StudioSuspense>
            )}

            {activeTab === 'storyboard' && (
              <StudioSuspense><AnimeStoryboard project={currentProject} onUpdateProject={handleUpdateProject} /></StudioSuspense>
            )}

            {activeTab === 'manga' && (
              <StudioSuspense><MangaStudio project={currentProject} onUpdateProject={handleUpdateProject} /></StudioSuspense>
            )}

            {activeTab === 'anime' && (
              <GenericStudioView 
                tab="anime"
                title="4K Animation Studio Engine"
                subtitle="Render keyframes, tween motion, and run 60fps neural upscale with Gemini 1.5 Pro."
                icon={<Video className="w-6 h-6" />}
                badge="Anime Render"
                features={['Keyframe Motion Interpolation', 'Ufotable Dynamic Lighting', '4K 60fps Neural Upscale']}
              />
            )}

            {activeTab === 'prompt' && (
              <GenericStudioView 
                tab="prompt"
                title="Prompt Engineering Lab"
                subtitle="Test, optimize, and store Gemini 1.5 Pro and Imagen 3 anime prompts."
                icon={<Wand2 className="w-6 h-6" />}
                badge="Prompt Lab"
                features={['Negative Prompt Matrices', 'Style Preset Injection', 'Seed Variation Tester']}
              />
            )}

            {activeTab === 'voice' && (
              <StudioSuspense><VoiceStudio project={currentProject} onUpdateProject={handleUpdateProject} /></StudioSuspense>
            )}

            {activeTab === 'music' && (
              <GenericStudioView 
                tab="music"
                title="Soundtrack & BGM Engine"
                subtitle="Synthesize orchestral anime soundtracks, ambient themes, and battle BGM."
                icon={<Music className="w-6 h-6" />}
                badge="Audio Engine"
                features={['Procedural Theme Generation', 'Stems Audio Separator', 'J-Pop & Orchestral Presets']}
              />
            )}

            {activeTab === 'video' && (
              <StudioSuspense><VideoStudio project={currentProject} onUpdateProject={handleUpdateProject} /></StudioSuspense>
            )}

            {activeTab === 'assets' && (
              <GenericStudioView 
                tab="assets"
                title="Global Asset Library"
                subtitle="Centralized repository for character models, backgrounds, audio dubs, and textures."
                icon={<Package className="w-6 h-6" />}
                badge="Assets"
                features={['Vector Art Repository', '3D Model Rig Storage', 'Audio FX & Dub Database']}
              />
            )}

            {activeTab === 'marketplace' && (
              <GenericStudioView 
                tab="marketplace"
                title="Prompt & Rig Marketplace"
                subtitle="Trade custom anime prompts, character rigs, loras, and background packages."
                icon={<ShoppingBag className="w-6 h-6" />}
                badge="Marketplace"
                features={['Creator Royalty Pipeline', 'Verified Rig Badges', '1-Click Studio Import']}
              />
            )}

            {activeTab === 'community' && (
              <GenericStudioView 
                tab="community"
                title="Creator Guild & Community"
                subtitle="Collaborate with international animators, scriptwriters, and voice actors."
                icon={<MessageSquare className="w-6 h-6" />}
                badge="Community"
                features={['Live Co-Working Rooms', 'Feedback & Critique Guilds', 'Showcase Gallery']}
              />
            )}

            {activeTab === 'analytics' && (
              <GenericStudioView 
                tab="analytics"
                title="Production Analytics"
                subtitle="Track credit burn, render completion times, team productivity, and API latency."
                icon={<BarChart3 className="w-6 h-6" />}
                badge="Analytics"
                features={['Real-Time GPU Telemetry', 'Credit Expenditure Metrics', 'Team Activity Heatmaps']}
              />
            )}

            {activeTab === 'billing' && (
              <GenericStudioView 
                tab="billing"
                title="Credits & Billing Hub"
                subtitle="Manage enterprise subscriptions, top up credits, and review usage invoices."
                icon={<CreditCard className="w-6 h-6" />}
                badge="Billing"
                features={['Enterprise Credit Top-Up', 'Monthly Usage Invoices', 'Team Seat Management']}
              />
            )}

            {activeTab === 'publish' && (
              <StudioSuspense><PublishStudio project={currentProject} onOpenExportModal={() => setIsExportOpen(true)} /></StudioSuspense>
            )}

            {activeTab === 'profile' && (
              <StudioSuspense><UserProfileView /></StudioSuspense>
            )}

            {activeTab === 'rbac' || activeTab === 'admin' ? (
              <StudioSuspense><RbacStudio /></StudioSuspense>
            ) : null}

            {activeTab === 'settings' && (
              <StudioSuspense><AccountSettingsStudio /></StudioSuspense>
            )}
          </main>
        </div>

        {/* Phase 7.1 Bottom Footer */}
        <Footer />

        {/* Phase 7.1 Shell Modals & Drawers */}
        <CommandPalette />
        <QuickCreateModal />
        <NotificationsDrawer />
        <KeyboardShortcutsModal />

        {/* Existing Application Modals */}
        <AuthModal />

        {isExportOpen && (
          <ExportModal project={currentProject} onClose={() => setIsExportOpen(false)} />
        )}

        {isNewProjectOpen && (
          <NewProjectModal
            onClose={() => setIsNewProjectOpen(false)}
            onCreateProject={handleCreateProject}
          />
        )}
      </div>
    </AuthProvider>
    </QueryClientProvider>
  );
}
