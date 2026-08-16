import React, { useState } from 'react';
import { 
  Image, 
  Plus, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Eye 
} from 'lucide-react';
import { LightNovelChapter, IllustrationAnchor } from '../../types';
import { useAddIllustrationAnchor } from '../../hooks/useNovelStudioData';

interface IllustrationAnchorsTabProps {
  chapters: LightNovelChapter[];
}

export const IllustrationAnchorsTab: React.FC<IllustrationAnchorsTabProps> = ({
  chapters
}) => {
  const addAnchor = useAddIllustrationAnchor();

  const [selectedChapterId, setSelectedChapterId] = useState(chapters[0]?.id || '');
  const [anchorName, setAnchorName] = useState('');
  const [paragraphIndex, setParagraphIndex] = useState(2);
  const [promptDesc, setPromptDesc] = useState('');
  const [styleTag, setStyleTag] = useState<IllustrationAnchor['styleTag']>('Full-Page Splash');
  const [isAdding, setIsAdding] = useState(false);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];

  const handleCreateAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorName.trim() || !promptDesc.trim() || !selectedChapterId) return;

    addAnchor.mutate(
      {
        chapterId: selectedChapterId,
        anchor: {
          anchorName,
          paragraphIndex: Number(paragraphIndex),
          promptDescription: promptDesc,
          styleTag,
          imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
        }
      },
      {
        onSuccess: () => {
          setAnchorName('');
          setPromptDesc('');
          setIsAdding(false);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Image className="w-5 h-5 text-purple-400" />
              <span>Light Novel Key Visual Illustration Anchors</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Insert full-page splash artwork, battle climax spreads, and character profile cards into light novel chapter manuscripts.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>Ch. {c.chapterNumber}: {c.title}</option>
              ))}
            </select>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Visual Anchor</span>
            </button>
          </div>
        </div>

        {/* Add Visual Anchor Form */}
        {isAdding && (
          <form onSubmit={handleCreateAnchor} className="p-4 bg-slate-950 border border-purple-500/40 rounded-xl space-y-3 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              NEW KEY VISUAL ILLUSTRATION SPECIFICATION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-300 block mb-1">Anchor Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Centurion Sky Drop"
                  value={anchorName}
                  onChange={(e) => setAnchorName(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-300 block mb-1">Paragraph Target Index</label>
                <input
                  type="number"
                  min={1}
                  value={paragraphIndex}
                  onChange={(e) => setParagraphIndex(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-300 block mb-1">Illustration Style Format</label>
                <select
                  value={styleTag}
                  onChange={(e) => setStyleTag(e.target.value as any)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                >
                  <option value="Full-Page Splash">Full-Page Splash</option>
                  <option value="Battle Climax Insert">Battle Climax Insert</option>
                  <option value="Chibi Interlude">Chibi Interlude</option>
                  <option value="Character Profile Spread">Character Profile Spread</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300 block mb-1">Illustration Prompt Description</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. High-energy anime artwork of two cybernetic centurions dropping from rain-slicked neon skyscrapers..."
                value={promptDesc}
                onChange={(e) => setPromptDesc(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={addAnchor.isPending}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
            >
              {addAnchor.isPending ? 'Generating Illustration Anchor...' : 'Save Visual Anchor to Chapter'}
            </button>
          </form>
        )}
      </div>

      {/* Anchors Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(selectedChapter?.illustrationAnchors || []).map((anchor) => (
          <div key={anchor.id} className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 space-y-3 shadow-lg backdrop-blur-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                {anchor.imageUrl ? (
                  <img src={anchor.imageUrl} alt={anchor.anchorName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Image</div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-purple-300">
                  {anchor.styleTag}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400">Target: Paragraph #{anchor.paragraphIndex}</span>
                <h3 className="text-sm font-bold text-white">{anchor.anchorName}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">{anchor.promptDescription}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(selectedChapter?.illustrationAnchors || []).length === 0 && (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          No key visual illustration anchors attached to Chapter {selectedChapter?.chapterNumber}. Click "Add Visual Anchor" above!
        </div>
      )}
    </div>
  );
};
