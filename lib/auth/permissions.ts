import type { Role } from '@/lib/types';

// Permission matrix based on roles
const PERMISSIONS = {
  // Organization management
  canUpdateOrganization: ['owner', 'admin'] as Role[],
  canDeleteOrganization: ['owner'] as Role[],
  
  // Member management
  canInviteMembers: ['owner', 'admin', 'manager'] as Role[],
  canRemoveMembers: ['owner', 'admin'] as Role[],
  canUpdateMemberRoles: ['owner', 'admin'] as Role[],
  
  // Invitation management
  canManageInvitations: ['owner', 'admin', 'manager'] as Role[],
  canResendInvitations: ['owner', 'admin', 'manager'] as Role[],
  canRevokeInvitations: ['owner', 'admin'] as Role[],
  
  // View permissions
  canViewMembers: ['owner', 'admin', 'manager', 'agent', 'viewer'] as Role[],
  canViewInvitations: ['owner', 'admin', 'manager'] as Role[],
  canViewSettings: ['owner', 'admin'] as Role[],
  
  // Activity logs
  canViewActivityLogs: ['owner', 'admin', 'manager'] as Role[],
};

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Check if user can perform action on another member based on roles
 * - Can't modify owner
 * - Can only modify members with lower role priority
 */
export function canModifyMember(actorRole: Role, targetRole: Role): boolean {
  // Can't modify owner
  if (targetRole === 'owner') {
    return false;
  }
  
  // Role hierarchy (lower number = higher priority)
  const rolePriority: Record<Role, number> = {
    owner: 0,
    admin: 1,
    manager: 2,
    agent: 3,
    viewer: 4,
  };
  
  return rolePriority[actorRole] < rolePriority[targetRole];
}

/**
 * Check if a role change is allowed
 */
export function canChangeRole(
  actorRole: Role,
  currentMemberRole: Role,
  newRole: Role
): boolean {
  // Can't change owner role
  if (currentMemberRole === 'owner') {
    return false;
  }
  
  // Can't promote to owner (only one owner per org)
  if (newRole === 'owner') {
    return false;
  }
  
  // Must be able to modify the member
  if (!canModifyMember(actorRole, currentMemberRole)) {
    return false;
  }
  
  // Must have permission to update roles
  return hasPermission(actorRole, 'canUpdateMemberRoles');
}

/**
 * Get all roles that a user can assign
 */
export function getAssignableRoles(userRole: Role): Role[] {
  const allRoles: Role[] = ['admin', 'manager', 'agent', 'viewer'];
  
  // Role hierarchy
  const rolePriority: Record<Role, number> = {
    owner: 0,
    admin: 1,
    manager: 2,
    agent: 3,
    viewer: 4,
  };
  
  // Can assign roles lower than or equal to own role (except owner)
  return allRoles.filter(role => rolePriority[role] >= rolePriority[userRole]);
}

/**
 * Check if user is owner of the organization
 */
export function isOwner(userRole: Role): boolean {
  return userRole === 'owner';
}

/**
 * Check if user is admin or owner
 */
export function isAdminOrOwner(userRole: Role): boolean {
  return userRole === 'owner' || userRole === 'admin';
}

/**
 * Check if user can view sensitive data
 */
export function canViewSensitiveData(userRole: Role): boolean {
  return isAdminOrOwner(userRole);
}
