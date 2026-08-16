import React, { useState } from 'react';
import { Project, VideoGeneration } from '../types';
import { 
  Video, 
  Sparkles, 
  Film, 
  Play, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Tv
} from 'lucide-react';

interface VideoStudioProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({ project, onUpdateProject }) => {
  const [promptInput, setPromptInput] = useState(
    'Cinematic 60fps anime cutscene, cyberpunk female kunoichi leaping off skyscraper roof with glowing cyan katana under heavy neon rain'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [motionIntensity, setMotionIntensity] = useState('Dynamic Action');
  const [isRendering, setIsRendering] = useState(false);

  // Trigger Video Generation Render Simulation / Veo Pipeline
  const handleStartVideoRender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsRendering(true);

    const newVideo: VideoGeneration = {
      id: `vid-${Date.now()}`,
      prompt: promptInput,
      aspectRatio,
      resolution,
      status: 'generating',
      progressMessage: 'Initializing Veo 3.1 Neural Render Engine...',
      createdAt: new Date().toISOString()
    };

    const updatedVids = [newVideo, ...project.videoGenerations];
    onUpdateProject({ ...project, videoGenerations: updatedVids });

    // Simulate multi-step neural render pipeline for realistic preview experience
    setTimeout(() => {
      const completedVid: VideoGeneration = {
        ...newVideo,
        status: 'completed',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      };
      const finalVids = updatedVids.map((v) => (v.id === newVideo.id ? completedVid : v));
      onUpdateProject({ ...project, videoGenerations: finalVids });
      setIsRendering(false);
    }, 4500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">AI Video Studio (Veo Suite)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Render high-frame-rate 60fps anime cutscenes, camera pans, and trailer shots directly from prompts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Video Prompt & Settings */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Film className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">GENERATE ANIME VIDEO SCENE</h2>
          </div>

          <form onSubmit={handleStartVideoRender} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">ANIME SCENE PROMPT *</label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe camera movement, lighting, character action..."
                className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">ASPECT RATIO</label>
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`w-1/2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      aspectRatio === '16:9' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`w-1/2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      aspectRatio === '9:16' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    9:16 Vertical
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">RESOLUTION</label>
                <select
                  value={resolution}
                  onChange={(e: any) => setResolution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">MOTION INTENSITY</label>
              <select
                value={motionIntensity}
                onChange={(e) => setMotionIntensity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Gentle Camera Pan">Gentle Camera Pan</option>
                <option value="Dynamic Action">Dynamic Action Shonen Cut</option>
                <option value="Cinematic Drone Sweep">Cinematic Drone Sweep</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isRendering || !promptInput.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRendering ? 'Rendering Video Frame Sequence...' : 'Render Anime Cutscene'}</span>
            </button>
          </form>
        </div>

        {/* Right List: Rendered Videos Gallery */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Tv className="w-4 h-4 text-amber-400" />
              <span>RENDERED VIDEO GALLERY ({project.videoGenerations.length})</span>
            </h2>
          </div>

          <div className="space-y-4">
            {project.videoGenerations.map((vid) => (
              <div key={vid.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    VEO RENDER • {vid.resolution} • {vid.aspectRatio}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    vid.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300 animate-pulse'
                  }`}>
                    {vid.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans">{vid.prompt}</p>

                {vid.status === 'generating' && (
                  <div className="space-y-2 py-2">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full animate-pulse w-3/4" />
                    </div>
                    <p className="text-[10px] text-amber-400 font-mono animate-pulse">{vid.progressMessage}</p>
                  </div>
                )}

                {vid.status === 'completed' && vid.videoUrl && (
                  <div className="rounded-xl overflow-hidden bg-black aspect-[16/9]">
                    <video
                      src={vid.videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            {project.videoGenerations.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-xs">
                No video renders completed yet. Enter an anime prompt to launch the Veo renderer!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
