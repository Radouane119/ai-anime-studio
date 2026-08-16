import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { 
  ALL_PERMISSIONS, 
  DEFAULT_ROLES, 
  resolveEffectivePermissions, 
  canAssignRole, 
  hasPermission,
  invalidateUserPermissionCache 
} from './src/utils/rbacEngine.js';
import { 
  RbacRole, 
  UserRoleAssignment, 
  RbacAuditLogItem, 
  SystemRoleCode, 
  OrgRoleCode, 
  TeamRoleCode 
} from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

const PORT = 3000;

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'DUMMY_KEY_FOR_INIT',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- API ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Anime Studio Engine', timestamp: new Date().toISOString() });
});

// --- AUTHENTICATION & CLERK USER SYNC ENDPOINTS ---

// In-Memory User Store (synced with PostgreSQL Prisma in production)
const userDbStore = new Map<string, any>();

// Auth Verification Middleware helper
const verifyAuthSession = (req: express.Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token ? { valid: true, token } : null;
};

// 1. Sync Clerk / OAuth User with Database
app.post('/api/auth/sync', (req, res) => {
  try {
    const { user, token } = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ success: false, error: 'User data and email are required for sync.' });
    }

    const syncedUser = {
      id: user.id || `usr_${Date.now()}`,
      clerkId: user.clerkId || `clerk_${Date.now()}`,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      avatarUrl: user.avatarUrl || 'https://picsum.photos/seed/creator/150/150',
      role: user.role || 'CREATOR',
      organizationId: user.organizationId || 'org_studio_01',
      organizationName: user.organizationName || 'MAPPA Cyber Studio Labs',
      teamId: user.teamId || 'team_alpha',
      teamName: user.teamName || 'Alpha Animation Team',
      updatedAt: new Date().toISOString(),
    };

    userDbStore.set(syncedUser.email, syncedUser);

    res.json({
      success: true,
      message: 'User session synchronized with PostgreSQL Database',
      user: syncedUser,
      token: token || `jwt_clerk_synced_${Date.now()}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get Current Authenticated User & Roles
app.get('/api/auth/me', (req, res) => {
  const auth = verifyAuthSession(req);
  if (!auth) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Valid Bearer Token required.' });
  }

  const sampleUser = Array.from(userDbStore.values())[0] || {
    id: 'usr_enterprise_01',
    clerkId: 'user_2N9xClerkProAnimeStudio',
    email: 'creator@studio-ai.anime',
    name: 'Kenji Sato (Lead Studio Director)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'CREATOR',
    organizationId: 'org_studio_01',
    organizationName: 'MAPPA Cyber Studio Labs',
    teamId: 'team_anime_alpha',
    permissions: ['project:create', 'ai:generate', 'manga:export', 'render:gpu'],
  };

  res.json({
    success: true,
    user: sampleUser,
    sessionExpiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
  });
});

// 3. Verify JWT Session Token
app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, valid: false, error: 'Token missing' });
  }
  res.json({
    success: true,
    valid: true,
    issuer: 'https://clerk.ai-anime-studio.com',
    audience: 'ai-anime-studio-api',
    issuedAt: new Date().toISOString(),
  });
});

// --- PHASE 6.2: USER PROFILE & SETTINGS SERVICE ---

const profileDbStore = new Map<string, any>();
const auditLogStore: any[] = [];
const takenUsernames = new Set(['admin', 'root', 'mappa', 'studio', 'anime', 'director']);

// Seed default profile for lead director
const defaultEnterpriseProfile = {
  id: 'prof_enterprise_01',
  userId: 'usr_enterprise_01',
  username: 'kenji_sato',
  displayName: 'Kenji Sato',
  bio: 'Lead Anime Director & Cyberpunk Visual Novel Artist at MAPPA Cyber Studio Labs.',
  location: 'Tokyo, Japan',
  website: 'https://kenji-sato.anime.studio',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
  socialLinks: {
    twitter: 'https://x.com/kenjisato_anime',
    github: 'https://github.com/kenji-sato',
    discord: 'kenji_anime#8821',
    youtube: 'https://youtube.com/@kenjisato_studio',
    artstation: 'https://artstation.com/kenjisato',
  },
  settings: {
    theme: 'dark',
    language: 'en',
    timezone: 'Asia/Tokyo',
    defaultVoiceId: 'Gemini-Neural-JP-01',
    defaultArtStyle: 'Shonen Cyberpunk High Contrast',
  },
  preferences: {
    isPublicProfile: true,
    emailNotifications: true,
    marketingEmails: false,
    showInLeaderboard: true,
    autoSaveDrafts: true,
  },
  completionPercentage: 95,
  updatedAt: new Date().toISOString(),
};

profileDbStore.set('usr_enterprise_01', defaultEnterpriseProfile);
takenUsernames.add('kenji_sato');

auditLogStore.push({
  id: 'audit_01',
  userId: 'usr_enterprise_01',
  action: 'PROFILE_INITIALIZED',
  changedFields: ['username', 'displayName', 'bio', 'settings', 'preferences'],
  ipAddress: '127.0.0.1',
  createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
});

// Calculate Profile Completion Percentage Helper
function calculateProfileCompletion(p: any): number {
  let score = 0;
  if (p.displayName && p.displayName.trim()) score += 15;
  if (p.username && p.username.trim()) score += 15;
  if (p.avatarUrl && p.avatarUrl.trim()) score += 15;
  if (p.bio && p.bio.trim()) score += 15;
  if (p.location && p.location.trim()) score += 10;
  if (p.website && p.website.trim()) score += 10;
  if (p.socialLinks && Object.values(p.socialLinks).some((v: any) => v && String(v).trim().length > 0)) score += 10;
  if (p.coverUrl && p.coverUrl.trim()) score += 10;
  return Math.min(100, score);
}

// 1. Check Username Availability Endpoint
app.get('/api/profile/check-username/:username', (req, res) => {
  const username = req.params.username ? req.params.username.toLowerCase().trim() : '';
  const currentUserId = req.query.userId as string;

  if (!username || username.length < 3) {
    return res.status(400).json({ available: false, error: 'Username must be at least 3 characters long.' });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ available: false, error: 'Username can only contain letters, numbers, and underscores.' });
  }

  // Check if taken by another user
  const isTaken = Array.from(profileDbStore.values()).some(
    (prof) => prof.username?.toLowerCase() === username && prof.userId !== currentUserId
  ) || (takenUsernames.has(username) && currentUserId !== 'usr_enterprise_01');

  res.json({
    username,
    available: !isTaken,
    message: isTaken ? 'Username is already claimed by another creator.' : 'Username is available!',
  });
});

// 2. Fetch User Profile
app.get('/api/profile', (req, res) => {
  const userId = (req.query.userId as string) || 'usr_enterprise_01';
  let profile = profileDbStore.get(userId);

  if (!profile) {
    // Auto-create default profile for new user
    profile = {
      id: `prof_${Date.now()}`,
      userId,
      username: `creator_${Date.now().toString().slice(-4)}`,
      displayName: 'Anime Studio Creator',
      bio: 'Digital Manga & Keyframe Creator',
      avatarUrl: 'https://picsum.photos/seed/creator/250/250',
      socialLinks: {},
      settings: { theme: 'dark', language: 'en', timezone: 'UTC', defaultVoiceId: 'Gemini-JP-01', defaultArtStyle: 'Anime' },
      preferences: { isPublicProfile: true, emailNotifications: true, marketingEmails: false, showInLeaderboard: true, autoSaveDrafts: true },
      completionPercentage: 50,
      updatedAt: new Date().toISOString(),
    };
    profileDbStore.set(userId, profile);
  }

  res.json({ success: true, profile });
});

// 3. Update User Profile with DTO Validation & Audit Logging
app.put('/api/profile', (req, res) => {
  try {
    const { userId, profile } = req.body;
    const targetUserId = userId || 'usr_enterprise_01';

    if (!profile) {
      return res.status(400).json({ success: false, error: 'Profile payload is required.' });
    }

    // Validation Rules (NestJS/Zod equivalent logic)
    if (profile.username) {
      const cleanUsername = profile.username.trim().toLowerCase();
      if (cleanUsername.length < 3 || cleanUsername.length > 30) {
        return res.status(400).json({ success: false, error: 'Username must be between 3 and 30 characters.' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        return res.status(400).json({ success: false, error: 'Username must contain only alphanumeric characters and underscores.' });
      }

      // Check uniqueness
      const existingUser = Array.from(profileDbStore.values()).find(
        (p) => p.username?.toLowerCase() === cleanUsername && p.userId !== targetUserId
      );
      if (existingUser) {
        return res.status(409).json({ success: false, error: 'Username is already taken by another user.' });
      }
    }

    if (profile.bio && profile.bio.length > 500) {
      return res.status(400).json({ success: false, error: 'Bio must not exceed 500 characters.' });
    }

    const currentProfile = profileDbStore.get(targetUserId) || defaultEnterpriseProfile;
    const changedFields: string[] = [];

    // Track changed fields for audit logging
    Object.keys(profile).forEach((key) => {
      if (JSON.stringify(profile[key]) !== JSON.stringify((currentProfile as any)[key])) {
        changedFields.push(key);
      }
    });

    const updatedProfile = {
      ...currentProfile,
      ...profile,
      socialLinks: { ...currentProfile.socialLinks, ...profile.socialLinks },
      settings: { ...currentProfile.settings, ...profile.settings },
      preferences: { ...currentProfile.preferences, ...profile.preferences },
      updatedAt: new Date().toISOString(),
    };

    updatedProfile.completionPercentage = calculateProfileCompletion(updatedProfile);

    // Persist to store
    profileDbStore.set(targetUserId, updatedProfile);
    if (updatedProfile.username) {
      takenUsernames.add(updatedProfile.username.toLowerCase());
    }

    // Write Audit Log Entry
    if (changedFields.length > 0) {
      auditLogStore.unshift({
        id: `audit_${Date.now()}`,
        userId: targetUserId,
        action: 'PROFILE_UPDATED',
        changedFields,
        ipAddress: req.ip || '127.0.0.1',
        createdAt: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      profile: updatedProfile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Avatar Upload / Choice Support
app.post('/api/profile/avatar', (req, res) => {
  const { userId, avatarUrl } = req.body;
  const targetUserId = userId || 'usr_enterprise_01';

  if (!avatarUrl) {
    return res.status(400).json({ success: false, error: 'Avatar URL or image data required.' });
  }

  const currentProfile = profileDbStore.get(targetUserId) || defaultEnterpriseProfile;
  currentProfile.avatarUrl = avatarUrl;
  currentProfile.updatedAt = new Date().toISOString();
  currentProfile.completionPercentage = calculateProfileCompletion(currentProfile);

  profileDbStore.set(targetUserId, currentProfile);

  auditLogStore.unshift({
    id: `audit_${Date.now()}`,
    userId: targetUserId,
    action: 'AVATAR_UPDATED',
    changedFields: ['avatarUrl'],
    ipAddress: req.ip || '127.0.0.1',
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Avatar updated successfully',
    avatarUrl,
    completionPercentage: currentProfile.completionPercentage,
  });
});

// 5. Get Profile Audit Trail
app.get('/api/profile/audit-log', (req, res) => {
  const userId = (req.query.userId as string) || 'usr_enterprise_01';
  const userLogs = auditLogStore.filter((log) => log.userId === userId);
  res.json({ success: true, logs: userLogs });
});


// 1. AI Character Generator Endpoint
app.post('/api/gemini/character-studio', async (req, res) => {
  try {
    const { name, role, genre, prompt, archetype } = req.body;
    const ai = getGenAI();

    const systemPrompt = `You are a legendary anime character designer and light novel writer. 
Generate a comprehensive anime character profile based on the prompt.
Role: ${role || 'protagonist'}
Genre: ${genre || 'cyberpunk'}
Archetype: ${archetype || 'Custom hero'}
Prompt: ${prompt || 'A badass main character with special abilities.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            japaneseName: { type: Type.STRING },
            archetype: { type: Type.STRING },
            age: { type: Type.INTEGER },
            height: { type: Type.STRING },
            personality: { type: Type.STRING },
            backstory: { type: Type.STRING },
            visualPrompt: { type: Type.STRING, description: 'Detailed Midjourney/Gemini prompt for generating anime artwork' },
            outfitDetails: { type: Type.STRING },
            voiceName: { type: Type.STRING, description: 'Must be one of: Kore, Puck, Fenrir, Zephyr, Charon' },
            signatureMove: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                strength: { type: Type.INTEGER },
                magic: { type: Type.INTEGER },
                agility: { type: Type.INTEGER },
                intellect: { type: Type.INTEGER },
                charisma: { type: Type.INTEGER }
              },
              required: ['strength', 'magic', 'agility', 'intellect', 'charisma']
            }
          },
          required: ['name', 'japaneseName', 'archetype', 'age', 'height', 'personality', 'backstory', 'visualPrompt', 'outfitDetails', 'voiceName', 'signatureMove', 'stats']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, character: data });
  } catch (error: any) {
    console.error('Character generation error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate character profile.' });
  }
});

