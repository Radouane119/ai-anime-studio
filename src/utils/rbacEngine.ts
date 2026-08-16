// Phase 6.4 — RBAC Engine, Permission Guards & Permission Service

import { 
  RbacPermission, 
  RbacRole, 
  PermissionCode, 
  SystemRoleCode, 
  OrgRoleCode, 
  TeamRoleCode, 
  UserRoleAssignment, 
  RbacAuditLogItem,
  EffectivePermissionsResponse
} from '../types';

// ====================================================
// 1. ALL SYSTEM PERMISSIONS DEFINITIONS
// ====================================================
export const ALL_PERMISSIONS: RbacPermission[] = [
  // Users
  { id: 'p_usr_read', code: 'user.read', name: 'Read User Profile', category: 'Users', description: 'View user profiles and basic workspace activity.' },
  { id: 'p_usr_update', code: 'user.update', name: 'Update User Profile', category: 'Users', description: 'Modify user bio, preferences, and avatar settings.' },
  { id: 'p_usr_delete', code: 'user.delete', name: 'Delete User Account', category: 'Users', description: 'Permanently remove or deactivate user accounts.' },

  // Projects
  { id: 'p_prj_create', code: 'project.create', name: 'Create Project', category: 'Projects', description: 'Create new anime, manga, novel, or video projects.' },
  { id: 'p_prj_read', code: 'project.read', name: 'Read Project', category: 'Projects', description: 'View project details, timelines, and visual scripts.' },
  { id: 'p_prj_update', code: 'project.update', name: 'Update Project', category: 'Projects', description: 'Edit project metadata, storyboards, and assets.' },
  { id: 'p_prj_delete', code: 'project.delete', name: 'Delete Project', category: 'Projects', description: 'Delete projects and clean up stored media.' },

  // Stories
  { id: 'p_sty_create', code: 'story.create', name: 'Create Story Arc', category: 'Stories', description: 'Draft novel chapters, episode scripts, and dialogue lines.' },
  { id: 'p_sty_edit', code: 'story.edit', name: 'Edit Story Arc', category: 'Stories', description: 'Refine manuscripts, AI voice timing, and storyboard panels.' },
  { id: 'p_sty_pub', code: 'story.publish', name: 'Publish Story', category: 'Stories', description: 'Publish chapters and episodes to global distribution.' },

  // Characters
  { id: 'p_chr_create', code: 'character.create', name: 'Create Character', category: 'Characters', description: 'Design character sheets, prompt vectors, and lore stats.' },
  { id: 'p_chr_edit', code: 'character.edit', name: 'Edit Character', category: 'Characters', description: 'Update character artwork, neural voice models, and stats.' },
  { id: 'p_chr_delete', code: 'character.delete', name: 'Delete Character', category: 'Characters', description: 'Remove characters from studio repositories.' },

  // Marketplace
  { id: 'p_mp_sell', code: 'marketplace.sell', name: 'List Assets for Sale', category: 'Marketplace', description: 'Publish custom voice models, LUTs, and backgrounds to Marketplace.' },
  { id: 'p_mp_buy', code: 'marketplace.buy', name: 'Purchase Assets', category: 'Marketplace', description: 'Acquire community anime models and sound effects.' },
  { id: 'p_mp_mod', code: 'marketplace.moderate', name: 'Moderate Marketplace', category: 'Marketplace', description: 'Review, approve, or take down marketplace listings.' },

  // Admin
  { id: 'p_adm_dash', code: 'admin.dashboard', name: 'Access Admin Dashboard', category: 'Admin', description: 'View system health, GPU compute metrics, and analytics.' },
  { id: 'p_adm_usr', code: 'admin.users', name: 'Manage System Users', category: 'Admin', description: 'Assign roles, review user access, and manage memberships.' },
  { id: 'p_adm_set', code: 'admin.settings', name: 'Manage System Settings', category: 'Admin', description: 'Configure global RBAC rules, API limits, and security.' },
];

// Map helper
export const PERMISSION_CODES = ALL_PERMISSIONS.map(p => p.code);

// ====================================================
// 2. SYSTEM, ORGANIZATION, AND TEAM ROLES MATRIX
// ====================================================

