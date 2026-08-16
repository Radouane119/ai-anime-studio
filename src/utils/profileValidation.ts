// Phase 6.2 Profile & User Settings Validation Logic

export interface ProfileFormValues {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  avatarUrl: string;
  coverUrl: string;
  socialLinks: {
    twitter: string;
    github: string;
    discord: string;
    youtube: string;
    artstation: string;
  };
  settings: {
    theme: 'dark' | 'light' | 'system';
    language: 'en' | 'ja' | 'ko' | 'fr' | 'es';
    timezone: string;
    defaultVoiceId: string;
    defaultArtStyle: string;
  };
  preferences: {
    isPublicProfile: boolean;
    emailNotifications: boolean;
    marketingEmails: boolean;
    showInLeaderboard: boolean;
    autoSaveDrafts: boolean;
  };
}

export interface ValidationErrorMap {
  [key: string]: string;
}

export function validateProfileForm(values: ProfileFormValues): ValidationErrorMap {
  const errors: ValidationErrorMap = {};

  // Display Name
  if (!values.displayName || values.displayName.trim().length === 0) {
    errors.displayName = 'Display Name is required.';
  } else if (values.displayName.trim().length > 60) {
    errors.displayName = 'Display Name must be under 60 characters.';
  }

  // Username
  const usernameClean = values.username.trim().toLowerCase();
  if (!usernameClean) {
    errors.username = 'Username is required.';
  } else if (usernameClean.length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (usernameClean.length > 30) {
    errors.username = 'Username must not exceed 30 characters.';
  } else if (!/^[a-zA-Z0-9_]+$/.test(usernameClean)) {
    errors.username = 'Username can only contain letters, numbers, and underscores.';
  }

  // Bio
  if (values.bio && values.bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters.';
  }

  // Website URL
  if (values.website && values.website.trim().length > 0) {
    if (!values.website.startsWith('http://') && !values.website.startsWith('https://')) {
      errors.website = 'Website must start with http:// or https://';
    }
  }

  // Social Links
  if (values.socialLinks.twitter && values.socialLinks.twitter.trim() && !values.socialLinks.twitter.includes('twitter.com') && !values.socialLinks.twitter.includes('x.com')) {
    errors.twitter = 'Please enter a valid Twitter/X URL or handle.';
  }

  return errors;
}
