import React from 'react';
import { 
  Crown, 
  Swords, 
  Zap, 
  Mic, 
  Eye, 
  Flame, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';
import { DetailedCharacter } from '../../types';

interface CharacterGridCardProps {
  character: DetailedCharacter;
  onInspect: (character: DetailedCharacter) => void;
  onOpenVoiceDubbing: (characterName: string) => void;
}

export const CharacterGridCard: React.FC<CharacterGridCardProps> = ({
  character,
  onInspect,
  onOpenVoiceDubbing
}) => {
  const getElementBadge = (elem: string) => {
    switch (elem) {
      case 'Fire': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Ice': return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Lightning': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Void': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Plasma': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Star-Mote': default: return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 space-y-4 shadow-lg backdrop-blur-sm transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Avatar Image & Floating Badges */}
        <div className="relative h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={character.avatarUrl}
            alt={character.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getElementBadge(character.element)}`}>
              {character.element}
            </span>
            <span className="text-[10px] font-mono font-bold bg-slate-950/80 text-amber-400 px-2 py-0.5 rounded border border-slate-800">
              PWR: {character.stats?.combatPower || 85}
            </span>
          </div>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-mono text-indigo-300 block">{character.factionAffiliation}</span>
            <h3 className="text-base font-black text-white">{character.name}</h3>
            {character.japaneseName && (
              <span className="text-[10px] font-serif text-slate-400">{character.japaneseName}</span>
            )}
          </div>
        </div>

        {/* Character Role & Bio */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
              {character.role}
            </span>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {character.age}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {character.description}
          </p>
        </div>

        {/* Signature Move Pill */}
        {character.signatureMoves.length > 0 && (
          <div className="text-[10px] font-mono bg-slate-950 border border-slate-800/80 p-2 rounded-xl text-slate-300 flex items-center space-x-2">
            <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Ult: {character.signatureMoves[0]}</span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onOpenVoiceDubbing(character.name)}
          className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
        >
          <Mic className="w-3 h-3" />
          <span>Dub Voice ({character.voiceProfile.voiceActorName})</span>
        </button>

        <button
          onClick={() => onInspect(character)}
          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
        >
          <span>Inspect Rig</span>
          <Eye className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
