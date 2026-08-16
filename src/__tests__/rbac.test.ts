// Phase 6.4 — Role-Based Access Control (RBAC) Test Suite

import { 
  ALL_PERMISSIONS, 
  DEFAULT_ROLES, 
  resolveEffectivePermissions, 
  hasPermission, 
  hasRole, 
  canAssignRole,
  invalidateUserPermissionCache 
} from '../utils/rbacEngine';
import { SystemRoleCode, PermissionCode } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runRbacTestSuite() {
  console.log('🧪 Starting Phase 6.4 — RBAC Unit & Authorization Test Suite...');

  // 1. Verify Catalog Definitions
  assert(ALL_PERMISSIONS.length >= 18, 'Must define at least 18 fine-grained permissions');
  assert(DEFAULT_ROLES.length >= 12, 'Must define default system, org, and team roles');

  // 2. Test Super Admin Unrestricted Permissions
  const superAdminEff = resolveEffectivePermissions('test_super_admin', 'SUPER_ADMIN', 'OWNER', 'TEAM_LEAD');
  assert(superAdminEff.permissions.length === ALL_PERMISSIONS.length, 'Super Admin must possess ALL system permissions');
  assert(hasPermission(superAdminEff.permissions, 'admin.settings'), 'Super Admin must have admin.settings');
  assert(hasPermission(superAdminEff.permissions, 'user.delete'), 'Super Admin must have user.delete');

  // 3. Test Standard User Permission Boundary
  const standardUserEff = resolveEffectivePermissions('test_standard_user', 'USER', 'VIEWER', 'MEMBER');
  assert(hasPermission(standardUserEff.permissions, 'project.create'), 'Standard user can create projects');
  assert(!hasPermission(standardUserEff.permissions, 'admin.settings'), 'Standard user MUST NOT have admin.settings');
  assert(!hasPermission(standardUserEff.permissions, 'user.delete'), 'Standard user MUST NOT have user.delete');

  // 4. Test Support Specialist Permissions
  const supportEff = resolveEffectivePermissions('test_support', 'SUPPORT', 'MANAGER', 'TEAM_LEAD');
  assert(hasPermission(supportEff.permissions, 'marketplace.moderate'), 'Support staff can moderate marketplace');
  assert(hasPermission(supportEff.permissions, 'user.read'), 'Support staff can read user profile');
  assert(!hasPermission(supportEff.permissions, 'admin.settings'), 'Support staff MUST NOT have full admin settings');

  // 5. Test Privilege Escalation Prevention Rules
  assert(canAssignRole('SUPER_ADMIN', 'SUPER_ADMIN'), 'Super Admin can grant Super Admin role');
  assert(canAssignRole('ADMIN', 'ADMIN'), 'Admin can grant Admin role');
  assert(!canAssignRole('ADMIN', 'SUPER_ADMIN'), 'Privilege Escalation Blocked: Admin CANNOT grant Super Admin role');
  assert(!canAssignRole('USER', 'ADMIN'), 'Privilege Escalation Blocked: Standard User CANNOT grant Admin role');
  assert(!canAssignRole('SUPPORT', 'SUPER_ADMIN'), 'Privilege Escalation Blocked: Support CANNOT grant Super Admin role');

  // 6. Test Permission Guard Helper
  assert(hasRole('SUPER_ADMIN', 'USER'), 'Super Admin satisfies any role requirement');
  assert(hasRole('ADMIN', 'ADMIN'), 'Admin role match');
  assert(!hasRole('USER', 'ADMIN'), 'User does not satisfy Admin requirement');

  // 7. Test Permission Cache Invalidation
  invalidateUserPermissionCache();
  const freshEff = resolveEffectivePermissions('test_cache_user', 'USER');
  assert(freshEff.userId === 'test_cache_user', 'Fresh effective permissions returned after cache clearing');

  console.log('✅ All Phase 6.4 RBAC & Authorization Tests Passed Successfully!');
}