export const DEFAULT_ROLES: RbacRole[] = [
  // --- SYSTEM ROLES ---
  {
    id: 'role_sys_super_admin',
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    scope: 'SYSTEM',
    description: 'Full unrestricted system authorization across all resources, tenant organizations, and system settings.',
    isSystem: true,
    permissions: [...PERMISSION_CODES],
  },
  {
    id: 'role_sys_admin',
    code: 'ADMIN',
    name: 'Admin',
    scope: 'SYSTEM',
    description: 'Administrative access for user management, project governance, and admin dashboard controls.',
    isSystem: true,
    permissions: [
      'user.read', 'user.update',
      'project.create', 'project.read', 'project.update', 'project.delete',
      'story.create', 'story.edit', 'story.publish',
      'character.create', 'character.edit', 'character.delete',
      'marketplace.sell', 'marketplace.buy', 'marketplace.moderate',
      'admin.dashboard', 'admin.users', 'admin.settings'
    ],
  },
  {
    id: 'role_sys_support',
    code: 'SUPPORT',
    name: 'Support Specialist',
    scope: 'SYSTEM',
    description: 'Read and update permissions for troubleshooting user issues and moderating community submissions.',
    isSystem: true,
    permissions: [
      'user.read', 'user.update',
      'project.read',
      'story.create', 'story.edit',
      'character.create', 'character.edit',
      'marketplace.buy', 'marketplace.moderate',
      'admin.dashboard', 'admin.users'
    ],
  },
  {
    id: 'role_sys_user',
    code: 'USER',
    name: 'Standard User / Creator',
    scope: 'SYSTEM',
    description: 'Standard studio creator access for building anime projects, character design, and publishing.',
    isSystem: true,
    permissions: [
      'user.read', 'user.update',
      'project.create', 'project.read', 'project.update',
      'story.create', 'story.edit', 'story.publish',
      'character.create', 'character.edit',
      'marketplace.sell', 'marketplace.buy'
    ],
  },

  // --- ORGANIZATION ROLES ---
  {
    id: 'role_org_owner',
    code: 'OWNER',
    name: 'Organization Owner',
    scope: 'ORGANIZATION',
    description: 'Owner of the studio workspace with billing controls and team administration rights.',
    isSystem: true,
    permissions: [
      'user.read', 'user.update',
      'project.create', 'project.read', 'project.update', 'project.delete',
      'story.create', 'story.edit', 'story.publish',
      'character.create', 'character.edit', 'character.delete',
      'marketplace.sell', 'marketplace.buy',
      'admin.users'
    ],
  },
  {
    id: 'role_org_admin',
    code: 'ADMIN_ORG',
    name: 'Organization Admin',
    scope: 'ORGANIZATION',
    description: 'Manages organization projects, member roles, and publishing pipeline.',
    isSystem: true,
    permissions: [
      'user.read',
      'project.create', 'project.read', 'project.update',
      'story.create', 'story.edit', 'story.publish',
      'character.create', 'character.edit',
      'marketplace.sell', 'marketplace.buy'
    ],
  },
  {
    id: 'role_org_manager',
    code: 'MANAGER',
    name: 'Organization Manager',
    scope: 'ORGANIZATION',
    description: 'Coordinates production workflows, assigns team leads, and reviews stories.',
    isSystem: true,
    permissions: [
      'user.read',
      'project.create', 'project.read', 'project.update',
      'story.create', 'story.edit',
      'character.create', 'character.edit',
      'marketplace.buy'
    ],
  },
  {
    id: 'role_org_editor',
    code: 'EDITOR',
    name: 'Organization Editor',
    scope: 'ORGANIZATION',
    description: 'Content editor responsible for manuscript writing, voice synth, and video clip editing.',
    isSystem: true,
    permissions: [
      'user.read',
      'project.read',
      'story.create', 'story.edit',
      'character.create', 'character.edit'
    ],
  },
  {
    id: 'role_org_viewer',
    code: 'VIEWER',
    name: 'Organization Viewer',
    scope: 'ORGANIZATION',
    description: 'Read-only stakeholder access to inspect projects and review storyboards.',
    isSystem: true,
    permissions: [
      'user.read',
      'project.read'
    ],
  },

  // --- TEAM ROLES ---
  {
    id: 'role_team_lead',
    code: 'TEAM_LEAD',
    name: 'Team Lead',
    scope: 'TEAM',
    description: 'Directs sub-team projects and character design repositories.',
    isSystem: true,
    permissions: [
      'project.create', 'project.read', 'project.update',
      'story.create', 'story.edit',
      'character.create', 'character.edit'
    ],
  },
  {
    id: 'role_team_member',
    code: 'MEMBER',
    name: 'Team Member',
    scope: 'TEAM',
    description: 'Active contributor inside team workspace.',
    isSystem: true,
    permissions: [
      'project.read',
      'story.create', 'story.edit',
      'character.create'
    ],
  },
  {
    id: 'role_team_guest',
    code: 'GUEST',
    name: 'Team Guest',
    scope: 'TEAM',
    description: 'Temporary reviewer with view-only permissions for assigned projects.',
    isSystem: true,
    permissions: [
      'project.read'
    ],
  },
];

// ====================================================
// 3. IN-MEMORY PERMISSION CACHE & RESOLUTION ENGINE
// ====================================================

interface CacheEntry {
  permissions: Set<PermissionCode>;
  timestamp: number;
}

const PERMISSION_CACHE_TTL_MS = 60 * 1000; // 1 Minute Cache TTL
const permissionCache = new Map<string, CacheEntry>();

