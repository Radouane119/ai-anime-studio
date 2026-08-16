import React, { useState } from 'react';
import { Character, Project } from '../types';
import { 
  Users, 
  Sparkles, 
  Plus, 
  Zap, 
  Mic, 
  Shield, 
  Award, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Check, 
  Image as ImageIcon,
  Flame
} from 'lucide-react';

interface CharacterStudioProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const CharacterStudio: React.FC<CharacterStudioProps> = ({ project, onUpdateProject }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(project.characters[0] || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form states for AI Character Creation
  const [promptInput, setPromptInput] = useState('');
  const [roleInput, setRoleInput] = useState<'protagonist' | 'deuteragonist' | 'antagonist' | 'supporting' | 'mentor'>('protagonist');
  const [archetypeInput, setArchetypeInput] = useState('Cybernetic Assassin');

  // Trigger Gemini AI Character Generation
  const handleGenerateAICharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/character-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          role: roleInput,
          archetype: archetypeInput,
          genre: project.genre
        })
      });

      const data = await response.json();
      if (data.success && data.character) {
        const newChar: Character = {
          id: `char-${Date.now()}`,
          name: data.character.name || 'New Character',
          japaneseName: data.character.japaneseName || '',
          role: roleInput,
          archetype: data.character.archetype || archetypeInput,
          age: data.character.age || 20,
          height: data.character.height || '175 cm',
          stats: data.character.stats || { strength: 80, magic: 75, agility: 85, intellect: 80, charisma: 70 },
          personality: data.character.personality || '',
          backstory: data.character.backstory || '',
          visualPrompt: data.character.visualPrompt || promptInput,
          outfitDetails: data.character.outfitDetails || '',
          voiceName: data.character.voiceName || 'Kore',
          signatureMove: data.character.signatureMove || 'Ultimate Strike',
          avatarUrl: `https://picsum.photos/seed/${Date.now()}/400/400`
        };

        const updatedChars = [...project.characters, newChar];
        onUpdateProject({ ...project, characters: updatedChars });
        setSelectedCharacter(newChar);
        setShowNewModal(false);
        setPromptInput('');
      }
    } catch (err) {
      console.error('Failed to generate AI character:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Gemini Image Art Generation for Character Portrait
  const handleGenerateCharacterArt = async () => {
    if (!selectedCharacter) return;
    setIsGeneratingArt(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: selectedCharacter.visualPrompt || selectedCharacter.name,
          aspectRatio: '1:1'
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updatedChar = { ...selectedCharacter, avatarUrl: data.imageUrl };
        const updatedList = project.characters.map((c) => (c.id === selectedCharacter.id ? updatedChar : c));
        onUpdateProject({ ...project, characters: updatedList });
        setSelectedCharacter(updatedChar);
      }
    } catch (err) {
      console.error('Failed to generate character portrait art:', err);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Character Lorebook & AI Studio</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Design anime protagonists, stat web parameters, signature moves, voice profiles, and high-res art.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/25 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Character</span>
        </button>
      </div>

      {/* Main Content Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character List */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>CHARACTER ROSTER ({project.characters.length})</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">GEMINI POWERED</span>
          </div>

          <div className="space-y-2">
            {project.characters.map((char) => {
              const isSelected = selectedCharacter?.id === char.id;
              return (
                <div
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-violet-950/40 border-violet-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={char.avatarUrl || 'https://picsum.photos/seed/char/100/100'}
                    alt={char.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold truncate">{char.name}</h3>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-violet-300 uppercase">
                        {char.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{char.archetype}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">Voice: {char.voiceName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Character Inspector & Art Generator */}
        {selectedCharacter ? (
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <img
                    src={selectedCharacter.avatarUrl || 'https://picsum.photos/seed/char/200/200'}
                    alt={selectedCharacter.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-violet-500/40 shadow-lg"
                  />
                  <button
                    onClick={handleGenerateCharacterArt}
                    disabled={isGeneratingArt}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-bold"
                  >
                    <RefreshCw className={`w-4 h-4 mb-1 ${isGeneratingArt ? 'animate-spin' : ''}`} />
                    <span>Redraw Portrait</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-extrabold text-white">{selectedCharacter.name}</h2>
                    {selectedCharacter.japaneseName && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-sans">
                        {selectedCharacter.japaneseName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-violet-400 font-medium mt-0.5">
                    {selectedCharacter.archetype} • {selectedCharacter.age} yrs • {selectedCharacter.height}
                  </p>
                  <div className="flex items-center space-x-3 mt-1.5">
                    <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                      <Mic className="w-3.5 h-3.5 text-cyan-400" />
                      <span>VA: {selectedCharacter.voiceName}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>Move: {selectedCharacter.signatureMove || 'N/A'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateCharacterArt}
                disabled={isGeneratingArt}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{isGeneratingArt ? 'Rendering AI Art...' : 'Generate New Artwork'}</span>
              </button>
            </div>

            {/* Character Stats Matrix */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>BATTLE STAT PARAMETERS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Physical Strength (PWR)</span>
                    <span className="font-mono text-violet-400">{selectedCharacter.stats.strength} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.strength}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Magic / Neural Energy (MAG)</span>
                    <span className="font-mono text-cyan-400">{selectedCharacter.stats.magic} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.magic}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Agility & Speed (AGI)</span>
                    <span className="font-mono text-fuchsia-400">{selectedCharacter.stats.agility} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-fuchsia-400 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.agility}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Tactical Intelligence (INT)</span>
                    <span className="font-mono text-emerald-400">{selectedCharacter.stats.intellect} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedCharacter.stats.intellect}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Backstory & Personality Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-violet-300 uppercase">Personality Profile</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedCharacter.personality}</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">Outfit & Visual Aesthetics</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedCharacter.outfitDetails || selectedCharacter.visualPrompt}</p>
              </div>
            </div>

            {/* Full Backstory */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Lorebook Origin Backstory</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">{selectedCharacter.backstory}</p>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            Select a character from the roster or generate a new one with Gemini.
          </div>
        )}
      </div>

      {/* AI Character Creation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">Gemini AI Character Generator</h2>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAICharacter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  CHARACTER CONCEPT PROMPT *
                </label>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. A rogue dark elf elementalist with cursed frost gauntlets who seeks vengeance against the empire..."
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">ROLE</label>
                  <select
                    value={roleInput}
                    onChange={(e: any) => setRoleInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="protagonist">Protagonist (Hero)</option>
                    <option value="deuteragonist">Deuteragonist (Rival/Ally)</option>
                    <option value="antagonist">Antagonist (Villain)</option>
                    <option value="supporting">Supporting Character</option>
                    <option value="mentor">Mentor / Sensei</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">ARCHETYPE</label>
                  <input
                    type="text"
                    value={archetypeInput}
                    onChange={(e) => setArchetypeInput(e.target.value)}
                    placeholder="e.g. Tsundere Alchemist"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !promptInput.trim()}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Synthesizing Profile...' : 'Generate Character'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
