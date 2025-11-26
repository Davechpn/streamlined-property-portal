import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as memberApi from '@/lib/api/members';
import type { UpdateMemberRoleRequest } from '@/lib/types';

// Query keys
export const memberKeys = {
  all: (orgId: string) => ['members', orgId] as const,
};

// Get all members for an organization
export function useMembers(orgId: string) {
  return useQuery({
    queryKey: memberKeys.all(orgId),
    queryFn: () => memberApi.getMembers(orgId),
    enabled: !!orgId,
  });
}

// Update member role mutation
export function useUpdateMemberRole(orgId: string, memberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberRoleRequest) =>
      memberApi.updateMemberRole(orgId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all(orgId) });
    },
  });
}

// Remove member mutation
export function useRemoveMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => memberApi.removeMember(orgId, memberId),
    onMutate: async (memberId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: memberKeys.all(orgId) });

      // Snapshot previous value
      const previousMembers = queryClient.getQueryData(memberKeys.all(orgId));

      // Optimistically remove member
      queryClient.setQueryData(memberKeys.all(orgId), (old: any) =>
        old?.filter((member: any) => member.id !== memberId)
      );

      return { previousMembers };
    },
    onError: (err, memberId, context) => {
      // Rollback on error
      if (context?.previousMembers) {
        queryClient.setQueryData(memberKeys.all(orgId), context.previousMembers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all(orgId) });
    },
  });
}
