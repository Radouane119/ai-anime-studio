import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Key, 
  Bell, 
  Eye, 
  Monitor, 
  Globe, 
  Lock, 
  Smartphone, 
  Laptop, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Unlink, 
  Link as LinkIcon, 
  Download, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Sparkles,
  Search,
  Clock,
  ShieldCheck,
  Languages,
  MapPin,
  Palette
} from 'lucide-react';
import { 
  SettingsSubTab, 
  AccountProfileData, 
  AccountAppearanceSettings, 
  NotificationSettingsData, 
  PrivacySettingsData, 
  ConnectedAccountItem, 
  ActiveSessionItem, 
  SecurityActivityLogItem, 
  ApiKeyItem, 
  NewApiKeyResult, 
  SecurityOverviewData 
} from '../types';

export const AccountSettingsStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('profile');
  const [loading, setLoading] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [profile, setProfile] = useState<AccountProfileData>({
    displayName: 'Kenji Sato',
    username: 'kenji_studio',
    bio: '',
    avatarUrl: '',
    website: '',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    language: 'en',
    socialLinks: { twitter: '', github: '', discord: '', youtube: '' }
  });

  const [appearance, setAppearance] = useState<AccountAppearanceSettings>({
    theme: 'dark',
    defaultVoiceId: 'Gemini-Neural-JP-01',
    defaultArtStyle: 'Shonen Cyberpunk High Contrast',
    autoSaveDrafts: true,
    reducedMotion: false,
    highContrastUi: false
  });

  const [notifications, setNotifications] = useState<NotificationSettingsData>({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    productUpdates: true,
    marketplaceActivity: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettingsData>({
    isPublicProfile: true,
    hideEmail: true,
    hideActivity: false,
    searchVisibility: true,
    dataExportRequested: false
  });

  const [securityOverview, setSecurityOverview] = useState<SecurityOverviewData>({
    mfaEnabled: true,
    mfaMethod: 'TOTP Authenticator App',
    emailVerified: true,
    phoneVerified: true,
    passwordLastChangedAt: new Date().toISOString(),
    trustedDevicesCount: 2,
    activeSessionsCount: 3
  });

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccountItem[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSessionItem[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityActivityLogItem[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);

  // Modals state
  const [showCreateKeyModal, setShowCreateKeyModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read:projects', 'write:ai']);
  const [generatedKeyResult, setGeneratedKeyResult] = useState<NewApiKeyResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');

  // Fetch initial dashboard data
  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        if (data.profile) setProfile(data.profile);
        if (data.appearance) setAppearance(data.appearance);
        if (data.notifications) setNotifications(data.notifications);
        if (data.privacy) setPrivacy(data.privacy);
        if (data.securityOverview) setSecurityOverview(data.securityOverview);
      }

      // Fetch Connected Accounts, Sessions, Logs, Keys in parallel
      const [connRes, sessRes, actRes, keyRes] = await Promise.all([
        fetch('/api/security/connected-accounts'),
        fetch('/api/security/sessions'),
        fetch('/api/security/activity'),
        fetch('/api/apikeys')
      ]);

      const [connData, sessData, actData, keyData] = await Promise.all([
        connRes.json(),
        sessRes.json(),
        actRes.json(),
        keyRes.json()
      ]);

      if (connData.accounts) setConnectedAccounts(connData.accounts);
      if (sessData.sessions) setActiveSessions(sessData.sessions);
      if (actData.activityLogs) setSecurityLogs(actData.activityLogs);
      if (keyData.apiKeys) setApiKeys(keyData.apiKeys);

    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setErrorMsg('Failed to sync settings from server.');
    } finally {
      setLoading(false);
    }
  };

  const notifySuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        notifySuccess('Profile settings saved successfully.');
      } else {
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSaveAppearance = async (newAppearance: AccountAppearanceSettings) => {
    setAppearance(newAppearance);
    try {
      const res = await fetch('/api/settings/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppearance)
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess('Appearance preferences updated.');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleToggleNotification = async (key: keyof NotificationSettingsData) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess('Notification settings updated.');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleTogglePrivacy = async (key: keyof PrivacySettingsData) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    try {
      const res = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess('Privacy settings updated.');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleToggleOAuthProvider = async (provider: string, isConnected: boolean) => {
    setErrorMsg(null);
    try {
      const endpoint = isConnected ? '/api/security/connected-accounts/unlink' : '/api/security/connected-accounts/link';
      const method = isConnected ? 'DELETE' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      const data = await res.json();
      if (data.success) {
        setConnectedAccounts(data.accounts);
        notifySuccess(`${isConnected ? 'Unlinked' : 'Linked'} ${provider.toUpperCase()} account successfully.`);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch('/api/security/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveSessions(data.sessions);
        notifySuccess(data.message);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const res = await fetch('/api/security/sessions/revoke-all', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setActiveSessions(data.sessions);
        notifySuccess(data.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const res = await fetch('/api/apikeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, permissions: newKeyPermissions })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKeyResult(data.apiKey);
        setApiKeys(prev => [data.apiKey, ...prev]);
        setNewKeyName('');
        setShowCreateKeyModal(false);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      const res = await fetch(`/api/apikeys/${keyId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApiKeys(prev => prev.filter(k => k.id !== keyId));
        notifySuccess(data.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleExportDataArchive = async () => {
    try {
      const res = await fetch('/api/account/export-data', { method: 'POST' });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-anime-studio-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      notifySuccess('Account archive downloaded successfully.');
    } catch (err: any) {
      setErrorMsg('Failed to download data archive.');
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') return;
    try {
      const res = await fetch('/api/account/danger-zone/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationText: deleteConfirmText })
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteAccountModal(false);
        notifySuccess(data.message);
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const subNavItems: { id: SettingsSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance & Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notification Settings', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Visibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'connected', label: 'Connected Accounts', icon: <Globe className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Sessions', icon: <Shield className="w-4 h-4" /> },
    { id: 'apikeys', label: 'API Keys & Developers', icon: <Key className="w-4 h-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading Account Settings & Security Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Account Settings & Security
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Phase 6.5
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage profile credentials, appearance, OAuth connections, security policies, and API keys.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchSettingsData}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync Data
            </button>
            <a 
              href="https://clerk.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Clerk Managed
            </a>
          </div>
        </div>
      </div>

      {/* Global Toast Notifications */}
      {saveSuccess && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {saveSuccess}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-4">
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-medium">
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            {errorMsg}
          </div>
        </div>
      )}

      {/* Main Studio Body Grid */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sub-Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
            Navigation Menu
          </div>
          {subNavItems.map((item) => {
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}

          <div className="pt-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Security Status
              </div>
              <p className="text-[11px] text-slate-400">
                2FA: <span className="text-emerald-400 font-medium">Active</span> | Sessions: <span className="text-slate-200">{activeSessions.length} Devices</span>
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-indigo-500 h-1.5 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tab Content View */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: PROFILE SETTINGS */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    Public Profile & Studio Identity
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage how your anime creator profile appears across community features and collaborative studios.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Avatar Upload / URL */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <img 
                      src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250'} 
                      alt="Avatar Preview" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/40 shadow-md"
                    />
                    <div className="flex-1 w-full space-y-2">
                      <label className="text-xs font-medium text-slate-300">Avatar Image URL</label>
                      <input 
                        type="url" 
                        value={profile.avatarUrl}
                        onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/your-avatar.jpg"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                      <p className="text-[11px] text-slate-500">
                        Square PNG or JPG recommended. Minimum dimensions: 250x250px.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Display Name</label>
                      <input 
                        type="text" 
                        value={profile.displayName}
                        onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                        <span>Username</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Available</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-500">@</span>
                        <input 
                          type="text" 
                          value={profile.username}
                          onChange={e => setProfile({ ...profile, username: e.target.value })}
                          required
                          className="w-full pl-7 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Bio & Studio Headline</label>
                    <textarea 
                      rows={3}
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Share your creative focus, anime genres, or studio roles..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" /> Website / Portfolio
                      </label>
                      <input 
                        type="url" 
                        value={profile.website}
                        onChange={e => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://studio-ai.anime"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Country / Region
                      </label>
                      <select 
                        value={profile.country}
                        onChange={e => setProfile({ ...profile, country: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Japan">Japan (日本)</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="South Korea">South Korea</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Timezone
                      </label>
                      <select 
                        value={profile.timezone}
                        onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Asia/Tokyo">Asia/Tokyo (JST - UTC+9)</option>
                        <option value="America/New_York">America/New_York (EST - UTC-5)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-8)</option>
                        <option value="Europe/London">Europe/London (GMT - UTC+0)</option>
                        <option value="Europe/Paris">Europe/Paris (CET - UTC+1)</option>
                      </select>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <label className="text-xs font-semibold text-slate-300">Social Accounts</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text"
                        placeholder="Twitter handle (@username)"
                        value={profile.socialLinks?.twitter || ''}
                        onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: e.target.value } })}
                        className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                      <input 
                        type="text"
                        placeholder="GitHub handle (username)"
                        value={profile.socialLinks?.github || ''}
                        onChange={e => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                        className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/20"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE & PREFERENCES */}
          {activeSubTab === 'appearance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    Theme & Anime Engine Preferences
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Customize studio dark canvas presets, default voice synthesis models, and rendering parameters.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Theme Mode Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Theme Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'dark', label: 'Dark Canvas', desc: 'High-contrast studio theme' },
                        { id: 'light', label: 'Light Clean', desc: 'Minimal bright canvas' },
                        { id: 'system', label: 'System Default', desc: 'Syncs with OS preferences' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSaveAppearance({ ...appearance, theme: t.id as any })}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            appearance.theme === t.id 
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">{t.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Engine Defaults */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Default Anime Voice Model</label>
                      <select 
                        value={appearance.defaultVoiceId}
                        onChange={e => handleSaveAppearance({ ...appearance, defaultVoiceId: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Gemini-Neural-JP-01">Gemini-Neural-JP-01 (Protagonist Voice)</option>
                        <option value="Gemini-Neural-JP-02">Gemini-Neural-JP-02 (Antagonist Voice)</option>
                        <option value="Gemini-Neural-EN-01">Gemini-Neural-EN-01 (English Dub Lead)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Default Art Style Preset</label>
                      <select 
                        value={appearance.defaultArtStyle}
                        onChange={e => handleSaveAppearance({ ...appearance, defaultArtStyle: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Shonen Cyberpunk High Contrast">Shonen Cyberpunk High Contrast</option>
                        <option value="Ufotable Dynamic Lighting">Ufotable Dynamic Lighting</option>
                        <option value="Kyoto Animation Soft Watercolor">Kyoto Animation Soft Watercolor</option>
                        <option value="Mappa Cinematic Dark Fantasy">Mappa Cinematic Dark Fantasy</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    {[
                      { key: 'autoSaveDrafts', label: 'Auto-Save Studio Drafts', desc: 'Automatically snapshot scene drafts every 30 seconds.' },
                      { key: 'reducedMotion', label: 'Reduced Motion Effects', desc: 'Disable canvas parallax animations and scene preview transitions.' },
                      { key: 'highContrastUi', label: 'High-Contrast Studio UI', desc: 'Enhance border visibility and text contrast ratio across all panels.' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSaveAppearance({ ...appearance, [item.key]: !appearance[item.key as keyof AccountAppearanceSettings] })}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            appearance[item.key as keyof AccountAppearanceSettings] ? 'bg-indigo-600' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            appearance[item.key as keyof AccountAppearanceSettings] ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATION SETTINGS */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    Notification Channels & Alerts
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control how and when you receive rendering updates, security events, and community activities.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Email Digest', desc: 'Receive daily/weekly summary of studio projects and render job status.' },
                    { key: 'pushNotifications', label: 'Browser Push Notifications', desc: 'Real-time alert when AI render generation finishes.' },
                    { key: 'inAppNotifications', label: 'In-App Alert Banner', desc: 'Display pop-ups for mentions, comments, and collaborative edits.' },
                    { key: 'securityAlerts', label: 'Security & Auth Alerts', desc: 'Immediate notification on new device logins or API key creation.' },
                    { key: 'productUpdates', label: 'Studio Product Updates', desc: 'Be first to know about new Gemini AI model releases and features.' },
                    { key: 'marketplaceActivity', label: 'Marketplace Trade Activity', desc: 'Alerts when your prompt templates or character models are purchased.' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleNotification(item.key as keyof NotificationSettingsData)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          notifications[item.key as keyof NotificationSettingsData] ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          notifications[item.key as keyof NotificationSettingsData] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & VISIBILITY */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    Privacy Controls & Data Compliance
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage public profile discoverability, search engine indexing, and data protection settings.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'isPublicProfile', label: 'Public Profile Visibility', desc: 'Allow anyone with your link to view your public anime portfolio.' },
                    { key: 'hideEmail', label: 'Hide Email Address', desc: 'Keep your email hidden from team members and public profile cards.' },
                    { key: 'hideActivity', label: 'Hide Online Studio Activity', desc: 'Don\'t show "Active in Studio" indicator to team collaborators.' },
                    { key: 'searchVisibility', label: 'Search Engine Indexing', desc: 'Include your creator profile in external web search results.' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePrivacy(item.key as keyof PrivacySettingsData)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          privacy[item.key as keyof PrivacySettingsData] ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          privacy[item.key as keyof PrivacySettingsData] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONNECTED ACCOUNTS */}
          {activeSubTab === 'connected' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    Connected Accounts & OAuth SSO
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Link external identities for single sign-on (SSO) and asset synchronization across platforms.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {connectedAccounts.map(acc => {
                    const isConnected = acc.status === 'connected';
                    return (
                      <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-xl border ${
                            isConnected ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                              {acc.providerName}
                              {isConnected ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                                  Connected
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">
                                  Not Linked
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {isConnected ? acc.email : 'Click link below to authorize with OAuth'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleOAuthProvider(acc.provider, isConnected)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                            isConnected 
                              ? 'bg-slate-900 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border-slate-800 hover:border-red-500/30' 
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
                          }`}
                        >
                          {isConnected ? 'Disconnect' : 'Connect Account'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & SESSIONS */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              {/* Security Overview Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      Clerk Security Status & Multi-Factor Auth
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Enterprise authentication details managed securely via Clerk Auth SDK.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 2FA Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Two-Factor Authentication</div>
                    <div className="text-xs font-semibold text-slate-200">{securityOverview.mfaMethod}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Email & Phone Verification</div>
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Both Verified
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Password Last Updated</div>
                    <div className="text-xs font-semibold text-slate-200">
                      {new Date(securityOverview.passwordLastChangedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions Manager */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-indigo-400" />
                      Active Devices & Sessions ({activeSessions.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Devices currently authenticated to your Studio account.
                    </p>
                  </div>

                  <button
                    onClick={handleRevokeAllSessions}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out All Other Devices
                  </button>
                </div>

                <div className="space-y-3">
                  {activeSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl border ${
                          session.isCurrent ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}>
                          {session.device.includes('iPhone') || session.device.includes('iPad') ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <Laptop className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                            {session.device} ({session.os})
                            {session.isCurrent && (
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/30">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{session.browser}</span> • <span>{session.ipAddress}</span> • <span>{session.location}</span>
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 text-xs font-medium transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Activity History Log */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Recent Security Events Log
                </h3>

                <div className="space-y-2">
                  {securityLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'SUCCESS' ? 'bg-emerald-400' : log.status === 'WARNING' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <div className="font-medium text-slate-200">{log.description}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{log.ipAddress} • {log.device}</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: API KEYS & DEVELOPER TOOLS */}
          {activeSubTab === 'apikeys' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-indigo-400" />
                      API Keys & Developer Tokens
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Generate secret keys for programmatic API access, automated render pipelines, and CI/CD integration.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCreateKeyModal(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    Generate New API Key
                  </button>
                </div>

                {/* API Key Table */}
                <div className="space-y-3">
                  {apiKeys.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-500 text-xs">
                      No active API keys generated yet. Click "Generate New API Key" to get started.
                    </div>
                  ) : (
                    apiKeys.map(k => (
                      <div key={k.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200">{k.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono">
                              {k.keyPrefix}...
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {k.permissions.map(p => (
                              <span key={p} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono border border-indigo-500/20">
                                {p}
                              </span>
                            ))}
                          </div>
                          <div className="text-[11px] text-slate-500 pt-1">
                            Created: {new Date(k.createdAt).toLocaleDateString()} • Usage Count: {k.usageCount} calls
                          </div>
                        </div>

                        <button
                          onClick={() => handleRevokeApiKey(k.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors self-start sm:self-center"
                        >
                          Revoke Key
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DANGER ZONE */}
          {activeSubTab === 'danger' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Danger Zone & Account Actions
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Download full account data archives or request permanent account deletion.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Data Export Box */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Export Studio Data Archive (GDPR)</div>
                      <div className="text-[11px] text-slate-400">Download a complete JSON snapshot of your projects, preferences, and security logs.</div>
                    </div>
                    <button
                      onClick={handleExportDataArchive}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Data
                    </button>
                  </div>

                  {/* Account Deletion Box */}
                  <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-red-300">Delete Account & Purge Studio Workspace</div>
                      <div className="text-[11px] text-red-400/80">Permanently delete account, subscriptions, API keys, and all anime project assets.</div>
                    </div>
                    <button
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: CREATE API KEY */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                Generate New API Key
              </h3>
              <button 
                onClick={() => setShowCreateKeyModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Key Name / Identifier</label>
                <input 
                  type="text"
                  placeholder="e.g. Production Animation Pipeline"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Key Scopes & Permissions</label>
                <div className="space-y-2">
                  {[
                    { id: 'read:projects', label: 'Read Projects & Assets' },
                    { id: 'write:ai', label: 'Execute AI Generation Models' },
                    { id: 'marketplace:trade', label: 'Publish to Marketplace' }
                  ].map(sc => (
                    <label key={sc.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={newKeyPermissions.includes(sc.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewKeyPermissions([...newKeyPermissions, sc.id]);
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== sc.id));
                          }
                        }}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-600"
                      />
                      {sc.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateKeyModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Generate Secret Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERATED SECRET KEY ONCE */}
      {generatedKeyResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">API Key Generated Successfully!</h3>
            </div>

            <p className="text-xs text-slate-300">
              Please copy your secret key below now. For security purposes, <strong className="text-amber-400">it will never be displayed again</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-emerald-400 select-all break-all">
                {generatedKeyResult.rawSecret}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedKeyResult.rawSecret);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 flex items-center gap-1"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? 'Copied!' : 'Copy Key'}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setGeneratedKeyResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                I Have Saved My Secret Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE ACCOUNT CONFIRMATION */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Delete Account & Permanent Purge</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete your user profile, cancel active subscriptions, revoke all API keys, and soft-delete all anime project assets.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Type <span className="text-red-400 font-mono font-bold">DELETE MY ACCOUNT</span> to confirm:
              </label>
              <input 
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-red-300 font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  deleteConfirmText === 'DELETE MY ACCOUNT' 
                    ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer' 
                    : 'bg-red-950 text-red-800 border border-red-900 cursor-not-allowed'
                }`}
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
