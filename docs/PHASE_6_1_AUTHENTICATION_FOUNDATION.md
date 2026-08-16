# Phase 6.1 — Authentication & Authorization Foundation

## Executive Overview
Phase 6.1 implements the enterprise-grade Authentication & Authorization Foundation for **AI Anime Studio**, powered by **Clerk SSO**, **JWT Session Tokens**, **Next.js 15 Auth Context**, **Express Auth Middleware**, and **PostgreSQL Prisma RBAC** (Role-Based Access Control).

---

## 1. Authentication Architecture

```
[ Client Browser ]
        │
        ├── 1. Clerk SSO Sign-In / Sign-Up Modal
        ├── 2. JWT Session Token Issued
        ├── 3. React AuthContext State Sync
        │
        ▼
[ Next.js 15 / Client App ]
        │
        ├── 4. ProtectedRoute Guard Check (Roles: ADMIN, CREATOR, MEMBER)
        │
        ▼  Bearer JWT Header
[ Express Backend API (`/api/auth/*`) ]
        │
        ├── 5. `POST /api/auth/sync` (Synchronizes Clerk user with PostgreSQL)
        ├── 6. `GET /api/auth/me` (Returns authenticated role & permissions)
        ├── 7. `POST /api/auth/verify` (Token validation)
        │
        ▼
[ PostgreSQL Database (Prisma ORM) ]
        ├── User Table (`clerkId`, `email`, `role`)
        ├── UserProfile Table (`bio`, `themePreference`)
        ├── Organization & Team Tables
        └── Session & OAuthAccount Tables
```

---

## 2. Implemented Features

### 2.1 Frontend Authentication (`src/context/AuthContext.tsx` & `src/components/AuthModal.tsx`)
* **AuthProvider**: Provides react context for user session, active JWT token, login/signup handlers, and organization switcher.
* **AuthModal**: Sleek modal interface with tab switching between Sign In, Sign Up, and Active Session Details.
* **ProtectedRoute Component**: Wraps sensitive studio canvases (Keyframes, Manga Panel Generator, Neural Dubbing) to require specific roles (`CREATOR`, `ADMIN`).
* **Navbar Integration**: Displays active user profile picture, role badge (`CREATOR`), organization dropdown, and one-click session inspect / sign-out.

### 2.2 Backend Authorization (`server.ts`)
* **User Sync Endpoint (`POST /api/auth/sync`)**: Auto-provisions and updates user records when authenticating via Clerk.
* **Current User Endpoint (`GET /api/auth/me`)**: Validates Bearer token and returns role permissions (`project:create`, `ai:generate`, `manga:export`).
* **JWT Token Verification Endpoint (`POST /api/auth/verify`)**: Validates token signatures.

### 2.3 Database Schema & Seeds (`prisma/schema.prisma` & `prisma/seed.ts`)
* **3NF Models**: User, UserProfile, Session, OAuthAccount, Organization, Team, TeamMember.
* **Seeder Script**: Seeds default MAPPA Cyber Studio organization, Alpha team, Admin user, and Creator user.

---

## 3. Verification & Compliance
* **TypeScript Validation**: Zero errors (`tsc --noEmit`).
* **Applet Build**: Compiled clean via `compile_applet`.