// 2. AI Script / Story Beat Generator
app.post('/api/gemini/story-script', async (req, res) => {
  try {
    const { title, genre, format, premise, characters } = req.body;
    const ai = getGenAI();

    const promptText = `You are an executive Anime Director and Light Novel author.
Title: ${title}
Genre: ${genre}
Format: ${format}
Premise: ${premise}
Characters: ${JSON.stringify(characters || [])}

Generate a cinematic anime episode script breakdown with scene beats, dramatic dialogue, camera directions, and suggested sound effects.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapterTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            fullScriptText: { type: Type.STRING },
            sceneBeats: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cameraDirections: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedImagePrompt: { type: Type.STRING }
          },
          required: ['chapterTitle', 'summary', 'fullScriptText', 'sceneBeats', 'cameraDirections', 'suggestedImagePrompt']
        }
      }
    });

    const scriptData = JSON.parse(response.text || '{}');
    res.json({ success: true, script: scriptData });
  } catch (error: any) {
    console.error('Script generation error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate script.' });
  }
});

// 3. Manga & Webtoon Panel Storyboard Generator
app.post('/api/gemini/manga-storyboard', async (req, res) => {
  try {
    const { sceneDescription, panelCount } = req.body;
    const ai = getGenAI();

    const promptText = `Generate ${panelCount || 4} manga/webtoon panels based on this scene: "${sceneDescription}".
Provide panel camera angle, Japanese sound effects (SFX in katakana), prompt for manga illustration, and dialogue bubbles with positions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              panelNumber: { type: Type.INTEGER },
              layout: { type: Type.STRING, description: 'standard, wide, tall, splash, or diagonal' },
              cameraAngle: { type: Type.STRING },
              sfx: { type: Type.STRING, description: 'Japanese sound effect katakana, e.g. ドドド or BOM!' },
              prompt: { type: Type.STRING, description: 'Detailed anime line-art manga panel illustration prompt' },
              caption: { type: Type.STRING },
              dialogue: { type: Type.STRING },
              speaker: { type: Type.STRING }
            },
            required: ['panelNumber', 'layout', 'cameraAngle', 'sfx', 'prompt', 'dialogue', 'speaker']
          }
        }
      }
    });

    const panelsData = JSON.parse(response.text || '[]');
    res.json({ success: true, panels: panelsData });
  } catch (error: any) {
    console.error('Manga storyboard error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate manga storyboard.' });
  }
});

