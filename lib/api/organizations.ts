import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationDetailResponse,
} from '@/lib/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Get all organizations for current user
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const response = await apiClient.get<ApiResponse<Organization[]>>('/organizations');
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_organizations' },
    });
    throw error;
  }
}

// Get single organization details
export async function getOrganization(id: string): Promise<OrganizationDetailResponse> {
  try {
    const response = await apiClient.get<ApiResponse<OrganizationDetailResponse>>(`/organizations/${id}`);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'get_organization', org_id: id },
    });
    throw error;
  }
}

// Create new organization
export async function createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
  try {
    const response = await apiClient.post<ApiResponse<Organization>>('/organizations', data);
    Sentry.addBreadcrumb({
      category: 'organization',
      message: 'Organization created',
      data: { name: data.name },
    });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'create_organization' },
    });
    throw error;
  }
}

// Update organization
export async function updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
  try {
    const response = await apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}`, data);
    Sentry.addBreadcrumb({
      category: 'organization',
      message: 'Organization updated',
      data: { org_id: id },
    });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'update_organization', org_id: id },
    });
    throw error;
  }
}

// Switch active workspace
export async function switchWorkspace(orgId: string): Promise<void> {
  try {
    await apiClient.post(`/organizations/${orgId}/switch`);
    Sentry.addBreadcrumb({
      category: 'organization',
      message: 'Workspace switched',
      data: { org_id: orgId },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'switch_workspace', org_id: orgId },
    });
    throw error;
  }
}
