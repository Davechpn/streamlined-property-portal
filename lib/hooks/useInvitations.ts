import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as invitationApi from '@/lib/api/invitations';

// Query keys
export const invitationKeys = {
  user: ['user-invitations'] as const,
  org: (orgId: string) => ['org-invitations', orgId] as const,
};

// Get all invitations for current user (sent and received)
export function useUserInvitations() {
  return useQuery({
    queryKey: invitationKeys.user,
    queryFn: invitationApi.getUserInvitations,
  });
}

// Get invitations for a specific organization
export function useOrganizationInvitations(orgId: string) {
  return useQuery({
    queryKey: invitationKeys.org(orgId),
    queryFn: () => invitationApi.getOrganizationInvitations(orgId),
    enabled: !!orgId,
  });
}

// Send invitation mutation
export function useSendInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitationApi.sendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.user });
    },
  });
}

// Accept invitation mutation
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invitationId, token }: { invitationId?: string; token: string }) =>
      invitationApi.acceptInvitation(invitationId || '', token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.user });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

// Cancel invitation mutation
export function useCancelInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitationApi.cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.user });
    },
  });
}
