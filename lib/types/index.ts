/**
 * TypeScript Type Definitions for Accounts Module
 * 
 * This file contains all TypeScript interfaces and types
 * used throughout the accounts module frontend.
 * 
 * Import these types in components and hooks:
 * import type { User, Organization, Role } from '@/lib/types';
 */

// ============================================================================
// Core Entity Types
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  profilePhotoUrl: string | null;
  authenticationMethods: string[];
  lastActiveAt: string;
  createdAt: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  platformAdminRole?: PlatformAdminRole | null;
}

export interface ProfileResponse {
  user: User;
  organizations: OrganizationMembership[];
  activeSessions: any[];
  permissions: Record<string, any>;
}

export type AuthMethod = 'google' | 'email' | 'phone';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  timezone: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  userRole?: Role;
  joinedAt?: string;
  memberCount?: number;
}

export interface OrganizationSettings {
  allowPublicSignup: boolean;
  defaultMemberRole: Role;
}

export type OrganizationStatus = 'active' | 'inactive' | 'archived';

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  status: MemberStatus;
  joinedAt: Date;
  invitedBy: string | null;
  lastActive: Date;
  user?: User;
  organization?: Organization;
}

export type Role = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';

export type MemberStatus = 'active' | 'inactive' | 'pending';

export interface Invitation {
  id: string;
  token: string;
  inviterId: string;
  inviteeContact: string;
  organizationId: string;
  assignedRole: Role;
  message: string | null;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  revokedBy: string | null;
  inviter?: User;
  organization?: Organization;
}

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

// Organization Membership from API response
export interface OrganizationMembership {
  id: string;
  organizationId: string;
  organizationName: string;
  user: User;
  organization: Organization;
  role: Role;
  status: string;
  joinedAt: string;
  updatedAt: string;
  isActive: boolean;
}

// ============================================================================
// Organization Activity & Audit Types
// ============================================================================

export interface Activity {
  id: string;
  organizationId: string;
  actorId: string;
  type: ActivityEventType;
  metadata: Record<string, any>;
  createdAt: Date;
  actor: {
    id: string;
    name: string;
    email: string | null;
  };
}

export type ActivityEventType =
  | 'member.invited'
  | 'member.joined'
  | 'member.removed'
  | 'member.role_changed'
  | 'organization.created'
  | 'organization.updated'
  | 'invitation.sent'
  | 'invitation.accepted'
  | 'invitation.revoked';

// ============================================================================
// Platform Admin Types
// ============================================================================

export interface PlatformAdminRole {
  id: string;
  userId: string;
  roleType: PlatformAdminType;
  permissions: PlatformAdminPermission[];
  assignedBy: string;
  assignedAt: Date;
  status: AdminRoleStatus;
  user?: User;
}

export type PlatformAdminType =
  | 'super_admin'
  | 'operations_admin'
  | 'customer_support_admin'
  | 'business_admin';

export type PlatformAdminPermission =
  | 'view_all_organizations'
  | 'manage_organizations'
  | 'assign_admin_roles'
  | 'view_activities'
  | 'view_audit_trails'
  | 'view_compensation'
  | 'export_data'
  | 'system_configuration';

export type AdminRoleStatus = 'active' | 'inactive';

export interface AdminActivity {
  id: string;
  adminId: string;
  activityType: ActivityType;
  timestamp: Date;
  organizationId: string | null;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, any>;
  compensationValue: number;
  verificationStatus: VerificationStatus;
  admin?: User;
  organization?: Organization;
}

export type ActivityType =
  | 'org_onboarding'
  | 'property_creation'
  | 'user_support'
  | 'system_configuration';

export type VerificationStatus = 'pending' | 'verified' | 'disputed' | 'corrected';

export interface AuditTrail {
  id: string;
  adminId: string;
  actionType: AuditActionType;
  timestamp: Date;
  affectedResources: AffectedResource[];
  ipAddress: string;
  userAgent: string;
  requestDetails: Record<string, any>;
  resultStatus: 'success' | 'failure';
  beforeState: Record<string, any> | null;
  afterState: Record<string, any> | null;
  admin?: User;
}

export interface AffectedResource {
  resourceType: string;
  resourceId: string;
  changes: string[];
}

export type AuditActionType =
  | 'role_assignment'
  | 'role_revocation'
  | 'permission_change'
  | 'organization_created'
  | 'organization_updated'
  | 'organization_deleted'
  | 'user_suspended'
  | 'user_reactivated'
  | 'system_config_change'
  | 'compensation_adjustment';

export interface Session {
  id: string;
  userId: string;
  organizationId: string | null;
  createdAt: Date;
  expiresAt: Date;
  rememberMe: boolean;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  user?: User;
  organization?: Organization;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  organizations: OrganizationMembership[];
}

export interface SessionInfo {
  id: string;
  expiresAt: Date;
  rememberMe: boolean;
}

export interface UserProfileResponse {
  user: User;
  organizations: OrganizationMembershipInfo[];
  platformAdminRole: PlatformAdminRole | null;
}

export interface OrganizationMembershipInfo {
  organization: Organization;
  role: Role;
  joinedAt: Date;
  lastActive: Date;
}

export interface OrganizationDetailResponse {
  organization: Organization;
  members: OrganizationMemberWithUser[];
  pendingInvitations: InvitationWithDetails[];
  userRole: Role;
  permissions: OrganizationPermissions;
}

export interface OrganizationMemberWithUser {
  id: string;
  userId: string;
  name: string;
  userName: string;
  email: string;
  role: Role;
  status: string;
  joinedAt: string;
}

export interface OrganizationPermissions {
  canManageMembers: boolean;
  canEditOrganization: boolean;
  canDeleteOrganization: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canChangeRoles: boolean;
}

