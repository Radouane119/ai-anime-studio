import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DetailedCharacter, CharacterStudioTelemetry, CharacterExpression } from '../types';

const INITIAL_CHARACTERS: DetailedCharacter[] = [
  {
    id: 'char_01',
    name: 'Ren Kurogane',
    japaneseName: '黒鉄 蓮',
    role: 'Protagonist',
    archetype: 'Protagonist',
    element: 'Plasma',
    age: '19 Years',
    factionAffiliation: 'Rebellion Cell Zero',
    description: 'Former OmniCorp rogue operative wielding an experimental MNL plasma core and hyper-blade.',
    personalityTraits: ['Stoic', 'Loyal', 'Relentless', 'Sarcastic'],
    signatureMoves: ['Plasma Overclock Slash', 'Zero-Point Dash', 'Neural Burst'],
    backstory: 'Orphaned during the Siege of Level 0, Ren was enhanced with corporate cyberware before joining the rebellion.',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    stats: {
      combatPower: 92,
      agilitySpeed: 88,
      intelligenceTactics: 79,
      manaAffinity: 85,
      defenseResist: 76
    },
    expressions: [
      {
        id: 'exp_01',
        emotion: 'Heroic / Determined',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        promptDescription: 'Determined gaze, plasma spark in eyes'
      },
      {
        id: 'exp_02',
        emotion: 'Combat Rage',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        promptDescription: 'Screaming battle cry with aura flair'
      }
    ],
    voiceProfile: {
      voiceActorName: 'Puck',
      pitchModifier: 0,
      speedModifier: 1.0,
      catchphrase: 'My blade doesn’t ask for permission.',
      preferredTone: 'heroic'
    },
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'char_02',
    name: 'Director Sarah Vance',
    japaneseName: 'ヴァンス ヴァイザー',
    role: 'Antagonist',
    archetype: 'Antagonist',
    element: 'Void',
    age: '34 Years',
    factionAffiliation: 'OmniCorp Security Force',
    description: 'Ruthless CEO of OmniCorp Security Network, calculated strategist controlling orbital particle cannons.',
    personalityTraits: ['Calculated', 'Ambitious', 'Dominant', 'Cold'],
    signatureMoves: ['Orbital Lock-On Strike', 'Void Barrier', 'Cyber-Neural Overwrite'],
    backstory: 'Graduated top of Imperial Cybernetics Academy and restructured OmniCorp into a military powerhouse.',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    stats: {
      combatPower: 96,
      agilitySpeed: 70,
      intelligenceTactics: 98,
      manaAffinity: 91,
      defenseResist: 94
    },
    expressions: [
      {
        id: 'exp_03',
        emotion: 'Sly Smile',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
        promptDescription: 'Cold smug smirk in executive lighting'
      }
    ],
    voiceProfile: {
      voiceActorName: 'Kore',
      pitchModifier: -2,
      speedModifier: 0.95,
      catchphrase: 'Perfection is not negotiable.',
      preferredTone: 'dramatic'
    },
    createdAt: '2026-08-02T11:00:00.000Z'
  },
  {
    id: 'char_03',
    name: 'High Priestess Lyra',
    japaneseName: 'ライラ 聖女',
    role: 'Mentor',
    archetype: 'Mentor',
    element: 'Star-Mote',
    age: '26 Years',
    factionAffiliation: 'Holy Order of Starlight',
    description: 'Mystic paladin who communion with the celestial starfalls to purify corrupted cyber-mana.',
    personalityTraits: ['Wise', 'Serene', 'Compassionate', 'Unwavering'],
    signatureMoves: ['Starfall Sanctuary', 'Aether Purification', 'Celestial Ray'],
    backstory: 'Witnessed the Eclipse Calamity firsthand and unlocked celestial starlight magic in the ruins.',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    stats: {
      combatPower: 85,
      agilitySpeed: 82,
      intelligenceTactics: 90,
      manaAffinity: 99,
      defenseResist: 88
    },
    expressions: [],
    voiceProfile: {
      voiceActorName: 'Zephyr',
      pitchModifier: +1,
      speedModifier: 0.9,
      catchphrase: 'Walk in the radiance of the celestial void.',
      preferredTone: 'calm'
    },
    createdAt: '2026-08-03T14:00:00.000Z'
  }
];

export function useDetailedCharacters() {
  return useQuery({
    queryKey: ['detailed_characters'],
    queryFn: async (): Promise<DetailedCharacter[]> => {
      const stored = localStorage.getItem('studio_detailed_characters');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { /* ignore */ }
      }
      return INITIAL_CHARACTERS;
    }
  });
}

export function useCharacterStudioTelemetry() {
  const charactersQuery = useDetailedCharacters();

  return useQuery({
    queryKey: ['character_telemetry', charactersQuery.data],
    queryFn: async (): Promise<CharacterStudioTelemetry> => {
      const list = charactersQuery.data || INITIAL_CHARACTERS;
      const totalCharacters = list.length;
      const protagonists = list.filter(c => c.archetype === 'Protagonist').length;
      const totalExpressions = list.reduce((acc, c) => acc + (c.expressions?.length || 0), 0);
      const avgCombat = Math.round(list.reduce((acc, c) => acc + (c.stats?.combatPower || 50), 0) / (totalCharacters || 1));

      return {
        totalCharacters,
        protagonistsCount: protagonists,
        dubbedTracksCount: 12,
        totalExpressionsGenerated: totalExpressions,
        avgCombatRating: avgCombat
      };
    }
  });
}

// Mutations
export function useCreateDetailedCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newChar: Omit<DetailedCharacter, 'id' | 'createdAt'>) => {
      const stored = localStorage.getItem('studio_detailed_characters');
      const list: DetailedCharacter[] = stored ? JSON.parse(stored) : INITIAL_CHARACTERS;
      const created: DetailedCharacter = {
        ...newChar,
        id: `char_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updated = [created, ...list];
      localStorage.setItem('studio_detailed_characters', JSON.stringify(updated));
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detailed_characters'] });
      queryClient.invalidateQueries({ queryKey: ['character_telemetry'] });
    }
  });
}

export function useAddCharacterExpression() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ characterId, expression }: { characterId: string; expression: Omit<CharacterExpression, 'id'> }) => {
      const stored = localStorage.getItem('studio_detailed_characters');
      const list: DetailedCharacter[] = stored ? JSON.parse(stored) : INITIAL_CHARACTERS;

      const updated = list.map(c => {
        if (c.id === characterId) {
          const newExp: CharacterExpression = {
            ...expression,
            id: `exp_${Date.now()}`
          };
          return {
            ...c,
            expressions: [...(c.expressions || []), newExp]
          };
        }
        return c;
      });

      localStorage.setItem('studio_detailed_characters', JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detailed_characters'] });
      queryClient.invalidateQueries({ queryKey: ['character_telemetry'] });
    }
  });
}
