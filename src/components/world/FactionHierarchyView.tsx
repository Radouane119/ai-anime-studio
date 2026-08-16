import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Crown, 
  MapPin, 
  Plus, 
  Swords, 
  HeartHandshake, 
  Zap, 
  X,
  Sparkles
} from 'lucide-react';
import { Faction, FactionType, FactionAlignment } from '../../types';
import { useCreateFaction } from '../../hooks/useWorldBuildingData';

interface FactionHierarchyViewProps {
  factions: Faction[];
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
}

export const FactionHierarchyView: React.FC<FactionHierarchyViewProps> = ({
  factions,
  isCreateModalOpen,
  onCloseCreateModal
}) => {
  const createFaction = useCreateFaction();

  // Form State for new Faction
  const [name, setName] = useState('');
  const [type, setType] = useState<FactionType>('Syndicate');
  const [leader, setLeader] = useState('');
  const [alignment, setAlignment] = useState<FactionAlignment>('Chaotic Neutral');
  const [powerLevel, setPowerLevel] = useState(75);
  const [membersCount, setMembersCount] = useState(5000);
  const [headquarters, setHeadquarters] = useState('');
  const [motto, setMotto] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8b5cf6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leader.trim()) return;

    createFaction.mutate(
      {
        name: name.trim(),
        type,
        leader: leader.trim(),
        alignment,
        powerLevel,
        membersCount,
        headquarters: headquarters.trim() || 'Uncharted Sector',
        motto: motto.trim() || 'Forward into the unknown.',
        description: description.trim() || `${name} is an active faction in the anime lore database.`,
        allies: [],
        enemies: [],
        color
      },
      {
        onSuccess: () => {
          setName('');
          setLeader('');
          setHeadquarters('');
          setMotto('');
          setDescription('');
          onCloseCreateModal();
        }
      }
    );
  };

  const getTypeBadge = (fType: FactionType) => {
    switch (fType) {
      case 'Megacorp': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Magic Order': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Syndicate': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Rebellion': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Empire': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Guild': default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Factions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {factions.map((fac) => (
          <div
            key={fac.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-sm transition-all"
            style={{ borderLeft: `4px solid ${fac.color}` }}
          >
            {/* Header Title & Type */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-white">{fac.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getTypeBadge(fac.type)}`}>
                    {fac.type}
                  </span>
                </div>
                <p className="text-xs text-indigo-300 italic font-serif mt-1">
                  "{fac.motto}"
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block">Power Rating</span>
                <span className="text-sm font-black font-mono text-amber-400">{fac.powerLevel} / 100</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {fac.description}
            </p>

            {/* Meta Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Leader</span>
                </span>
                <strong className="text-slate-100">{fac.leader}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-mono block flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  <span>Headquarters</span>
                </span>
                <strong className="text-slate-100 truncate block">{fac.headquarters}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-mono block flex items-center space-x-1">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>Members</span>
                </span>
                <strong className="text-slate-100 font-mono">{fac.membersCount.toLocaleString()}</strong>
              </div>
            </div>

            {/* Allies & Rivals Badges */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono text-slate-400">Allies:</span>
                <div className="flex flex-wrap gap-1">
                  {fac.allies.length > 0 ? (
                    fac.allies.map((a, i) => (
                      <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">None listed</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-[10px] font-mono text-slate-400">Rivals:</span>
                <div className="flex flex-wrap gap-1">
                  {fac.enemies.length > 0 ? (
                    fac.enemies.map((e, i) => (
                      <span key={i} className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded-md">
                        {e}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">None listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating New Faction */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={onCloseCreateModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Create New Faction Rig</span>
              </h2>
              <p className="text-xs text-slate-400">
                Define the political structure, leadership, power score, and alignment archetype for your world.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Faction Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Shadow Shinobi Clan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Faction Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FactionType)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Syndicate">Syndicate</option>
                    <option value="Megacorp">Megacorp</option>
                    <option value="Magic Order">Magic Order</option>
                    <option value="Rebellion">Rebellion</option>
                    <option value="Empire">Empire</option>
                    <option value="Guild">Guild</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Leader Character *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Lord Kage"
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Headquarters</label>
                  <input
                    type="text"
                    placeholder="e.g., Hidden Fortress Sector 7"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Power Score (1-100)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={powerLevel}
                    onChange={(e) => setPowerLevel(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Member Count</label>
                  <input
                    type="number"
                    min={1}
                    value={membersCount}
                    onChange={(e) => setMembersCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Motto / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g., From the shadows we rule the neon sky"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Description & Lore</label>
                <textarea
                  rows={3}
                  placeholder="Outline faction history, primary goals, and territory details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-4 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFaction.isPending || !name.trim() || !leader.trim()}
                  className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {createFaction.isPending ? 'Saving...' : 'Create Faction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
