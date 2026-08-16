# Phase 6.5 — Account Settings & Security Documentation

## Executive Overview
Phase 6.5 introduces a production-ready, centralized **Account Settings & Security System** for **AI Anime Studio**. This module empowers creators to manage their profile credentials, theme and rendering engine preferences, notification channels, privacy rules, connected OAuth accounts, active device sessions, multi-factor authentication status, API key lifecycle, and GDPR data archives.

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Frontend: AccountSettingsStudio.tsx                   │
│ (Profile, Appearance, Notifications, Privacy, Connected, Security, API Keys) │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                        JSON API / HTTP Requests
                                     │
┌────────────────────────────────────▼────────────────────────────────────────┐
│                        Express Server (server.ts)                           │
│  ├── /api/settings (GET, PUT)                                               │
│  ├── /api/security/connected-accounts (GET, LINK, UNLINK)                  │
│  ├── /api/security/sessions (GET, REVOKE, REVOKE-ALL)                       │
│  ├── /api/apikeys (GET, POST, PUT, DELETE - SHA-256 Hashing)                │
│  ├── /api/account/export-data (POST - GDPR Download)                        │
│  └── /api/account/danger-zone/delete (POST - Soft Delete Request)         │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────────┐
│                        Database Schema (Prisma)                             │
│  ├── ApiKey (keyPrefix, keyHash SHA-256, permissions, usageCount)          │
│  ├── NotificationSettings (email, push, inApp, marketing, securityAlerts)   │
│  ├── PrivacySettings (isPublicProfile, hideEmail, hideActivity)             │
│  └── SecurityEvent (eventType, description, ipAddress, device, status)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features Implemented

### 1. Profile & Identity Management
- **Display Name & Username**: Real-time username availability validation indicator.
- **Avatar & Headline**: Custom image URL preview with 250x250px optimal scaling support.
- **Location, Timezone & Language**: Regional selection (Japan, USA, UK, Germany, France, South Korea).
- **Social Handles**: Twitter/X, GitHub, Discord, and YouTube integrations.

### 2. Appearance & Engine Style Controls
- **Studio Theme Presets**: Dark Canvas (High Contrast), Light Clean, and System Default.
- **Voice Synthesis Model**: Default anime protagonist voice selection (e.g., `Gemini-Neural-JP-01`).
- **Art Style Presets**: Shonen Cyberpunk, Ufotable Dynamic Lighting, KyoAni Soft Watercolor, MAPPA Dark Fantasy.
- **Accessibility**: Reduced Motion toggles and High-Contrast UI options.

### 3. Notification & Alert Channels
- Granular controls for Email Digest, Browser Push, In-App Popups, Security Alerts, Product Updates, and Marketplace Activity.

### 4. Privacy & Visibility Controls
- Public Portfolio visibility toggle (`isPublicProfile`).
- Email address & online activity status masking.
- Search engine indexing permissions.

### 5. Connected Accounts & OAuth SSO
- Single Click linking/unlinking for Google Workspace, GitHub Enterprise, Discord Community, Microsoft 365, and Apple ID.
- Safety check preventing unlinking when only one authentication method exists.

### 6. Security Center & Active Device Sessions
- **Clerk Auth Security Badge**: Live status for MFA (TOTP Authenticator), Email verification, and Password last changed date.
- **Active Session Manager**: Table displaying device model, OS, browser, IP address, and location. Supports single session revocation or bulk "Sign Out All Other Devices".
- **Security Log Timeline**: Immutable security audit trail logging logins, MFA changes, and API key generations.

### 7. API Keys & Developer Tokens
- Cryptographically secure key generation via `crypto.randomBytes(16)`.
- Keys prefixed with `ak_live_`.
- Server-side SHA-256 hashing (`crypto.createHash('sha256')`); raw secrets are returned **ONCE** to the user and never stored in plaintext.
- Granular scopes (`read:projects`, `write:ai`, `marketplace:trade`).
- Usage counter and last used timestamp tracking.

### 8. Danger Zone & GDPR Data Export
- Downloadable JSON snapshot containing user profile, appearance, notifications, privacy, sessions, and security history.
- Soft-deletion account purge request with typed confirmation requirement (`DELETE MY ACCOUNT`).

---

## API Specification

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/settings` | `GET` | Fetch settings overview, profile, appearance, and security status. |
| `/api/settings/profile` | `PUT` | Update display name, bio, avatar, location, timezone, social links. |
| `/api/settings/appearance` | `PUT` | Update theme, default voice ID, art style, auto-save settings. |
| `/api/settings/notifications` | `PUT` | Update notification preferences. |
| `/api/settings/privacy` | `PUT` | Update privacy and profile discoverability flags. |
| `/api/security/connected-accounts` | `GET` | List connected OAuth providers. |
| `/api/security/connected-accounts/link` | `POST` | Link an OAuth account. |
| `/api/security/connected-accounts/unlink` | `DELETE` | Unlink an OAuth account. |
| `/api/security/sessions` | `GET` | List all authenticated active device sessions. |
| `/api/security/sessions/revoke` | `POST` | Revoke a specific active device session. |
| `/api/security/sessions/revoke-all` | `POST` | Revoke all sessions except current session. |
| `/api/security/activity` | `GET` | Fetch security event history logs. |
| `/api/apikeys` | `GET` | List active and revoked API keys (masked prefix). |
| `/api/apikeys` | `POST` | Generate new API key; returns raw secret ONCE. |
| `/api/apikeys/:id` | `PUT` | Rename API key. |
| `/api/apikeys/:id` | `DELETE` | Revoke API key. |
| `/api/account/export-data` | `POST` | Export downloadable JSON GDPR data archive. |
| `/api/account/danger-zone/delete` | `POST` | Initiate account soft deletion request. |

---

## Verification & Testing
- **Unit Test Suite**: `/src/__tests__/settings_security.test.ts`
- **Lint Verification**: `npm run lint` (0 errors)
- **Compile Verification**: `npm run build` (0 errors)
