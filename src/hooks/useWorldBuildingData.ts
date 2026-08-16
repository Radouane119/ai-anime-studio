import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Faction, 
  LoreEntry, 
  WorldLocation, 
  TimelineEvent, 
  WorldBuildingStats 
} from '../types';

// Default mock datasets for world building lore
const INITIAL_FACTIONS: Faction[] = [
  {
    id: 'fac_01',
    name: 'Aetherial Syndicate',
    type: 'Syndicate',
    leader: 'Kaito Vance',
    alignment: 'Chaotic Neutral',
    powerLevel: 88,
    membersCount: 14200,
    headquarters: 'Neo-Tokyo Level 0',
    motto: 'Knowledge is free, steel is absolute.',
    description: 'An underground cyber-syndicate specializing in illegal neural implants, rogue AI cores, and contraband magic tech.',
    allies: ['Shadow Ninjas Guild'],
    enemies: ['OmniCorp Security', 'Holy Order of Starlight'],
    color: '#8b5cf6'
  },
  {
    id: 'fac_02',
    name: 'OmniCorp Security Force',
    type: 'Megacorp',
    leader: 'Director Sarah Vance',
    alignment: 'Lawful Evil',
    powerLevel: 95,
    membersCount: 85000,
    headquarters: 'Sky-Tower Apex',
    motto: 'Order through militarized perfection.',
    description: 'The mega-conglomerate controlling 70% of Tokyo-4 energy grids and orbital defense networks.',
    allies: ['Holy Order of Starlight'],
    enemies: ['Aetherial Syndicate', 'Rebellion Cell Zero'],
    color: '#ef4444'
  },
  {
    id: 'fac_03',
    name: 'Holy Order of Starlight',
    type: 'Magic Order',
    leader: 'High Priestess Lyra',
    alignment: 'Lawful Good',
    powerLevel: 82,
    membersCount: 6400,
    headquarters: 'Aether Cathedral Citadel',
    motto: 'May the void stars guide our blades.',
    description: 'Ancient order of paladins wielding star-motes to purify corrupted mana zones and abyssal rifts.',
    allies: ['OmniCorp Security'],
    enemies: ['Aetherial Syndicate'],
    color: '#3b82f6'
  },
  {
    id: 'fac_04',
    name: 'Rebellion Cell Zero',
    type: 'Rebellion',
    leader: 'Ren Kurogane',
    alignment: 'Chaotic Good',
    powerLevel: 74,
    membersCount: 3200,
    headquarters: 'Sub-Basement 9 Sector',
    motto: 'Break the neural chains.',
    description: 'Freedom fighters opposing corporate neural surveillance and mandatory cyberware registration.',
    allies: ['Aetherial Syndicate'],
    enemies: ['OmniCorp Security'],
    color: '#10b981'
  }
];

const INITIAL_LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'lore_01',
    title: 'Mana-Neural Link (MNL-Core)',
    category: 'Magic System',
    summary: 'Biomechanical interface allowing humans to channel ambient mana as raw plasma energy.',
    detailedContent: 'Developed during the Third Cyber War, the MNL-Core translates synaptic impulses directly into elemental spells. Excessive usage causes Neural Overclock syndrome.',
    tags: ['Cyberware', 'Magic', 'MNL', 'Weapons'],
    secrecyLevel: 'Public Knowledge',
    associatedCharacters: ['Kaito Vance', 'Director Sarah Vance'],
    updatedAt: '2026-08-04T12:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'lore_02',
    title: 'The Eclipse Calamity of 2088',
    category: 'Religion',
    summary: 'The catastrophic celestial alignment that shattered the upper atmosphere and bled starlight mana into Earth.',
    detailedContent: 'When the dual moons aligned with Saturn, atmospheric barriers ruptured, showering major metropolises with crystalline starlight shards that granted supernatural abilities.',
    tags: ['Calamity', 'History', 'Starlight', 'Lore'],
    secrecyLevel: 'Public Knowledge',
    associatedCharacters: ['High Priestess Lyra'],
    updatedAt: '2026-08-03T15:30:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'lore_03',
    title: 'Zero-Point Hyper-Blade',
    category: 'Relic',
    summary: 'Forged from fallen meteoric titanium and tuned to oscillating plasma frequencies.',
    detailedContent: 'Only 3 hyper-blades exist across the world. They vibrate at 100,000 Hz, allowing the wielder to slice cleanly through tank armor and energy barriers.',
    tags: ['Relic', 'Weapon', 'Titanium', 'Kurogane'],
    secrecyLevel: 'Guarded Secret',
    associatedCharacters: ['Ren Kurogane'],
    updatedAt: '2026-08-05T09:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'lore_04',
    title: 'Dark Quantum Network',
    category: 'Technology',
    summary: 'Encrypted sub-space communication mesh immune to corporate surveillance.',
    detailedContent: 'Operating on entangled photon states beneath the physical internet layer, used exclusively by underground hackers and rebellion strategists.',
    tags: ['Tech', 'Encryption', 'Quantum', 'Hackers'],
    secrecyLevel: 'Forbidden Knowledge',
    associatedCharacters: ['Kaito Vance'],
    updatedAt: '2026-08-01T11:00:00.000Z'
  }
];

