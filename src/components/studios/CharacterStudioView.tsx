import React, { useState } from 'react';
import { Project, DetailedCharacter } from '../../types';
import { 
  useDetailedCharacters, 
  useCharacterStudioTelemetry 
} from '../../hooks/useCharacterStudioData';
import { CharacterStudioHeader, CharacterStudioSubTab } from '../character/CharacterStudioHeader';
import { CharacterGridCard } from '../character/CharacterGridCard';
import { CharacterDetailModal } from '../character/CharacterDetailModal';
import { AiCharacterGeneratorModal } from '../character/AiCharacterGeneratorModal';
import { VoiceDubbingRigTab } from '../character/VoiceDubbingRigTab';
import { 
  Search, 
  Filter, 
  Swords, 
  Layers, 
  Users, 
  Sparkles, 
  ShieldAlert, 
  Crown 
} from 'lucide-react';

interface CharacterStudioViewProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const CharacterStudioView: React.FC<CharacterStudioViewProps> = ({
  project,
  onUpdateProject
}) => {
  const charactersQuery = useDetailedCharacters();
  const telemetryQuery = useCharacterStudioTelemetry();

  const charactersList = charactersQuery.data || [];
  const telemetry = telemetryQuery.data;

  const [activeSubTab, setActiveSubTab] = useState<CharacterStudioSubTab>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [inspectCharacter, setInspectCharacter] = useState<DetailedCharacter | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [preselectedDubCharacter, setPreselectedDubCharacter] = useState<string | undefined>(undefined);

  const filteredCharacters = charactersList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.factionAffiliation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || c.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenVoiceDubbing = (characterName: string) => {
    setPreselectedDubCharacter(characterName);
    setActiveSubTab('voice');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header */}
      <CharacterStudioHeader
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        onOpenCreateCharacter={() => setIsAiModalOpen(true)}
      />

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">ROSTER SIZE</span>
            <span className="text-base font-extrabold text-white">{telemetry?.totalCharacters || charactersList.length}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">AVG COMBAT RATING</span>
            <span className="text-base font-extrabold text-white">{telemetry?.avgCombatRating || 88}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">EXPRESSION SHEETS</span>
            <span className="text-base font-extrabold text-white">{telemetry?.totalExpressionsGenerated || 4}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">DUBBED VOICE TRACKS</span>
            <span className="text-base font-extrabold text-white">{(project.voiceTracks || []).length}</span>
          </div>
        </div>
      </div>

      {/* Roster View */}
      {activeSubTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search character name or backstory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 font-mono">Role:</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Roles</option>
                <option value="Protagonist">Protagonist</option>
                <option value="Antagonist">Antagonist</option>
                <option value="Mentor">Mentor</option>
                <option value="Rival">Rival</option>
              </select>
            </div>
          </div>

          {/* Character Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((char) => (
              <CharacterGridCard
                key={char.id}
                character={char}
                onInspect={setInspectCharacter}
                onOpenVoiceDubbing={handleOpenVoiceDubbing}
              />
            ))}
          </div>

          {filteredCharacters.length === 0 && (
            <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
              <p className="text-sm font-bold text-slate-400">No characters match your search filter.</p>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Synthesize Character with Gemini
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expression Sheets Sub-Tab */}
      {activeSubTab === 'expressions' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Multi-Angle Character Expression Sheets</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistent facial and emotional expression sheets generated across all roster characters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {charactersList.map((char) => (
              <div key={char.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={char.avatarUrl} alt={char.name} className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                  <div>
                    <h3 className="text-xs font-bold text-white">{char.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{char.expressions?.length || 0} Expression Sheets</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {char.expressions?.map((exp) => (
                    <div key={exp.id} className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 space-y-1">
                      <img src={exp.imageUrl} alt={exp.emotion} className="w-full h-16 object-cover rounded" />
                      <span className="text-[9px] font-mono text-indigo-300 block truncate">{exp.emotion}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Dubbing Sub-Tab */}
      {activeSubTab === 'voice' && (
        <VoiceDubbingRigTab
          project={project}
          onUpdateProject={onUpdateProject}
          preselectedCharacterName={preselectedDubCharacter}
        />
      )}

      {/* Stats Sub-Tab */}
      {activeSubTab === 'stats' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Swords className="w-5 h-5 text-amber-400" />
                <span>Roster Power Rating Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparative stat ratings across all characters in the active project.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {charactersList.map((char) => (
              <div key={char.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{char.name} ({char.role})</span>
                  <span className="text-xs font-mono font-bold text-amber-400">Combat Power: {char.stats?.combatPower || 85}</span>
                </div>

                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${char.stats?.combatPower || 85}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CharacterDetailModal
        character={inspectCharacter}
        onClose={() => setInspectCharacter(null)}
        onOpenVoiceDubbing={handleOpenVoiceDubbing}
      />

      <AiCharacterGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
