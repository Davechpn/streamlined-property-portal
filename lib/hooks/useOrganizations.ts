import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as orgApi from '@/lib/api/organizations';
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  Organization,
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
    mutationFn: async (orgId: string) => {
      // Get the organization data from the list
      const orgs = queryClient.getQueryData<Organization[]>(organizationKeys.all);
      const org = orgs?.find(o => o.id === orgId);
      
      if (!org) {
        throw new Error('Organization not found');
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('currentOrganizationId', orgId);
      
      return org;
    },
    onSuccess: (org) => {
      // Update the current organization in cache
      queryClient.setQueryData(organizationKeys.current, org);
      
      // Invalidate related queries to refetch with new context
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

// Get current active organization
export function useCurrentOrganization() {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: organizationKeys.current,
    queryFn: async () => {
      // First check if we have a stored organization ID
      const storedOrgId = localStorage.getItem('currentOrganizationId');
      
      // Get all organizations
      const orgs = await orgApi.getOrganizations();
      
      if (!orgs || orgs.length === 0) {
        return null;
      }
      
      // Try to find the stored organization
      if (storedOrgId) {
        const storedOrg = orgs.find(o => o.id === storedOrgId);
        if (storedOrg) {
          return storedOrg;
        }
      }
      
      // Fall back to first organization and store it
      const firstOrg = orgs[0];
      localStorage.setItem('currentOrganizationId', firstOrg.id);
      return firstOrg;
    },
    staleTime: Infinity, // Don't refetch automatically
  });
}