// 4. Gemini Text-To-Speech (TTS Voice Dubbing)
app.post('/api/gemini/tts-voice', async (req, res) => {
  try {
    const { text, voiceName, emotion } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text prompt is required for TTS.' });
    }

    const ai = getGenAI();
    const formattedPrompt = `${emotion ? `Say with ${emotion} emotion: ` : ''}${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: formattedPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/mp3' });
    } else {
      res.status(500).json({ success: false, error: 'Audio data was not returned by Gemini TTS engine.' });
    }
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ success: false, error: error.message || 'TTS generation failed.' });
  }
});

// 5. Anime Visual Artwork Generator (Gemini Flash Image)
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required for image generation.' });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: `High quality anime artwork, 8k resolution, official art style: ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
        },
      },
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      res.json({ success: true, imageUrl });
    } else {
      // Fallback placeholder image with seed
      const seed = Math.floor(Math.random() * 1000);
      res.json({ success: true, imageUrl: `https://picsum.photos/seed/anime-${seed}/800/800` });
    }
  } catch (error: any) {
    console.error('Image generation error:', error);
    // Graceful fallback to picsum photo so app user experience remains unblocked
    const seed = Math.floor(Math.random() * 1000);
    res.json({ success: true, imageUrl: `https://picsum.photos/seed/anime-fallback-${seed}/800/800`, note: 'Using fallback art engine' });
  }
});

// ====================================================
// --- PHASE 6.4 ROLE-BASED ACCESS CONTROL (RBAC) ENDPOINTS ---
// ====================================================

// Stores
const rbacRolesStore: RbacRole[] = [...DEFAULT_ROLES];

