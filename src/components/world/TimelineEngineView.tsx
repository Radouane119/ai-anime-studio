import React, { useState } from 'react';
import { 
  History, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  Users, 
  Plus, 
  X,
  Swords,
  Scroll
} from 'lucide-react';
import { TimelineEvent, EventCategory } from '../../types';
import { useCreateTimelineEvent } from '../../hooks/useWorldBuildingData';

interface TimelineEngineViewProps {
  events: TimelineEvent[];
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
}

export const TimelineEngineView: React.FC<TimelineEngineViewProps> = ({
  events,
  isCreateModalOpen,
  onCloseCreateModal
}) => {
  const createEvent = useCreateTimelineEvent();

  // Form State
  const [era, setEra] = useState('Cyber-Mana Era');
  const [year, setYear] = useState('2096 AE');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('War & Conflict');
  const [description, setDescription] = useState('');
  const [impactScore, setImpactScore] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createEvent.mutate(
      {
        era,
        year,
        title: title.trim(),
        category,
        description: description.trim(),
        keyFactions: ['Aetherial Syndicate'],
        keyCharacters: ['Kaito Vance'],
        impactScore
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          onCloseCreateModal();
        }
      }
    );
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Cataclysm': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'War & Conflict': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Discovery': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Political Treaty': default: return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chronological Timeline Track */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8">
        {events.map((evt, idx) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Node Bullet */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 group-hover:scale-125 transition-all shadow-md shadow-indigo-500/40" />

            {/* Event Card */}
            <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 shadow-lg backdrop-blur-sm transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-sm">
                    {evt.year}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ({evt.era})
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getCategoryBadge(evt.category)}`}>
                    {evt.category}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs font-mono">
                  <span className="text-slate-400">World Impact:</span>
                  <span className="font-bold text-amber-400">{evt.impactScore} / 10</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {/* Factions & Characters involved */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
                {evt.keyFactions.map((f, i) => (
                  <span key={i} className="text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md">
                    Faction: {f}
                  </span>
                ))}
                {evt.keyCharacters.map((c, i) => (
                  <span key={i} className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    Char: {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating New Timeline Event */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={onCloseCreateModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span>Add Historical Timeline Event</span>
              </h2>
              <p className="text-xs text-slate-400">
                Log key wars, catastrophic ruptures, political treaties, or technological breakthroughs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Era Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cyber-Mana Era"
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Chronological Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2096 AE"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., The Battle of Sky-Tower"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Event Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="War & Conflict">War & Conflict</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Cataclysm">Cataclysm</option>
                    <option value="Political Treaty">Political Treaty</option>
                    <option value="Ascension">Ascension</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">World Impact Rating (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={impactScore}
                  onChange={(e) => setImpactScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Historical Narrative & Outcome *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the cause, major battles, participant casualties, and lasting world consequences..."
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
                  disabled={createEvent.isPending || !title.trim() || !description.trim()}
                  className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {createEvent.isPending ? 'Saving...' : 'Log Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
