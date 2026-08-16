import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Users, 
  Compass, 
  Plus, 
  X, 
  Eye, 
  Building2, 
  Flame 
} from 'lucide-react';
import { WorldLocation, LocationType } from '../../types';
import { useCreateWorldLocation } from '../../hooks/useWorldBuildingData';

interface WorldMapCanvasViewProps {
  locations: WorldLocation[];
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
}

export const WorldMapCanvasView: React.FC<WorldMapCanvasViewProps> = ({
  locations,
  isCreateModalOpen,
  onCloseCreateModal
}) => {
  const createLocation = useCreateWorldLocation();

  const [selectedLoc, setSelectedLoc] = useState<WorldLocation | null>(locations[0] || null);

  // Form State
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState<LocationType>('Capital City');
  const [controllingFaction, setControllingFaction] = useState('Aetherial Syndicate');
  const [dangerLevel, setDangerLevel] = useState<'Safe Zone' | 'Moderate Risk' | 'Lethal Hazard' | 'Extinction Level'>('Moderate Risk');
  const [population, setPopulation] = useState('500,000');
  const [mapX, setMapX] = useState(50);
  const [mapY, setMapY] = useState(50);
  const [description, setDescription] = useState('');
  const [poiInput, setPoiInput] = useState('');
  const [pois, setPois] = useState<string[]>(['Central Plaza', 'Rune Tower']);

  const handleAddPoi = () => {
    if (!poiInput.trim()) return;
    if (!pois.includes(poiInput.trim())) setPois([...pois, poiInput.trim()]);
    setPoiInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !region.trim()) return;

    createLocation.mutate(
      {
        name: name.trim(),
        region: region.trim(),
        type,
        controllingFaction,
        dangerLevel,
        population: population.trim() || 'Unknown',
        mapX,
        mapY,
        description: description.trim() || `${name} is a location in the anime world map.`,
        pointsOfInterest: pois,
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80'
      },
      {
        onSuccess: () => {
          setName('');
          setRegion('');
          setDescription('');
          onCloseCreateModal();
        }
      }
    );
  };

  const getDangerBadge = (level: string) => {
    switch (level) {
      case 'Extinction Level': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Lethal Hazard': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Moderate Risk': return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
      case 'Safe Zone': default: return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer Canvas */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Interactive World Map Coordinates</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Click location pin to view details</span>
          </div>

          {/* Interactive Tactical Map Container */}
          <div className="relative w-full h-[420px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group">
            {/* Grid Map Background */}
            <div 
              className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Map Pin Buttons */}
            {locations.map((loc) => {
              const isSelected = selectedLoc?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border transition-all cursor-pointer group/pin ${
                    isSelected
                      ? 'bg-indigo-600 border-white text-white scale-125 z-20 shadow-lg shadow-indigo-500/50'
                      : 'bg-slate-900/90 border-indigo-500/50 text-indigo-400 hover:scale-110 z-10'
                  }`}
                >
                  <MapPin className="w-4 h-4 animate-bounce" />
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/pin:flex flex-col items-center z-30 pointer-events-none whitespace-nowrap">
                    <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-white rounded-lg text-[10px] font-bold shadow-xl">
                      {loc.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Locations Quick Switcher Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
                  selectedLoc?.id === loc.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Location Details Panel */}
        {selectedLoc ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedLoc.imageUrl}
                  alt={selectedLoc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getDangerBadge(selectedLoc.dangerLevel)}`}>
                    {selectedLoc.dangerLevel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    Pop: {selectedLoc.population}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">{selectedLoc.region}</span>
                <h3 className="text-lg font-bold text-white">{selectedLoc.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedLoc.description}
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Controlling Faction:</span>
                  <strong className="text-indigo-300">{selectedLoc.controllingFaction}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Location Type:</span>
                  <strong className="text-slate-200">{selectedLoc.type}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <strong className="text-xs text-slate-300 font-mono block">Points of Interest:</strong>
                <div className="space-y-1">
                  {selectedLoc.pointsOfInterest.map((poi, idx) => (
                    <div key={idx} className="px-3 py-1.5 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{poi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 flex items-center justify-center text-slate-500 text-xs">
            Select a map pin to view location specs
          </div>
        )}
      </div>

      {/* Modal for Creating New Location */}
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
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span>Add World Map Location</span>
              </h2>
              <p className="text-xs text-slate-400">
                Register new cities, dungeons, citadels, or ruins on the interactive map grid.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Location Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Neo-Tokyo Level 0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Region Sector *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., East Pacific Megacity"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Location Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as LocationType)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Capital City">Capital City</option>
                    <option value="Forbidden Dungeon">Forbidden Dungeon</option>
                    <option value="Ancient Ruins">Ancient Ruins</option>
                    <option value="Orbital Citadel">Orbital Citadel</option>
                    <option value="Shattered Zone">Shattered Zone</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Danger Level</label>
                  <select
                    value={dangerLevel}
                    onChange={(e) => setDangerLevel(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Safe Zone">Safe Zone</option>
                    <option value="Moderate Risk">Moderate Risk</option>
                    <option value="Lethal Hazard">Lethal Hazard</option>
                    <option value="Extinction Level">Extinction Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Map X % (0-100)</label>
                  <input
                    type="number"
                    min={5}
                    max={95}
                    value={mapX}
                    onChange={(e) => setMapX(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Map Y % (0-100)</label>
                  <input
                    type="number"
                    min={5}
                    max={95}
                    value={mapY}
                    onChange={(e) => setMapY(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Description & Atmosphere</label>
                <textarea
                  rows={2}
                  placeholder="Atmospheric summary of the region..."
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
                  disabled={createLocation.isPending || !name.trim() || !region.trim()}
                  className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {createLocation.isPending ? 'Saving...' : 'Add Map Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
