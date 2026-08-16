export type StudioTab = 
  | 'dashboard'
  | 'projects'
  | 'novel'
  | 'characters'
  | 'world'
  | 'storyboard'
  | 'manga'
  | 'anime'
  | 'prompt'
  | 'voice'
  | 'music'
  | 'video'
  | 'assets'
  | 'marketplace'
  | 'community'
  | 'analytics'
  | 'billing'
  | 'settings'
  | 'admin'
  | 'profile'
  | 'rbac'
  | 'publish';

// ==========================================
// PHASE 7.1 DASHBOARD SHELL TYPES
// ==========================================

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'Enterprise Studio' | 'Pro Creator' | 'Free Tier';
  role: 'Owner' | 'Admin' | 'Member';
}

export interface OrganizationItem {
  id: string;
  name: string;
  avatarUrl?: string;
  membersCount: number;
}

export interface TeamItem {
  id: string;
  name: string;
  department: string;
  iconName: string;
}

export interface PinnedItem {
  id: string;
  title: string;
  type: 'project' | 'character' | 'novel' | 'manga' | 'storyboard';
  tab: StudioTab;
  isFavorite?: boolean;
}

export interface CommandPaletteGroup {
  category: 'Navigation' | 'Projects' | 'Characters' | 'Stories' | 'Commands' | 'Quick Actions';
  items: CommandPaletteItem[];
}

export interface CommandPaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Projects' | 'Characters' | 'Stories' | 'Commands' | 'Quick Actions';
  shortcut?: string;
  icon: string;
  tab?: StudioTab;
  action?: () => void;
}

export interface AiProviderStatus {
  provider: 'Gemini 1.5 Pro' | 'Gemini 1.5 Flash' | 'Imagen 3' | 'Chirp Audio' | 'Runway Gen-3';
  status: 'operational' | 'degraded' | 'maintenance';
  latencyMs: number;
}

export interface StudioNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'render_complete' | 'security' | 'team_invite' | 'credit_low' | 'system';
}

export type ProjectFormat = 
  | 'anime_series'
  | 'manga_comic'
  | 'webtoon'
  | 'light_novel'
  | 'storyboard'
  | 'youtube_short';

export type Genre = 
  | 'cyberpunk'
  | 'fantasy_isekai'
  | 'shonen_action'
  | 'slice_of_life'
  | 'mecha_sci_fi'
  | 'dark_supernatural';

export interface Character {
  id: string;
  name: string;
  japaneseName?: string;
  role: 'protagonist' | 'deuteragonist' | 'antagonist' | 'supporting' | 'mentor';
  archetype: string;
  age: number;
  height: string;
  stats: {
    strength: number; // 0-100
    magic: number;    // 0-100
    agility: number;  // 0-100
    intellect: number;// 0-100
    charisma: number; // 0-100
  };
  personality: string;
  backstory: string;
  visualPrompt: string;
  outfitDetails: string;
  voiceName: string; // 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon'
  avatarUrl?: string;
  signatureMove?: string;
}

export interface NovelChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  content: string;
  sceneBeats: string[];
  suggestedPrompt: string;
  wordCount: number;
}

export interface DialogueBubble {
  id: string;
  characterId: string;
  characterName: string;
  text: string;
  bubbleType: 'speech' | 'thought' | 'shout' | 'whisper';
  position: { x: number; y: number }; // percentage inside panel
}

export interface MangaPanel {
  id: string;
  panelNumber: number;
  layout: 'standard' | 'wide' | 'tall' | 'splash' | 'diagonal';
  cameraAngle: 'Close-up' | 'Medium Shot' | 'Wide Shot' | 'Low Angle Worm Eye' | 'High Angle Bird Eye' | 'Dutch Angle';
  sfx: string; // e.g. "ドドド", "ゴゴゴ", "BOM!"
  sfxPosition?: { x: number; y: number };
  prompt: string;
  imageUrl?: string;
  dialogueBubbles: DialogueBubble[];
  caption?: string;
}

export interface StoryboardFrame {
  id: string;
  sceneNumber: number;
  frameNumber: number;
  shotType: 'Extreme Close-up' | 'Close-up' | 'Medium' | 'Wide' | 'Establishing';
  cameraMove: 'Static' | 'Pan Right' | 'Pan Left' | 'Zoom In' | 'Zoom Out' | 'Tilt Up' | 'Tracking Shot';
  action: string;
  dialogue: string;
  soundEffect: string;
  musicMood: string;
  prompt: string;
  imageUrl?: string;
  durationSeconds: number;
}

export interface VoiceTrack {
  id: string;
  characterName: string;
  voiceName: string;
  emotion: 'heroic' | 'dramatic' | 'tsundere' | 'whisper' | 'energetic' | 'calm';
  text: string;
  audioBase64?: string;
  durationMs?: number;
  createdAt: string;
}

