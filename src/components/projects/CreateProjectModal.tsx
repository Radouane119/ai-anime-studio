import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Film, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  Tag, 
  Check, 
  Wand2 
} from 'lucide-react';
import { useCreateWorkspaceProject } from '../../hooks/useProjectsData';
import { ProjectFormat } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const createProject = useCreateWorkspaceProject();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [format, setFormat] = useState<ProjectFormat>('anime_series');
  const [genre, setGenre] = useState('Cyberpunk');
  const [synopsis, setSynopsis] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [tags, setTags] = useState<string[]>(['AI Studio', 'Cyberpunk', 'Original Series']);

  if (!isOpen) return null;

  const formats = [
    { id: 'anime_series', label: 'Anime Series', description: 'Multi-episode 4K animated production with voice dubbing', icon: Film },
    { id: 'light_novel', label: 'Light Novel', description: 'Rich chapter writer with Gemini AI scene beats and prose', icon: BookOpen },
    { id: 'manga_comic', label: 'Manga / Comic', description: 'Multi-panel layout editor with dialogue bubbles & SFX', icon: Layers },
    { id: 'youtube_short', label: 'YouTube Short', description: 'Vertical 9:16 high-fps viral video shorts', icon: PlaySquare }
  ];

  const genres = [
    'Cyberpunk',
    'Dark Fantasy',
    'Action / Shonen',
    'Slice of Life',
    'Sci-Fi / Mecha',
    'Supernatural',
    'Isekai',
    'Romance'
  ];

  const handleAddTag = () => {
    if (!customTag.trim()) return;
    if (!tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
    }
    setCustomTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProject.mutate(
      {
        title: title.trim(),
        tagline: tagline.trim() || 'Original AI Anime Studio Rig',
        format,
        genre,
        synopsis: synopsis.trim() || `${title} is an original ${genre} production created in AI Anime Studio.`,
        tags
      },
      {
        onSuccess: () => {
          setTitle('');
          setTagline('');
          setSynopsis('');
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Initialize New Studio Rig</h2>
          </div>
          <p className="text-xs text-slate-400">
            Select your format specification, genre tropes, and initial studio configuration parameters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Format Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              1. Production Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((f) => {
                const Icon = f.icon;
                const isSelected = format === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as ProjectFormat)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{f.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{f.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Cyber Blade: Neo Tokyo 2099"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Tagline / Subtitle</label>
              <input
                type="text"
                placeholder="e.g., The fate of mankind rests on neural steel"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Genre Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Primary Genre Archetype</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    genre === g
                      ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Lore Synopsis & World Pitch</label>
            <textarea
              rows={3}
              placeholder="Outline the primary plot, protagonist goal, central conflict, and world atmosphere..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Custom Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Tags & Keywords</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add keyword tag (e.g. 4K, Cyberpunk, Mecha)"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span key={t} className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-lg flex items-center space-x-1">
                  <span>#{t}</span>
                  <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-400 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProject.isPending || !title.trim()}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{createProject.isPending ? 'Building Rig...' : 'Create Studio Rig'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
