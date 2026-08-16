import React, { useState } from 'react';
import { DialogueBubble, MangaPanel, Project } from '../types';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Camera, 
  Layout, 
  Zap, 
  RefreshCw, 
  Layers,
  Move
} from 'lucide-react';

interface MangaStudioProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const MangaStudio: React.FC<MangaStudioProps> = ({ project, onUpdateProject }) => {
  const [selectedPanel, setSelectedPanel] = useState<MangaPanel>(project.mangaPanels[0] || null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isRenderingArt, setIsRenderingArt] = useState(false);
  const [scenePromptInput, setScenePromptInput] = useState('');
  const [viewMode, setViewMode] = useState<'tankobon' | 'webtoon'>('tankobon');

  // Trigger Gemini Manga Storyboard Layout Generation
  const handleGenerateMangaPanels = async () => {
    setIsGeneratingStory(true);
    try {
      const response = await fetch('/api/gemini/manga-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneDescription: scenePromptInput || project.synopsis,
          panelCount: 3
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.panels)) {
        const generatedPanels: MangaPanel[] = data.panels.map((p: any, idx: number) => ({
          id: `panel-${Date.now()}-${idx}`,
          panelNumber: project.mangaPanels.length + idx + 1,
          layout: p.layout || 'standard',
          cameraAngle: p.cameraAngle || 'Medium Shot',
          sfx: p.sfx || 'ドドド',
          prompt: p.prompt || scenePromptInput,
          imageUrl: `https://picsum.photos/seed/manga-${Date.now()}-${idx}/800/600`,
          dialogueBubbles: p.dialogue ? [
            {
              id: `b-${Date.now()}`,
              characterId: project.characters[0]?.id || 'char-1',
              characterName: p.speaker || project.characters[0]?.name || 'Protagonist',
              text: p.dialogue,
              bubbleType: 'speech',
              position: { x: 50, y: 75 }
            }
          ] : []
        }));

        const updatedPanels = [...project.mangaPanels, ...generatedPanels];
        onUpdateProject({ ...project, mangaPanels: updatedPanels });
        setSelectedPanel(generatedPanels[0]);
        setScenePromptInput('');
      }
    } catch (err) {
      console.error('Manga panel generation error:', err);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Trigger Gemini Image Art for single panel
  const handleRenderPanelArt = async (panel: MangaPanel) => {
    setIsRenderingArt(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Black and white manga page ink illustration, ${panel.cameraAngle}, ${panel.prompt}`,
          aspectRatio: panel.layout === 'wide' ? '16:9' : panel.layout === 'tall' ? '9:16' : '4:3'
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updatedPanel = { ...panel, imageUrl: data.imageUrl };
        const updatedPanels = project.mangaPanels.map((p) => (p.id === panel.id ? updatedPanel : p));
        onUpdateProject({ ...project, mangaPanels: updatedPanels });
        setSelectedPanel(updatedPanel);
      }
    } catch (err) {
      console.error('Failed to render panel art:', err);
    } finally {
      setIsRenderingArt(false);
    }
  };

  // Add Dialogue Bubble to Panel
  const handleAddDialogueBubble = (panel: MangaPanel) => {
    const newBubble: DialogueBubble = {
      id: `bubble-${Date.now()}`,
      characterId: project.characters[0]?.id || 'c1',
      characterName: project.characters[0]?.name || 'Protagonist',
      text: 'New line of anime dialogue...',
      bubbleType: 'speech',
      position: { x: 50, y: 70 }
    };
    const updatedPanel = {
      ...panel,
      dialogueBubbles: [...panel.dialogueBubbles, newBubble]
    };
    const updatedPanels = project.mangaPanels.map((p) => (p.id === panel.id ? updatedPanel : p));
    onUpdateProject({ ...project, mangaPanels: updatedPanels });
    setSelectedPanel(updatedPanel);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-fuchsia-400" />
            <h1 className="text-xl font-bold text-white">Manga & Webtoon Storyboard Studio</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Construct manga panel grids, Japanese katakana sound effects, speech bubbles, and AI line-art rendering.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('tankobon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'tankobon' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tankobon Page View
            </button>
            <button
              onClick={() => setViewMode('webtoon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'webtoon' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Webtoon Scroll Mode
            </button>
          </div>
        </div>
      </div>

      {/* AI Panel Prompt Engine */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-300 mb-1">
            GEMINI MANGA PANEL STORYBOARDER
          </label>
          <input
            type="text"
            value={scenePromptInput}
            onChange={(e) => setScenePromptInput(e.target.value)}
            placeholder="e.g. Ren-01 activates plasma katana in rain as enforcers surround her from above..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        <button
          onClick={handleGenerateMangaPanels}
          disabled={isGeneratingStory}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-semibold text-xs transition-all shadow-lg shadow-fuchsia-600/20 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGeneratingStory ? 'Drafting Storyboard...' : 'Generate Manga Panels'}</span>
        </button>
      </div>

      {/* Main Manga Layout View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Storyboard Panels Canvas */}
        <div className={`lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 ${
          viewMode === 'webtoon' ? 'max-w-xl mx-auto space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
        }`}>
          {project.mangaPanels.map((panel) => {
            const isSelected = selectedPanel?.id === panel.id;
            return (
              <div
                key={panel.id}
                onClick={() => setSelectedPanel(panel)}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  panel.layout === 'splash' ? 'sm:col-span-2' : ''
                } ${
                  isSelected ? 'border-fuchsia-500 shadow-xl shadow-fuchsia-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img
                    src={panel.imageUrl || 'https://picsum.photos/seed/manga/600/400'}
                    alt={`Manga panel ${panel.panelNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-95 contrast-125 group-hover:grayscale-0 transition-all duration-300"
                  />

                  {/* Panel Metadata Pill */}
                  <div className="absolute top-2 left-2 bg-black/80 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 backdrop-blur-sm">
                    #{panel.panelNumber} • {panel.cameraAngle}
                  </div>

                  {/* Katakana Sound Effect Overlay */}
                  {panel.sfx && (
                    <div className="absolute top-4 right-4 text-3xl font-black text-rose-500 tracking-widest font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none animate-bounce">
                      {panel.sfx}
                    </div>
                  )}

                  {/* Speech Bubbles Render */}
                  {panel.dialogueBubbles.map((b) => (
                    <div
                      key={b.id}
                      className="absolute bg-white text-slate-950 p-2.5 rounded-2xl max-w-[200px] shadow-2xl border-2 border-slate-900 font-sans text-[11px] font-bold leading-tight"
                      style={{ left: `${b.position.x}%`, top: `${b.position.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <span className="text-[9px] text-violet-700 font-mono block uppercase">{b.characterName}</span>
                      "{b.text}"
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 p-2.5 flex items-center justify-between text-xs border-t border-slate-800">
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-[240px]">{panel.prompt}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenderPanelArt(panel);
                    }}
                    disabled={isRenderingArt}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-fuchsia-300 rounded font-semibold text-[11px] flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRenderingArt ? 'animate-spin' : ''}`} />
                    <span>Redraw Art</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Panel Inspector & Speech Bubble Editor */}
        {selectedPanel ? (
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layout className="w-4 h-4 text-fuchsia-400" />
                <span>INSPECT PANEL #{selectedPanel.panelNumber}</span>
              </h3>
            </div>

            {/* Panel Layout & Camera Angle Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">CAMERA ANGLE</label>
                <select
                  value={selectedPanel.cameraAngle}
                  onChange={(e: any) => {
                    const updated = { ...selectedPanel, cameraAngle: e.target.value };
                    const updatedPanels = project.mangaPanels.map((p) => (p.id === selectedPanel.id ? updated : p));
                    onUpdateProject({ ...project, mangaPanels: updatedPanels });
                    setSelectedPanel(updated);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                >
                  <option value="Close-up">Close-up</option>
                  <option value="Medium Shot">Medium Shot</option>
                  <option value="Wide Shot">Wide Shot</option>
                  <option value="Low Angle Worm Eye">Low Angle Worm Eye</option>
                  <option value="High Angle Bird Eye">High Angle Bird Eye</option>
                  <option value="Dutch Angle">Dutch Angle</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">JAPANESE SFX (KATAKANA)</label>
                <input
                  type="text"
                  value={selectedPanel.sfx}
                  onChange={(e) => {
                    const updated = { ...selectedPanel, sfx: e.target.value };
                    const updatedPanels = project.mangaPanels.map((p) => (p.id === selectedPanel.id ? updated : p));
                    onUpdateProject({ ...project, mangaPanels: updatedPanels });
                    setSelectedPanel(updated);
                  }}
                  placeholder="e.g. ドドド or BOM!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">MANGA ART PROMPT</label>
                <textarea
                  value={selectedPanel.prompt}
                  onChange={(e) => {
                    const updated = { ...selectedPanel, prompt: e.target.value };
                    const updatedPanels = project.mangaPanels.map((p) => (p.id === selectedPanel.id ? updated : p));
                    onUpdateProject({ ...project, mangaPanels: updatedPanels });
                    setSelectedPanel(updated);
                  }}
                  className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            </div>

            {/* Speech Bubbles Manager */}
            <div className="border-t border-slate-800 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                  <span>SPEECH BUBBLES ({selectedPanel.dialogueBubbles.length})</span>
                </span>
                <button
                  onClick={() => handleAddDialogueBubble(selectedPanel)}
                  className="text-[11px] font-semibold text-fuchsia-400 hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Bubble</span>
                </button>
              </div>

              {selectedPanel.dialogueBubbles.map((bubble, idx) => (
                <div key={bubble.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <select
                      value={bubble.characterName}
                      onChange={(e) => {
                        const updatedBubbles = [...selectedPanel.dialogueBubbles];
                        updatedBubbles[idx].characterName = e.target.value;
                        const updated = { ...selectedPanel, dialogueBubbles: updatedBubbles };
                        const updatedPanels = project.mangaPanels.map((p) => (p.id === selectedPanel.id ? updated : p));
                        onUpdateProject({ ...project, mangaPanels: updatedPanels });
                        setSelectedPanel(updated);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded text-xs text-violet-300 font-bold p-1"
                    >
                      {project.characters.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const updatedBubbles = selectedPanel.dialogueBubbles.filter((b) => b.id !== bubble.id);
                        const updated = { ...selectedPanel, dialogueBubbles: updatedBubbles };
                        const updatedPanels = project.mangaPanels.map((p) => (p.id === selectedPanel.id ? updated : p));
                        onUpdateProject({ ...project, mangaPanels: updatedPanels });
                        setSelectedPanel(updated);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={bubble.text}
                    onChange={(e) => {
                      const updatedBubbles = [...selectedPanel.dialogueBubbles];
                      updatedBubbles[idx].text = e.target.value;
                      const updated = { ...selectedPanel, dialogueBubbles: updatedBubbles };
                      const updatedPanels = project.mangaPanels.map((p) => (p.id === selectedPanel.id ? updated : p));
                      onUpdateProject({ ...project, mangaPanels: updatedPanels });
                      setSelectedPanel(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