export interface VideoGeneration {
  id: string;
  operationName?: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  status: 'idle' | 'generating' | 'completed' | 'failed';
  videoUrl?: string;
  progressMessage?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  format: ProjectFormat;
  genre: Genre;
  synopsis: string;
  coverImage: string;
  updatedAt: string;
  episodesCount: number;
  charactersCount: number;
  mangaPagesCount: number;
  voiceTracksCount: number;
  characters: Character[];
  chapters: NovelChapter[];
  mangaPanels: MangaPanel[];
  storyboardFrames: StoryboardFrame[];
  voiceTracks: VoiceTrack[];
  videoGenerations: VideoGeneration[];
}

export interface StudioAnalytics {
  totalRenders: number;
  charactersCreated: number;
  chaptersWritten: number;
  mangaPanelsDrawn: number;
  voiceMinutesGenerated: number;
  storageUsedMB: number;
  gpuQuotaRemaining: number;
}

export type SystemRoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'USER';
export type OrgRoleCode = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
export type TeamRoleCode = 'TEAM_LEAD' | 'MEMBER' | 'GUEST';

export type UserRole = SystemRoleCode | 'CREATOR' | 'MEMBER' | 'GUEST';

export type PermissionCode = 
  | 'user.read'
  | 'user.update'
  | 'user.delete'
  | 'project.create'
  | 'project.read'
  | 'project.update'
  | 'project.delete'
  | 'story.create'
  | 'story.edit'
  | 'story.publish'
  | 'character.create'
  | 'character.edit'
  | 'character.delete'
  | 'marketplace.sell'
  | 'marketplace.buy'
  | 'marketplace.moderate'
  | 'admin.dashboard'
  | 'admin.users'
  | 'admin.settings'
  | string;

export type RoleScope = 'SYSTEM' | 'ORGANIZATION' | 'TEAM' | 'CUSTOM';

export interface RbacPermission {
  id: string;
  code: PermissionCode;
  name: string;
  category: 'Users' | 'Projects' | 'Stories' | 'Characters' | 'Marketplace' | 'Admin' | string;
  description: string;
}

export interface FeaturePermission {
  id: string;
  roleId: string;
  featureKey: string;
  isEnabled: boolean;
  configJson?: Record<string, any>;
}

export interface RbacRole {
  id: string;
  code: string;
  name: string;
  scope: RoleScope;
  description: string;
  isSystem: boolean;
  permissions: PermissionCode[];
  featurePermissions?: FeaturePermission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRoleAssignment {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  systemRole: SystemRoleCode;
  orgRole: OrgRoleCode;
  teamRole: TeamRoleCode;
  customRoles?: string[];
  assignedAt?: string;
}

export interface RbacAuditLogItem {
  id: string;
  actorId: string;
  actorName?: string;
  action: 'ROLE_ASSIGNED' | 'ROLE_REVOKED' | 'PERMISSION_GRANTED' | 'PERMISSION_REVOKED' | 'CUSTOM_ROLE_CREATED' | 'ROLE_UPDATED';
  targetUserId?: string;
  targetUserName?: string;
  roleId?: string;
  roleCode?: string;
  permissionCode?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface EffectivePermissionsResponse {
  userId: string;
  roles: {
    system: SystemRoleCode;
    org: OrgRoleCode;
    team: TeamRoleCode;
    custom: string[];
  };
  permissions: PermissionCode[];
  featureFlags: Record<string, boolean>;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  discord?: string;
  youtube?: string;
  artstation?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'ja' | 'ko' | 'fr' | 'es';
  timezone: string;
  defaultVoiceId: string;
  defaultArtStyle: string;
}

export interface UserPreferences {
  isPublicProfile: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  showInLeaderboard: boolean;
  autoSaveDrafts: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  coverUrl?: string;
  socialLinks?: SocialLinks;
  settings?: UserSettings;
  preferences?: UserPreferences;
  completionPercentage: number;
  updatedAt?: string;
}

export interface ProfileAuditLog {
  id: string;
  userId: string;
  action: string;
  changedFields: string[];
  ipAddress?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  teamId?: string;
  teamName?: string;
  profile?: UserProfile;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: string;
}

// ==========================================
// PHASE 6.5 ACCOUNT SETTINGS & SECURITY TYPES
// ==========================================

export type SettingsSubTab = 
  | 'profile'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'connected'
  | 'security'
  | 'apikeys'
  | 'danger';

export interface AccountProfileData {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  website: string;
  country: string;
  timezone: string;
  language: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
    youtube?: string;
  };
}

export interface AccountAppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  defaultVoiceId: string;
  defaultArtStyle: string;
  autoSaveDrafts: boolean;
  reducedMotion: boolean;
  highContrastUi: boolean;
}

