import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type {
  Organization,
  OrganizationStatus,
  User,
  UserStatus,
  AdminActivity,
  PlatformAdminDashboardResponse,
  OrganizationFilters,
  UserFilters,
  AdminActivityFilters,
} from '@/lib/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ============================================================================
// Platform Stats
// ============================================================================

export async function getPlatformStats(): Promise<PlatformAdminDashboardResponse> {
  try {
    const response = await apiClient.get<ApiResponse<PlatformAdminDashboardResponse>>('/admin/stats');
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_platform_stats' },
    });
    throw error;
  }
}

// ============================================================================
// Organization Management
// ============================================================================

export async function getAllOrganizations(filters?: OrganizationFilters): Promise<Organization[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const url = `/admin/organizations${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<Organization[]>>(url);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_all_organizations' },
    });
    throw error;
  }
}

export async function updateOrganizationStatus(
  orgId: string,
  status: OrganizationStatus
): Promise<Organization> {
  try {
    const response = await apiClient.patch<ApiResponse<Organization>>(
      `/admin/organizations/${orgId}/status`,
      { status }
    );
    Sentry.addBreadcrumb({
      category: 'admin',
      message: `Organization status updated: ${status}`,
      data: { org_id: orgId },
    });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'update_org_status', org_id: orgId },
    });
    throw error;
  }
}

// ============================================================================
// User Management
// ============================================================================

export async function getAllUsers(filters?: UserFilters): Promise<User[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const url = `/admin/users${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<User[]>>(url);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_all_users' },
    });
    throw error;
  }
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<User> {
  try {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/admin/users/${userId}/status`,
      { status }
    );
    Sentry.addBreadcrumb({
      category: 'admin',
      message: `User status updated: ${status}`,
      data: { user_id: userId },
    });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'update_user_status', user_id: userId },
    });
    throw error;
  }
}

// ============================================================================
// Admin Activity
// ============================================================================

export async function getAdminActivities(filters?: AdminActivityFilters): Promise<AdminActivity[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.activityType) params.append('activityType', filters.activityType);
    if (filters?.adminId) params.append('adminId', filters.adminId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const url = `/admin/activities${params.toString() ? `?${params}` : ''}`;
    const response = await apiClient.get<ApiResponse<AdminActivity[]>>(url);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_admin_activities' },
    });
    throw error;
  }
}
