import { useQuery } from '@tanstack/react-query';
import * as activityApi from '@/lib/api/activities';

// Query keys
export const activityKeys = {
  all: (orgId: string) => ['activities', orgId] as const,
  filtered: (orgId: string, filters?: any) => ['activities', orgId, filters] as const,
};

interface UseActivitiesOptions {
  type?: string;
  actorId?: string;
  limit?: number;
  offset?: number;
}

// Get activities for an organization
export function useActivities(orgId: string, options?: UseActivitiesOptions) {
  return useQuery({
    queryKey: activityKeys.filtered(orgId, options),
    queryFn: () => activityApi.getActivities(orgId, options),
    enabled: !!orgId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
