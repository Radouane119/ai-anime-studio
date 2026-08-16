# Phase 4 — Enterprise Database Design & Architecture

## Executive Summary
This document specifies the Enterprise Relational Database Architecture for **AI Anime Studio**, powered by PostgreSQL 16 and Prisma ORM. The schema is fully compliant with Third Normal Form (3NF), optimized for horizontal partitioning, soft deletion, zero-downtime migrations, strict row-level security, and audit logging.

---

## 1. Entity Relationship Diagram (ERD Overview)

```
+------------------+         +-------------------+         +-------------------+
|      User        | 1 --- * |      Project      | 1 --- * |     Character     |
+------------------+         +-------------------+         +-------------------+
| id               |         | id                |         | id                |
| clerkId          |         | ownerId (FK)      |         | projectId (FK)    |
| email            |         | title             |         | name              |
| role             |         | genre             |         | signatureMove     |
+------------------+         +-------------------+         +-------------------+
         |                            |                              |
         | 1                          | 1                            | 1
         |                            |                              |
         *                            *                              *
+------------------+         +-------------------+         +-------------------+
|   Subscription   |         |    MangaProject   |         |     VoiceClip     |
+------------------+         +-------------------+         +-------------------+
| id               |         | id                |         | id                |
| userId (FK)      |         | projectId (FK)    |         | characterId (FK)  |
| plan             |         | readDirection     |         | audioUrl          |
+------------------+         +-------------------+         +-------------------+
```

---

## 2. Table Specifications & 3NF Schema Rules

### 2.1 Authentication & User Management
* **`User`**: Primary record linked via Clerk OAuth (`clerkId`). Indexed on `email` and `clerkId`.
* **`UserProfile`**: 1-to-1 extension holding preferences, social links, and default voice settings.
* **`Session` & `OAuthAccount`**: Authentication sessions, JWT metadata, and external OAuth sync records.
* **`Organization`, `Team`, `TeamMember`**: Multi-tenant RBAC container for enterprise studios.

### 2.2 Studio Domains
* **`Project`**: Core container model for all media assets (Novel, Manga, Storyboard, Voice, Video).
* **`Story` -> `Chapter` -> `Scene`**: Hierarchical 3NF breakdown for Light Novels and Episode Scripts.
* **`Character`**: Lorebook entity containing visual prompts, attributes, and RPG stat webs (`strengthStat`, `magicStat`, `agilityStat`).
* **`World` -> `Location`**: Worldbuilding atlas and fantasy settings.
* **`MangaProject` -> `MangaPage` -> `MangaPanel`**: Multi-panel Webtoon canvas renderer data model.
* **`Storyboard` -> `Shot` & `AnimationProject`**: Video cut sequences, duration timestepping, and keyframes.
* **`VoiceClip` & `MusicTrack`**: Gemini Neural Voice Dubbing models and soundtrack stems.

### 2.3 Marketplace, Community & Monetization
* **`MarketplaceItem` & `Order`**: Creator asset marketplace with token-based transactions.
* **`Post`, `Comment`, `Like`**: Community feed & creator showcases.
* **`Subscription`**: Stripe subscription sync state (`PlanTier`).

---

## 3. Database Performance & Indexing Strategy

1. **B-Tree Indexes**: Applied to all primary keys (`id`), foreign keys (`userId`, `projectId`, `storyId`, `pageId`), and composite lookup keys (`[storyId, order]`, `[mangaProjectId, pageNumber]`).
2. **Soft Delete Strategy**: Key models (`User`, `Project`) feature `deletedAt DateTime?`. Global query filters exclude deleted records (`WHERE deletedAt IS NULL`).
3. **Partitioning**: `AiRequestLog` and `AuditLog` are candidate tables for range partitioning by `createdAt` (monthly partitions) to sustain high-throughput telemetry.

---

## 4. Security & Compliance
* **Row-Level Access (RLS)**: Enforced via API Middleware checking `ownerId` / `teamId` against session context.
* **Data Encryption**: Sensitive API keys and tokens stored in DB use AES-256-GCM column encryption.
* **GDPR Compliance**: Full cascading delete cascade configuration (`onDelete: Cascade`) for user profile purges.
