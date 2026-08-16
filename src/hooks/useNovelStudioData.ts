import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LightNovelChapter, NovelStudioTelemetry, IllustrationAnchor } from '../types';

const INITIAL_CHAPTERS: LightNovelChapter[] = [
  {
    id: 'chap_01',
    chapterNumber: 1,
    title: 'Neon Blood & Neural Steel',
    japaneseTitle: 'ネオンの血と神経の鋼',
    summary: 'Ren encounters Director Vance’s enforcers in the flooded subterranean alleyways of Sector 9.',
    tone: 'Action / Cyberpunk',
    content: `The neon rain cascaded off the rusted fire escapes of Sector 9, painting the oil-slick pavement in electric crimson hues. 

Ren Kurogane checked the pulse indicator on his hyper-blade. 98% charge. 

"Target sighted in Sector 9," a cold voice echoed through the comms. It was Puck, broadcasting from his encrypted netrunner hideout. "Ren, OmniCorp heavy units are closing in from the perimeter."

Ren adjusted the collar of his reinforced leather trenchcoat. "Let them come. My blade has been thirsty since midnight."

Suddenly, the air distorted with high-frequency particle hums. Two Omni-Centurions dropped from the sky-bridge above, heavy plasma cannons humming into active firing mode.`,
    wordCount: 104,
    dialogueNodes: [
      { id: 'dn_1', speakerName: 'Puck', emotion: 'Urgent', line: 'Ren, OmniCorp heavy units are closing in from the perimeter.' },
      { id: 'dn_2', speakerName: 'Ren Kurogane', emotion: 'Smug', line: 'Let them come. My blade has been thirsty since midnight.' }
    ],
    illustrationAnchors: [
      {
        id: 'ia_1',
        anchorName: 'Centurion Drop Scene',
        paragraphIndex: 4,
        promptDescription: 'Two cybernetic centurions landing with heavy smoke in a rain-slicked alley',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        styleTag: 'Battle Climax Insert'
      }
    ],
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-01T12:30:00.000Z'
  },
  {
    id: 'chap_02',
    chapterNumber: 2,
    title: 'The Starlight Sanctuary',
    japaneseTitle: '星明かりの聖域',
    summary: 'High Priestess Lyra reveals the ancient celestial prophecy hidden within the corporate database.',
    tone: 'Dark Fantasy',
    content: `Deep within the subterranean catacombs beneath the Starlight Cathedral, incense smoke swirled around glowing crystal pillars.

Lyra unclasped her heavy starlight cloak, her gaze resting on the ancient holocron glowing on the marble alter.

"The prophecy was never meant to be sold to OmniCorp," she whispered softly.

Ren leaned against a carved stone column, arms crossed over his chest. "Corporate executives don't care about prophecies, Lyra. They care about particle yield."`,
    wordCount: 78,
    dialogueNodes: [
      { id: 'dn_3', speakerName: 'High Priestess Lyra', emotion: 'Serene', line: 'The prophecy was never meant to be sold to OmniCorp.' },
      { id: 'dn_4', speakerName: 'Ren Kurogane', emotion: 'Cynical', line: 'Corporate executives don’t care about prophecies, Lyra. They care about particle yield.' }
    ],
    illustrationAnchors: [
      {
        id: 'ia_2',
        anchorName: 'Starlight Holocron Reveal',
        paragraphIndex: 2,
        promptDescription: 'High Priestess Lyra hovering over a glowing starlight holocron in a dark cathedral',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        styleTag: 'Full-Page Splash'
      }
    ],
    createdAt: '2026-08-02T14:00:00.000Z',
    updatedAt: '2026-08-02T15:10:00.000Z'
  }
];

export function useLightNovelChapters() {
  return useQuery({
    queryKey: ['light_novel_chapters'],
    queryFn: async (): Promise<LightNovelChapter[]> => {
      const stored = localStorage.getItem('studio_light_novel_chapters');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { /* ignore */ }
      }
      return INITIAL_CHAPTERS;
    }
  });
}

export function useNovelStudioTelemetry() {
  const chaptersQuery = useLightNovelChapters();

  return useQuery({
    queryKey: ['novel_telemetry', chaptersQuery.data],
    queryFn: async (): Promise<NovelStudioTelemetry> => {
      const list = chaptersQuery.data || INITIAL_CHAPTERS;
      const totalChapters = list.length;
      const totalWordCount = list.reduce((acc, c) => acc + (c.wordCount || 0), 0);
      const totalAnchors = list.reduce((acc, c) => acc + (c.illustrationAnchors?.length || 0), 0);

      return {
        totalChapters,
        totalWordCount,
        avgDialogueDensity: 42,
        totalIllustrationAnchors: totalAnchors,
        aiGeneratedChapters: 5
      };
    }
  });
}

// Mutations
export function useCreateNovelChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newChap: Omit<LightNovelChapter, 'id' | 'createdAt' | 'updatedAt'>) => {
      const stored = localStorage.getItem('studio_light_novel_chapters');
      const list: LightNovelChapter[] = stored ? JSON.parse(stored) : INITIAL_CHAPTERS;
      const created: LightNovelChapter = {
        ...newChap,
        id: `chap_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updated = [...list, created];
      localStorage.setItem('studio_light_novel_chapters', JSON.stringify(updated));
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['light_novel_chapters'] });
      queryClient.invalidateQueries({ queryKey: ['novel_telemetry'] });
    }
  });
}

export function useUpdateNovelChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedChapter: LightNovelChapter) => {
      const stored = localStorage.getItem('studio_light_novel_chapters');
      const list: LightNovelChapter[] = stored ? JSON.parse(stored) : INITIAL_CHAPTERS;

      const updated = list.map(c => c.id === updatedChapter.id ? { ...updatedChapter, updatedAt: new Date().toISOString() } : c);
      localStorage.setItem('studio_light_novel_chapters', JSON.stringify(updated));
      return updatedChapter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['light_novel_chapters'] });
      queryClient.invalidateQueries({ queryKey: ['novel_telemetry'] });
    }
  });
}

export function useAddIllustrationAnchor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chapterId, anchor }: { chapterId: string; anchor: Omit<IllustrationAnchor, 'id'> }) => {
      const stored = localStorage.getItem('studio_light_novel_chapters');
      const list: LightNovelChapter[] = stored ? JSON.parse(stored) : INITIAL_CHAPTERS;

      const updated = list.map(c => {
        if (c.id === chapterId) {
          const newAnchor: IllustrationAnchor = {
            ...anchor,
            id: `ia_${Date.now()}`
          };
          return {
            ...c,
            illustrationAnchors: [...(c.illustrationAnchors || []), newAnchor]
          };
        }
        return c;
      });

      localStorage.setItem('studio_light_novel_chapters', JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['light_novel_chapters'] });
      queryClient.invalidateQueries({ queryKey: ['novel_telemetry'] });
    }
  });
}
