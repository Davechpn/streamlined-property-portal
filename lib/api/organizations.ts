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

interface OrganizationsListResponse {
  success: boolean;
  message: string;
  organizations: Organization[];
  errors: any[];
}

// Get all organizations for current user
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const response = await apiClient.get<OrganizationsListResponse>('/organizations');
    // Normalize userRole to lowercase
    const organizations = response.data.organizations.map(org => ({
      ...org,
      userRole: org.userRole?.toLowerCase() as any
    }));
    return organizations;
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
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    
    // API returns organization data directly, not wrapped
    const orgData = response.data;
    
    // Normalize role to lowercase to match Role type
    const userRole = orgData.userRole?.toLowerCase() as any;
    
    return {
      organization: {
        ...orgData,
        userRole
      },
      members: [],
      pendingInvitations: [],
      userRole,
      permissions: {} as any,
    };
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
    const response = await apiClient.post<{ success: boolean; organization: Organization; message: string }>('/organizations', data);
    Sentry.addBreadcrumb({
      category: 'organization',
      message: 'Organization created',
      data: { name: data.name },
    });
    return response.data.organization;
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
    // Use PUT method as per API specification
    const response = await apiClient.put<Organization>(`/organizations/${id}`, data);
    
    Sentry.addBreadcrumb({
      category: 'organization',
      message: 'Organization updated',
      data: { org_id: id },
    });
    
    // API returns organization data directly
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_action: 'update_organization', org_id: id },
    });
    throw error;
  }
}
