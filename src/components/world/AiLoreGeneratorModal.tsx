import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  X, 
  BookOpen, 
  Users, 
  MapPin, 
  History, 
  Check 
} from 'lucide-react';
import { useCreateLoreEntry, useCreateFaction, useCreateWorldLocation, useCreateTimelineEvent } from '../../hooks/useWorldBuildingData';

interface AiLoreGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiLoreGeneratorModal: React.FC<AiLoreGeneratorModalProps> = ({
  isOpen,
  onClose
}) => {
  const createLore = useCreateLoreEntry();
  const createFaction = useCreateFaction();
  const createLocation = useCreateWorldLocation();
  const createEvent = useCreateTimelineEvent();

  const [prompt, setPrompt] = useState('');
  const [targetType, setTargetType] = useState<'lore' | 'faction' | 'location' | 'event'>('lore');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Simulate AI synthesis based on user prompt
    setTimeout(() => {
      setIsGenerating(false);

      if (targetType === 'lore') {
        setGeneratedOutput({
          title: `Neural Quantum ${prompt.slice(0, 15)} Matrix`,
          category: 'Magic System',
          summary: `Synthesized magic system generated from prompt: "${prompt}". Uses quantum resonance to translate thought into elemental kinetic force.`,
          detailedContent: `Operating at the Planck scale, users inject nano-fluid converters into their nervous system. Upon focusing mental intent, atmospheric particles crystallize into plasma arc blades. Overuse causes temporary synaptic blackouts.`,
          secrecyLevel: 'Guarded Secret',
          tags: ['AI Generated', 'Quantum', 'Magic']
        });
      } else if (targetType === 'faction') {
        setGeneratedOutput({
          name: `Order of the ${prompt.slice(0, 12)} Void`,
          type: 'Magic Order',
          leader: 'Grandmaster Vane',
          alignment: 'Chaotic Neutral',
          powerLevel: 89,
          membersCount: 8400,
          headquarters: 'Astral Spire Apex',
          motto: 'In the silence of the void, steel reigns.',
          description: `An elite cabal inspired by "${prompt}", dedicated to harnessing void energy to balance corporate tyranny with natural magic reserves.`,
          color: '#8b5cf6'
        });
      } else if (targetType === 'location') {
        setGeneratedOutput({
          name: `${prompt.slice(0, 12)} Sector 9`,
          region: 'Aetherial Outlands',
          type: 'Shattered Zone',
          controllingFaction: 'Independent Scavengers',
          dangerLevel: 'Lethal Hazard',
          population: '45,000 Wastes Dwellers',
          mapX: 62,
          mapY: 48,
          description: `A heavily distorted biome generated from "${prompt}". Starlight mana storms pass through every 12 hours, energizing floating metallic monoliths.`,
          pointsOfInterest: ['The Cobalt Crater', 'Sub-Basement Trading Post'],
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
        });
      } else {
        setGeneratedOutput({
          era: 'Aetherial Era',
          year: '2099 AE',
          title: `The Great ${prompt.slice(0, 15)} Convergence`,
          category: 'Cataclysm',
          description: `Historical milestone resulting from "${prompt}". Three major leyline currents converged over Tokyo-4, elevating magical density by 300%.`,
          keyFactions: ['Aetherial Syndicate'],
          keyCharacters: ['Kaito Vance'],
          impactScore: 9
        });
      }
    }, 1200);
  };

  const handleApply = () => {
    if (!generatedOutput) return;

    if (targetType === 'lore') {
      createLore.mutate({
        title: generatedOutput.title,
        category: generatedOutput.category,
        summary: generatedOutput.summary,
        detailedContent: generatedOutput.detailedContent,
        tags: generatedOutput.tags,
        secrecyLevel: generatedOutput.secrecyLevel,
        associatedCharacters: []
      });
    } else if (targetType === 'faction') {
      createFaction.mutate({
        name: generatedOutput.name,
        type: generatedOutput.type,
        leader: generatedOutput.leader,
        alignment: generatedOutput.alignment,
        powerLevel: generatedOutput.powerLevel,
        membersCount: generatedOutput.membersCount,
        headquarters: generatedOutput.headquarters,
        motto: generatedOutput.motto,
        description: generatedOutput.description,
        allies: [],
        enemies: [],
        color: generatedOutput.color
      });
    } else if (targetType === 'location') {
      createLocation.mutate(generatedOutput);
    } else {
      createEvent.mutate(generatedOutput);
    }

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
            <h2 className="text-xl font-bold text-white">Gemini World-Building AI Assistant</h2>
          </div>
          <p className="text-xs text-slate-400">
            Prompt Gemini 1.5 Pro to synthesize rich magic systems, faction lore, territory locations, or historical events.
          </p>
        </div>

        {/* Target Entity Selector */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'lore', label: 'Magic/Lore', icon: BookOpen },
            { id: 'faction', label: 'Faction', icon: Users },
            { id: 'location', label: 'Location', icon: MapPin },
            { id: 'event', label: 'Timeline', icon: History }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = targetType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTargetType(item.id as any);
                  setGeneratedOutput(null);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center space-y-1 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">Synthesis Prompt Idea</label>
          <textarea
            rows={3}
            placeholder="e.g. A dark cyberpunk magic order that uses blood-mana to power floating orbital snipers..."
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
          <span>{isGenerating ? 'Synthesizing Lore Matrix...' : 'Generate with Gemini 1.5 Pro'}</span>
        </button>

        {/* Generated Output Preview */}
        {generatedOutput && (
          <div className="p-4 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
                Generated {targetType} Record
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                Ready to Commit
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                {generatedOutput.title || generatedOutput.name}
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {generatedOutput.summary || generatedOutput.description}
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Add Record to World Database</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