export interface NotificationSettingsData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  marketplaceActivity: boolean;
}

export interface PrivacySettingsData {
  isPublicProfile: boolean;
  hideEmail: boolean;
  hideActivity: boolean;
  searchVisibility: boolean;
  dataExportRequested: boolean;
  dataExportUrl?: string;
}

export interface ConnectedAccountItem {
  id: string;
  provider: 'google' | 'github' | 'discord' | 'microsoft' | 'apple';
  providerName: string;
  email: string;
  connectedAt: string;
  status: 'connected' | 'disconnected';
  avatarUrl?: string;
}

export interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface SecurityActivityLogItem {
  id: string;
  eventType: 'LOGIN_SUCCESS' | 'PASSWORD_CHANGE' | 'MFA_ENABLED' | 'MFA_DISABLED' | 'API_KEY_CREATED' | 'SESSION_REVOKED' | 'SUSPICIOUS_LOGIN';
  description: string;
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  createdAt: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
  status: 'active' | 'revoked';
}

export interface NewApiKeyResult extends ApiKeyItem {
  rawSecret: string;
}

export interface SecurityOverviewData {
  mfaEnabled: boolean;
  mfaMethod?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  passwordLastChangedAt?: string;
  trustedDevicesCount: number;
  activeSessionsCount: number;
}

// ==========================================
// PHASE 7.2 DASHBOARD HOME & WIDGET TYPES
// ==========================================

export interface DashboardSummaryResponse {
  userGreeting: string;
  userName: string;
  organization: string;
  teamName: string;
  totalProjects: number;
  activeSeriesCount: number;
  episodesInProduction: number;
  renderedScenesCount: number;
  characterRosterCount: number;
  lastUpdated: string;
}

export interface RecentProjectItem {
  id: string;
  title: string;
  tagline: string;
  genre: string;
  format: string;
  thumbnailUrl: string;
  progressPercent: number;
  lastModified: string;
  isFavorite: boolean;
  status: 'In Production' | 'Scripting' | 'Rendering' | 'Published' | 'Planning';
  episodesCount: number;
  charactersCount: number;
  viewsCount?: number;
}

export interface AiUsageStatsResponse {
  requestsToday: number;
  requestsThisMonth: number;
  tokensUsedToday: number;
  tokensUsedThisMonth: number;
  remainingCredits: number;
  maxCreditsQuota: number;
  modelBreakdown: {
    model: string;
    percentage: number;
    color: string;
  }[];
  dailyTrend: {
    date: string;
    requests: number;
    tokens: number;
  }[];
}

export interface StorageUsageResponse {
  totalStorageBytes: number;
  maxStorageQuotaBytes: number;
  breakdown: {
    category: 'Images' | 'Videos' | 'Audio' | 'Documents';
    bytes: number;
    percentage: number;
    color: string;
  }[];
}

export interface ActivityFeedItem {
  id: string;
  type: 'edit' | 'asset' | 'team' | 'marketplace' | 'render' | 'voice';
  userName: string;
  userAvatar: string;
  action: string;
  targetName: string;
  timestamp: string;
  projectId?: string;
  badgeColor?: string;
}

export interface NotificationsSummaryResponse {
  unreadCount: number;
  recentAlerts: {
    id: string;
    title: string;
    message: string;
    category: 'alert' | 'security' | 'team' | 'system';
    timestamp: string;
    read: boolean;
    actionUrl?: string;
  }[];
}

export interface TipOrAnnouncement {
  id: string;
  title: string;
  description: string;
  category: 'Feature' | 'Tip' | 'Announcement';
  badge: string;
  readMoreUrl?: string;
  actionTab?: StudioTab;
  date: string;
  isNew?: boolean;
}

// ==========================================
// PHASE 7.4 WORLD BUILDER & LORE DATABASE TYPES
// ==========================================

export type FactionType = 'Empire' | 'Guild' | 'Syndicate' | 'Magic Order' | 'Megacorp' | 'Rebellion';
export type FactionAlignment = 'Lawful Good' | 'Chaotic Neutral' | 'Lawful Evil' | 'Chaotic Good' | 'Neutral';

export interface Faction {
  id: string;
  name: string;
  type: FactionType;
  leader: string;
  alignment: FactionAlignment;
  powerLevel: number; // 1-100
  membersCount: number;
  headquarters: string;
  description: string;
  motto: string;
  allies: string[];
  enemies: string[];
  color: string;
  logoUrl?: string;
}

export type LoreCategory = 'Magic System' | 'Technology' | 'Relic' | 'Religion' | 'Culture' | 'Species';

