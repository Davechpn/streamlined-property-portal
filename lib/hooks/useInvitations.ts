import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as invitationApi from '@/lib/api/invitations';
import type { InviteMemberRequest } from '@/lib/types';

// Query keys
export const invitationKeys = {
  all: (orgId: string) => ['invitations', orgId] as const,
};

// Get all invitations for an organization
export function useInvitations(orgId: string) {
  return useQuery({
    queryKey: invitationKeys.all(orgId),
    queryFn: () => invitationApi.getInvitations(orgId),
    enabled: !!orgId,
  });
}

// Create invitation mutation
export function useCreateInvitation(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteMemberRequest) =>
      invitationApi.createInvitation(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all(orgId) });
    },
  });
}

// Resend invitation mutation
export function useResendInvitation(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      invitationApi.resendInvitation(orgId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all(orgId) });
    },
  });
}

// Cancel invitation mutation
export function useCancelInvitation(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      invitationApi.cancelInvitation(orgId, invitationId),
    onMutate: async (invitationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: invitationKeys.all(orgId) });

      // Snapshot previous value
      const previousInvitations = queryClient.getQueryData(invitationKeys.all(orgId));

      // Optimistically remove invitation
      queryClient.setQueryData(invitationKeys.all(orgId), (old: any) =>
        old?.filter((invitation: any) => invitation.id !== invitationId)
      );

      return { previousInvitations };
    },
    onError: (err, invitationId, context) => {
      // Rollback on error
      if (context?.previousInvitations) {
        queryClient.setQueryData(invitationKeys.all(orgId), context.previousInvitations);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all(orgId) });
    },
  });
}

// Accept invitation mutation
export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (token: string) => invitationApi.acceptInvitation(token),
  });
}