export function invalidateUserPermissionCache(userId?: string) {
  if (userId) {
    permissionCache.delete(userId);
  } else {
    permissionCache.clear();
  }
}

/**
 * Resolves union of effective permissions from System Role, Org Role, Team Role, and Custom Roles.
 */
export function resolveEffectivePermissions(
  userId: string,
  systemRole: SystemRoleCode = 'USER',
  orgRole: OrgRoleCode = 'VIEWER',
  teamRole: TeamRoleCode = 'MEMBER',
  customRoles: string[] = [],
  activeRolesList: RbacRole[] = DEFAULT_ROLES
): EffectivePermissionsResponse {
  // Check Cache first
  const cacheKey = `${userId}_${systemRole}_${orgRole}_${teamRole}_${customRoles.join('_')}`;
  const cached = permissionCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < PERMISSION_CACHE_TTL_MS) {
    const permArray = Array.from(cached.permissions);
    return {
      userId,
      roles: {
        system: systemRole,
        org: orgRole,
        team: teamRole,
        custom: customRoles
      },
      permissions: permArray,
      featureFlags: computeFeatureFlags(permArray, systemRole)
    };
  }

  const permissionSet = new Set<PermissionCode>();

  // If Super Admin, grant ALL permissions
  if (systemRole === 'SUPER_ADMIN') {
    PERMISSION_CODES.forEach(code => permissionSet.add(code));
  } else {
    // 1. Resolve System Role permissions
    const sysRoleObj = activeRolesList.find(r => r.code === systemRole);
    if (sysRoleObj) {
      sysRoleObj.permissions.forEach(p => permissionSet.add(p));
    }

    // 2. Resolve Org Role permissions
    const orgRoleObj = activeRolesList.find(r => r.code === orgRole || (orgRole === 'ADMIN' && r.code === 'ADMIN_ORG'));
    if (orgRoleObj) {
      orgRoleObj.permissions.forEach(p => permissionSet.add(p));
    }

    // 3. Resolve Team Role permissions
    const teamRoleObj = activeRolesList.find(r => r.code === teamRole);
    if (teamRoleObj) {
      teamRoleObj.permissions.forEach(p => permissionSet.add(p));
    }

    // 4. Resolve Custom Roles
    customRoles.forEach(cRoleCode => {
      const cRoleObj = activeRolesList.find(r => r.code === cRoleCode);
      if (cRoleObj) {
        cRoleObj.permissions.forEach(p => permissionSet.add(p));
      }
    });
  }

  // Write to cache
  permissionCache.set(cacheKey, {
    permissions: permissionSet,
    timestamp: Date.now()
  });

  const finalPermissions = Array.from(permissionSet);

  return {
    userId,
    roles: {
      system: systemRole,
      org: orgRole,
      team: teamRole,
      custom: customRoles
    },
    permissions: finalPermissions,
    featureFlags: computeFeatureFlags(finalPermissions, systemRole)
  };
}

/**
 * Checks if permissionSet satisfies the required permission code
 */
export function hasPermission(effectivePermissions: PermissionCode[], requiredPerm: PermissionCode): boolean {
  if (!requiredPerm) return true;
  if (effectivePermissions.includes('admin.settings') && requiredPerm.startsWith('admin.')) return true;
  return effectivePermissions.includes(requiredPerm);
}

/**
 * Checks if user has a specific role
 */
export function hasRole(currentSystemRole: string, requiredRole: string): boolean {
  if (currentSystemRole === 'SUPER_ADMIN') return true;
  return currentSystemRole === requiredRole;
}

/**
 * Prevents privilege escalation:
 * Super Admin can grant any role.
 * Admin can grant Admin, Support, User, but NOT Super Admin.
 * Support / User cannot grant any administrative roles.
 */
export function canAssignRole(actorSystemRole: SystemRoleCode, roleToAssign: SystemRoleCode | OrgRoleCode | TeamRoleCode): boolean {
  if (actorSystemRole === 'SUPER_ADMIN') return true;
  if (actorSystemRole === 'ADMIN') {
    return roleToAssign !== 'SUPER_ADMIN';
  }
  return false;
}

/**
 * Feature Flags based on permissions
 */
function computeFeatureFlags(permissions: PermissionCode[], systemRole: SystemRoleCode): Record<string, boolean> {
  const isSuper = systemRole === 'SUPER_ADMIN';
  return {
    ai_4k_render: isSuper || permissions.includes('project.create'),
    batch_voice_gen: isSuper || permissions.includes('story.publish'),
    advanced_analytics: isSuper || permissions.includes('admin.dashboard'),
    marketplace_listing: isSuper || permissions.includes('marketplace.sell'),
    rbac_management: isSuper || permissions.includes('admin.settings') || permissions.includes('admin.users'),
  };
}