const INITIAL_LOCATIONS: WorldLocation[] = [
  {
    id: 'loc_01',
    name: 'Neo-Tokyo Level 0',
    region: 'East Pacific Megacity',
    type: 'Shattered Zone',
    controllingFaction: 'Aetherial Syndicate',
    dangerLevel: 'Lethal Hazard',
    population: '2.4 Million',
    mapX: 35,
    mapY: 65,
    description: 'Neon-drenched subterranean slums built beneath the massive concrete pylons supporting the upper corporate platforms.',
    pointsOfInterest: ['Black Market Alley', 'The Rusty Circuit Lounge', 'Neural Repair Bay 9'],
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_02',
    name: 'Sky-Tower Apex',
    region: 'Upper Stratosphere Zone',
    type: 'Orbital Citadel',
    controllingFaction: 'OmniCorp Security Force',
    dangerLevel: 'Safe Zone',
    population: '120,000 Elite Citizens',
    mapX: 75,
    mapY: 25,
    description: 'Floating glass-and-steel monolith towering 2,000 meters into the clouds, housing corporate directors and research laboratories.',
    pointsOfInterest: ['Director Executive Suite', 'Orbital Defense Command', 'Quantum AI Reactor Core'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc_03',
    name: 'Starlight Cathedral Ruins',
    region: 'Aether Valley Sector',
    type: 'Ancient Ruins',
    controllingFaction: 'Holy Order of Starlight',
    dangerLevel: 'Moderate Risk',
    population: '1,500 Monks & Paladins',
    mapX: 20,
    mapY: 40,
    description: 'Crystalline Gothic ruins emitting a constant blue mana aurora. Site of the first celestial starfall.',
    pointsOfInterest: ['Chamber of Star-Motes', 'Relic Vault Alpha', 'Sanctuary of the Eclipse'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80'
  }
];

const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt_01',
    era: 'Pre-Eclipse Era',
    year: '2085 AE',
    title: 'Founding of OmniCorp Megacorp',
    category: 'Political Treaty',
    description: 'Five mega-tech conglomerates merged into OmniCorp, taking control of global power grids.',
    keyFactions: ['OmniCorp Security Force'],
    keyCharacters: ['Director Sarah Vance'],
    impactScore: 8
  },
  {
    id: 'evt_02',
    era: 'Eclipse Era',
    year: '2088 AE',
    title: 'The Great Starlight Rupture',
    category: 'Cataclysm',
    description: 'Celestial moon alignment breached the atmosphere, awakening magic mana reserves across Earth.',
    keyFactions: ['Holy Order of Starlight'],
    keyCharacters: ['High Priestess Lyra'],
    impactScore: 10
  },
  {
    id: 'evt_03',
    era: 'Cyber-Mana Era',
    year: '2094 AE',
    title: 'The Siege of Level 0',
    category: 'War & Conflict',
    description: 'OmniCorp attempted to eradicate underground cyber-syndicates, triggering a 3-year subterranean war.',
    keyFactions: ['Aetherial Syndicate', 'OmniCorp Security Force', 'Rebellion Cell Zero'],
    keyCharacters: ['Kaito Vance', 'Ren Kurogane'],
    impactScore: 9
  }
];

export function useWorldFactions() {
  return useQuery({
    queryKey: ['world_factions'],
    queryFn: async (): Promise<Faction[]> => {
      const stored = localStorage.getItem('studio_world_factions');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { /* ignore */ }
      }
      return INITIAL_FACTIONS;
    }
  });
}

