import React, { useState } from 'react';
import { 
  X, 
  Swords, 
  Zap, 
  Layers, 
  Sparkles, 
  Mic, 
  Crown, 
  Plus, 
  Check 
} from 'lucide-react';
import { DetailedCharacter, CharacterExpression } from '../../types';
import { useAddCharacterExpression } from '../../hooks/useCharacterStudioData';

interface CharacterDetailModalProps {
  character: DetailedCharacter | null;
  onClose: () => void;
  onOpenVoiceDubbing: (characterName: string) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  onOpenVoiceDubbing
}) => {
  const addExpression = useAddCharacterExpression();

  const [isAddingExpression, setIsAddingExpression] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<CharacterExpression['emotion']>('Heroic / Determined');
  const [promptDesc, setPromptDesc] = useState('');

  if (!character) return null;

  const handleCreateExpression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptDesc.trim()) return;

    addExpression.mutate(
      {
        characterId: character.id,
        expression: {
          emotion: selectedEmotion,
          imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
          promptDescription: promptDesc.trim()
        }
      },
      {
        onSuccess: () => {
          setPromptDesc('');
          setIsAddingExpression(false);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 border-b border-slate-800 pb-4">
          <img
            src={character.avatarUrl}
            alt={character.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-xl object-cover border border-slate-800 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">{character.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {character.role}
              </span>
            </div>
            {character.japaneseName && (
              <span className="text-xs text-slate-400 font-serif block">{character.japaneseName}</span>
            )}
            <p className="text-xs text-indigo-300 font-mono mt-1">
              Affiliation: {character.factionAffiliation} • Voice: {character.voiceProfile.voiceActorName}
            </p>
          </div>
        </div>

        {/* Character Radar Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Combat</span>
            <strong className="text-amber-400 font-mono">{character.stats?.combatPower || 85}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Agility</span>
            <strong className="text-emerald-400 font-mono">{character.stats?.agilitySpeed || 80}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Tactics</span>
            <strong className="text-indigo-400 font-mono">{character.stats?.intelligenceTactics || 85}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Mana</span>
            <strong className="text-purple-400 font-mono">{character.stats?.manaAffinity || 90}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Defense</span>
            <strong className="text-cyan-400 font-mono">{character.stats?.defenseResist || 75}</strong>
          </div>
        </div>

        {/* Backstory & Personality */}
        <div className="space-y-2 text-xs text-slate-300">
          <strong className="text-slate-100 font-mono block">Backstory & Lore:</strong>
          <p className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl leading-relaxed">
            {character.backstory}
          </p>
        </div>

        {/* Expression Sheets Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Multi-Angle Expression Sheets ({character.expressions?.length || 0})</span>
            </h3>

            <button
              onClick={() => setIsAddingExpression(!isAddingExpression)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expression</span>
            </button>
          </div>

          {/* Add Expression Form */}
          {isAddingExpression && (
            <form onSubmit={handleCreateExpression} className="p-3 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Emotion State</label>
                  <select
                    value={selectedEmotion}
                    onChange={(e) => setSelectedEmotion(e.target.value as any)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="Heroic / Determined">Heroic / Determined</option>
                    <option value="Tsundere / Blushing">Tsundere / Blushing</option>
                    <option value="Combat Rage">Combat Rage</option>
                    <option value="Shocked / Wide-Eyed">Shocked / Wide-Eyed</option>
                    <option value="Sly Smile">Sly Smile</option>
                    <option value="Melancholy">Melancholy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Prompt Spec</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Screaming battle cry with plasma glow"
                    value={promptDesc}
                    onChange={(e) => setPromptDesc(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addExpression.isPending || !promptDesc.trim()}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md"
              >
                {addExpression.isPending ? 'Generating Sheet...' : 'Generate Expression Sheet'}
              </button>
            </form>
          )}

          {/* Expression Sheets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {character.expressions?.map((exp) => (
              <div key={exp.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2 space-y-1.5">
                <img
                  src={exp.imageUrl}
                  alt={exp.emotion}
                  referrerPolicy="no-referrer"
                  className="w-full h-24 object-cover rounded-lg border border-slate-800"
                />
                <span className="text-[10px] font-mono font-bold text-indigo-300 block truncate">
                  {exp.emotion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenVoiceDubbing(character.name);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Open Voice Dubbing Rig</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
