import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  X, 
  Check, 
  Users, 
  Swords, 
  ShieldAlert 
} from 'lucide-react';
import { useCreateDetailedCharacter } from '../../hooks/useCharacterStudioData';
import { CharacterArchetype, CharacterElement } from '../../types';

interface AiCharacterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCharacterGeneratorModal: React.FC<AiCharacterGeneratorModalProps> = ({
  isOpen,
  onClose
}) => {
  const createCharacter = useCreateDetailedCharacter();

  const [prompt, setPrompt] = useState('');
  const [archetype, setArchetype] = useState<CharacterArchetype>('Protagonist');
  const [element, setElement] = useState<CharacterElement>('Plasma');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput({
        name: `Aoi ${prompt.slice(0, 10)}`,
        japaneseName: '葵 零',
        role: archetype,
        archetype: archetype,
        element: element,
        age: '20 Years',
        factionAffiliation: 'Rebellion Cell Zero',
        description: `Synthesized anime character concept based on: "${prompt}". Operates as a ${archetype} specializing in ${element} elemental combat.`,
        personalityTraits: ['Rebellious', 'Tactical', 'Fierce'],
        signatureMoves: [`${element} Overdrive`, 'Neural Strike', 'Flash Dash'],
        backstory: `Generated via Gemini 1.5 Pro. Raised in the subterranean sectors before unlocking ${element} affinity during the Great Rupture.`,
        avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        stats: {
          combatPower: 90,
          agilitySpeed: 85,
          intelligenceTactics: 88,
          manaAffinity: 92,
          defenseResist: 78
        },
        expressions: [],
        voiceProfile: {
          voiceActorName: 'Puck',
          pitchModifier: 0,
          speedModifier: 1.0,
          catchphrase: 'My power is absolute.',
          preferredTone: 'heroic'
        }
      });
    }, 1200);
  };

  const handleApply = () => {
    if (!generatedOutput) return;
    createCharacter.mutate(generatedOutput);
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
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Gemini Character Generator</h2>
          </div>
          <p className="text-xs text-slate-400">
            Prompt Gemini 1.5 Pro to synthesize anime character sheets with stats, backstories, signature moves, and voice actor models.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Archetype</label>
            <select
              value={archetype}
              onChange={(e) => setArchetype(e.target.value as CharacterArchetype)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Protagonist">Protagonist</option>
              <option value="Antagonist">Antagonist</option>
              <option value="Rival">Rival</option>
              <option value="Mentor">Mentor</option>
              <option value="Sidekick">Sidekick</option>
              <option value="Anti-Hero">Anti-Hero</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Element Affinity</label>
            <select
              value={element}
              onChange={(e) => setElement(e.target.value as CharacterElement)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="Fire">Fire</option>
              <option value="Ice">Ice</option>
              <option value="Lightning">Lightning</option>
              <option value="Void">Void</option>
              <option value="Plasma">Plasma</option>
              <option value="Star-Mote">Star-Mote</option>
              <option value="Cyberware">Cyberware</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 block">Character Prompt Concept</label>
          <textarea
            rows={3}
            placeholder="e.g. A rogue dual-wielding plasma assassin with a tragic backstory from Sector 9..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Character Sheet...' : 'Generate with Gemini 1.5 Pro'}</span>
        </button>

        {generatedOutput && (
          <div className="p-4 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
                Synthesized Character Sheet
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                Combat Rating: {generatedOutput.stats.combatPower}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                {generatedOutput.name} ({generatedOutput.japaneseName})
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {generatedOutput.description}
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Commit Character to Roster</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
