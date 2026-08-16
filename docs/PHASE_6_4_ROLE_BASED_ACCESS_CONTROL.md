# Phase 6.4 — Role-Based Access Control (RBAC) & Authorization Governance

## Executive Summary
Phase 6.4 introduces the enterprise-grade **Role-Based Access Control (RBAC) & Authorization System** for **AI Anime Studio**. Building directly upon the Phase 6.1 Authentication foundation and Phase 6.2 User Profile System, Phase 6.4 delivers fine-grained authorization across System, Tenant Organization, and Team scopes with privilege escalation protection, permission caching, audit logging, and responsive UI controls.

---

## 1. System Architecture & Permission Resolution Flow

```
                                [ Frontend Request ]
                                         │
                                         ▼
                     [ PermissionGate Component / useRBAC Hook ]
                                         │
                                         ▼
             [ Permission Resolution Engine (`src/utils/rbacEngine.ts`) ]
                     ┌───────────────────┴───────────────────┐
                     │                                       │
        [ Check In-Memory TTL Cache ]              [ Resolve Effective Set ]
                     │                                       │
            (Cache Hit / Valid)                     (Union of Roles & Scopes)
                     │                                       │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                        [ Express Server API Endpoint ]
                                         │
                                         ▼
                   [ Authorization Guard & Escalation Check ]
                       - `canAssignRole(actor, target)`
                       - `hasPermission(effective, code)`
                                         │
                                         ▼
                     [ Immutable RBAC Security Audit Log ]
```

---

## 2. Roles Breakdown

### 2.1 System Roles
* **SUPER_ADMIN**: Absolute, unrestricted authorization across all resources, system settings, and multi-tenant organizations.
* **ADMIN**: System administration for user management, project governance, and analytics dashboard access.
* **SUPPORT**: Read and update privileges for user support, moderation, and incident investigation.
* **USER**: Standard studio creator with rights to create, edit, and publish projects, characters, and manuscripts.

### 2.2 Organization Roles
* **OWNER**: Tenant owner with billing oversight, organization deletion rights, and member management.
* **ADMIN**: Manages workspace projects, member invitations, and publishing settings.
* **MANAGER**: Directs daily production sprints, scene reviews, and team leads.
* **EDITOR**: Manuscript editing, AI voice synthesis, and storyboard creation.
* **VIEWER**: Read-only stakeholder access to review project progress and storyboards.

### 2.3 Team Roles
* **TEAM_LEAD**: Leads creative direction for assigned sub-team projects.
* **MEMBER**: Standard team contributor.
* **GUEST**: Temporary reviewer with view-only permissions.

---

## 3. Fine-Grained Permission Catalog (18 Core Permissions)

| Category | Permission Code | Description |
| :--- | :--- | :--- |
| **Users** | `user.read` | View user profiles and workspace activity |
| | `user.update` | Update user metadata and preferences |
| | `user.delete` | Permanently remove or deactivate accounts |
| **Projects** | `project.create` | Instantiate new anime, manga, or video projects |
| | `project.read` | View project storyboards and scripts |
| | `project.update` | Modify project assets and story arcs |
| | `project.delete` | Delete project repositories and media |
| **Stories** | `story.create` | Draft novel chapters and anime scripts |
| | `story.edit` | Refine manuscripts and audio timings |
| | `story.publish` | Publish chapters to global distribution |
| **Characters** | `character.create` | Design character sheets and prompt vectors |
| | `character.edit` | Update character artwork and voice models |
| | `character.delete` | Remove character models from studio |
| **Marketplace**| `marketplace.sell` | List custom voice models & backgrounds for sale |
| | `marketplace.buy` | Acquire marketplace assets |
| | `marketplace.moderate` | Review, approve, or take down listings |
| **Admin** | `admin.dashboard` | Access system metrics and GPU compute stats |
| | `admin.users` | Manage user role assignments |
| | `admin.settings` | Configure global RBAC rules & security settings |

---

## 4. Prisma 3NF Database Schema

