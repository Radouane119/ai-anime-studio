import React, { useState } from 'react';
import { Genre, Project, ProjectFormat } from '../types';
import { Plus, Sparkles, X, Clapperboard } from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onCreateProject }) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [format, setFormat] = useState<ProjectFormat>('anime_series');
  const [genre, setGenre] = useState<Genre>('cyberpunk');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title,
      tagline: tagline || 'An exciting new AI anime production.',
      format: format,
      genre: genre,
      synopsis: synopsis || 'Story outline created in AI Anime Studio.',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      updatedAt: new Date().toISOString(),
      episodesCount: 1,
      charactersCount: 1,
      mangaPagesCount: 1,
      voiceTracksCount: 0,
      characters: [
        {
          id: `char-init-${Date.now()}`,
          name: 'Main Hero',
          role: 'protagonist',
          archetype: 'Determined Hero',
          age: 18,
          height: '175 cm',
          stats: { strength: 80, magic: 80, agility: 80, intellect: 80, charisma: 80 },
          personality: 'Brave, loyal, and unyielding.',
          backstory: 'Forged through trial and adversity.',
          visualPrompt: 'High quality anime style hero protagonist',
          outfitDetails: 'Custom armor coat',
          voiceName: 'Kore',
          signatureMove: 'Rising Strike',
          avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80'
        }
      ],
      chapters: [],
      mangaPanels: [],
      storyboardFrames: [],
      voiceTracks: [],
      videoGenerations: []
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">Create New AI Anime Project</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">PROJECT TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blade of the Void: Rebirth"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">TAGLINE</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. When magic and mecha collide, destiny is rewritten."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">FORMAT</label>
              <select
                value={format}
                onChange={(e: any) => setFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="anime_series">Anime Series (TV)</option>
                <option value="manga_comic">Manga Comic (Tankobon)</option>
                <option value="webtoon">Webtoon Vertical Scroll</option>
                <option value="light_novel">Light Novel</option>
                <option value="storyboard">Cinematic Storyboard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">GENRE</label>
              <select
                value={genre}
                onChange={(e: any) => setGenre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="fantasy_isekai">Fantasy / Isekai</option>
                <option value="shonen_action">Shonen Action</option>
                <option value="slice_of_life">Slice of Life</option>
                <option value="mecha_sci_fi">Mecha Sci-Fi</option>
                <option value="dark_supernatural">Dark Supernatural</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">STORY SYNOPSIS</label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Brief summary of the world, plot, and main conflict..."
              className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20"
            >
              Initialize Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
