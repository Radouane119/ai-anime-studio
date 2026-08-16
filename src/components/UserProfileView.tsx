import React, { useState, useEffect } from 'react';
import {
  User,
  Check,
  X,
  Shield,
  Edit3,
  Camera,
  Globe,
  MapPin,
  Twitter,
  Github,
  Youtube,
  Sparkles,
  Sliders,
  History,
  Eye,
  EyeOff,
  Bell,
  Moon,
  Sun,
  Languages,
  Mic,
  Palette,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  Clock,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, ProfileAuditLog } from '../types';
import { validateProfileForm, ProfileFormValues, ValidationErrorMap } from '../utils/profileValidation';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=250&auto=format&fit=crop&q=80',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
];

export const UserProfileView: React.FC = () => {
  const { user, updateProfile, checkUsernameAvailable } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'settings' | 'audit'>('overview');

  const currentProfile = user?.profile;

  // Form State
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    displayName: currentProfile?.displayName || user?.name || '',
    username: currentProfile?.username || 'creator_user',
    bio: currentProfile?.bio || '',
    location: currentProfile?.location || '',
    website: currentProfile?.website || '',
    avatarUrl: currentProfile?.avatarUrl || user?.avatarUrl || AVATAR_PRESETS[0],
    coverUrl: currentProfile?.coverUrl || COVER_PRESETS[0],
    socialLinks: {
      twitter: currentProfile?.socialLinks?.twitter || '',
      github: currentProfile?.socialLinks?.github || '',
      discord: currentProfile?.socialLinks?.discord || '',
      youtube: currentProfile?.socialLinks?.youtube || '',
      artstation: currentProfile?.socialLinks?.artstation || '',
    },
    settings: {
      theme: currentProfile?.settings?.theme || 'dark',
      language: currentProfile?.settings?.language || 'en',
      timezone: currentProfile?.settings?.timezone || 'Asia/Tokyo',
      defaultVoiceId: currentProfile?.settings?.defaultVoiceId || 'Gemini-Neural-JP-01',
      defaultArtStyle: currentProfile?.settings?.defaultArtStyle || 'Shonen Cyberpunk High Contrast',
    },
    preferences: {
      isPublicProfile: currentProfile?.preferences?.isPublicProfile ?? true,
      emailNotifications: currentProfile?.preferences?.emailNotifications ?? true,
      marketingEmails: currentProfile?.preferences?.marketingEmails ?? false,
      showInLeaderboard: currentProfile?.preferences?.showInLeaderboard ?? true,
      autoSaveDrafts: currentProfile?.preferences?.autoSaveDrafts ?? true,
    },
  });

  const [errors, setErrors] = useState<ValidationErrorMap>({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<ProfileAuditLog[]>([]);

  useEffect(() => {
    if (currentProfile) {
      setFormValues({
        displayName: currentProfile.displayName || user?.name || '',
        username: currentProfile.username || '',
        bio: currentProfile.bio || '',
        location: currentProfile.location || '',
        website: currentProfile.website || '',
        avatarUrl: currentProfile.avatarUrl || user?.avatarUrl || AVATAR_PRESETS[0],
        coverUrl: currentProfile.coverUrl || COVER_PRESETS[0],
        socialLinks: {
          twitter: currentProfile.socialLinks?.twitter || '',
          github: currentProfile.socialLinks?.github || '',
          discord: currentProfile.socialLinks?.discord || '',
          youtube: currentProfile.socialLinks?.youtube || '',
          artstation: currentProfile.socialLinks?.artstation || '',
        },
        settings: {
          theme: currentProfile.settings?.theme || 'dark',
          language: currentProfile.settings?.language || 'en',
          timezone: currentProfile.settings?.timezone || 'Asia/Tokyo',
          defaultVoiceId: currentProfile.settings?.defaultVoiceId || 'Gemini-Neural-JP-01',
          defaultArtStyle: currentProfile.settings?.defaultArtStyle || 'Shonen Cyberpunk High Contrast',
        },
        preferences: {
          isPublicProfile: currentProfile.preferences?.isPublicProfile ?? true,
          emailNotifications: currentProfile.preferences?.emailNotifications ?? true,
          marketingEmails: currentProfile.preferences?.marketingEmails ?? false,
          showInLeaderboard: currentProfile.preferences?.showInLeaderboard ?? true,
          autoSaveDrafts: currentProfile.preferences?.autoSaveDrafts ?? true,
        },
      });
    }
  }, [currentProfile, user]);

  // Load audit trail
  const loadAuditTrail = async () => {
    try {
      const res = await fetch(`/api/profile/audit-log?userId=${user?.id || 'usr_enterprise_01'}`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setAuditLogs(data.logs);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      loadAuditTrail();
    }
  }, [activeTab]);

  // Debounced Username availability check
  useEffect(() => {
    const cleanU = formValues.username.trim();
    if (!cleanU || cleanU === currentProfile?.username) {
      setUsernameStatus(null);
      setIsCheckingUsername(false);
      return;
    }

    if (cleanU.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanU)) {
      setUsernameStatus({ available: false, message: 'Invalid username format.' });
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      const isAvailable = await checkUsernameAvailable(cleanU);
      setIsCheckingUsername(false);
      setUsernameStatus({
        available: isAvailable,
        message: isAvailable ? 'Username is available!' : 'Username is taken by another creator.',
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [formValues.username, currentProfile?.username, checkUsernameAvailable]);

  // Handle Form Input Updates
  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleNestedChange = (category: 'socialLinks' | 'settings' | 'preferences', field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // Avatar Upload / Choice handler
  const handleAvatarSelect = (url: string) => {
    setFormValues((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleCoverSelect = (url: string) => {
    setFormValues((prev) => ({ ...prev, coverUrl: url }));
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfileForm(formValues);

    if (usernameStatus && !usernameStatus.available && formValues.username !== currentProfile?.username) {
      validationErrors.username = usernameStatus.message;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setSaveSuccessMessage(null);

    try {
      const payload: Partial<UserProfile> = {
        displayName: formValues.displayName,
        username: formValues.username,
        bio: formValues.bio,
        location: formValues.location,
        website: formValues.website,
        avatarUrl: formValues.avatarUrl,
        coverUrl: formValues.coverUrl,
        socialLinks: formValues.socialLinks,
        settings: formValues.settings,
        preferences: formValues.preferences,
      };

      await updateProfile(payload);
      setSaveSuccessMessage('Profile and preferences updated successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
      setActiveTab('overview');
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const completionScore = currentProfile?.completionPercentage || 85;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-zinc-100 pb-16">
      {/* Banner / Cover Header */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c10] shadow-2xl">
        <div
          className="h-44 sm:h-56 bg-cover bg-center transition-all duration-300 relative"
          style={{ backgroundImage: `url(${formValues.coverUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-black/40 to-transparent" />
          
          {/* Quick Cover Change Pills */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-300">Cover Art</span>
            <div className="flex space-x-1 pl-2">
              {COVER_PRESETS.map((cUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCoverSelect(cUrl)}
                  className={`w-4 h-4 rounded-full border border-white/30 transition-transform hover:scale-125 ${
                    formValues.coverUrl === cUrl ? 'ring-2 ring-indigo-500 scale-110' : ''
                  }`}
                  style={{ backgroundImage: `url(${cUrl})`, backgroundSize: 'cover' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Profile Header Info Overlap */}
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            {/* Avatar with Camera Badge */}
            <div className="relative group">
              <img
                src={formValues.avatarUrl}
                alt={formValues.displayName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-[#09090c] shadow-2xl bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl ring-2 ring-[#09090c] shadow-lg transition-transform hover:scale-110"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  {formValues.displayName || 'Anime Studio Director'}
                </h1>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md">
                  {user?.role || 'CREATOR'}
                </span>
              </div>
              <p className="text-sm text-zinc-400 font-mono">
                @{formValues.username || 'creator'} • <span className="text-zinc-300">{user?.organizationName || 'MAPPA Cyber Studio'}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            {activeTab !== 'edit' ? (
              <button
                onClick={() => setActiveTab('edit')}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Studio Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Profile Tab Navigation */}
        <div className="flex items-center border-t border-white/10 bg-[#0a0a0e] px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'edit'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferences & Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail & Security</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessMessage && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex items-center justify-between text-xs font-medium animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: PROFILE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details & Bio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center space-x-2 font-mono">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Director Bio & Creative Statement</span>
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                {formValues.bio || 'No creative bio added yet. Click Edit Profile to add your studio statement.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-zinc-400 border-t border-white/5">
                {formValues.location && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{formValues.location}</span>
                  </div>
                )}
                {formValues.website && (
                  <a
                    href={formValues.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-indigo-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{formValues.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Social Media Links Card */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono">
                Connected Social Platforms
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formValues.socialLinks.twitter ? (
                  <a
                    href={formValues.socialLinks.twitter.startsWith('http') ? formValues.socialLinks.twitter : `https://x.com/${formValues.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-white/5 transition-colors text-xs text-zinc-200"
                  >
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span className="truncate">Twitter / X</span>
                  </a>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-zinc-900/30 rounded-xl border border-dashed border-white/10 text-xs text-zinc-500">
                    <Twitter className="w-4 h-4 opacity-40" />
                    <span>Twitter not linked</span>
                  </div>
                )}

                {formValues.socialLinks.github ? (
                  <a
                    href={formValues.socialLinks.github.startsWith('http') ? formValues.socialLinks.github : `https://github.com/${formValues.socialLinks.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-white/5 transition-colors text-xs text-zinc-200"
                  >
                    <Github className="w-4 h-4 text-zinc-300" />
                    <span className="truncate">GitHub</span>
                  </a>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-zinc-900/30 rounded-xl border border-dashed border-white/10 text-xs text-zinc-500">
                    <Github className="w-4 h-4 opacity-40" />
                    <span>GitHub not linked</span>
                  </div>
                )}

                {formValues.socialLinks.youtube ? (
                  <a
                    href={formValues.socialLinks.youtube.startsWith('http') ? formValues.socialLinks.youtube : `https://youtube.com/${formValues.socialLinks.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-white/5 transition-colors text-xs text-zinc-200"
                  >
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span className="truncate">YouTube Studio</span>
                  </a>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-zinc-900/30 rounded-xl border border-dashed border-white/10 text-xs text-zinc-500">
                    <Youtube className="w-4 h-4 opacity-40" />
                    <span>YouTube not linked</span>
                  </div>
                )}

                {formValues.socialLinks.artstation ? (
                  <a
                    href={formValues.socialLinks.artstation.startsWith('http') ? formValues.socialLinks.artstation : `https://artstation.com/${formValues.socialLinks.artstation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-white/5 transition-colors text-xs text-zinc-200"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="truncate">ArtStation Portfolio</span>
                  </a>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-zinc-900/30 rounded-xl border border-dashed border-white/10 text-xs text-zinc-500">
                    <Sparkles className="w-4 h-4 opacity-40" />
                    <span>ArtStation not linked</span>
                  </div>
                )}
              </div>
            </div>

            {/* Studio Active Configuration Summary */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono">
                System & AI Engine Configuration
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 space-y-1">
                  <p className="text-zinc-500">Theme Engine</p>
                  <p className="text-indigo-300 font-semibold uppercase">{formValues.settings.theme}</p>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 space-y-1">
                  <p className="text-zinc-500">Language</p>
                  <p className="text-indigo-300 font-semibold uppercase">{formValues.settings.language}</p>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 space-y-1">
                  <p className="text-zinc-500">Timezone</p>
                  <p className="text-indigo-300 font-semibold truncate">{formValues.settings.timezone}</p>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 space-y-1">
                  <p className="text-zinc-500">Default Voice AI</p>
                  <p className="text-purple-300 font-semibold truncate">{formValues.settings.defaultVoiceId}</p>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 space-y-1 col-span-2 sm:col-span-2">
                  <p className="text-zinc-500">Default Render Art Style</p>
                  <p className="text-emerald-300 font-semibold truncate">{formValues.settings.defaultArtStyle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Completion Widget & Visibility Card */}
          <div className="space-y-6">
            {/* Profile Completion Indicator */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                  Profile Completion
                </h3>
                <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {completionScore}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${completionScore}%` }}
                />
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    {formValues.displayName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                    <span>Display Name</span>
                  </span>
                  <span className={formValues.displayName ? 'text-emerald-400' : 'text-zinc-600'}>+15%</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    {formValues.username ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                    <span>Unique Handle (@username)</span>
                  </span>
                  <span className={formValues.username ? 'text-emerald-400' : 'text-zinc-600'}>+15%</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    {formValues.avatarUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                    <span>Custom Creator Avatar</span>
                  </span>
                  <span className={formValues.avatarUrl ? 'text-emerald-400' : 'text-zinc-600'}>+15%</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    {formValues.bio ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                    <span>Creative Bio</span>
                  </span>
                  <span className={formValues.bio ? 'text-emerald-400' : 'text-zinc-600'}>+15%</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    {formValues.location ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                    <span>Location</span>
                  </span>
                  <span className={formValues.location ? 'text-emerald-400' : 'text-zinc-600'}>+10%</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    {Object.values(formValues.socialLinks).some(Boolean) ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                    <span>Social Media Links</span>
                  </span>
                  <span className={Object.values(formValues.socialLinks).some(Boolean) ? 'text-emerald-400' : 'text-zinc-600'}>+10%</span>
                </div>
              </div>
            </div>

            {/* Account Privacy & Status Card */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                Account Status
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2">
                    {formValues.preferences.isPublicProfile ? (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-zinc-300">Profile Visibility</span>
                  </div>
                  <span className="font-semibold text-white uppercase font-mono">
                    {formValues.preferences.isPublicProfile ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span className="text-zinc-300">SSO Provider</span>
                  </div>
                  <span className="font-semibold text-indigo-300 font-mono">Clerk OAuth</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-300">Email Verification</span>
                  </div>
                  <span className="font-semibold text-emerald-400 font-mono">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE FORM */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <span>Edit Creator Profile</span>
              </h2>
              <p className="text-xs text-zinc-400">Update your public identity, display handles, and avatar presets.</p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>

          {/* Avatar & Cover Picker */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              Choose Creator Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_PRESETS.map((avatar, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                    formValues.avatarUrl === avatar
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-105'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={avatar} alt={`Preset ${idx}`} className="w-full h-20 object-cover" />
                  {formValues.avatarUrl === avatar && (
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white p-1 rounded-full shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-zinc-400 mb-1">Custom Avatar URL</label>
              <input
                type="url"
                value={formValues.avatarUrl}
                onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                placeholder="https://images.unsplash.com/your-custom-avatar.jpg"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formValues.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="e.g. Kenji Sato"
                className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none ${
                  errors.displayName ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                }`}
              />
              {errors.displayName && <p className="text-[11px] text-red-400">{errors.displayName}</p>}
            </div>

            {/* Username with Uniqueness Check */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center justify-between">
                <span>Unique Handle (@username) <span className="text-red-400">*</span></span>
                {isCheckingUsername && <span className="text-indigo-400 text-[10px] lowercase font-normal flex items-center"><RefreshCw className="w-3 h-3 animate-spin mr-1" /> checking...</span>}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-zinc-500 font-mono text-xs">@</span>
                <input
                  type="text"
                  value={formValues.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="kenji_sato"
                  className={`w-full bg-zinc-900 border rounded-xl pl-8 pr-10 py-2.5 text-xs text-white focus:outline-none ${
                    errors.username ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                  }`}
                />
                <div className="absolute right-3 top-2.5">
                  {usernameStatus && usernameStatus.available && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {usernameStatus && !usernameStatus.available && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              {usernameStatus && (
                <p className={`text-[11px] ${usernameStatus.available ? 'text-emerald-400' : 'text-red-400'}`}>
                  {usernameStatus.message}
                </p>
              )}
              {errors.username && <p className="text-[11px] text-red-400">{errors.username}</p>}
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Creative Director Bio
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {formValues.bio.length} / 500
              </span>
            </div>
            <textarea
              rows={4}
              value={formValues.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell other creators about your style, preferred anime genres, and background..."
              className={`w-full bg-zinc-900 border rounded-xl p-4 text-xs text-white focus:outline-none ${
                errors.bio ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
              }`}
            />
            {errors.bio && <p className="text-[11px] text-red-400">{errors.bio}</p>}
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Location / Studio HQ
              </label>
              <input
                type="text"
                value={formValues.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Portfolio / Website URL
              </label>
              <input
                type="url"
                value={formValues.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://kenji-sato.anime.studio"
                className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none ${
                  errors.website ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                }`}
              />
              {errors.website && <p className="text-[11px] text-red-400">{errors.website}</p>}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              Social Handles & Portfolio Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Twitter / X URL</label>
                <input
                  type="text"
                  value={formValues.socialLinks.twitter}
                  onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">GitHub Profile</label>
                <input
                  type="text"
                  value={formValues.socialLinks.github}
                  onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Discord Handle</label>
                <input
                  type="text"
                  value={formValues.socialLinks.discord}
                  onChange={(e) => handleNestedChange('socialLinks', 'discord', e.target.value)}
                  placeholder="username#0000"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">YouTube Channel</label>
                <input
                  type="text"
                  value={formValues.socialLinks.youtube}
                  onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/@channel"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SETTINGS & PREFERENCES */}
      {activeTab === 'settings' && (
        <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Studio & Localization Preferences</span>
            </h2>
            <p className="text-xs text-zinc-400">Customize theme engines, language, default voice synthesis models, and privacy controls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System Preferences */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center space-x-2">
                <Laptop className="w-4 h-4" />
                <span>Interface & AI Engines</span>
              </h3>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">Theme Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['dark', 'light', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleNestedChange('settings', 'theme', t)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center space-x-2 transition-all ${
                        formValues.settings.theme === t
                          ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                          : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
                      {t === 'light' && <Sun className="w-3.5 h-3.5" />}
                      {t === 'system' && <Laptop className="w-3.5 h-3.5" />}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300 flex items-center space-x-1.5">
                  <Languages className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Studio UI Language</span>
                </label>
                <select
                  value={formValues.settings.language}
                  onChange={(e) => handleNestedChange('settings', 'language', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="en">English (United States)</option>
                  <option value="ja">Japanese (日本語 - Studio Main)</option>
                  <option value="ko">Korean (한국어 - Webtoon Spec)</option>
                  <option value="fr">French (Français)</option>
                  <option value="es">Spanish (Español)</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Timezone</span>
                </label>
                <select
                  value={formValues.settings.timezone}
                  onChange={(e) => handleNestedChange('settings', 'timezone', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Asia/Tokyo">Asia/Tokyo (JST - UTC+9)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-8)</option>
                  <option value="America/New_York">America/New_York (EST - UTC-5)</option>
                  <option value="Europe/Paris">Europe/Paris (CET - UTC+1)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>

              {/* Default Voice Model */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300 flex items-center space-x-1.5">
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span>Default Voice Synthesis Engine</span>
                </label>
                <select
                  value={formValues.settings.defaultVoiceId}
                  onChange={(e) => handleNestedChange('settings', 'defaultVoiceId', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Gemini-Neural-JP-01">Gemini Neural JP 01 (Heroic Shonen)</option>
                  <option value="Gemini-Neural-JP-02">Gemini Neural JP 02 (Dark Antihero)</option>
                  <option value="Gemini-Neural-EN-01">Gemini Neural EN Dub 01 (English Dub)</option>
                </select>
              </div>
            </div>

            {/* Privacy & Account Toggles */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Privacy & Notifications</span>
              </h3>

              <div className="space-y-4">
                {/* Public Profile Toggle */}
                <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">Public Creator Profile</p>
                    <p className="text-[11px] text-zinc-400">Allow other creators to view your anime projects and character templates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNestedChange('preferences', 'isPublicProfile', !formValues.preferences.isPublicProfile)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      formValues.preferences.isPublicProfile ? 'bg-indigo-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formValues.preferences.isPublicProfile ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">Render Completion Alerts</p>
                    <p className="text-[11px] text-zinc-400">Receive email alerts when long GPU render jobs or 4K exports complete.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNestedChange('preferences', 'emailNotifications', !formValues.preferences.emailNotifications)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      formValues.preferences.emailNotifications ? 'bg-indigo-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formValues.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Show in Leaderboard */}
                <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">Show in Top Creators Leaderboard</p>
                    <p className="text-[11px] text-zinc-400">Include your manga panels & episode renders in community rankings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNestedChange('preferences', 'showInLeaderboard', !formValues.preferences.showInLeaderboard)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      formValues.preferences.showInLeaderboard ? 'bg-indigo-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formValues.preferences.showInLeaderboard ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Save Drafts */}
                <div className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">Auto-Save Storyboard Drafts</p>
                    <p className="text-[11px] text-zinc-400">Automatically persist chapter edits and keyframe canvas state every 5 seconds.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNestedChange('preferences', 'autoSaveDrafts', !formValues.preferences.autoSaveDrafts)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      formValues.preferences.autoSaveDrafts ? 'bg-indigo-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formValues.preferences.autoSaveDrafts ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span>Profile Audit Trail & Security Logs</span>
              </h2>
              <p className="text-xs text-zinc-400">Immutable ledger of all profile updates, handle changes, and security events.</p>
            </div>
            <button
              onClick={loadAuditTrail}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-zinc-300 text-xs flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Event / Action</th>
                  <th className="pb-3 font-semibold">Modified Fields</th>
                  <th className="pb-3 font-semibold">IP Address</th>
                  <th className="pb-3 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold">
                          <Shield className="w-3 h-3 text-indigo-400" />
                          <span>{log.action}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-zinc-300 max-w-xs truncate">
                        {log.changedFields?.join(', ') || 'General Settings'}
                      </td>
                      <td className="py-3.5 px-2 text-zinc-400 font-mono">{log.ipAddress || '127.0.0.1'}</td>
                      <td className="py-3.5 pl-4 text-right text-zinc-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500 italic">
                      No security audit events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