export function useWorldLoreEntries(categoryFilter?: string, searchQuery?: string) {
  return useQuery({
    queryKey: ['world_lore_entries', categoryFilter, searchQuery],
    queryFn: async (): Promise<LoreEntry[]> => {
      let list: LoreEntry[] = INITIAL_LORE_ENTRIES;
      const stored = localStorage.getItem('studio_world_lore');
      if (stored) {
        try { list = JSON.parse(stored); } catch (e) { /* ignore */ }
      }

      if (categoryFilter && categoryFilter !== 'all') {
        list = list.filter(e => e.category.toLowerCase() === categoryFilter.toLowerCase());
      }

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        list = list.filter(e => 
          e.title.toLowerCase().includes(q) || 
          e.summary.toLowerCase().includes(q) || 
          e.tags.some(t => t.toLowerCase().includes(q))
        );
      }

      return list;
    }
  });
}

export function useWorldLocations() {
  return useQuery({
    queryKey: ['world_locations'],
    queryFn: async (): Promise<WorldLocation[]> => {
      const stored = localStorage.getItem('studio_world_locations');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { /* ignore */ }
      }
      return INITIAL_LOCATIONS;
    }
  });
}

export function useWorldTimelineEvents() {
  return useQuery({
    queryKey: ['world_timeline_events'],
    queryFn: async (): Promise<TimelineEvent[]> => {
      const stored = localStorage.getItem('studio_world_timeline');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { /* ignore */ }
      }
      return INITIAL_TIMELINE_EVENTS;
    }
  });
}

export function useWorldBuildingStats() {
  const factionsQuery = useWorldFactions();
  const loreQuery = useWorldLoreEntries();
  const locationsQuery = useWorldLocations();
  const timelineQuery = useWorldTimelineEvents();

  return useQuery({
    queryKey: ['world_stats', factionsQuery.data, loreQuery.data, locationsQuery.data, timelineQuery.data],
    queryFn: async (): Promise<WorldBuildingStats> => {
      const factions = factionsQuery.data || INITIAL_FACTIONS;
      const lore = loreQuery.data || INITIAL_LORE_ENTRIES;
      const locations = locationsQuery.data || INITIAL_LOCATIONS;
      const timeline = timelineQuery.data || INITIAL_TIMELINE_EVENTS;

      const magicSystems = lore.filter(l => l.category === 'Magic System').length;

      return {
        totalFactions: factions.length,
        totalLoreEntries: lore.length,
        totalLocations: locations.length,
        timelineEventsCount: timeline.length,
        magicSystemsCount: magicSystems
      };
    }
  });
}

// Mutations
export function useCreateFaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newFaction: Omit<Faction, 'id'>) => {
      const stored = localStorage.getItem('studio_world_factions');
      const list: Faction[] = stored ? JSON.parse(stored) : INITIAL_FACTIONS;
      const created: Faction = {
        ...newFaction,
        id: `fac_${Date.now()}`
      };
      const updated = [created, ...list];
      localStorage.setItem('studio_world_factions', JSON.stringify(updated));
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['world_factions'] });
      queryClient.invalidateQueries({ queryKey: ['world_stats'] });
    }
  });
}

export function useCreateLoreEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEntry: Omit<LoreEntry, 'id' | 'updatedAt'>) => {
      const stored = localStorage.getItem('studio_world_lore');
      const list: LoreEntry[] = stored ? JSON.parse(stored) : INITIAL_LORE_ENTRIES;
      const created: LoreEntry = {
        ...newEntry,
        id: `lore_${Date.now()}`,
        updatedAt: new Date().toISOString()
      };
      const updated = [created, ...list];
      localStorage.setItem('studio_world_lore', JSON.stringify(updated));
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['world_lore_entries'] });
      queryClient.invalidateQueries({ queryKey: ['world_stats'] });
    }
  });
}

export function useCreateWorldLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLoc: Omit<WorldLocation, 'id'>) => {
      const stored = localStorage.getItem('studio_world_locations');
      const list: WorldLocation[] = stored ? JSON.parse(stored) : INITIAL_LOCATIONS;
      const created: WorldLocation = {
        ...newLoc,
        id: `loc_${Date.now()}`
      };
      const updated = [created, ...list];
      localStorage.setItem('studio_world_locations', JSON.stringify(updated));
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['world_locations'] });
      queryClient.invalidateQueries({ queryKey: ['world_stats'] });
    }
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEvent: Omit<TimelineEvent, 'id'>) => {
      const stored = localStorage.getItem('studio_world_timeline');
      const list: TimelineEvent[] = stored ? JSON.parse(stored) : INITIAL_TIMELINE_EVENTS;
      const created: TimelineEvent = {
        ...newEvent,
        id: `evt_${Date.now()}`
      };
      const updated = [...list, created];
      localStorage.setItem('studio_world_timeline', JSON.stringify(updated));
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['world_timeline_events'] });
      queryClient.invalidateQueries({ queryKey: ['world_stats'] });
    }
  });
}
