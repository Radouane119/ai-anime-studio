import React, { useState, useEffect } from 'react';
import { Project, StoryboardFrame } from '../types';
import { 
  Film, 
  Play, 
  Pause, 
  Plus, 
  Video, 
  Music, 
  Volume2, 
  Camera, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';

interface AnimeStoryboardProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const AnimeStoryboard: React.FC<AnimeStoryboardProps> = ({ project, onUpdateProject }) => {
  const [selectedFrame, setSelectedFrame] = useState<StoryboardFrame>(project.storyboardFrames[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isRenderingArt, setIsRenderingArt] = useState(false);

  // Auto-advance frames during storyboard timeline playback
  useEffect(() => {
    let timer: any;
    if (isPlaying && project.storyboardFrames.length > 0) {
      const activeFrame = project.storyboardFrames[currentFrameIndex];
      const durationMs = (activeFrame?.durationSeconds || 3) * 1000;

      timer = setTimeout(() => {
        setCurrentFrameIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % project.storyboardFrames.length;
          setSelectedFrame(project.storyboardFrames[nextIndex]);
          return nextIndex;
        });
      }, durationMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIndex, project.storyboardFrames]);

  // Render Frame Art using Gemini Image AI
  const handleRenderFrameArt = async (frame: StoryboardFrame) => {
    setIsRenderingArt(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Cinematic anime movie keyframe, ${frame.shotType}, camera move ${frame.cameraMove}, ${frame.prompt}`,
          aspectRatio: '16:9'
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updatedFrame = { ...frame, imageUrl: data.imageUrl };
        const updatedFrames = project.storyboardFrames.map((f) => (f.id === frame.id ? updatedFrame : f));
        onUpdateProject({ ...project, storyboardFrames: updatedFrames });
        setSelectedFrame(updatedFrame);
      }
    } catch (err) {
      console.error('Failed to render frame art:', err);
    } finally {
      setIsRenderingArt(false);
    }
  };

  const handleAddFrame = () => {
    const newFrame: StoryboardFrame = {
      id: `frame-${Date.now()}`,
      sceneNumber: 1,
      frameNumber: project.storyboardFrames.length + 1,
      shotType: 'Medium',
      cameraMove: 'Pan Right',
      action: 'Character draws weapon and leaps forward...',
      dialogue: 'Ren-01: Cyber sigil engage!',
      soundEffect: 'High-voltage laser hum',
      musicMood: 'Epic Anime Action Synth',
      prompt: 'Cinematic anime keyframe of female kunoichi in action pose',
      imageUrl: `https://picsum.photos/seed/storyboard-${Date.now()}/800/450`,
      durationSeconds: 3.5
    };

    const updated = [...project.storyboardFrames, newFrame];
    onUpdateProject({ ...project, storyboardFrames: updated });
    setSelectedFrame(newFrame);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Anime Director & Keyframe Storyboard</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Design camera movements, scene beats, audio cues, frame timings, and preview sequential anime playback.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Timeline' : 'Play Storyboard Preview'}</span>
          </button>

          <button
            onClick={handleAddFrame}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Keyframe</span>
          </button>
        </div>
      </div>

      {/* Main Director Preview Monitor */}
      {selectedFrame && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/9] max-h-[460px] bg-black overflow-hidden flex items-center justify-center">
            <img
              src={selectedFrame.imageUrl || 'https://picsum.photos/seed/frame/1280/720'}
              alt={`Frame ${selectedFrame.frameNumber}`}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-[3000ms] ${
                isPlaying ? 'scale-110 translate-x-2' : ''
              }`}
            />

            {/* Camera Motion Vector Indicator */}
            <div className="absolute top-4 left-4 bg-black/80 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg border border-slate-700 flex items-center space-x-2 backdrop-blur-md">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>SHOT #{selectedFrame.frameNumber} • {selectedFrame.shotType} • {selectedFrame.cameraMove}</span>
            </div>

            {/* Timeline Progress Badge */}
            <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-lg border border-amber-500/30">
              DURATION: {selectedFrame.durationSeconds}s
            </div>

            {/* Sound Effect Banner */}
            {selectedFrame.soundEffect && (
              <div className="absolute bottom-16 left-4 bg-slate-950/90 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2 backdrop-blur-md">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>SFX: {selectedFrame.soundEffect}</span>
              </div>
            )}

            {/* Music Mood Banner */}
            {selectedFrame.musicMood && (
              <div className="absolute bottom-16 right-4 bg-slate-950/90 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2 backdrop-blur-md">
                <Music className="w-3.5 h-3.5 text-rose-400" />
                <span>BGM: {selectedFrame.musicMood}</span>
              </div>
            )}

            {/* Subtitle Dialogue Bar */}
            {selectedFrame.dialogue && (
              <div className="absolute bottom-3 left-6 right-6 bg-black/85 text-center text-white font-sans text-sm font-bold py-2 px-4 rounded-xl border border-white/10 shadow-2xl">
                {selectedFrame.dialogue}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sequential Timeline Keyframe Rail */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>KEYFRAME TIMELINE RAIL ({project.storyboardFrames.length} FRAMES)</span>
          <span className="text-[10px] text-amber-400 font-mono">TOTAL TIME: {project.storyboardFrames.reduce((acc, f) => acc + f.durationSeconds, 0)}s</span>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2">
          {project.storyboardFrames.map((frame, index) => {
            const isSelected = selectedFrame?.id === frame.id;
            return (
              <div
                key={frame.id}
                onClick={() => {
                  setSelectedFrame(frame);
                  setCurrentFrameIndex(index);
                }}
                className={`w-48 shrink-0 bg-slate-950 border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'border-amber-400 shadow-lg shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-[16/9] bg-slate-900">
                  <img
                    src={frame.imageUrl || 'https://picsum.photos/seed/thumb/400/225'}
                    alt={`Thumb ${frame.frameNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono text-white px-1.5 py-0.5 rounded">
                    {frame.durationSeconds}s
                  </div>
                </div>
                <div className="p-2 text-[11px]">
                  <p className="font-bold text-white truncate">Frame #{frame.frameNumber}</p>
                  <p className="text-slate-400 truncate text-[10px]">{frame.shotType} • {frame.cameraMove}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
