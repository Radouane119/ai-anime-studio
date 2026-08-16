// Phase 6.4 — PermissionGate Component & useRBAC Custom Hook

import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PermissionCode, SystemRoleCode, OrgRoleCode, TeamRoleCode } from '../types';
import { resolveEffectivePermissions, hasPermission, hasRole } from '../utils/rbacEngine';

export interface UseRbacResult {
  systemRole: SystemRoleCode;
  orgRole: OrgRoleCode;
  teamRole: TeamRoleCode;
  permissions: PermissionCode[];
  featureFlags: Record<string, boolean>;
  hasPermission: (perm: PermissionCode) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (perms: PermissionCode[]) => boolean;
  hasAllPermissions: (perms: PermissionCode[]) => boolean;
  canManageRbac: boolean;
}

export function useRBAC(): UseRbacResult {
  const { user } = useAuth();

  const systemRole: SystemRoleCode = (user?.role as SystemRoleCode) || 'USER';
  const orgRole: OrgRoleCode = 'OWNER'; // Default owner for user studio
  const teamRole: TeamRoleCode = 'TEAM_LEAD'; // Default team lead

  const effective = useMemo(() => {
    return resolveEffectivePermissions(
      user?.id || 'guest_user',
      systemRole,
      orgRole,
      teamRole,
      []
    );
  }, [user?.id, systemRole, orgRole, teamRole]);

  const checkHasPermission = (perm: PermissionCode) => {
    return hasPermission(effective.permissions, perm);
  };

  const checkHasRole = (role: string) => {
    return hasRole(systemRole, role) || orgRole === role || teamRole === role;
  };

  const hasAnyPermission = (perms: PermissionCode[]) => {
    return perms.some(p => checkHasPermission(p));
  };

  const hasAllPermissions = (perms: PermissionCode[]) => {
    return perms.every(p => checkHasPermission(p));
  };

  const canManageRbac = checkHasPermission('admin.settings') || checkHasPermission('admin.users') || systemRole === 'SUPER_ADMIN' || systemRole === 'ADMIN';

  return {
    systemRole,
    orgRole,
    teamRole,
    permissions: effective.permissions,
    featureFlags: effective.featureFlags,
    hasPermission: checkHasPermission,
    hasRole: checkHasRole,
    hasAnyPermission,
    hasAllPermissions,
    canManageRbac
  };
}

interface PermissionGateProps {
  permission?: PermissionCode;
  permissions?: PermissionCode[];
  requireAll?: boolean;
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  children
}) => {
  const rbac = useRBAC();

  if (role && !rbac.hasRole(role)) {
    return <>{fallback}</>;
  }

  if (permission && !rbac.hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (permissions && permissions.length > 0) {
    const isAllowed = requireAll
      ? rbac.hasAllPermissions(permissions)
      : rbac.hasAnyPermission(permissions);

    if (!isAllowed) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};
