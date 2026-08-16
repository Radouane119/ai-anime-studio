import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  X, 
  Check, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { useCreateNovelChapter } from '../../hooks/useNovelStudioData';
import { NovelTone, Project } from '../../types';

interface AiNovelGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const AiNovelGeneratorModal: React.FC<AiNovelGeneratorModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const createChapter = useCreateNovelChapter();

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<NovelTone>('Action / Cyberpunk');
  const [chapterNumber, setChapterNumber] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);
  const [generationError, setGenerationError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedOutput(null);

    try {
      const response = await fetch('/api/gemini/story-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Chapter ${chapterNumber}: ${prompt.slice(0, 60)}`,
          genre: project.genre,
          format: project.format,
          premise: prompt,
          characters: project.characters.map(({ name, role }) => ({ name, role }))
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.script) {
        throw new Error(payload.error || 'The writing service did not return a draft.');
      }

      const script = payload.script;
      const content = script.fullScriptText || script.summary;
      setGeneratedOutput({
        chapterNumber: Number(chapterNumber),
        title: script.chapterTitle || `Chapter ${chapterNumber}`,
        summary: script.summary || prompt,
        tone,
        content,
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
        dialogueNodes: [],
        illustrationAnchors: [{
          id: 'ia_gen1',
          anchorName: 'Chapter key visual',
          paragraphIndex: 1,
          promptDescription: script.suggestedImagePrompt || prompt,
          styleTag: 'Full-Page Splash'
        }]
      });
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Unable to generate a chapter right now.');
    } finally {
      setIsGenerating(false);
    }
    return;
    /*
     * Previous local-only fixture retained temporarily as a migration reference.
     * Generation now always goes through /api/gemini/story-script above.
     */
    /* setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput({
        chapterNumber: Number(chapterNumber),
        title: `Eclipse Over ${prompt.slice(0, 15)}`,
        japaneseTitle: '日食のサイバーブレード',
        summary: `Synthesized Chapter ${chapterNumber} based on concept: "${prompt}".`,
        tone: tone,
        content: `The neon fog hung heavy over the plasma docks as Chapter ${chapterNumber} unfolded.

Ren Kurogane ignited his hyper-blade, blue plasma sparks illuminating the towering steel bulkheads.

"We have three minutes before OmniCorp orbital sensors recalibrate," Puck alerted through the tactical comms.

Ren smirked into the rain. "Three minutes is two minutes too long."`,
        wordCount: 56,
        dialogueNodes: [
          { id: 'dn_gen1', speakerName: 'Puck', emotion: 'Tactical', line: 'We have three minutes before OmniCorp orbital sensors recalibrate.' },
          { id: 'dn_gen2', speakerName: 'Ren Kurogane', emotion: 'Confident', line: 'Three minutes is two minutes too long.' }
        ],
        illustrationAnchors: [
          {
            id: 'ia_gen1',
            anchorName: 'Plasma Dock Climax',
            paragraphIndex: 2,
            promptDescription: 'Ren Kurogane standing on plasma docks with ignited hyper-blade in neon fog',
            imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
            styleTag: 'Battle Climax Insert'
          }
        ]
      });
    }, 1200); */
  };

  const handleApply = () => {
    if (!generatedOutput) return;
    createChapter.mutate(generatedOutput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-purple-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Gemini Light Novel Writer</h2>
          </div>
          <p className="text-xs text-slate-400">
            Prompt Gemini 1.5 Pro to synthesize light novel chapters complete with Japanese titles, dialogue nodes, and visual illustration anchors.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Chapter Number</label>
            <input
              type="number"
              min={1}
              value={chapterNumber}
              onChange={(e) => setChapterNumber(Number(e.target.value))}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Genre Tone Spec</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as NovelTone)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Action / Cyberpunk">Action / Cyberpunk</option>
              <option value="Dark Fantasy">Dark Fantasy</option>
              <option value="Slice of Life / RomCom">Slice of Life / RomCom</option>
              <option value="Isekai Fantasy">Isekai Fantasy</option>
              <option value="Psychological Thriller">Psychological Thriller</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">Chapter Plot Concept</label>
          <textarea
            rows={3}
            placeholder="e.g. Ren infiltrates the OmniCorp plasma docks under cover of a thunderstorm..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Light Novel Chapter...' : 'Draft Chapter with Gemini 1.5 Pro'}</span>
        </button>

        {generatedOutput && (
          <div className="p-4 bg-slate-950 border border-purple-500/40 rounded-xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                Synthesized Manuscript Preview
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                Ch. {generatedOutput.chapterNumber}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                {generatedOutput.title}
                {generatedOutput.japaneseTitle ? ` (${generatedOutput.japaneseTitle})` : ''}
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed italic">
                "{generatedOutput.summary}"
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Commit Chapter to Volume Outline</span>
            </button>
          </div>
        )}

        {generationError && (
          <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {generationError}
          </p>
        )}
      </div>
    </div>
  );
};