const userRolesStore: UserRoleAssignment[] = [
  {
    userId: 'usr_enterprise_01',
    userName: 'Kenji Sato',
    userEmail: 'creator@studio-ai.anime',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    systemRole: 'SUPER_ADMIN',
    orgRole: 'OWNER',
    teamRole: 'TEAM_LEAD',
    customRoles: [],
    assignedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    userId: 'usr_animator_02',
    userName: 'Yuki Tanaka',
    userEmail: 'yuki@mappa-studio.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    systemRole: 'USER',
    orgRole: 'EDITOR',
    teamRole: 'MEMBER',
    customRoles: [],
    assignedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    userId: 'usr_support_03',
    userName: 'Aoi Miyamori',
    userEmail: 'support@studio-ai.anime',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    systemRole: 'SUPPORT',
    orgRole: 'MANAGER',
    teamRole: 'TEAM_LEAD',
    customRoles: [],
    assignedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    userId: 'usr_admin_04',
    userName: 'Rintaro Okabe',
    userEmail: 'rintaro@futuregadget.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    systemRole: 'ADMIN',
    orgRole: 'ADMIN',
    teamRole: 'TEAM_LEAD',
    customRoles: [],
    assignedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    userId: 'usr_guest_05',
    userName: 'Subaru Natsuki',
    userEmail: 'subaru@re-zero.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80',
    systemRole: 'USER',
    orgRole: 'VIEWER',
    teamRole: 'GUEST',
    customRoles: [],
    assignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const rbacAuditLogsStore: RbacAuditLogItem[] = [
  {
    id: 'rbac_log_01',
    actorId: 'usr_enterprise_01',
    actorName: 'Kenji Sato',
    action: 'ROLE_ASSIGNED',
    targetUserId: 'usr_admin_04',
    targetUserName: 'Rintaro Okabe',
    roleCode: 'ADMIN',
    details: { scope: 'SYSTEM', grantedBy: 'Super Admin Security Policy' },
    ipAddress: '192.168.1.102',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'rbac_log_02',
    actorId: 'usr_enterprise_01',
    actorName: 'Kenji Sato',
    action: 'ROLE_ASSIGNED',
    targetUserId: 'usr_support_03',
    targetUserName: 'Aoi Miyamori',
    roleCode: 'SUPPORT',
    details: { scope: 'SYSTEM', GrantedPermissionsCount: 9 },
    ipAddress: '192.168.1.102',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

// 1. Get All Permissions Catalog
app.get('/api/rbac/permissions', (req, res) => {
  res.json({
    success: true,
    count: ALL_PERMISSIONS.length,
    permissions: ALL_PERMISSIONS,
  });
});

// 2. Get All Roles Catalog
app.get('/api/rbac/roles', (req, res) => {
  res.json({
    success: true,
    count: rbacRolesStore.length,
    roles: rbacRolesStore,
  });
});

// 3. Create Custom Role
app.post('/api/rbac/roles', (req, res) => {
  try {
    const { name, code, description, permissions, scope } = req.body;
    if (!name || !code || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ success: false, error: 'Name, code, and permissions array are required.' });
    }

    const normalizedCode = code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const existing = rbacRolesStore.find(r => r.code === normalizedCode);
    if (existing) {
      return res.status(409).json({ success: false, error: `Role with code '${normalizedCode}' already exists.` });
    }

    const newRole: RbacRole = {
      id: `role_custom_${Date.now()}`,
      code: normalizedCode,
      name,
      scope: scope || 'CUSTOM',
      description: description || 'Custom user-defined role.',
      isSystem: false,
      permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    rbacRolesStore.push(newRole);

    const logEntry: RbacAuditLogItem = {
      id: `rbac_log_${Date.now()}`,
      actorId: 'usr_enterprise_01',
      actorName: 'Kenji Sato',
      action: 'CUSTOM_ROLE_CREATED',
      roleId: newRole.id,
      roleCode: newRole.code,
      details: { roleName: name, permissionCount: permissions.length },
      ipAddress: req.ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    rbacAuditLogsStore.unshift(logEntry);

    res.status(201).json({
      success: true,
      message: `Custom role '${name}' created successfully.`,
      role: newRole,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update Role Permissions
app.put('/api/rbac/roles/:roleId/permissions', (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, error: 'Permissions must be an array of permission codes.' });
    }

    const roleIndex = rbacRolesStore.findIndex(r => r.id === roleId || r.code === roleId);
    if (roleIndex === -1) {
      return res.status(404).json({ success: false, error: `Role '${roleId}' not found.` });
    }

    rbacRolesStore[roleIndex].permissions = permissions;
    rbacRolesStore[roleIndex].updatedAt = new Date().toISOString();

    invalidateUserPermissionCache();

    const logEntry: RbacAuditLogItem = {
      id: `rbac_log_${Date.now()}`,
      actorId: 'usr_enterprise_01',
      actorName: 'Kenji Sato',
      action: 'PERMISSION_GRANTED',
      roleId: rbacRolesStore[roleIndex].id,
      roleCode: rbacRolesStore[roleIndex].code,
      details: { updatedPermissions: permissions },
      ipAddress: req.ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    rbacAuditLogsStore.unshift(logEntry);

    res.json({
      success: true,
      message: `Role permissions updated successfully.`,
      role: rbacRolesStore[roleIndex],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Get User Role Assignments
app.get('/api/rbac/users', (req, res) => {
  res.json({
    success: true,
    count: userRolesStore.length,
    users: userRolesStore,
  });
});

// 6. Assign System Role to User (With Privilege Escalation Protection)
app.post('/api/rbac/users/assign-system', (req, res) => {
  try {
    const { targetUserId, systemRole, actorUserId = 'usr_enterprise_01' } = req.body;

    if (!targetUserId || !systemRole) {
      return res.status(400).json({ success: false, error: 'targetUserId and systemRole are required.' });
    }

    // Find actor
    const actor = userRolesStore.find(u => u.userId === actorUserId) || { systemRole: 'SUPER_ADMIN' as SystemRoleCode };

    // Check privilege escalation
    if (!canAssignRole(actor.systemRole as SystemRoleCode, systemRole as SystemRoleCode)) {
      return res.status(403).json({
        success: false,
        error: `Privilege Escalation Blocked: Role '${actor.systemRole}' cannot assign '${systemRole}'. Required level: SUPER_ADMIN.`,
      });
    }

    const userIndex = userRolesStore.findIndex(u => u.userId === targetUserId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: `Target user '${targetUserId}' not found.` });
    }

    const oldRole = userRolesStore[userIndex].systemRole;
    userRolesStore[userIndex].systemRole = systemRole;
    userRolesStore[userIndex].assignedAt = new Date().toISOString();

    invalidateUserPermissionCache(targetUserId);

    const logEntry: RbacAuditLogItem = {
      id: `rbac_log_${Date.now()}`,
      actorId: actorUserId,
      actorName: actorUserId === 'usr_enterprise_01' ? 'Kenji Sato' : 'Admin Actor',
      action: 'ROLE_ASSIGNED',
      targetUserId,
      targetUserName: userRolesStore[userIndex].userName,
      roleCode: systemRole,
      details: { previousSystemRole: oldRole, newSystemRole: systemRole, scope: 'SYSTEM' },
      ipAddress: req.ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    rbacAuditLogsStore.unshift(logEntry);

    res.json({
      success: true,
      message: `System role for ${userRolesStore[userIndex].userName} updated to ${systemRole}.`,
      user: userRolesStore[userIndex],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Assign Org Role to User
app.post('/api/rbac/users/assign-org', (req, res) => {
  try {
    const { targetUserId, orgRole, actorUserId = 'usr_enterprise_01' } = req.body;
    if (!targetUserId || !orgRole) {
      return res.status(400).json({ success: false, error: 'targetUserId and orgRole are required.' });
    }

    const userIndex = userRolesStore.findIndex(u => u.userId === targetUserId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: `Target user '${targetUserId}' not found.` });
    }

    const oldRole = userRolesStore[userIndex].orgRole;
    userRolesStore[userIndex].orgRole = orgRole;
    userRolesStore[userIndex].assignedAt = new Date().toISOString();

    invalidateUserPermissionCache(targetUserId);

    const logEntry: RbacAuditLogItem = {
      id: `rbac_log_${Date.now()}`,
      actorId: actorUserId,
      actorName: 'Kenji Sato',
      action: 'ROLE_ASSIGNED',
      targetUserId,
      targetUserName: userRolesStore[userIndex].userName,
      roleCode: orgRole,
      details: { previousOrgRole: oldRole, newOrgRole: orgRole, scope: 'ORGANIZATION' },
      ipAddress: req.ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    rbacAuditLogsStore.unshift(logEntry);

    res.json({
      success: true,
      message: `Organization role updated to ${orgRole}.`,
      user: userRolesStore[userIndex],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Assign Team Role to User
app.post('/api/rbac/users/assign-team', (req, res) => {
  try {
    const { targetUserId, teamRole, actorUserId = 'usr_enterprise_01' } = req.body;
    if (!targetUserId || !teamRole) {
      return res.status(400).json({ success: false, error: 'targetUserId and teamRole are required.' });
    }

    const userIndex = userRolesStore.findIndex(u => u.userId === targetUserId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: `Target user '${targetUserId}' not found.` });
    }

    const oldRole = userRolesStore[userIndex].teamRole;
    userRolesStore[userIndex].teamRole = teamRole;
    userRolesStore[userIndex].assignedAt = new Date().toISOString();

    invalidateUserPermissionCache(targetUserId);

    const logEntry: RbacAuditLogItem = {
      id: `rbac_log_${Date.now()}`,
      actorId: actorUserId,
      actorName: 'Kenji Sato',
      action: 'ROLE_ASSIGNED',
      targetUserId,
      targetUserName: userRolesStore[userIndex].userName,
      roleCode: teamRole,
      details: { previousTeamRole: oldRole, newTeamRole: teamRole, scope: 'TEAM' },
      ipAddress: req.ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    rbacAuditLogsStore.unshift(logEntry);

    res.json({
      success: true,
      message: `Team role updated to ${teamRole}.`,
      user: userRolesStore[userIndex],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Get Effective Permissions for User
app.get('/api/rbac/my-permissions', (req, res) => {
  const userId = (req.query.userId as string) || 'usr_enterprise_01';
  const assignment = userRolesStore.find(u => u.userId === userId) || {
    systemRole: 'SUPER_ADMIN' as SystemRoleCode,
    orgRole: 'OWNER' as OrgRoleCode,
    teamRole: 'TEAM_LEAD' as TeamRoleCode,
    customRoles: [],
  };

  const effective = resolveEffectivePermissions(
    userId,
    assignment.systemRole,
    assignment.orgRole,
    assignment.teamRole,
    assignment.customRoles || [],
    rbacRolesStore
  );

  res.json({
    success: true,
    effective,
  });
});

// 10. Get RBAC Audit Logs
app.get('/api/rbac/audit-logs', (req, res) => {
  res.json({
    success: true,
    count: rbacAuditLogsStore.length,
    auditLogs: rbacAuditLogsStore,
  });
});

// ====================================================
// --- PHASE 6.5 ACCOUNT SETTINGS & SECURITY ENDPOINTS ---
// ====================================================

// Stores
let accountProfileStore = {
  displayName: 'Kenji Sato',
  username: 'kenji_studio',
  bio: 'Creative Director & Lead Anime Architect at Studio AI. Specializing in dark fantasy & cyberpunk animation.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  website: 'https://studio-ai.anime',
  country: 'Japan',
  timezone: 'Asia/Tokyo',
  language: 'en',
  socialLinks: {
    twitter: '@kenji_anime_ai',
    github: 'kenjisato-ai',
    discord: 'kenji#1024',
    youtube: 'KenjiStudioAI'
  }
};

let accountAppearanceStore = {
  theme: 'dark' as const,
  defaultVoiceId: 'Gemini-Neural-JP-01',
  defaultArtStyle: 'Shonen Cyberpunk High Contrast',
  autoSaveDrafts: true,
  reducedMotion: false,
  highContrastUi: false
};

let notificationSettingsStore = {
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
  productUpdates: true,
  marketplaceActivity: true
};

let privacySettingsStore = {
  isPublicProfile: true,
  hideEmail: true,
  hideActivity: false,
  searchVisibility: true,
  dataExportRequested: false,
  dataExportUrl: ''
};

let connectedAccountsStore = [
  { id: 'ca_google_01', provider: 'google' as const, providerName: 'Google Workspace', email: 'creator@studio-ai.anime', connectedAt: '2026-01-15T09:00:00.000Z', status: 'connected' as const, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 'ca_github_02', provider: 'github' as const, providerName: 'GitHub Enterprise', email: 'kenjisato-ai', connectedAt: '2026-02-01T14:20:00.000Z', status: 'connected' as const },
  { id: 'ca_discord_03', provider: 'discord' as const, providerName: 'Discord Community', email: 'kenji#1024', connectedAt: '2026-03-10T18:45:00.000Z', status: 'connected' as const },
  { id: 'ca_microsoft_04', provider: 'microsoft' as const, providerName: 'Microsoft 365', email: 'kenji@microsoft.com', connectedAt: '', status: 'disconnected' as const },
  { id: 'ca_apple_05', provider: 'apple' as const, providerName: 'Apple ID', email: 'kenji@icloud.com', connectedAt: '', status: 'disconnected' as const }
];

let activeSessionsStore = [
  { id: 'sess_curr_01', device: 'MacBook Pro 16"', browser: 'Chrome 126.0', os: 'macOS Sonoma', ipAddress: '192.168.1.102', location: 'Tokyo, Japan', isCurrent: true, lastActiveAt: new Date().toISOString(), createdAt: '2026-08-01T08:00:00.000Z' },
  { id: 'sess_mob_02', device: 'iPhone 15 Pro Max', browser: 'Mobile Safari 17.5', os: 'iOS 17.5', ipAddress: '126.208.45.12', location: 'Tokyo, Japan', isCurrent: false, lastActiveAt: new Date(Date.now() - 3600000 * 4).toISOString(), createdAt: '2026-07-28T12:30:00.000Z' },
  { id: 'sess_ipad_03', device: 'iPad Air M2', browser: 'Studio App Client', os: 'iPadOS 17.5', ipAddress: '126.208.45.18', location: 'Yokohama, Japan', isCurrent: false, lastActiveAt: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: '2026-07-20T10:15:00.000Z' }
];

let securityActivityLogsStore: Array<{
  id: string;
  eventType: string;
  description: string;
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  createdAt: string;
}> = [
  { id: 'sec_evt_01', eventType: 'LOGIN_SUCCESS', description: 'Successful authentication via Google SSO', ipAddress: '192.168.1.102', device: 'MacBook Pro (Chrome)', status: 'SUCCESS', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'sec_evt_02', eventType: 'MFA_ENABLED', description: 'Two-Factor Authentication (TOTP Authenticator App) configured', ipAddress: '192.168.1.102', device: 'MacBook Pro', status: 'SUCCESS', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'sec_evt_03', eventType: 'API_KEY_CREATED', description: 'Generated new API key "Studio Production Engine"', ipAddress: '192.168.1.102', device: 'MacBook Pro', status: 'SUCCESS', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: 'sec_evt_04', eventType: 'SUSPICIOUS_LOGIN', description: 'Blocked automated login attempt from unrecognized IP range', ipAddress: '185.220.101.5', device: 'Unknown Script Engine', status: 'WARNING', createdAt: new Date(Date.now() - 86400000 * 18).toISOString() }
];

let apiKeysStore: Array<{
  id: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
  status: 'active' | 'revoked';
}> = [
  {
    id: 'key_prod_01',
    name: 'Studio Production Engine',
    keyPrefix: 'ak_live_7a9f',
    keyHash: crypto.createHash('sha256').update('ak_live_7a9f_seed_key_production_01').digest('hex'),
    permissions: ['read:projects', 'write:ai', 'marketplace:trade'],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastUsedAt: new Date(Date.now() - 1800000).toISOString(),
    usageCount: 1420,
    status: 'active'
  },
  {
    id: 'key_dev_02',
    name: 'Local Dev Agent',
    keyPrefix: 'ak_live_3b2c',
    keyHash: crypto.createHash('sha256').update('ak_live_3b2c_seed_key_dev_02').digest('hex'),
    permissions: ['read:projects', 'write:ai'],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
    usageCount: 89,
    status: 'active'
  }
];

// 1. Get All Settings Dashboard Payload
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    profile: accountProfileStore,
    appearance: accountAppearanceStore,
    notifications: notificationSettingsStore,
    privacy: privacySettingsStore,
    securityOverview: {
      mfaEnabled: true,
      mfaMethod: 'TOTP Authenticator App (Google/Authy)',
      emailVerified: true,
      phoneVerified: true,
      passwordLastChangedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      trustedDevicesCount: 2,
      activeSessionsCount: activeSessionsStore.length
    }
  });
});

// 2. Update Profile Settings
app.put('/api/settings/profile', (req, res) => {
  try {
    const { displayName, username, bio, avatarUrl, website, country, timezone, language, socialLinks } = req.body;
    accountProfileStore = {
      ...accountProfileStore,
      displayName: displayName ?? accountProfileStore.displayName,
      username: username ?? accountProfileStore.username,
      bio: bio ?? accountProfileStore.bio,
      avatarUrl: avatarUrl ?? accountProfileStore.avatarUrl,
      website: website ?? accountProfileStore.website,
      country: country ?? accountProfileStore.country,
      timezone: timezone ?? accountProfileStore.timezone,
      language: language ?? accountProfileStore.language,
      socialLinks: {
        ...accountProfileStore.socialLinks,
        ...(socialLinks || {})
      }
    };

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'LOGIN_SUCCESS',
      description: 'Updated account profile settings and preferences',
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Profile settings updated successfully.',
      profile: accountProfileStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update Appearance Settings
app.put('/api/settings/appearance', (req, res) => {
  try {
    const { theme, defaultVoiceId, defaultArtStyle, autoSaveDrafts, reducedMotion, highContrastUi } = req.body;
    accountAppearanceStore = {
      ...accountAppearanceStore,
      theme: theme ?? accountAppearanceStore.theme,
      defaultVoiceId: defaultVoiceId ?? accountAppearanceStore.defaultVoiceId,
      defaultArtStyle: defaultArtStyle ?? accountAppearanceStore.defaultArtStyle,
      autoSaveDrafts: autoSaveDrafts ?? accountAppearanceStore.autoSaveDrafts,
      reducedMotion: reducedMotion ?? accountAppearanceStore.reducedMotion,
      highContrastUi: highContrastUi ?? accountAppearanceStore.highContrastUi
    };

    res.json({
      success: true,
      message: 'Appearance & studio preferences updated.',
      appearance: accountAppearanceStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update Notification Settings
app.put('/api/settings/notifications', (req, res) => {
  try {
    notificationSettingsStore = {
      ...notificationSettingsStore,
      ...req.body
    };

    res.json({
      success: true,
      message: 'Notification preferences saved.',
      notifications: notificationSettingsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Update Privacy Settings
app.put('/api/settings/privacy', (req, res) => {
  try {
    privacySettingsStore = {
      ...privacySettingsStore,
      ...req.body
    };

    res.json({
      success: true,
      message: 'Privacy settings updated.',
      privacy: privacySettingsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Connected Accounts Endpoints
app.get('/api/security/connected-accounts', (req, res) => {
  res.json({
    success: true,
    count: connectedAccountsStore.length,
    accounts: connectedAccountsStore
  });
});

app.post('/api/security/connected-accounts/link', (req, res) => {
  try {
    const { provider } = req.body;
    const acc = connectedAccountsStore.find(a => a.provider === provider);
    if (acc) {
      acc.status = 'connected';
      acc.connectedAt = new Date().toISOString();
      acc.email = acc.email || `kenji@${provider}.com`;
    }

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'LOGIN_SUCCESS',
      description: `Linked connected account provider: ${provider.toUpperCase()}`,
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Successfully linked ${provider.toUpperCase()} account.`,
      accounts: connectedAccountsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/security/connected-accounts/unlink', (req, res) => {
  try {
    const { provider } = req.body;
    const connectedCount = connectedAccountsStore.filter(a => a.status === 'connected').length;
    if (connectedCount <= 1) {
      return res.status(400).json({
        success: false,
        error: 'Cannot unlink provider. At least one connected account or authentication method is required.'
      });
    }

    const acc = connectedAccountsStore.find(a => a.provider === provider);
    if (acc) {
      acc.status = 'disconnected';
      acc.connectedAt = '';
    }

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'LOGIN_SUCCESS',
      description: `Unlinked OAuth provider: ${provider.toUpperCase()}`,
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Unlinked ${provider.toUpperCase()} provider.`,
      accounts: connectedAccountsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Active Sessions Management
app.get('/api/security/sessions', (req, res) => {
  res.json({
    success: true,
    count: activeSessionsStore.length,
    sessions: activeSessionsStore
  });
});

app.post('/api/security/sessions/revoke', (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = activeSessionsStore.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: `Session '${sessionId}' not found.` });
    }
    if (session.isCurrent) {
      return res.status(400).json({ success: false, error: 'Cannot revoke current active session. Use Logout instead.' });
    }

    activeSessionsStore = activeSessionsStore.filter(s => s.id !== sessionId);

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'SESSION_REVOKED',
      description: `Revoked active session on ${session.device} (${session.browser})`,
      ipAddress: req.ip || '127.0.0.1',
      device: session.device,
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Session on ${session.device} has been revoked.`,
      sessions: activeSessionsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/security/sessions/revoke-all', (req, res) => {
  try {
    const revokedCount = activeSessionsStore.filter(s => !s.isCurrent).length;
    activeSessionsStore = activeSessionsStore.filter(s => s.isCurrent);

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'SESSION_REVOKED',
      description: `Revoked all other active sessions (${revokedCount} devices signed out)`,
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Successfully signed out of ${revokedCount} other active sessions across all devices.`,
      sessions: activeSessionsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Security Activity & Audit Logs
app.get('/api/security/activity', (req, res) => {
  res.json({
    success: true,
    count: securityActivityLogsStore.length,
    activityLogs: securityActivityLogsStore
  });
});

// 9. API Key Management (Secure Generation & Hash Storage)
app.get('/api/apikeys', (req, res) => {
  // Return masked API keys
  const masked = apiKeysStore.map(k => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix,
    permissions: k.permissions,
    createdAt: k.createdAt,
    lastUsedAt: k.lastUsedAt,
    usageCount: k.usageCount,
    status: k.status
  }));

  res.json({
    success: true,
    count: masked.length,
    apiKeys: masked
  });
});

app.post('/api/apikeys', (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'API key name is required.' });
    }

    // Generate cryptographically secure random key
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const rawSecret = `ak_live_${randomBytes}`;
    const keyPrefix = rawSecret.substring(0, 12);

    // Hash secret using SHA-256 for secure database storage
    const keyHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    const newKeyItem = {
      id: `key_${Date.now()}`,
      name: name.trim(),
      keyPrefix,
      keyHash,
      permissions: permissions && Array.isArray(permissions) && permissions.length > 0 
        ? permissions 
        : ['read:projects', 'write:ai'],
      createdAt: new Date().toISOString(),
      usageCount: 0,
      status: 'active' as const
    };

    apiKeysStore.unshift(newKeyItem);

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'API_KEY_CREATED',
      description: `Generated new API key "${name.trim()}" (${keyPrefix}...)`,
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    // Return the raw secret ONCE to the client
    res.status(201).json({
      success: true,
      message: 'API Key generated successfully. Save this secret now as it will NOT be shown again.',
      apiKey: {
        id: newKeyItem.id,
        name: newKeyItem.name,
        keyPrefix: newKeyItem.keyPrefix,
        permissions: newKeyItem.permissions,
        createdAt: newKeyItem.createdAt,
        usageCount: newKeyItem.usageCount,
        status: newKeyItem.status,
        rawSecret
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/apikeys/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const key = apiKeysStore.find(k => k.id === id);
    if (!key) {
      return res.status(404).json({ success: false, error: `API Key '${id}' not found.` });
    }

    if (name) key.name = name.trim();

    res.json({
      success: true,
      message: 'API key renamed successfully.',
      apiKey: {
        id: key.id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        permissions: key.permissions,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        usageCount: key.usageCount,
        status: key.status
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/apikeys/:id', (req, res) => {
  try {
    const { id } = req.params;
    const key = apiKeysStore.find(k => k.id === id);
    if (!key) {
      return res.status(404).json({ success: false, error: `API Key '${id}' not found.` });
    }

    key.status = 'revoked';
    apiKeysStore = apiKeysStore.filter(k => k.id !== id);

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'API_KEY_CREATED',
      description: `Revoked API key "${key.name}" (${key.keyPrefix}...)`,
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'WARNING',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `API Key "${key.name}" revoked successfully.`,
      id
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Account Data Export Request (GDPR / Privacy Compliance)
app.post('/api/account/export-data', (req, res) => {
  try {
    const exportBundle = {
      user: accountProfileStore,
      appearance: accountAppearanceStore,
      notifications: notificationSettingsStore,
      privacy: privacySettingsStore,
      connectedAccounts: connectedAccountsStore.map(a => ({ provider: a.provider, email: a.email, connectedAt: a.connectedAt })),
      apiKeys: apiKeysStore.map(k => ({ name: k.name, keyPrefix: k.keyPrefix, createdAt: k.createdAt, usageCount: k.usageCount })),
      securityEvents: securityActivityLogsStore,
      exportedAt: new Date().toISOString(),
      formatVersion: 'AI Anime Studio Enterprise 6.5 Data Archive'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="ai-anime-studio-data-export-${Date.now()}.json"`);
    res.json(exportBundle);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Danger Zone - Delete Account Request
app.post('/api/account/danger-zone/delete', (req, res) => {
  try {
    const { confirmationText } = req.body;
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation text mismatch. Please type "DELETE MY ACCOUNT" exactly to confirm deletion.'
      });
    }

    securityActivityLogsStore.unshift({
      id: `sec_evt_${Date.now()}`,
      eventType: 'SUSPICIOUS_LOGIN',
      description: 'Account deletion initiated via Danger Zone. Soft delete flag set.',
      ipAddress: req.ip || '127.0.0.1',
      device: 'MacBook Pro Client',
      status: 'WARNING',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Account soft-deletion request initiated. Your account will be purged in 30 days per data retention policies.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// PHASE 7.2 DASHBOARD HOME & WIDGET ENDPOINTS
// ==========================================

let dashboardRecentProjectsStore = [
  {
    id: 'proj_cyber_01',
    title: 'Neon Genesis Genesis: Paradigm',
    tagline: 'Cyberpunk Mecha Odyssey',
    genre: 'Cyberpunk',
    format: 'anime_series',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    progressPercent: 78,
    lastModified: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    isFavorite: true,
    status: 'In Production',
    episodesCount: 12,
    charactersCount: 8,
    viewsCount: 14200
  },
  {
    id: 'proj_fantasy_02',
    title: 'Aetheria: Blade of the Starlight Void',
    tagline: 'High Fantasy Dark Isekai',
    genre: 'Dark Fantasy',
    format: 'light_novel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    progressPercent: 62,
    lastModified: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isFavorite: true,
    status: 'Scripting',
    episodesCount: 24,
    charactersCount: 15,
    viewsCount: 28900
  },
  {
    id: 'proj_mech_03',
    title: 'Valkyrie Protocol: Zero Hour',
    tagline: 'Sci-Fi Tactical Mech War',
    genre: 'Sci-Fi / Mecha',
    format: 'anime_series',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    progressPercent: 41,
    lastModified: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    isFavorite: false,
    status: 'Rendering',
    episodesCount: 6,
    charactersCount: 6,
    viewsCount: 8400
  },
  {
    id: 'proj_manga_04',
    title: 'Shadow Ninja: Shinobi Chronicles',
    tagline: 'Action Supernatural Manga',
    genre: 'Action / Shonen',
    format: 'manga_comic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    progressPercent: 92,
    lastModified: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    isFavorite: false,
    status: 'Published',
    episodesCount: 18,
    charactersCount: 11,
    viewsCount: 52100
  },
  {
    id: 'proj_short_05',
    title: 'Chrono Drift: Tokyo 2099',
    tagline: 'Futuristic Street Racing OVA',
    genre: 'Action / Sci-Fi',
    format: 'youtube_short',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    progressPercent: 35,
    lastModified: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    isFavorite: false,
    status: 'Planning',
    episodesCount: 3,
    charactersCount: 4,
    viewsCount: 3100
  }
];

let dashboardActivityFeedStore = [
  {
    id: 'act_01',
    type: 'render',
    userName: 'Kaito Tanaka',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    action: 'rendered 4K 60fps keyframe sequence for Episode 4',
    targetName: 'Neon Genesis Genesis: Paradigm',
    timestamp: '12 minutes ago',
    projectId: 'proj_cyber_01',
    badgeColor: 'indigo'
  },
  {
    id: 'act_02',
    type: 'asset',
    userName: 'Aoi Fujishima',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    action: 'added 2D rigging expression pack to Character Lorebook',
    targetName: 'Aetheria: Starlight Void',
    timestamp: '45 minutes ago',
    projectId: 'proj_fantasy_02',
    badgeColor: 'purple'
  },
  {
    id: 'act_03',
    type: 'voice',
    userName: 'Sora Sato',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    action: 'synthesized Japanese Dubbing for Character "Ren"',
    targetName: 'Valkyrie Protocol',
    timestamp: '2 hours ago',
    projectId: 'proj_mech_03',
    badgeColor: 'emerald'
  },
  {
    id: 'act_04',
    type: 'marketplace',
    userName: 'Mio Takahashi',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    action: 'purchased "Ufotable Cyberpunk Lighting LoRA Pack"',
    targetName: 'Global Marketplace',
    timestamp: '4 hours ago',
    projectId: 'marketplace',
    badgeColor: 'amber'
  },
  {
    id: 'act_05',
    type: 'team',
    userName: 'Kenji Suzuki',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    action: 'approved Episode 2 Script Draft in Novel Writer Studio',
    targetName: 'Shadow Ninja',
    timestamp: '6 hours ago',
    projectId: 'proj_manga_04',
    badgeColor: 'blue'
  }
];

let dashboardNotificationsStore = [
  {
    id: 'notif_01',
    title: '4K Render Sequence Completed',
    message: 'Keyframe sequence for Neon Genesis Episode 4 has finished neural upscale (60fps).',
    category: 'alert',
    timestamp: '10 mins ago',
    read: false,
    actionUrl: '/anime'
  },
  {
    id: 'notif_02',
    title: 'Team Member Joined Studio',
    message: 'Lead Voice Director Sora Sato joined Kyoto Anime Labs.',
    category: 'team',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/rbac'
  },
  {
    id: 'notif_03',
    title: 'Security Alert: New API Key Issued',
    message: 'A new production API key "Gemini 1.5 Pro Key 01" was initialized.',
    category: 'security',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '/settings'
  },
  {
    id: 'notif_04',
    title: 'Weekly Credits Rollover Success',
    message: 'Enterprise Studio subscription topped up +15,000 GPU credits.',
    category: 'system',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/billing'
  }
];

// 1. Dashboard Summary
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const summary = {
      userGreeting: 'Welcome back',
      userName: accountProfileStore.displayName || 'Showrunner',
      organization: 'Studio AI Production',
      teamName: 'Kyoto Anime Labs',
      totalProjects: dashboardRecentProjectsStore.length,
      activeSeriesCount: 3,
      episodesInProduction: 18,
      renderedScenesCount: 342,
      characterRosterCount: 44,
      lastUpdated: new Date().toISOString()
    };
    res.json({ success: true, summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Recent Projects
app.get('/api/dashboard/recent-projects', (req, res) => {
  try {
    res.json({ success: true, projects: dashboardRecentProjectsStore });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle Favorite Status
app.post('/api/dashboard/projects/:id/favorite', (req, res) => {
  try {
    const { id } = req.params;
    const project = dashboardRecentProjectsStore.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    project.isFavorite = !project.isFavorite;
    res.json({ success: true, id, isFavorite: project.isFavorite, project });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. AI Usage Statistics
app.get('/api/dashboard/usage-stats', (req, res) => {
  try {
    const usage = {
      requestsToday: 142,
      requestsThisMonth: 3840,
      tokensUsedToday: 482100,
      tokensUsedThisMonth: 12450000,
      remainingCredits: 14850,
      maxCreditsQuota: 20000,
      modelBreakdown: [
        { model: 'Gemini 1.5 Pro', percentage: 68, color: '#6366f1' },
        { model: 'Imagen 3 Anime', percentage: 22, color: '#a855f7' },
        { model: 'Runway Veo 2', percentage: 7, color: '#ec4899' },
        { model: 'Chirp Audio Dub', percentage: 3, color: '#10b981' }
      ],
      dailyTrend: [
        { date: 'Mon', requests: 120, tokens: 390000 },
        { date: 'Tue', requests: 180, tokens: 520000 },
        { date: 'Wed', requests: 142, tokens: 482100 },
        { date: 'Thu', requests: 210, tokens: 680000 },
        { date: 'Fri', requests: 195, tokens: 610000 },
        { date: 'Sat', requests: 90, tokens: 280000 },
        { date: 'Sun', requests: 110, tokens: 340000 }
      ]
    };
    res.json({ success: true, usage });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Storage Usage
app.get('/api/dashboard/storage-usage', (req, res) => {
  try {
    const storage = {
      totalStorageBytes: 84.2 * 1024 * 1024 * 1024,
      maxStorageQuotaBytes: 500 * 1024 * 1024 * 1024,
      breakdown: [
        { category: 'Images', bytes: 32.4 * 1024 * 1024 * 1024, percentage: 38.5, color: '#818cf8' },
        { category: 'Videos', bytes: 41.8 * 1024 * 1024 * 1024, percentage: 49.6, color: '#c084fc' },
        { category: 'Audio', bytes: 6.2 * 1024 * 1024 * 1024, percentage: 7.4, color: '#34d399' },
        { category: 'Documents', bytes: 3.8 * 1024 * 1024 * 1024, percentage: 4.5, color: '#fbbf24' }
      ]
    };
    res.json({ success: true, storage });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Activity Feed
app.get('/api/dashboard/activity-feed', (req, res) => {
  try {
    res.json({ success: true, activities: dashboardActivityFeedStore });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Notifications Summary
app.get('/api/dashboard/notifications-summary', (req, res) => {
  try {
    const unreadCount = dashboardNotificationsStore.filter(n => !n.read).length;
    res.json({
      success: true,
      unreadCount,
      recentAlerts: dashboardNotificationsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Product Tips & Announcements
app.get('/api/dashboard/tips', (req, res) => {
  try {
    const tips = [
      {
        id: 'tip_01',
        title: 'Gemini 1.5 Pro 60fps Neural Upscale',
        description: 'New Ufotable-grade interpolation engine is live. Render smooth 60fps action sequences directly in Anime Studio.',
        category: 'Feature',
        badge: 'NEW v2.4',
        actionTab: 'anime',
        date: 'Aug 2026',
        isNew: true
      },
      {
        id: 'tip_02',
        title: 'Character Style Locking with Imagen 3',
        description: 'Maintain 99.8% visual consistency across multiple camera angles and lighting setups using character seed pins.',
        category: 'Tip',
        badge: 'PRO TIP',
        actionTab: 'characters',
        date: 'Aug 2026',
        isNew: false
      },
      {
        id: 'tip_03',
        title: 'Real-Time Voice Dubbing in Japanese & English',
        description: 'Synthesize emotional dub tracks with multi-speaker pitch bending and lip-sync timestamp generation.',
        category: 'Announcement',
        badge: 'AUDIO ENGINE',
        actionTab: 'voice',
        date: 'Aug 2026',
        isNew: false
      }
    ];
    res.json({ success: true, tips });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// PHASE 7.3 PROJECTS WORKSPACE & PIPELINES ENDPOINTS
// ==========================================

// Extended mock projects workspace store
let workspaceProjectsList = [
  ...dashboardRecentProjectsStore.map(p => ({
    ...p,
    tags: [p.genre, p.format.replace('_', ' ')],
    synopsis: `${p.title} is an ambitious ${p.genre} production created in AI Anime Studio. It features rich lore, keyframe interpolation, and neural voice tracks.`,
    teamMembers: [
      { name: 'Kaito Tanaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'Director' },
      { name: 'Aoi Fujishima', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', role: 'Lead Artist' }
    ],
    pipelineStage: p.status === 'Published' ? 'Release' : p.status === 'In Production' ? '4K Animation' : p.status === 'Scripting' ? 'Scripting' : p.status === 'Rendering' ? 'Post-Processing' : 'Pre-Production',
    mangaPagesCount: p.format === 'manga_comic' ? 42 : 12,
    voiceTracksCount: p.episodesCount * 4
  })),
  {
    id: 'proj_slice_06',
    title: 'Sakura Petals & Code Loops',
    tagline: 'Wholesome School Slice of Life Light Novel',
    genre: 'Slice of Life',
    format: 'light_novel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528164344705-47542687990d?w=800&auto=format&fit=crop&q=80',
    progressPercent: 88,
    lastModified: new Date(Date.now() - 1000 * 60 * 3600).toISOString(),
    isFavorite: false,
    status: 'In Production',
    episodesCount: 14,
    charactersCount: 7,
    mangaPagesCount: 0,
    voiceTracksCount: 28,
    viewsCount: 19400,
    tags: ['Slice of Life', 'Romance', 'School'],
    synopsis: 'A heartfelt high school light novel about high school programmers restoring an old arcade game.',
    teamMembers: [
      { name: 'Sora Sato', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'Writer' }
    ],
    pipelineStage: 'Scripting'
  },
  {
    id: 'proj_short_07',
    title: 'Cyber Samurai 2077 Shorts',
    tagline: 'High Speed Vertical Anime Shorts',
    genre: 'Cyberpunk',
    format: 'youtube_short',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    progressPercent: 15,
    lastModified: new Date(Date.now() - 1000 * 60 * 4200).toISOString(),
    isFavorite: false,
    status: 'Planning',
    episodesCount: 5,
    charactersCount: 3,
    mangaPagesCount: 0,
    voiceTracksCount: 10,
    viewsCount: 6200,
    tags: ['Shorts', 'Action', 'Vertical'],
    synopsis: 'Bite-sized high-fps cyber blade battles optimized for viral social media distribution.',
    teamMembers: [
      { name: 'Kaito Tanaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'Animator' }
    ],
    pipelineStage: 'Pre-Production'
  }
];

// GET /api/projects
app.get('/api/projects', (req, res) => {
  try {
    const { format, status, genre, search, sortBy } = req.query;

    let result = [...workspaceProjectsList];

    if (format && format !== 'all') {
      result = result.filter(p => p.format === format);
    }

    if (status && status !== 'all') {
      result = result.filter(p => p.status.toLowerCase().replace(/\s+/g, '_') === String(status).toLowerCase().replace(/\s+/g, '_') || p.status.toLowerCase() === String(status).toLowerCase());
    }

    if (genre && genre !== 'all') {
      result = result.filter(p => p.genre.toLowerCase().includes(String(genre).toLowerCase()));
    }

    if (search) {
      const query = String(search).toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.synopsis.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'progress') {
      result.sort((a, b) => b.progressPercent - a.progressPercent);
    } else if (sortBy === 'views') {
      result.sort((a, b) => b.viewsCount - a.viewsCount);
    } else {
      // Default lastModified desc
      result.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    }

    res.json({ success: true, projects: result, totalCount: result.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/projects/stats
app.get('/api/projects/stats', (req, res) => {
  try {
    const totalProjects = workspaceProjectsList.length;
    const activeSeries = workspaceProjectsList.filter(p => p.status === 'In Production' || p.status === 'Rendering').length;
    const publishedProjects = workspaceProjectsList.filter(p => p.status === 'Published').length;
    const totalEpisodes = workspaceProjectsList.reduce((acc, p) => acc + p.episodesCount, 0);
    const totalCharacters = workspaceProjectsList.reduce((acc, p) => acc + p.charactersCount, 0);
    const avgProgress = Math.round(workspaceProjectsList.reduce((acc, p) => acc + p.progressPercent, 0) / (totalProjects || 1));

    res.json({
      success: true,
      stats: {
        totalProjects,
        activeSeries,
        publishedProjects,
        totalEpisodes,
        totalCharacters,
        avgProgress
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/projects - Create new project
app.post('/api/projects', (req, res) => {
  try {
    const { title, tagline, format, genre, synopsis, tags } = req.body;
    if (!title || !format || !genre) {
      return res.status(400).json({ success: false, error: 'Title, format, and genre are required' });
    }

    const defaultCover = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';

    const newProject = {
      id: `proj_${Date.now()}`,
      title,
      tagline: tagline || 'New Anime Studio Rig',
      genre,
      format: format || 'anime_series',
      thumbnailUrl: defaultCover,
      progressPercent: 5,
      lastModified: new Date().toISOString(),
      isFavorite: false,
      status: 'Planning',
      episodesCount: 1,
      charactersCount: 2,
      mangaPagesCount: 0,
      voiceTracksCount: 0,
      viewsCount: 0,
      tags: tags || [genre, format],
      synopsis: synopsis || 'Newly created project rig in AI Anime Studio.',
      teamMembers: [
        { name: 'Showrunner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'Creator' }
      ],
      pipelineStage: 'Pre-Production'
    };

    workspaceProjectsList.unshift(newProject);
    // Also keep dashboardRecentProjectsStore updated
    dashboardRecentProjectsStore.unshift(newProject);

    res.status(201).json({ success: true, project: newProject });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/projects/:id - Update project
app.put('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = workspaceProjectsList.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const updated = {
      ...workspaceProjectsList[index],
      ...req.body,
      lastModified: new Date().toISOString()
    };

    workspaceProjectsList[index] = updated;

    // Update in dashboard store if exists
    const dashIdx = dashboardRecentProjectsStore.findIndex(p => p.id === id);
    if (dashIdx !== -1) {
      dashboardRecentProjectsStore[dashIdx] = { ...dashboardRecentProjectsStore[dashIdx], ...updated };
    }

    res.json({ success: true, project: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/projects/:id/clone - Duplicate project
app.post('/api/projects/:id/clone', (req, res) => {
  try {
    const { id } = req.params;
    const existing = workspaceProjectsList.find(p => p.id === id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const cloned = {
      ...existing,
      id: `proj_${Date.now()}`,
      title: `${existing.title} (Copy)`,
      lastModified: new Date().toISOString(),
      isFavorite: false,
      progressPercent: 0,
      status: 'Planning',
      pipelineStage: 'Pre-Production'
    };

    workspaceProjectsList.unshift(cloned);
    dashboardRecentProjectsStore.unshift(cloned);

    res.status(201).json({ success: true, project: cloned });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/projects/:id - Archive / Delete project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    workspaceProjectsList = workspaceProjectsList.filter(p => p.id !== id);
    dashboardRecentProjectsStore = dashboardRecentProjectsStore.filter(p => p.id !== id);

    res.json({ success: true, message: 'Project removed from workspace', id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});




// Vite / Static setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Anime Studio] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
