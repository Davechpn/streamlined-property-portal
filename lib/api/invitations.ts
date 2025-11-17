import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type { InvitationWithDetails } from '@/lib/types';

interface InvitationsResponse {
  success: boolean;
  message: string;
  sentInvitations: InvitationWithDetails[];
  receivedInvitations: InvitationWithDetails[];
  errors: string[];
}

interface SendInvitationResponse {
  success: boolean;
  message: string;
  invitation: InvitationWithDetails | null;
  errors: string[];
}

interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  organization: any | null;
  errors: string[];
}

interface CancelInvitationResponse {
  success: boolean;
  message: string;
  errors: string[];
}

// Get all invitations for current user (sent and received)
export async function getUserInvitations(): Promise<InvitationsResponse> {
  try {
    const response = await apiClient.get<InvitationsResponse>('/invitations');
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_user_invitations' },
    });
    throw error;
  }
}

// Get invitations for a specific organization
export async function getOrganizationInvitations(orgId: string): Promise<InvitationsResponse> {
  try {
    const response = await apiClient.get<InvitationsResponse>(`/organizations/${orgId}/invitations`);
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_org_invitations', org_id: orgId },
    });
    throw error;
  }
}

// Send new invitation
export async function sendInvitation(data: {
  organizationId: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  message?: string;
}): Promise<SendInvitationResponse> {
  try {
    const response = await apiClient.post<SendInvitationResponse>('/invitations/send', data);
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation sent',
      data: { org_id: data.organizationId, contact: data.email || data.phoneNumber, role: data.role },
    });
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'send_invitation', org_id: data.organizationId },
    });
    throw error;
  }
}

// Accept invitation
export async function acceptInvitation(invitationId: string, token: string): Promise<AcceptInvitationResponse> {
  try {
    const response = await apiClient.post<AcceptInvitationResponse>('/invitations/accept', {
      invitationId,
      token,
    });
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation accepted',
      data: { invitation_id: invitationId },
    });
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'accept_invitation', invitation_id: invitationId },
    });
    throw error;
  }
}

// Cancel invitation
export async function cancelInvitation(invitationId: string): Promise<CancelInvitationResponse> {
  try {
    const response = await apiClient.delete<CancelInvitationResponse>(`/invitations/${invitationId}`, {
      data: { invitationId },
    });
    Sentry.addBreadcrumb({
      category: 'invitation',
      message: 'Invitation cancelled',
      data: { invitation_id: invitationId },
    });
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'cancel_invitation', invitation_id: invitationId },
    });
    throw error;
  }
}