export interface LoreEntry {
  id: string;
  title: string;
  category: LoreCategory;
  summary: string;
  detailedContent: string;
  tags: string[];
  secrecyLevel: 'Public Knowledge' | 'Guarded Secret' | 'Forbidden Knowledge' | 'Classified';
  associatedCharacters: string[];
  updatedAt: string;
  imageUrl?: string;
}

export type LocationType = 'Capital City' | 'Forbidden Dungeon' | 'Ancient Ruins' | 'Orbital Citadel' | 'Shattered Zone' | 'Sovereign Haven';

export interface WorldLocation {
  id: string;
  name: string;
  region: string;
  type: LocationType;
  controllingFaction: string;
  dangerLevel: 'Safe Zone' | 'Moderate Risk' | 'Lethal Hazard' | 'Extinction Level';
  population: string;
  mapX: number; // 0 to 100 percentage
  mapY: number; // 0 to 100 percentage
  description: string;
  pointsOfInterest: string[];
  imageUrl: string;
}

export type EventCategory = 'War & Conflict' | 'Discovery' | 'Cataclysm' | 'Political Treaty' | 'Ascension';

export interface TimelineEvent {
  id: string;
  era: string;
  year: string;
  title: string;
  category: EventCategory;
  description: string;
  keyFactions: string[];
  keyCharacters: string[];
  impactScore: number; // 1-10
}

export interface WorldBuildingStats {
  totalFactions: number;
  totalLoreEntries: number;
  totalLocations: number;
  timelineEventsCount: number;
  magicSystemsCount: number;
}

// ==========================================
// PHASE 7.5 CHARACTER STUDIO & VOICE RIG TYPES
// ==========================================

export type CharacterArchetype = 'Protagonist' | 'Antagonist' | 'Rival' | 'Mentor' | 'Sidekick' | 'Deity' | 'Anti-Hero';
export type CharacterElement = 'Fire' | 'Ice' | 'Lightning' | 'Void' | 'Plasma' | 'Wind' | 'Star-Mote' | 'Cyberware';

export interface CharacterSheetStats {
  combatPower: number; // 1-100
  agilitySpeed: number; // 1-100
  intelligenceTactics: number; // 1-100
  manaAffinity: number; // 1-100
  defenseResist: number; // 1-100
}

export interface CharacterExpression {
  id: string;
  emotion: 'Heroic / Determined' | 'Tsundere / Blushing' | 'Combat Rage' | 'Shocked / Wide-Eyed' | 'Sly Smile' | 'Melancholy';
  imageUrl: string;
  promptDescription: string;
}

export interface CharacterVoiceProfile {
  voiceActorName: 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon';
  pitchModifier: number; // -10 to +10
  speedModifier: number; // 0.5 to 2.0
  catchphrase: string;
  preferredTone: 'heroic' | 'dramatic' | 'tsundere' | 'whisper' | 'energetic' | 'calm';
}

export interface DetailedCharacter {
  id: string;
  name: string;
  japaneseName?: string;
  role: string;
  archetype: CharacterArchetype;
  element: CharacterElement;
  age: string;
  factionAffiliation: string;
  description: string;
  personalityTraits: string[];
  signatureMoves: string[];
  backstory: string;
  avatarUrl: string;
  stats: CharacterSheetStats;
  expressions: CharacterExpression[];
  voiceProfile: CharacterVoiceProfile;
  createdAt: string;
}

export interface CharacterStudioTelemetry {
  totalCharacters: number;
  protagonistsCount: number;
  dubbedTracksCount: number;
  totalExpressionsGenerated: number;
  avgCombatRating: number;
}

// ==========================================
// PHASE 7.6 LIGHT NOVEL AI SCRIPTWRITER TYPES
// ==========================================

export type NovelTone = 'Action / Cyberpunk' | 'Dark Fantasy' | 'Slice of Life / RomCom' | 'Isekai Fantasy' | 'Psychological Thriller';

export interface DialogueNode {
  id: string;
  speakerName: string;
  emotion: string;
  line: string;
}

export interface IllustrationAnchor {
  id: string;
  anchorName: string;
  paragraphIndex: number;
  promptDescription: string;
  imageUrl?: string;
  styleTag: 'Full-Page Splash' | 'Chibi Interlude' | 'Battle Climax Insert' | 'Character Profile Spread';
}

export interface LightNovelChapter {
  id: string;
  chapterNumber: number;
  title: string;
  japaneseTitle?: string;
  summary: string;
  tone: NovelTone;
  content: string;
  wordCount: number;
  dialogueNodes: DialogueNode[];
  illustrationAnchors: IllustrationAnchor[];
  createdAt: string;
  updatedAt: string;
}

export interface NovelStudioTelemetry {
  totalChapters: number;
  totalWordCount: number;
  avgDialogueDensity: number; // percentage
  totalIllustrationAnchors: number;
  aiGeneratedChapters: number;
}




