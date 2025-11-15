import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as orgApi from '@/lib/api/organizations';
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
} from '@/lib/types';

// Query keys
export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (id: string) => ['organizations', id] as const,
  current: ['organizations', 'current'] as const,
};

// Get all organizations
export function useOrganizations() {
  return useQuery({
    queryKey: organizationKeys.all,
    queryFn: orgApi.getOrganizations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single organization
export function useOrganization(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => orgApi.getOrganization(id),
    enabled: !!id,
  });
}

// Create organization mutation
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) => orgApi.createOrganization(data),
    onMutate: async (newOrg) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: organizationKeys.all });

      // Snapshot previous value
      const previousOrgs = queryClient.getQueryData(organizationKeys.all);

      // Optimistically update with temporary ID
      queryClient.setQueryData(organizationKeys.all, (old: any) => [
        ...(old || []),
        { id: 'temp', name: newOrg.name, description: newOrg.description, memberCount: 1 },
      ]);

      return { previousOrgs };
    },
    onError: (err, newOrg, context) => {
      // Rollback on error
      if (context?.previousOrgs) {
        queryClient.setQueryData(organizationKeys.all, context.previousOrgs);
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      
      // Set current organization
      queryClient.setQueryData(organizationKeys.current, data);
    },
  });
}

// Update organization mutation
export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationRequest) => orgApi.updateOrganization(id, data),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(organizationKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}

// Switch workspace mutation
export function useSwitchWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => orgApi.switchWorkspace(orgId),
    onSuccess: async (_data, orgId) => {
      // Get the organization data and set as current
      const org = queryClient.getQueryData(organizationKeys.detail(orgId));
      if (org) {
        queryClient.setQueryData(organizationKeys.current, org);
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

// Get current active organization
export function useCurrentOrganization() {
  return useQuery({
    queryKey: organizationKeys.current,
    queryFn: async () => {
      // Get from cache or fetch first org
      const orgs = await orgApi.getOrganizations();
      return orgs[0] || null;
    },
    staleTime: Infinity, // Don't refetch automatically
  });
}
