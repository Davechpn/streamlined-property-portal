import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type {
  InvitationWithDetails,
  InviteMemberRequest,
} from '@/lib/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Get all invitations for an organization
export async function getInvitations(orgId: string): Promise<InvitationWithDetails[]> {
  try {
    const response = await apiClient.get<ApiResponse<InvitationWithDetails[]>>(
      `/organizations/${orgId}/invitations`
    );
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_invitations', org_id: orgId },
    });
    throw error;
  }
}

// Create new invitation
export async function createInvitation(
  orgId: string,
  data: InviteMemberRequest
): Promise<InvitationWithDetails> {
  try {
    const response = await apiClient.post<ApiResponse<InvitationWithDetails>>(
      `/organizations/${orgId}/invitations`,
      data
    );
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation created',
      data: { org_id: orgId, contact: data.inviteeContact, role: data.role },
    });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'create_invitation', org_id: orgId },
    });
    throw error;
  }
}

// Resend invitation
export async function resendInvitation(
  orgId: string,
  invitationId: string
): Promise<void> {
  try {
    await apiClient.post(`/organizations/${orgId}/invitations/${invitationId}/resend`);
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation resent',
      data: { org_id: orgId, invitation_id: invitationId },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'resend_invitation', org_id: orgId, invitation_id: invitationId },
    });
    throw error;
  }
}

// Cancel invitation
export async function cancelInvitation(
  orgId: string,
  invitationId: string
): Promise<void> {
  try {
    await apiClient.delete(`/organizations/${orgId}/invitations/${invitationId}`);
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation cancelled',
      data: { org_id: orgId, invitation_id: invitationId },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'cancel_invitation', org_id: orgId, invitation_id: invitationId },
    });
    throw error;
  }
}

// Accept invitation (public route)
export async function acceptInvitation(token: string): Promise<void> {
  try {
    await apiClient.post(`/invitations/${token}/accept`);
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation accepted',
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'accept_invitation' },
    });
    throw error;
  }
}