export interface InvitationListResponse {
  pending: InvitationWithDetails[];
  accepted: InvitationWithDetails[];
  expired: InvitationWithDetails[];
  revoked: InvitationWithDetails[];
}

export interface InvitationWithDetails {
  id: string;
  organizationId: string;
  organizationName: string;
  inviterName: string;
  email: string | null;
  phoneNumber: string | null;
  role: Role;
  message: string | null;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
  daysRemaining: number;
}

export interface PlatformAdminDashboardResponse {
  metrics: {
    totalOrganizations: number;
    totalUsers: number;
    activeUsers: number;
    newOrganizationsThisMonth: number;
    newUsersThisMonth: number;
  };
  recentOrganizations: Organization[];
  recentActivities: AdminActivityWithDetails[];
}

export interface AdminActivityReportResponse {
  activities: AdminActivityWithDetails[];
  compensation: CompensationSummary;
  pagination: PaginationInfo;
}

export interface AdminActivityWithDetails {
  id: string;
  admin: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
  activityType: ActivityType;
  timestamp: Date;
  organization: {
    id: string;
    name: string;
  } | null;
  compensationValue: number;
  verificationStatus: VerificationStatus;
}

export interface CompensationSummary {
  adminId: string;
  adminName: string;
  period: {
    start: Date;
    end: Date;
  };
  tierBreakdown: {
    tier1: { count: number; rate: number; total: number };
    tier2: { count: number; rate: number; total: number };
    tier3: { count: number; rate: number; total: number };
  };
  totalCompensation: number;
}

export interface AuditTrailResponse {
  entries: AuditTrailWithDetails[];
  pagination: PaginationInfo;
}

export interface AuditTrailWithDetails {
  id: string;
  admin: {
    id: string;
    name: string;
  };
  actionType: AuditActionType;
  timestamp: Date;
  affectedResources: AffectedResource[];
  resultStatus: 'success' | 'failure';
  ipAddress: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  organizationName: string;
  organizationDescription?: string;
  website?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OTPRequestRequest {
  phoneNumber: string;
}

export interface OTPVerifyRequest {
  phoneNumber: string;
  code: string;
}

export interface PasswordResetRequestRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name: string;
  profilePhotoUrl?: string | null;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  website?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
  settings?: Partial<OrganizationSettings>;
}

export interface InviteMemberRequest {
  inviteeContact: string;
  role: Role;
  message?: string;
}

export interface UpdateMemberRoleRequest {
  role: Role;
}

export interface AssignAdminRoleRequest {
  userId: string;
  roleType: Exclude<PlatformAdminType, 'super_admin'>;
  permissions: PlatformAdminPermission[];
}

export interface CorrectActivityRequest {
  newAdminId: string;
  reason: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

export interface ErrorResponse {
  error: APIError;
}

// ============================================================================
// Query Filter Types
// ============================================================================

export interface OrganizationFilters {
  status?: OrganizationStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface InvitationFilters {
  status?: InvitationStatus;
}

export interface MemberFilters {
  role?: Role;
  status?: MemberStatus;
}

export interface UserFilters {
  status?: UserStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AdminOrganizationFilters {
  page?: number;
  pageSize?: number;
  status?: OrganizationStatus;
  search?: string;
}

export interface AdminActivityFilters {
  activityType?: ActivityType;
  adminId?: string;
  organizationId?: string;
  limit?: number;
  offset?: number;
}

export interface AdminActivityFilters {
  adminId?: string;
  activityType?: ActivityType;
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface AuditTrailFilters {
  adminId?: string;
  actionType?: AuditActionType;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface AuthFormState {
  method: 'email' | 'phone' | 'google';
  isLoading: boolean;
  error: string | null;
}

export interface OTPState {
  isRequesting: boolean;
  isVerifying: boolean;
  expiresAt: Date | null;
  retriesRemaining: number;
  error: string | null;
}

export interface WorkspaceContext {
  activeOrganization: Organization | null;
  organizations: OrganizationMembershipInfo[];
  isLoading: boolean;
}

export interface PermissionContext {
  canInviteMembers: boolean;
  canEditOrg: boolean;
  canDeleteOrg: boolean;
  canManageMembers: boolean;
  canChangeRoles: boolean;
  canManageProperties: boolean;
  canViewOnly: boolean;
  role: Role | null;
}

// ============================================================================
// Utility Types
// ============================================================================

export type SortDirection = 'asc' | 'desc';

export interface SortState<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface TableState<T> {
  data: T[];
  isLoading: boolean;
  error: APIError | null;
  sort: SortState<T> | null;
  filters: Record<string, any>;
}

// ============================================================================
// Constants
// ============================================================================

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  agent: 'Agent',
  viewer: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Full control including organization deletion and billing',
  admin: 'Manage members, settings, and all lower permissions',
  manager: 'Manage properties, assign agents, and view reports',
  agent: 'Basic property operations and tenant communication',
  viewer: 'Read-only access to organization data',
};

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  expired: 'Expired',
  revoked: 'Revoked',
};

export const ADMIN_ROLE_LABELS: Record<PlatformAdminType, string> = {
  super_admin: 'Super Admin',
  operations_admin: 'Operations Admin',
  customer_support_admin: 'Customer Support Admin',
  business_admin: 'Business Admin',
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  org_onboarding: 'Organization Onboarding',
  property_creation: 'Property Creation',
  user_support: 'User Support',
  system_configuration: 'System Configuration',
};

export const COMPENSATION_TIERS = {
  tier1: { min: 1, max: 10, rate: 30 },
  tier2: { min: 11, max: 25, rate: 50 },
  tier3: { min: 26, max: Infinity, rate: 75 },
} as const;
