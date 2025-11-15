import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type { Activity } from '@/lib/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface ActivityFilters {
  type?: string;
  actorId?: string;
  limit?: number;
  offset?: number;
}

// Get activities for an organization
export async function getActivities(
  orgId: string,
  filters?: ActivityFilters
): Promise<Activity[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.actorId) params.append('actorId', filters.actorId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const url = `/organizations/${orgId}/activities${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<Activity[]>>(url);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_activities', org_id: orgId },
    });
    throw error;
  }
}

// Log a new activity (called automatically by other actions, but can be manual too)
export async function logActivity(
  orgId: string,
  data: {
    type: string;
    metadata?: Record<string, any>;
  }
): Promise<Activity> {
  try {
    const response = await apiClient.post<ApiResponse<Activity>>(
      `/organizations/${orgId}/activities`,
      data
    );
    Sentry.addBreadcrumb({
      category: 'activity',
      message: `Activity logged: ${data.type}`,
      data: { org_id: orgId },
    });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'log_activity', org_id: orgId },
    });
    throw error;
  }
}
