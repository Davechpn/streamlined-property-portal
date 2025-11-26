import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/lib/hooks/useOrganizations';
import { useUser } from '@/lib/hooks/useAuth';
import type { Role, OrganizationPermissions } from '@/lib/types';
import * as permissions from '@/lib/auth/permissions';

interface UsePermissionsOptions {
  orgId: string;
}

/**
 * Hook to check user permissions in an organization
 */
export function usePermissions({ orgId }: UsePermissionsOptions) {
  const { data: user } = useUser();
  const { data: orgDetails } = useOrganization(orgId);

  // Get user's role in this organization
  const userRole = orgDetails?.userRole;

  return {
    // Role info
    role: userRole,
    isOwner: userRole ? permissions.isOwner(userRole) : false,
    isAdminOrOwner: userRole ? permissions.isAdminOrOwner(userRole) : false,

    // Organization permissions
    canUpdateOrganization: userRole ? permissions.hasPermission(userRole, 'canUpdateOrganization') : false,
    canDeleteOrganization: userRole ? permissions.hasPermission(userRole, 'canDeleteOrganization') : false,
    canViewSettings: userRole ? permissions.hasPermission(userRole, 'canViewSettings') : false,

    // Member management
    canInviteMembers: userRole ? permissions.hasPermission(userRole, 'canInviteMembers') : false,
    canRemoveMembers: userRole ? permissions.hasPermission(userRole, 'canRemoveMembers') : false,
    canUpdateMemberRoles: userRole ? permissions.hasPermission(userRole, 'canUpdateMemberRoles') : false,
    canViewMembers: userRole ? permissions.hasPermission(userRole, 'canViewMembers') : false,

    // Invitation management
    canManageInvitations: userRole ? permissions.hasPermission(userRole, 'canManageInvitations') : false,
    canResendInvitations: userRole ? permissions.hasPermission(userRole, 'canResendInvitations') : false,
    canRevokeInvitations: userRole ? permissions.hasPermission(userRole, 'canRevokeInvitations') : false,
    canViewInvitations: userRole ? permissions.hasPermission(userRole, 'canViewInvitations') : false,

    // Activity logs
    canViewActivityLogs: userRole ? permissions.hasPermission(userRole, 'canViewActivityLogs') : false,

    // Sensitive data
    canViewSensitiveData: userRole ? permissions.canViewSensitiveData(userRole) : false,

    // Helper functions
    canModifyMember: (targetRole: Role) => 
      userRole ? permissions.canModifyMember(userRole, targetRole) : false,
    canChangeRole: (currentRole: Role, newRole: Role) =>
      userRole ? permissions.canChangeRole(userRole, currentRole, newRole) : false,
    getAssignableRoles: () =>
      userRole ? permissions.getAssignableRoles(userRole) : [],

    // Loading state
    isLoading: !orgDetails,
  };
}

/**
 * Hook to check if current user can perform an action
 * Returns boolean directly for simple permission checks
 */
export function useHasPermission(orgId: string, permission: permissions.Permission) {
  const { data: orgDetails } = useOrganization(orgId);
  const userRole = orgDetails?.userRole;

  return userRole ? permissions.hasPermission(userRole, permission) : false;
}

/**
 * Hook to get current user's role in an organization
 */
export function useUserRole(orgId: string): Role | undefined {
  const { data: orgDetails } = useOrganization(orgId);
  return orgDetails?.userRole;
}