```prisma
enum RoleScope {
  SYSTEM
  ORGANIZATION
  TEAM
  CUSTOM
}

model Role {
  id                 String              @id @default(uuid())
  code               String              @unique
  name               String
  scope              RoleScope           @default(SYSTEM)
  description        String?
  isSystem           Boolean             @default(false)
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt

  rolePermissions    RolePermission[]
  userRoles          UserRole[]
  organizationRoles  OrganizationRole[]
  teamRoles          TeamRole[]
  featurePermissions FeaturePermission[]
}

model Permission {
  id              String           @id @default(uuid())
  code            String           @unique
  name            String
  category        String
  description     String?
  createdAt       DateTime         @default(now())

  rolePermissions RolePermission[]
}

model RolePermission {
  id           String     @id @default(uuid())
  roleId       String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  grantedAt    DateTime   @default(now())

  @@unique([roleId, permissionId])
}

model UserRole {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleId     String
  role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedBy String?
  assignedAt DateTime @default(now())

  @@unique([userId, roleId])
}

model OrganizationRole {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  organizationId String
  roleId         String
  role           Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt     DateTime @default(now())

  @@unique([userId, organizationId, roleId])
}

model TeamRole {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  teamId     String
  roleId     String
  role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())

  @@unique([userId, teamId, roleId])
}

model FeaturePermission {
  id         String   @id @default(uuid())
  roleId     String
  role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  featureKey String
  isEnabled  Boolean  @default(true)
  configJson Json?
  createdAt  DateTime @default(now())

  @@unique([roleId, featureKey])
}

model RbacAuditLog {
  id             String   @id @default(uuid())
  actorId        String
  action         String
  targetUserId   String?
  roleId         String?
  permissionCode String?
  details        Json?
  ipAddress      String?
  createdAt      DateTime @default(now())

  @@index([actorId])
  @@index([createdAt])
}
```

---

## 5. API Endpoints Reference

### 5.1 Roles Catalog
* **`GET /api/rbac/roles`**: List all active system, organization, team, and custom roles.
* **`POST /api/rbac/roles`**: Create a custom role with custom permission set.
* **`PUT /api/rbac/roles/:roleId/permissions`**: Update assigned permissions for a role.

### 5.2 User Assignments & Privilege Escalation Protection
* **`GET /api/rbac/users`**: List all user role assignments.
* **`POST /api/rbac/users/assign-system`**: Assign system role (`SUPER_ADMIN`, `ADMIN`, `SUPPORT`, `USER`). Prevents lower roles from elevating users to higher system tiers (`HTTP 403 Forbidden`).
* **`POST /api/rbac/users/assign-org`**: Assign organization role.
* **`POST /api/rbac/users/assign-team`**: Assign team role.

### 5.3 Effective Permissions & Audit Logs
* **`GET /api/rbac/my-permissions`**: Returns computed effective permission array, feature flags, and roles for the requesting user.
* **`GET /api/rbac/audit-logs`**: Retrieve immutable security audit log trail.

---

## 6. Privilege Escalation Mitigation Strategy

1. **Role Level Hierarchy Enforcement**:
   * `SUPER_ADMIN` can assign any system or tenant role.
   * `ADMIN` can assign `ADMIN`, `SUPPORT`, and `USER`, but is strictly forbidden from granting `SUPER_ADMIN`.
   * `SUPPORT` and `USER` cannot assign administrative roles.
2. **Permission Guarding**:
   * Critical security operations require `admin.settings` or `admin.users`.
3. **Audit Ledger**:
   * Every role assignment, permission grant, or custom role creation writes an immutable entry into `RbacAuditLog` containing actor ID, target user ID, IP address, and timestamp.

---

## 7. Future Extension Strategy

* **Attribute-Based Access Control (ABAC)**: Support project-level metadata conditions (e.g. `project.ownerId == req.user.id`).
* **Dynamic Scoped API Keys**: Issue API keys bound to specific RBAC permission subsets.
* **SSO & SAML Role Mapping**: Automatically map Okta/Azure AD enterprise claims to AI Anime Studio RBAC roles.
