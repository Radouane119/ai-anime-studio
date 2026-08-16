import { Project } from '../types';

export const PRESET_PROJECTS: Project[] = [
  {
    id: 'proj-cyber-shinobi',
    title: 'Neon Genesis: Cyber-Shinobi 2099',
    tagline: 'In neo-Tokyo 2099, a high-tech kunoichi fights shadow mega-corporations with plasma katana and neural magic.',
    format: 'anime_series',
    genre: 'cyberpunk',
    synopsis: 'When Neo-Tokyo falls under the totalitarian reign of Kuroda Tech Syndicate, rogue android kunoichi Ren-01 awakens her forgotten neural sigils. Alongside hacker virtuoso Renji, she embarks on a silent revolution through neon-drenched skyscrapers and subterranean rain-slicked alleys.',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    updatedAt: '2026-08-05T09:40:00Z',
    episodesCount: 12,
    charactersCount: 4,
    mangaPagesCount: 24,
    voiceTracksCount: 18,
    characters: [
      {
        id: 'char-ren01',
        name: 'Ren-01 (Kage-Kaze)',
        japaneseName: '影風 レンの壱',
        role: 'protagonist',
        archetype: 'Silent Cyber-Kunoichi',
        age: 19,
        height: '172 cm',
        stats: { strength: 88, magic: 92, agility: 98, intellect: 82, charisma: 70 },
        personality: 'Stoic, fiercely loyal, hyper-calculated under pressure, possesses a hidden warm heart for innocent citizens.',
        backstory: 'Forged in the secret bio-laboratories of Kuroda Tech. Reclaimed her freedom during the Great Data Meltdown of 2095.',
        visualPrompt: 'High quality anime style, cyberpunk kunoichi female assassin with glowing cyan visor, jet black bob cut hair, sleek carbon-fiber armor with glowing pink neon sigils, dual plasma katana, rain-soaked Neo-Tokyo background with holographic billboards, octane render artstation sharp detail.',
        outfitDetails: 'Matte black nanotech suit with glowing neon sigils, waist sash housing micro-daggers, holographic elbow guards.',
        voiceName: 'Kore',
        avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
        signatureMove: 'Zero-Kelvin Phantom Slash'
      },
      {
        id: 'char-renji',
        name: 'Renji "Zero-Hex" Sato',
        japaneseName: '佐藤 レンジ',
        role: 'deuteragonist',
        archetype: 'Genius Rebel Netrunner',
        age: 21,
        height: '178 cm',
        stats: { strength: 45, magic: 65, agility: 75, intellect: 99, charisma: 88 },
        personality: 'Witty, hyper-intelligent, caffeine-addicted, always has a sarcastic comment ready before hacking a military drone.',
        backstory: 'Former lead encryption officer for Kuroda Tech. Leaked classified bio-weapon blueprints before going underground.',
        visualPrompt: 'Anime style young male netrunner hacker with silver messy hair, yellow tech goggles rested on forehead, oversized techwear parka with glowing cables, translucent neural wrist keyboard holo-display, cyberpunk basement studio with server racks.',
        outfitDetails: 'Oversized dark green techwear jacket, fingerless thermal gloves, multiple storage pouches and wireless data-nodes.',
        voiceName: 'Puck',
        avatarUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
        signatureMove: 'Overclocked EMP Cascade'
      },
      {
        id: 'char-kuroda',
        name: 'Lord Kuroda Akihito',
        japaneseName: '黒田 明仁',
        role: 'antagonist',
        archetype: ' Ruthless Corporate Warlord',
        age: 54,
        height: '188 cm',
        stats: { strength: 90, magic: 95, agility: 70, intellect: 94, charisma: 91 },
        personality: 'Cold, ruthless, visionary zealot who views humanity as obsolete raw material for bio-synthetic ascension.',
        backstory: 'CEO of Kuroda Syndicate. Controls 80% of Neo-Tokyo’s energy grid and neural implants.',
        visualPrompt: 'Anime style male villain corporate lord with slicked back white hair, cybernetic golden eye implant, wearing tailored dark crimson haori suit with golden embroidery, standing on high-rise balcony looking down at rainy cyberpunk city.',
        outfitDetails: 'Tailored dark haori with nano-shield fabric, golden dragon embroidery, obsidian cybernetic prosthetic arm.',
        voiceName: 'Fenrir',
        avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
        signatureMove: 'Singularity Orbital Strike'
      }
    ],
    chapters: [
      {
        id: 'chap-1',
        chapterNumber: 1,
        title: 'Episode 1: Awakening in the Neon Rain',
        summary: 'Ren-01 breaks free from the cryo-chamber in District 9 and encounters Renji under heavy drone fire.',
        content: `The rainfall in Neo-Tokyo was never real water. It was toxic, heavy with synthetic lubricants and industrial runoff that hissed as it hit the steaming titanium street plates.

Ren-01 opened her eyes. Glowing cyan telemetry flooded her retina.
[WARNING: BIOMETRIC REBOOT AT 42%]
[NEURAL CORE STATUS: UNSTABLE]

A heavy explosion shook the pavement. A squad of Kuroda Enforcers descended from a hovering VTOL gunship, their crimson visors piercing the torrential downpour.

"Subject 01 located," a mechanical voice barked over the tactical radio channel. "Engage lethally. Do not allow her neural sigil to sync!"

Ren-01 reached for her hip. Her hand found the hilt of the high-frequency plasma blade. The rain around the metal blade turned instantly to steam as 10,000 volts of cyan plasma ignited along its edge...`,
        sceneBeats: [
          'Ren-01 awakens in rain-soaked street',
          'Telemetry HUD reboot sequence',
          'Enforcer squad VTOL ambush',
          'Ignition of Plasma Katana',
          'Renji hacks the Enforcer drones'
        ],
        suggestedPrompt: 'Anime scene render, female cyber kunoichi drawing plasma katana against crimson-eyed corporate enforcers in heavy rain, neon lights reflections, dynamic motion blur',
        wordCount: 1450
      }
    ],
    mangaPanels: [
      {
        id: 'panel-1',
        panelNumber: 1,
        layout: 'splash',
        cameraAngle: 'Low Angle Worm Eye',
        sfx: 'ゴゴゴ (GOGOGO)',
        sfxPosition: { x: 80, y: 15 },
        prompt: 'Manga line art style splash page, cyberpunk city tower under dark storm clouds, glowing neon kanji billboards, detailed ink shading, high contrast dark theme',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        dialogueBubbles: [
          {
            id: 'b-1',
            characterId: 'char-ren01',
            characterName: 'Ren-01',
            text: 'This city belongs to the shadow lord no longer...',
            bubbleType: 'thought',
            position: { x: 20, y: 70 }
          }
        ],
        caption: 'NEO-TOKYO 2099 - DISTRICT 9 OUTER WALL'
      },
      {
        id: 'panel-2',
        panelNumber: 2,
        layout: 'diagonal',
        cameraAngle: 'Close-up',
        sfx: 'シャキン (SHAKIN)',
        sfxPosition: { x: 10, y: 20 },
        prompt: 'Manga panel close up of female cyber kunoichi cyan glowing eyes under visor, fierce determined expression, rain droplets on cheeks, sharp black ink manga lines',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        dialogueBubbles: [
          {
            id: 'b-2',
            characterId: 'char-ren01',
            characterName: 'Ren-01',
            text: 'Plasma Katana... Ignite!',
            bubbleType: 'shout',
            position: { x: 50, y: 50 }
          }
        ]
      }
    ],
    storyboardFrames: [
      {
        id: 'frame-1',
        sceneNumber: 1,
        frameNumber: 1,
        shotType: 'Establishing',
        cameraMove: 'Pan Right',
        action: 'Camera pans across rain-swept cyberpunk skyline showing Kuroda Tower piercing dark storm clouds.',
        dialogue: 'Voiceover (Renji): They thought they wiped her memory. They were wrong.',
        soundEffect: 'Heavy thunder roll & futuristic siren humming',
        musicMood: 'Dark Synthwave / Cyberpunk Industrial Beat',
        prompt: 'Anime movie frame, wide establishing shot of cyberpunk city neon skyscrapers under torrential rainstorm at midnight, 4k cinematic anime style',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 4.5
      },
      {
        id: 'frame-2',
        sceneNumber: 1,
        frameNumber: 2,
        shotType: 'Medium',
        cameraMove: 'Zoom In',
        action: 'Ren-01 jumps off rooftop edge, drawing blade in mid-air leaving glowing blue trail.',
        dialogue: 'Ren-01: Zero-Kelvin System... Engage!',
        soundEffect: 'High voltage plasma hum & wind roar',
        musicMood: 'Intense orchestral rock kick-in',
        prompt: 'Anime keyframe, female cyber kunoichi leaping off building roof into camera, glowing blue katana effect, dynamic mid-air action pose',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 3.0
      }
    ],
    voiceTracks: [
      {
        id: 'vt-1',
        characterName: 'Ren-01',
        voiceName: 'Kore',
        emotion: 'heroic',
        text: 'Target acquired. Kuroda enforcers step back if you value your neural cores!',
        createdAt: '2026-08-05T09:30:00Z'
      },
      {
        id: 'vt-2',
        characterName: 'Renji',
        voiceName: 'Puck',
        emotion: 'energetic',
        text: 'I just uploaded the viral backdoor into their VTOL flight computer. You have 30 seconds before it plummets!',
        createdAt: '2026-08-05T09:32:00Z'
      }
    ],
    videoGenerations: [
      {
        id: 'vid-1',
        prompt: 'Cinematic anime video, cyberpunk female kunoichi sprinting along glass rooftop with glowing katana under neon rain, smooth 60fps anime animation',
        aspectRatio: '16:9',
        resolution: '1080p',
        status: 'completed',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        createdAt: '2026-08-05T09:10:00Z'
      }
    ]
  },
  {
    id: 'proj-spellbound-academy',
    title: 'Starlight Academy: Spellbound',
    tagline: 'An underachieving alchemist discovers an ancient cosmic grimoire during the Celestial Eclipse.',
    format: 'light_novel',
    genre: 'fantasy_isekai',
    synopsis: 'Aria Silverfall was ranked dead last at the Royal Academy of Magic. But when she unseals the prohibited Astral Codex, she manifests a long-extinct magic class capable of rewriting elemental laws.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    updatedAt: '2026-08-05T08:15:00Z',
    episodesCount: 24,
    charactersCount: 3,
    mangaPagesCount: 16,
    voiceTracksCount: 10,
    characters: [
      {
        id: 'char-aria',
        name: 'Aria Silverfall',
        japaneseName: 'アリア・シルバーフォール',
        role: 'protagonist',
        archetype: 'Underdog Astral Mage',
        age: 16,
        height: '160 cm',
        stats: { strength: 40, magic: 100, agility: 85, intellect: 90, charisma: 95 },
        personality: 'Determined, endlessly curious, clumsy in potion class but unstoppable when channeling star magic.',
        backstory: 'Daughter of a humble countryside clockmaker who inherited an unreadable brass grimoire.',
        visualPrompt: 'Fantasy anime girl mage with flowing lavender hair, bright sapphire eyes, wearing high academy wizard robes with silver star runes, holding glowing crystal wand, magical library background',
        outfitDetails: 'Midnight blue academy cape with silver star trim, leather potion pouch belt, crystal pendant.',
        voiceName: 'Zephyr',
        avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
        signatureMove: 'Supernova Astral Flare'
      }
    ],
    chapters: [],
    mangaPanels: [],
    storyboardFrames: [],
    voiceTracks: [],
    videoGenerations: []
  }
];
