// Phase 6.2 — User Profile System Test Suite

import { validateProfileForm, ProfileFormValues } from '../utils/profileValidation';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runProfileValidationTests() {
  const validProfile: ProfileFormValues = {
    displayName: 'Kenji Sato',
    username: 'kenji_sato',
    bio: 'Lead anime director at MAPPA Labs.',
    location: 'Tokyo, Japan',
    website: 'https://kenji-sato.anime.studio',
    avatarUrl: 'https://picsum.photos/seed/kenji/250/250',
    coverUrl: 'https://picsum.photos/seed/cover/1200/400',
    socialLinks: {
      twitter: 'https://x.com/kenjisato_anime',
      github: 'https://github.com/kenji-sato',
      discord: 'kenji#0001',
      youtube: 'https://youtube.com/@kenji',
      artstation: 'https://artstation.com/kenji',
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
  };

  // Test 1: Valid Profile
  const errors1 = validateProfileForm(validProfile);
  assert(Object.keys(errors1).length === 0, 'Valid profile should produce 0 errors');

  // Test 2: Missing Display Name
  const invalidName = { ...validProfile, displayName: '' };
  const errors2 = validateProfileForm(invalidName);
  assert(errors2.displayName === 'Display Name is required.', 'Empty display name should fail');

  // Test 3: Short Username
  const invalidUser = { ...validProfile, username: 'ab' };
  const errors3 = validateProfileForm(invalidUser);
  assert(errors3.username === 'Username must be at least 3 characters.', 'Short username should fail');

  // Test 4: Long Bio
  const invalidBio = { ...validProfile, bio: 'A'.repeat(501) };
  const errors4 = validateProfileForm(invalidBio);
  assert(errors4.bio === 'Bio must not exceed 500 characters.', 'Long bio should fail');

  console.log('✅ All Phase 6.2 Profile Validation Tests Passed Successfully!');
}

