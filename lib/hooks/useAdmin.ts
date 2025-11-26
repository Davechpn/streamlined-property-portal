import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/lib/api/admin';
import type { OrganizationStatus, UserStatus } from '@/lib/types';

// Query keys
export const adminKeys = {
  stats: ['admin', 'stats'] as const,
  organizations: (filters?: any) => ['admin', 'organizations', filters] as const,
  users: (filters?: any) => ['admin', 'users', filters] as const,
  activities: (filters?: any) => ['admin', 'activities', filters] as const,
};

// Platform stats
export function usePlatformStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: adminApi.getPlatformStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// All organizations
export function useAllOrganizations(filters?: any) {
  return useQuery({
    queryKey: adminKeys.organizations(filters),
    queryFn: () => adminApi.getAllOrganizations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Update organization status
export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, status }: { orgId: string; status: OrganizationStatus }) =>
      adminApi.updateOrganizationStatus(orgId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
    },
  });
}

// All users
export function useAllUsers(filters?: any) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: () => adminApi.getAllUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Update user status
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
    },
  });
}

// Admin activities
export function useAdminActivities(filters?: any) {
  return useQuery({
    queryKey: adminKeys.activities(filters),
    queryFn: () => adminApi.getAdminActivities(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
