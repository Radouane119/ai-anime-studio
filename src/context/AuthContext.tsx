import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthSession, UserRole, UserProfile } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, name: string, role?: UserRole) => Promise<void>;
  signOut: () => void;
  switchOrganization: (orgId: string, orgName: string) => void;
  syncUser: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
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

const DEFAULT_USER: AuthUser = {
  id: 'usr_enterprise_01',
  clerkId: 'user_2N9xClerkProAnimeStudio',
  email: 'creator@studio-ai.anime',
  name: 'Kenji Sato (Lead Studio Director)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  role: 'CREATOR',
  organizationId: 'org_studio_01',
  organizationName: 'MAPPA Cyber Studio Labs',
  teamId: 'team_anime_alpha',
  teamName: 'Alpha Animation Unit',
  profile: DEFAULT_PROFILE,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_USER);
  const [session, setSession] = useState<AuthSession | null>({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfZW50ZXJwcmlzZV8wMSIsImlhdCI6MTcxNjIzNDU2N30',
    user: DEFAULT_USER,
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Attempt local session restore
    const storedSession = localStorage.getItem('studio_auth_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setUser(parsed.user);
        setSession(parsed);
      } catch (err) {
        console.error('Failed to parse saved auth session:', err);
      }
    }
  }, []);

  const syncUser = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, token: session?.token }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (e) {
      console.warn('API sync fallback using memory user:', e);
    }
  };

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      const newUser: AuthUser = {
        ...DEFAULT_USER,
        email,
        name: email.split('@')[0].toUpperCase() + ' (Studio Creator)',
      };
      const newSession: AuthSession = {
        token: `jwt_clerk_${Date.now()}`,
        user: newUser,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      };
      setUser(newUser);
      setSession(newSession);
      localStorage.setItem('studio_auth_session', JSON.stringify(newSession));
      await syncUser();
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string, role: UserRole = 'CREATOR') => {
    setIsLoading(true);
    try {
      const newUser: AuthUser = {
        id: `usr_${Date.now()}`,
        clerkId: `clerk_${Date.now()}`,
        email,
        name,
        avatarUrl: `https://picsum.photos/seed/${name}/150/150`,
        role,
        organizationId: 'org_studio_01',
        organizationName: 'AI Anime Production Guild',
        createdAt: new Date().toISOString(),
      };
      const newSession: AuthSession = {
        token: `jwt_clerk_${Date.now()}`,
        user: newUser,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      };
      setUser(newUser);
      setSession(newSession);
      localStorage.setItem('studio_auth_session', JSON.stringify(newSession));
      await syncUser();
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('studio_auth_session');
  };

  const switchOrganization = (orgId: string, orgName: string) => {
    if (!user) return;
    const updatedUser = { ...user, organizationId: orgId, organizationName: orgName };
    setUser(updatedUser);
    if (session) {
      const updatedSession = { ...session, user: updatedUser };
      setSession(updatedSession);
      localStorage.setItem('studio_auth_session', JSON.stringify(updatedSession));
    }
  };

  const calculateCompletion = (p: Partial<UserProfile>): number => {
    let score = 0;
    if (p.displayName) score += 15;
    if (p.username) score += 15;
    if (p.avatarUrl) score += 15;
    if (p.bio) score += 15;
    if (p.location) score += 10;
    if (p.website) score += 10;
    if (p.socialLinks && Object.values(p.socialLinks).some(Boolean)) score += 10;
    if (p.coverUrl) score += 10;
    return Math.min(100, score);
  };

  const checkUsernameAvailable = async (username: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/profile/check-username/${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        return data.available ?? true;
      }
    } catch {
      // memory fallback
    }
    return !['admin', 'root', 'mappa', 'studio'].includes(username.toLowerCase());
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('Not authenticated');

    const currentProfile = user.profile || DEFAULT_PROFILE;
    const mergedProfile: UserProfile = {
      ...currentProfile,
      ...profileData,
      socialLinks: { ...currentProfile.socialLinks, ...profileData.socialLinks },
      settings: { ...currentProfile.settings, ...profileData.settings } as any,
      preferences: { ...currentProfile.preferences, ...profileData.preferences } as any,
      updatedAt: new Date().toISOString(),
      completionPercentage: calculateCompletion({
        ...currentProfile,
        ...profileData,
      }),
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token || ''}`,
        },
        body: JSON.stringify({ userId: user.id, profile: mergedProfile }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          const updatedUser: AuthUser = {
            ...user,
            name: data.profile.displayName || user.name,
            avatarUrl: data.profile.avatarUrl || user.avatarUrl,
            profile: data.profile,
          };
          setUser(updatedUser);
          if (session) {
            const updatedSession = { ...session, user: updatedUser };
            setSession(updatedSession);
            localStorage.setItem('studio_auth_session', JSON.stringify(updatedSession));
          }
          return data.profile;
        }
      }
    } catch (e) {
      console.warn('API profile update fallback to client memory:', e);
    }

    const updatedUser: AuthUser = {
      ...user,
      name: mergedProfile.displayName || user.name,
      avatarUrl: mergedProfile.avatarUrl || user.avatarUrl,
      profile: mergedProfile,
    };
    setUser(updatedUser);
    if (session) {
      const updatedSession = { ...session, user: updatedUser };
      setSession(updatedSession);
      localStorage.setItem('studio_auth_session', JSON.stringify(updatedSession));
    }
    return mergedProfile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        switchOrganization,
        syncUser,
        updateProfile,
        checkUsernameAvailable,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
