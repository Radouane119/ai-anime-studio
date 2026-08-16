// Phase 6.5 — Account Settings & Security Engine
import crypto from 'crypto';

export interface GeneratedApiKey {
  rawSecret: string;
  keyPrefix: string;
  keyHash: string;
}

/**
 * Generates a cryptographically strong random API key prefixed with 'ak_live_'
 * and computes its SHA-256 hash for secure storage.
 */
export function generateApiKey(): GeneratedApiKey {
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const rawSecret = `ak_live_${randomBytes}`;
  const keyPrefix = rawSecret.substring(0, 12);
  const keyHash = hashSecret(rawSecret);

  return {
    rawSecret,
    keyPrefix,
    keyHash
  };
}

/**
 * Computes SHA-256 hash of a raw string secret.
 */
export function hashSecret(rawSecret: string): string {
  return crypto.createHash('sha256').update(rawSecret).digest('hex');
}

/**
 * Verifies if a provided raw secret matches a stored key hash.
 */
export function verifySecret(rawSecret: string, storedHash: string): boolean {
  const computedHash = hashSecret(rawSecret);
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedHash));
}

/**
 * Validates account deletion confirmation text string.
 */
export function validateAccountDeletionConfirmation(confirmText: string): boolean {
  return confirmText === 'DELETE MY ACCOUNT';
}

/**
 * Generates export data bundle structure for account data archive download.
 */
export function buildExportArchiveData(
  profileData: any,
  appearanceData: any,
  notificationData: any,
  privacyData: any,
  sessions: any[],
  apiKeys: any[]
) {
  return {
    version: '6.5.0',
    exportedAt: new Date().toISOString(),
    profile: profileData,
    appearance: appearanceData,
    notifications: notificationData,
    privacy: privacyData,
    sessionsCount: sessions.length,
    activeApiKeysCount: apiKeys.length,
    complianceStatus: 'GDPR / CCPA Compliant'
  };
}
