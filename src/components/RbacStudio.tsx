// Phase 6.4 — Role-Based Access Control (RBAC) Studio Component

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Users, 
  Building2, 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  Settings, 
  Edit3, 
  Sparkles,
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRBAC } from './PermissionGate';
import { 
  RbacRole, 
  RbacPermission, 
  UserRoleAssignment, 
  RbacAuditLogItem, 
  PermissionCode, 
  SystemRoleCode, 
  OrgRoleCode, 
  TeamRoleCode, 
  RoleScope 
} from '../types';

type RbacTab = 'roles' | 'matrix' | 'users' | 'org_team' | 'audit';

export const RbacStudio: React.FC = () => {
  const { user } = useAuth();
  const rbac = useRBAC();
  const [activeTab, setActiveTab] = useState<RbacTab>('roles');

  // State
  const [roles, setRoles] = useState<RbacRole[]>([]);
  const [permissions, setPermissions] = useState<RbacPermission[]>([]);
  const [users, setUsers] = useState<UserRoleAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<RbacAuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [permSearchQuery, setPermSearchQuery] = useState<string>('');

  // Custom Role Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleCode, setNewRoleCode] = useState<string>('');
  const [newRoleScope, setNewRoleScope] = useState<RoleScope>('CUSTOM');
  const [newRoleDescription, setNewRoleDescription] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionCode[]>([]);

  // Edit Role Modal State
  const [editingRole, setEditingRole] = useState<RbacRole | null>(null);
  const [editPermissions, setEditPermissions] = useState<PermissionCode[]>([]);

  useEffect(() => {
    fetchRbacData();
  }, []);

  const fetchRbacData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [rolesRes, permsRes, usersRes, auditRes] = await Promise.all([
        fetch('/api/rbac/roles'),
        fetch('/api/rbac/permissions'),
        fetch('/api/rbac/users'),
        fetch('/api/rbac/audit-logs'),
      ]);

      const [rolesData, permsData, usersData, auditData] = await Promise.all([
        rolesRes.json(),
        permsRes.json(),
        usersRes.json(),
        auditRes.json(),
      ]);

      if (rolesData.success) setRoles(rolesData.roles);
      if (permsData.success) setPermissions(permsData.permissions);
      if (usersData.success) setUsers(usersData.users);
      if (auditData.success) setAuditLogs(auditData.auditLogs);
    } catch (err: any) {
      console.error('Failed to load RBAC data:', err);
      setErrorMsg('Failed to connect to RBAC backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName || !newRoleCode) return;

    try {
      const res = await fetch('/api/rbac/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoleName,
          code: newRoleCode,
          scope: newRoleScope,
          description: newRoleDescription,
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create custom role');
      }

      setSuccessMsg(`Custom role '${newRoleName}' created successfully!`);
      setIsCreateModalOpen(false);
      setNewRoleName('');
      setNewRoleCode('');
      setNewRoleDescription('');
      setSelectedPermissions([]);
      fetchRbacData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleUpdateRolePermissions = async () => {
    if (!editingRole) return;
    try {
      const res = await fetch(`/api/rbac/roles/${editingRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editPermissions }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update permissions');
      }

      setSuccessMsg(`Permissions updated for role '${editingRole.name}'.`);
      setEditingRole(null);
      fetchRbacData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleAssignSystemRole = async (targetUserId: string, newRole: SystemRoleCode) => {
    try {
      const res = await fetch('/api/rbac/users/assign-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          systemRole: newRole,
          actorUserId: user?.id || 'usr_enterprise_01',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'System role assignment failed.');
      }

      setSuccessMsg(data.message);
      fetchRbacData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleAssignOrgRole = async (targetUserId: string, newRole: OrgRoleCode) => {
    try {
      const res = await fetch('/api/rbac/users/assign-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, orgRole: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Org role assignment failed.');

      setSuccessMsg(data.message);
      fetchRbacData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleAssignTeamRole = async (targetUserId: string, newRole: TeamRoleCode) => {
    try {
      const res = await fetch('/api/rbac/users/assign-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, teamRole: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Team role assignment failed.');

      setSuccessMsg(data.message);
      fetchRbacData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const filteredRoles = roles.filter(r => scopeFilter === 'ALL' || r.scope === scopeFilter);

  const filteredUsers = users.filter(u => 
    u.userName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.userEmail.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.systemRole.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(permissions.map(p => p.category)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  Role-Based Access Control (RBAC)
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-medium">
                    Enterprise v6.4
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Fine-grained authorization, permission matrix governance, tenant roles & audit logging engine.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRbacData}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
              Refresh Policy
            </button>

            {rbac.canManageRbac && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Custom Role
              </button>
            )}
          </div>
        </div>

        {/* --- MESSAGES --- */}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-xs hover:text-white">Dismiss</button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-xs hover:text-white">Dismiss</button>
          </div>
        )}

        {/* --- METRICS BAR --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Your Active System Role</p>
              <p className="text-sm font-bold text-white uppercase tracking-wider mt-0.5">{rbac.systemRole}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Configured Roles</p>
              <p className="text-lg font-bold text-white mt-0.5">{roles.length} Active</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Granular Permissions</p>
              <p className="text-lg font-bold text-white mt-0.5">{permissions.length} Defined</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Governed Users</p>
              <p className="text-lg font-bold text-white mt-0.5">{users.length} Creators</p>
            </div>
          </div>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex border-b border-slate-800 space-x-2 md:space-x-4 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Role Catalog ({roles.length})
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            Permission Matrix & Viewer
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            User Role Assignment
          </button>

          <button
            onClick={() => setActiveTab('org_team')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'org_team'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Org & Team Roles
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: ROLE CATALOG */}
        {/* ==================================================== */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'SYSTEM', 'ORGANIZATION', 'TEAM', 'CUSTOM'].map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setScopeFilter(scope)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                      scopeFilter === scope
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">Showing {filteredRoles.length} Roles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <div 
                  key={role.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {role.name}
                          </h3>
                          {role.isSystem && (
                            <span className="p-1 bg-slate-800 text-slate-400 rounded-lg title='System Protected Role'">
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-indigo-400/90 mt-0.5">{role.code}</p>
                      </div>

                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        role.scope === 'SYSTEM' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        role.scope === 'ORGANIZATION' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        role.scope === 'TEAM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {role.scope}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {role.description}
                    </p>

                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 mb-2">
                        Granted Permissions ({role.permissions.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {role.permissions.map((pCode) => (
                          <span 
                            key={pCode}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50"
                          >
                            {pCode}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {role.isSystem ? 'Built-in Security Policy' : 'Custom Configurable'}
                    </span>

                    {rbac.canManageRbac && (
                      <button
                        onClick={() => {
                          setEditingRole(role);
                          setEditPermissions([...role.permissions]);
                        }}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Permissions
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PERMISSION MATRIX & VIEWER */}
        {/* ==================================================== */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row items-md-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Granular Permission Matrix</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visual audit grid of permissions mapped across System, Organization, and Team role definitions.
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Filter permissions..."
                    value={permSearchQuery}
                    onChange={(e) => setPermSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 bg-slate-950/40">
                      <th className="py-3.5 px-4 w-1/3">Permission & Code</th>
                      <th className="py-3.5 px-4">Category</th>
                      {roles.filter(r => r.scope === 'SYSTEM').map(role => (
                        <th key={role.id} className="py-3.5 px-3 text-center">
                          <span className="text-[11px] font-mono text-slate-300">{role.code}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {permissions
                      .filter(p => p.code.toLowerCase().includes(permSearchQuery.toLowerCase()) || p.name.toLowerCase().includes(permSearchQuery.toLowerCase()))
                      .map((perm) => (
                        <tr key={perm.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-medium text-slate-200">{perm.name}</p>
                            <p className="text-[10px] font-mono text-indigo-400/80 mt-0.5">{perm.code}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {perm.category}
                            </span>
                          </td>
                          {roles.filter(r => r.scope === 'SYSTEM').map(role => {
                            const hasPerm = role.permissions.includes(perm.code);
                            return (
                              <td key={role.id} className="py-3 px-3 text-center">
                                {hasPerm ? (
                                  <div className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="inline-flex p-1 text-slate-700">
                                    <XCircle className="w-4 h-4" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: USER ROLE ASSIGNMENT */}
        {/* ==================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-md-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">User Authorization & Role Assignment</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assign System, Organization, and Team roles to team members with automatic privilege escalation checks.
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search creators by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 bg-slate-950/40">
                      <th className="py-3.5 px-4">Creator User</th>
                      <th className="py-3.5 px-4">System Role</th>
                      <th className="py-3.5 px-4">Organization Role</th>
                      <th className="py-3.5 px-4">Team Role</th>
                      <th className="py-3.5 px-4">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredUsers.map((u) => (
                      <tr key={u.userId} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl || 'https://picsum.photos/seed/user/100/100'}
                              alt={u.userName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="font-bold text-white">{u.userName}</p>
                              <p className="text-[11px] text-slate-400">{u.userEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* System Role Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.systemRole}
                            onChange={(e) => handleAssignSystemRole(u.userId, e.target.value as SystemRoleCode)}
                            disabled={!rbac.canManageRbac}
                            className="bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-indigo-300 font-semibold px-3 py-1.5 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                          >
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPPORT">SUPPORT</option>
                            <option value="USER">USER</option>
                          </select>
                        </td>

                        {/* Org Role Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.orgRole}
                            onChange={(e) => handleAssignOrgRole(u.userId, e.target.value as OrgRoleCode)}
                            disabled={!rbac.canManageRbac}
                            className="bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-blue-300 font-semibold px-3 py-1.5 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                          >
                            <option value="OWNER">OWNER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="EDITOR">EDITOR</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                        </td>

                        {/* Team Role Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.teamRole}
                            onChange={(e) => handleAssignTeamRole(u.userId, e.target.value as TeamRoleCode)}
                            disabled={!rbac.canManageRbac}
                            className="bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-amber-300 font-semibold px-3 py-1.5 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                          >
                            <option value="TEAM_LEAD">TEAM_LEAD</option>
                            <option value="MEMBER">MEMBER</option>
                            <option value="GUEST">GUEST</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {u.assignedAt ? new Date(u.assignedAt).toLocaleDateString() : 'Initial'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ORG & TEAM ROLES */}
        {/* ==================================================== */}
        {activeTab === 'org_team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Organization Roles Hierarchy */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Organization Role Hierarchy</h3>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'OWNER', desc: 'Full tenant ownership, billing management, and org admin rights.', perms: 'project.*, story.*, character.*, admin.users' },
                  { title: 'ADMIN', desc: 'Manages workspace projects, member invitations, and publishing pipeline.', perms: 'project.create/read/update, story.*, character.*' },
                  { title: 'MANAGER', desc: 'Directs daily studio sprints, story reviews, and character art.', perms: 'project.read/update, story.edit, character.edit' },
                  { title: 'EDITOR', desc: 'Manuscript writing, voice generation, and scene composition.', perms: 'story.create/edit, character.create/edit' },
                  { title: 'VIEWER', desc: 'Read-only stakeholder access to review scripts and storyboards.', perms: 'project.read, user.read' },
                ].map((item, idx) => (
                  <div key={item.title} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-2">Scope: {item.perms}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Roles Hierarchy */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Team Role Hierarchy</h3>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'TEAM_LEAD', desc: 'Directs creative direction for assigned sub-teams and projects.', perms: 'project.create/update, story.edit, character.edit' },
                  { title: 'MEMBER', desc: 'Active team contributor for drafting scenes, audio, and character models.', perms: 'project.read, story.create/edit, character.create' },
                  { title: 'GUEST', desc: 'External contractor or reviewer with temporary view-only access.', perms: 'project.read' },
                ].map((item, idx) => (
                  <div key={item.title} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md mt-0.5">
                      T{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-2">Scope: {item.perms}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: AUDIT LOGS */}
        {/* ==================================================== */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Immutable RBAC Audit Trail</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Security ledger recording every role change, permission grant, and custom policy creation.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.actorName || log.actorId}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-md text-[10px]">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1">
                          Target: <span className="text-slate-200 font-medium">{log.targetUserName || log.targetUserId || 'System Policy'}</span> | 
                          Role: <span className="font-mono text-indigo-300">{log.roleCode || 'N/A'}</span>
                        </p>
                        {log.details && (
                          <pre className="text-[10px] font-mono text-slate-500 mt-1.5 bg-slate-900/80 p-2 rounded-lg overflow-x-auto">
                            {JSON.stringify(log.details)}
                          </pre>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-slate-500 text-[11px] space-y-0.5">
                      <p className="flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                      <p className="font-mono text-[10px]">IP: {log.ipAddress || '127.0.0.1'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* MODAL: CREATE CUSTOM ROLE */}
        {/* ==================================================== */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  Define Custom RBAC Role
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Role Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Colorist"
                      value={newRoleName}
                      onChange={(e) => {
                        setNewRoleName(e.target.value);
                        setNewRoleCode(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                      }}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Role Code (Identifier)</label>
                    <input
                      type="text"
                      placeholder="e.g. LEAD_COLORIST"
                      value={newRoleCode}
                      onChange={(e) => setNewRoleCode(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scope</label>
                  <select
                    value={newRoleScope}
                    onChange={(e) => setNewRoleScope(e.target.value as RoleScope)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CUSTOM">CUSTOM</option>
                    <option value="SYSTEM">SYSTEM</option>
                    <option value="ORGANIZATION">ORGANIZATION</option>
                    <option value="TEAM">TEAM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe responsibilities and permissions boundary..."
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Permission Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">Assign Permissions ({selectedPermissions.length} Selected)</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    {categories.map((cat) => (
                      <div key={cat} className="space-y-2">
                        <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">{cat}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {permissions.filter(p => p.category === cat).map((p) => {
                            const isChecked = selectedPermissions.includes(p.code);
                            return (
                              <label 
                                key={p.code} 
                                className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                  isChecked 
                                    ? 'bg-indigo-600/10 border-indigo-500/40 text-white' 
                                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setSelectedPermissions(selectedPermissions.filter(c => c !== p.code));
                                    } else {
                                      setSelectedPermissions([...selectedPermissions, p.code]);
                                    }
                                  }}
                                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div>
                                  <p className="font-semibold text-[11px]">{p.name}</p>
                                  <p className="font-mono text-[9px] text-slate-500">{p.code}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20"
                  >
                    Create Custom Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* MODAL: EDIT ROLE PERMISSIONS */}
        {/* ==================================================== */}
        {editingRole && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-400" />
                    Edit Permissions for '{editingRole.name}'
                  </h3>
                  <p className="text-xs font-mono text-indigo-400 mt-0.5">Code: {editingRole.code}</p>
                </div>
                <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-400">{editingRole.description}</p>

                <div className="space-y-4 max-h-72 overflow-y-auto p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  {categories.map((cat) => (
                    <div key={cat} className="space-y-2">
                      <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">{cat}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {permissions.filter(p => p.category === cat).map((p) => {
                          const isChecked = editPermissions.includes(p.code);
                          return (
                            <label 
                              key={p.code} 
                              className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                isChecked 
                                  ? 'bg-indigo-600/10 border-indigo-500/40 text-white' 
                                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setEditPermissions(editPermissions.filter(c => c !== p.code));
                                  } else {
                                    setEditPermissions([...editPermissions, p.code]);
                                  }
                                }}
                                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div>
                                <p className="font-semibold text-[11px]">{p.name}</p>
                                <p className="font-mono text-[9px] text-slate-500">{p.code}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateRolePermissions}
                    className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20"
                  >
                    Save Permission Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
