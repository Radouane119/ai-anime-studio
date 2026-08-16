// Phase 6.5 — Account Settings & Security Test Suite

import { 
  generateApiKey, 
  hashSecret, 
  verifySecret, 
  validateAccountDeletionConfirmation, 
  buildExportArchiveData 
} from '../utils/securityEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runSettingsSecurityTestSuite() {
  console.log('🧪 Starting Phase 6.5 — Account Settings & Security Test Suite...');

  // 1. API Key Secure Generation
  const apiKeyResult = generateApiKey();
  assert(apiKeyResult.rawSecret.startsWith('ak_live_'), 'API key must start with prefix "ak_live_"');
  assert(apiKeyResult.keyPrefix.length === 12, 'Key prefix must be 12 characters');
  assert(apiKeyResult.keyHash.length === 64, 'SHA-256 hash must be 64 hex characters');

  // 2. Hash Verification Security
  const rawKey = apiKeyResult.rawSecret;
  const hash = apiKeyResult.keyHash;
  assert(verifySecret(rawKey, hash), 'Raw secret must match computed SHA-256 hash');
  assert(!verifySecret('ak_live_invalid_fake_secret', hash), 'Mismatched secret must fail hash verification');

  // 3. Danger Zone Confirmation Guard
  assert(validateAccountDeletionConfirmation('DELETE MY ACCOUNT'), 'Exact match text MUST validate deletion');
  assert(!validateAccountDeletionConfirmation('delete my account'), 'Lowercase text MUST be rejected');
  assert(!validateAccountDeletionConfirmation('DELETE'), 'Incomplete text MUST be rejected');

  // 4. Data Export Archive Structure
  const mockExport = buildExportArchiveData(
    { displayName: 'Kenji Sato', email: 'creator@studio-ai.anime' },
    { theme: 'dark' },
    { emailNotifications: true },
    { isPublicProfile: true },
    [{ id: 'sess_1' }],
    [{ id: 'key_1' }]
  );

  assert(mockExport.version === '6.5.0', 'Export archive must contain schema version');
  assert(mockExport.profile.displayName === 'Kenji Sato', 'Export must serialize profile data');
  assert(mockExport.sessionsCount === 1, 'Export must include active session metrics');
  assert(mockExport.complianceStatus.includes('GDPR'), 'Export must declare GDPR compliance');

  console.log('✅ Phase 6.5 Account Settings & Security Test Suite PASSED SUCCESSFULLY!');
  return true;
}

// Execute test suite
runSettingsSecurityTestSuite();
