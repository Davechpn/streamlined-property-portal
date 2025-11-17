import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type {
  OrganizationMemberWithUser,
  UpdateMemberRoleRequest,
} from '@/lib/types';

interface MembersResponse {
  success: boolean;
  message: string;
  members: OrganizationMemberWithUser[];
  errors: any[];
}

// Get all members for an organization
export async function getMembers(orgId: string): Promise<OrganizationMemberWithUser[]> {
  try {
    const response = await apiClient.get<MembersResponse>(
      `/organizations/${orgId}/members`
    );
    // Normalize role to lowercase
    const members = response.data.members.map(member => ({
      ...member,
      role: member.role.toLowerCase() as any
    }));
    return members;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_members', org_id: orgId },
    });
    throw error;
  }
}

// Update member role
export async function updateMemberRole(
  orgId: string,
  memberId: string,
  data: UpdateMemberRoleRequest
): Promise<OrganizationMemberWithUser> {
  try {
    const response = await apiClient.patch<{ success: boolean; member: OrganizationMemberWithUser; message: string }>(
      `/organizations/${orgId}/members/${memberId}/role`,
      data
    );
    Sentry.addBreadcrumb({
      category: 'member',
      message: 'Member role updated',
      data: { org_id: orgId, member_id: memberId, role: data.role },
    });
    // Normalize role to lowercase
    const member = {
      ...response.data.member,
      role: response.data.member.role.toLowerCase() as any
    };
    return member;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'update_member_role', org_id: orgId, member_id: memberId },
    });
    throw error;
  }
}

// Remove member from organization
export async function removeMember(orgId: string, memberId: string): Promise<void> {
  try {
    await apiClient.delete(`/organizations/${orgId}/members/${memberId}`);
    Sentry.addBreadcrumb({
      category: 'member',
      message: 'Member removed',
      data: { org_id: orgId, member_id: memberId },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'remove_member', org_id: orgId, member_id: memberId },
    });
    throw error;
  }
}
