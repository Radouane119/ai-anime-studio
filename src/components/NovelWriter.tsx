import React, { useState } from 'react';
import { NovelChapter, Project } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  FileText, 
  Video, 
  Wand2, 
  Copy, 
  Check, 
  Save, 
  SlidersHorizontal,
  Layers
} from 'lucide-react';

interface NovelWriterProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const NovelWriter: React.FC<NovelWriterProps> = ({ project, onUpdateProject }) => {
  const [selectedChapter, setSelectedChapter] = useState<NovelChapter>(
    project.chapters[0] || {
      id: 'chap-1',
      chapterNumber: 1,
      title: 'Episode 1: Awakening in the Neon Rain',
      summary: 'Ren-01 breaks free from cryo-chamber in District 9.',
      content: `The rainfall in Neo-Tokyo was never real water. It was toxic, heavy with synthetic lubricants...`,
      sceneBeats: ['Ren-01 awakens in rain', 'Enforcer squad ambush', 'Ignition of Plasma Katana'],
      suggestedPrompt: 'Cyberpunk anime female kunoichi drawing plasma blade under neon rain',
      wordCount: 850
    }
  );

  const [isExpanding, setIsExpanding] = useState(false);
  const [editorText, setEditorText] = useState(selectedChapter.content);
  const [copied, setCopied] = useState(false);
  const [premiseInput, setPremiseInput] = useState('');

  // Save changes to chapter
  const handleSaveChapter = () => {
    const wordCount = editorText.trim().split(/\s+/).length;
    const updatedChapter = { ...selectedChapter, content: editorText, wordCount };
    const updatedChapters = project.chapters.map((c) => (c.id === selectedChapter.id ? updatedChapter : c));

    // If new chapter, add it
    const exists = project.chapters.some((c) => c.id === selectedChapter.id);
    const finalChapters = exists ? updatedChapters : [...project.chapters, updatedChapter];

    onUpdateProject({ ...project, chapters: finalChapters });
  };

  // Generate Script & Scene Beats using Gemini
  const handleGenerateAIScript = async () => {
    setIsExpanding(true);
    try {
      const response = await fetch('/api/gemini/story-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedChapter.title,
          genre: project.genre,
          format: project.format,
          premise: premiseInput || selectedChapter.summary || project.synopsis,
          characters: project.characters.map((c) => ({ name: c.name, role: c.role }))
        })
      });

      const data = await response.json();
      if (data.success && data.script) {
        const newScript = data.script.fullScriptText || data.script.summary;
        setEditorText((prev) => `${prev}\n\n/* AI GENERATED SCENE BEATS */\n` + newScript);
        setSelectedChapter((prev) => ({
          ...prev,
          summary: data.script.summary || prev.summary,
          sceneBeats: data.script.sceneBeats || prev.sceneBeats,
          suggestedPrompt: data.script.suggestedImagePrompt || prev.suggestedPrompt
        }));
      }
    } catch (err) {
      console.error('Failed to generate AI script:', err);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Light Novel & Anime Script Studio</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Write light novel chapters, expand episode dialogue, generate camera cues, and extract keybeats.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveChapter}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Chapter</span>
          </button>

          <button
            onClick={handleGenerateAIScript}
            disabled={isExpanding}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExpanding ? 'AI Scriptwriting...' : 'AI Expand Scene'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chapter List & AI Assistant Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>EPISODES / CHAPTERS ({project.chapters.length})</span>
              <button
                onClick={() => {
                  const newChap: NovelChapter = {
                    id: `chap-${Date.now()}`,
                    chapterNumber: project.chapters.length + 1,
                    title: `Episode ${project.chapters.length + 1}: Uncharted Sigil`,
                    summary: 'New scene outline...',
                    content: 'Write your chapter script here...',
                    sceneBeats: [],
                    suggestedPrompt: '',
                    wordCount: 0
                  };
                  onUpdateProject({ ...project, chapters: [...project.chapters, newChap] });
                  setSelectedChapter(newChap);
                  setEditorText(newChap.content);
                }}
                className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Episode</span>
              </button>
            </div>

            <div className="space-y-2">
              {project.chapters.map((chap) => {
                const isSelected = selectedChapter?.id === chap.id;
                return (
                  <div
                    key={chap.id}
                    onClick={() => {
                      setSelectedChapter(chap);
                      setEditorText(chap.content);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{chap.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{chap.wordCount || 0} words • Scene beats: {chap.sceneBeats.length}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Generator Prompter */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>GEMINI SCRIPTWRITER INSTRUCTIONS</span>
            </div>
            <textarea
              value={premiseInput}
              onChange={(e) => setPremiseInput(e.target.value)}
              placeholder="e.g. Ren-01 infiltrates the rooftop heli-pad while Renji hacks the elevator override..."
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleGenerateAIScript}
              disabled={isExpanding}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isExpanding ? 'Expanding Plot...' : 'Generate Scene Script'}</span>
            </button>
          </div>

          {/* Scene Beats Summary */}
          {selectedChapter.sceneBeats.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Extracted Scene Beats</h4>
              <ul className="space-y-1.5">
                {selectedChapter.sceneBeats.map((beat, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{beat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Editor Workspace */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <input
              type="text"
              value={selectedChapter.title}
              onChange={(e) => setSelectedChapter({ ...selectedChapter, title: e.target.value })}
              className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-transparent focus:border-cyan-500 w-full"
            />
            <div className="flex items-center space-x-3 shrink-0 text-xs text-slate-400 font-mono">
              <span>{editorText.trim().split(/\s+/).length} WORDS</span>
              <button
                onClick={handleCopy}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Copy Script"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <textarea
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            className="w-full flex-1 min-h-[480px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-sans text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500/50 resize-y"
            placeholder="Write light novel prose or anime script breakdown here..."
          />

          {selectedChapter.suggestedPrompt && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="truncate">
                <span className="font-bold text-cyan-400">Suggested Anime Visual Prompt: </span>
                <span className="text-slate-300 italic truncate">{selectedChapter.suggestedPrompt}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
