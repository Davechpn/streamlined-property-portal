# Data Model: Accounts Module & Landing Page

**Date**: 2025-11-15  
**Spec**: [spec.md](./spec.md)

## TypeScript Interfaces

### User Entity

```typescript
interface User {
  id: string; // UUID
  name: string;
  email: string | null; // Nullable - user might use phone-only auth
  phoneNumber: string | null; // E.164 format, nullable - user might use email-only auth
  profilePhoto: string | null; // URL to uploaded photo
  emailVerified: boolean;
  phoneVerified: boolean;
  authMethods: AuthMethod[]; // List of linked auth methods
  lastActive: Date;
  createdAt: Date;
  status: UserStatus;
  platformAdminRole?: PlatformAdminRole | null; // Only present for platform admins
}

type AuthMethod = 'google' | 'email' | 'phone';

type UserStatus = 'active' | 'inactive' | 'suspended';
```

### Organization Entity

```typescript
interface Organization {
  id: string; // UUID
  name: string; // Globally unique, case-insensitive
  slug: string; // URL-friendly version
  description: string | null;
  ownerId: string; // User ID of owner
  logoUrl: string | null;
  settings: OrganizationSettings;
  lastActive: Date;
  createdAt: Date;
  status: OrganizationStatus;
  onboardedBy: string | null; // Platform admin ID if onboarded by admin
}

interface OrganizationSettings {
  allowPublicSignup: boolean;
  defaultMemberRole: Role;
  // Future settings can be added here
}

type OrganizationStatus = 'active' | 'inactive' | 'archived';
```

### OrganizationMember Entity

```typescript
interface OrganizationMember {
  id: string; // UUID
  userId: string;
  organizationId: string;
  role: Role;
  status: MemberStatus;
  joinedAt: Date;
  invitedBy: string | null; // User ID of inviter
  lastActive: Date;
  // Populated relations (for UI)
  user?: User;
  organization?: Organization;
}

type Role = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';

type MemberStatus = 'active' | 'inactive' | 'pending';
```

### Invitation Entity

```typescript
interface Invitation {
  id: string; // UUID
  token: string; // Unique token for acceptance URL
  inviterId: string; // User ID who sent invite
  inviteeContact: string; // Email or phone number
  organizationId: string;
  assignedRole: Role;
  message: string | null; // Optional message from inviter
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date; // createdAt + 14 days
  acceptedAt: Date | null;
  revokedAt: Date | null;
  revokedBy: string | null; // User ID who revoked
  // Populated relations
  inviter?: User;
  organization?: Organization;
}

type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';
```

### PlatformAdminRole Entity

```typescript
interface PlatformAdminRole {
  id: string; // UUID
  userId: string;
  roleType: PlatformAdminType;
  permissions: PlatformAdminPermission[];
  assignedBy: string; // Super admin user ID
  assignedAt: Date;
  status: AdminRoleStatus;
  // Populated relations
  user?: User;
}

type PlatformAdminType = 
  | 'super_admin' 
  | 'operations_admin' 
  | 'customer_support_admin' 
  | 'business_admin';

type PlatformAdminPermission = 
  | 'view_all_organizations'
  | 'manage_organizations'
  | 'assign_admin_roles'
  | 'view_activities'
  | 'view_audit_trails'
  | 'view_compensation'
  | 'export_data'
  | 'system_configuration';

type AdminRoleStatus = 'active' | 'inactive';
```

### AdminActivity Entity

```typescript
interface AdminActivity {
  id: string; // UUID
  adminId: string; // Platform admin user ID
  activityType: ActivityType;
  timestamp: Date;
  organizationId: string | null; // Null for system-level activities
  resourceType: string | null; // 'property', 'user', 'organization', etc.
  resourceId: string | null;
  metadata: Record<string, any>; // Flexible JSON metadata
  compensationValue: number; // Calculated based on tier ($30/$50/$75)
  verificationStatus: VerificationStatus;
  // Populated relations
  admin?: User;
  organization?: Organization;
}

type ActivityType = 
  | 'org_onboarding'
  | 'property_creation'
  | 'user_support'
  | 'system_configuration';

type VerificationStatus = 'pending' | 'verified' | 'disputed' | 'corrected';
```

### AuditTrail Entity

```typescript
interface AuditTrail {
  id: string; // UUID
  adminId: string; // Platform admin user ID
  actionType: AuditActionType;
  timestamp: Date;
  affectedResources: AffectedResource[];
  ipAddress: string;
  userAgent: string;
  requestDetails: Record<string, any>;
  resultStatus: 'success' | 'failure';
  beforeState: Record<string, any> | null;
  afterState: Record<string, any> | null;
  // Populated relations
  admin?: User;
}

interface AffectedResource {
  resourceType: string; // 'user', 'organization', 'role', etc.
  resourceId: string;
  changes: string[]; // List of changed fields
}

type AuditActionType = 
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
```

### Session Entity

```typescript
interface Session {
  id: string; // Session ID (stored in httpOnly cookie)
  userId: string;
  organizationId: string | null; // Active workspace, can be null if no org yet
  createdAt: Date;
  expiresAt: Date;
  rememberMe: boolean;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  // Populated relations
  user?: User;
  organization?: Organization;
}

interface DeviceInfo {
  browser: string;
  os: string;
  device: string; // 'mobile', 'tablet', 'desktop'
}
```

## Relationships

### User Relationships
- User 1:N OrganizationMember (a user can be member of many organizations)
- User 1:N Invitation (as inviter)
- User 1:1 PlatformAdminRole (optional, only for platform admins)
- User 1:N AdminActivity (as platform admin)
- User 1:N AuditTrail (as platform admin)
- User 1:N Session (can have multiple active sessions)

### Organization Relationships
- Organization 1:N OrganizationMember (an organization has many members)
- Organization 1:N Invitation (invitations to join the organization)
- Organization 1:1 User (via ownerId - organization owner)
- Organization 1:N AdminActivity (activities related to this org)

### OrganizationMember Relationships
- OrganizationMember N:1 User
- OrganizationMember N:1 Organization
- OrganizationMember N:1 User (via invitedBy - who invited this member)

### Invitation Relationships
- Invitation N:1 User (via inviterId)
- Invitation N:1 Organization
- Invitation N:1 User (via revokedBy, optional)

### PlatformAdminRole Relationships
- PlatformAdminRole N:1 User
- PlatformAdminRole N:1 User (via assignedBy - super admin who assigned)

### AdminActivity Relationships
- AdminActivity N:1 User (via adminId - the platform admin)
- AdminActivity N:1 Organization (optional, for org-specific activities)

### AuditTrail Relationships
- AuditTrail N:1 User (via adminId - the platform admin)

### Session Relationships
- Session N:1 User
- Session N:1 Organization (optional - active workspace)

## Validation Rules

### User Validation
- **name**: Required, 2-100 characters
- **email**: Valid email format, unique when present (case-insensitive)
- **phoneNumber**: Valid E.164 format, unique when present
- **password**: 
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 digit
  - At least 1 special character (optional but recommended)
- **profilePhoto**: 
  - Valid image URL or null
  - File types: JPEG, PNG, WebP
  - Maximum size: 5MB
  - Dimensions: 400x400 to 2000x2000 pixels (recommended square)
- **authMethods**: Must have at least one method
- **status**: Must be one of: 'active', 'inactive', 'suspended'

### Organization Validation
- **name**: 
  - Required
  - 2-100 characters
  - Globally unique (case-insensitive comparison)
  - Allowed characters: letters, numbers, spaces, hyphens, ampersands
  - Cannot start or end with whitespace
- **slug**: 
  - Auto-generated from name (lowercase, hyphens for spaces)
  - Globally unique
  - URL-safe characters only
- **description**: Optional, max 500 characters
- **ownerId**: Must be valid user ID, user must exist
- **status**: Must be one of: 'active', 'inactive', 'archived'

### OrganizationMember Validation
- **userId**: Must be valid user ID
- **organizationId**: Must be valid organization ID
- **role**: Must be one of: 'owner', 'admin', 'manager', 'agent', 'viewer'
- **status**: Must be one of: 'active', 'inactive', 'pending'
- **Constraint**: Unique combination of (userId, organizationId)
- **Business Rule**: Organization must have at least one active owner

### Invitation Validation
- **token**: 
  - Required
  - Globally unique
  - Cryptographically secure (e.g., UUID v4 or random 32-char hex)
- **inviteeContact**: 
  - Required
  - Must be valid email OR valid E.164 phone number
- **organizationId**: Must be valid organization ID
- **assignedRole**: Must be one of: 'owner', 'admin', 'manager', 'agent', 'viewer'
- **expiresAt**: Must be createdAt + 14 days
- **status**: Must be one of: 'pending', 'accepted', 'expired', 'revoked'
- **Business Rule**: Cannot have duplicate pending invitation (same contact + same org)

### PlatformAdminRole Validation
- **userId**: Must be valid user ID
- **roleType**: Must be one of: 'super_admin', 'operations_admin', 'customer_support_admin', 'business_admin'
- **permissions**: Must be valid array of PlatformAdminPermission values
- **assignedBy**: Must be valid super admin user ID
- **status**: Must be one of: 'active', 'inactive'
- **Constraint**: User can only have one active platform admin role

### AdminActivity Validation
- **adminId**: Must be valid platform admin user ID
- **activityType**: Must be one of: 'org_onboarding', 'property_creation', 'user_support', 'system_configuration'
- **timestamp**: Required, cannot be in the future
- **compensationValue**: 
  - Must be one of: $30, $50, $75 (based on tier)
  - Tier 1 (1-10 orgs): $30 per org
  - Tier 2 (11-25 orgs): $50 per org
  - Tier 3 (26+ orgs): $75 per org
- **verificationStatus**: Must be one of: 'pending', 'verified', 'disputed', 'corrected'

### AuditTrail Validation
- **adminId**: Must be valid platform admin user ID
- **actionType**: Must be valid AuditActionType
- **timestamp**: Required, cannot be in the future
- **resultStatus**: Must be 'success' or 'failure'
- **ipAddress**: Valid IPv4 or IPv6 address
- **Business Rule**: Audit trails are immutable after creation

### Session Validation
- **id**: Cryptographically secure session ID
- **userId**: Must be valid user ID
- **organizationId**: Must be valid organization ID or null
- **expiresAt**: 
  - Default: createdAt + 1 hour
  - With rememberMe: createdAt + 7 days
- **Business Rule**: Session must be validated on every protected route access

## API Response Shapes

### Authentication Response

```typescript
interface AuthResponse {
  user: User;
  session: SessionInfo; // Simplified session info (not full Session entity)
  organization: Organization | null; // User's first org or last active org
  organizations: Organization[]; // All user's organizations
}

interface SessionInfo {
  id: string;
  expiresAt: Date;
  rememberMe: boolean;
}
```

### User Profile Response

```typescript
interface UserProfileResponse {
  user: User;
  organizations: OrganizationMembershipInfo[];
  platformAdminRole: PlatformAdminRole | null;
}

interface OrganizationMembershipInfo {
  organization: Organization;
  role: Role;
  joinedAt: Date;
  lastActive: Date;
}
```

### Organization Detail Response

```typescript
interface OrganizationDetailResponse {
  organization: Organization;
  members: OrganizationMemberWithUser[];
  pendingInvitations: Invitation[];
  userRole: Role; // Current user's role in this org
  permissions: OrganizationPermissions; // What current user can do
}

interface OrganizationMemberWithUser {
  id: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phoneNumber: string | null;
    profilePhoto: string | null;
  };
  role: Role;
  status: MemberStatus;
  joinedAt: Date;
  lastActive: Date;
}

interface OrganizationPermissions {
  canManageMembers: boolean;
  canEditOrganization: boolean;
  canDeleteOrganization: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canChangeRoles: boolean;
}
```

### Invitation List Response

```typescript
interface InvitationListResponse {
  pending: InvitationWithDetails[];
  accepted: InvitationWithDetails[];
  expired: InvitationWithDetails[];
  revoked: InvitationWithDetails[];
}

interface InvitationWithDetails {
  id: string;
  inviteeContact: string;
  assignedRole: Role;
  message: string | null;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  inviter: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
  daysUntilExpiration: number; // Calculated field
}
```

### Platform Admin Dashboard Response

```typescript
interface PlatformAdminDashboardResponse {
  metrics: {
    totalOrganizations: number;
    totalUsers: number;
    activeUsers: number; // Active in last 30 days
    newOrganizationsThisMonth: number;
    newUsersThisMonth: number;
  };
  recentOrganizations: Organization[];
  recentActivities: AdminActivity[];
}
```

### Admin Activity Report Response

```typescript
interface AdminActivityReportResponse {
  activities: AdminActivityWithDetails[];
  compensation: CompensationSummary;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface AdminActivityWithDetails {
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

interface CompensationSummary {
  adminId: string;
  adminName: string;
  period: {
    start: Date;
    end: Date;
  };
  tierBreakdown: {
    tier1: { count: number; rate: number; total: number }; // 1-10 orgs @ $30
    tier2: { count: number; rate: number; total: number }; // 11-25 orgs @ $50
    tier3: { count: number; rate: number; total: number }; // 26+ orgs @ $75
  };
  totalCompensation: number;
}
```

### Audit Trail Response

```typescript
interface AuditTrailResponse {
  entries: AuditTrailWithDetails[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface AuditTrailWithDetails {
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
  // beforeState and afterState available on detail view
}
```

### Error Response

```typescript
interface ErrorResponse {
  error: {
    code: string; // e.g., 'VALIDATION_ERROR', 'UNAUTHORIZED', 'NOT_FOUND'
    message: string; // Human-readable error message
    details?: Record<string, string[]>; // Field-specific validation errors
    statusCode: number; // HTTP status code
  };
}

// Example validation error:
{
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: {
      email: ['Email is required', 'Email must be valid'],
      password: ['Password must be at least 8 characters']
    },
    statusCode: 400
  }
}
```

## Permission Matrix

### Organization-Level Permissions

| Action                     | Owner | Admin | Manager | Agent | Viewer |
|----------------------------|-------|-------|---------|-------|--------|
| View organization          | ✅    | ✅    | ✅      | ✅    | ✅     |
| Edit organization settings | ✅    | ✅    | ❌      | ❌    | ❌     |
| Delete organization        | ✅    | ❌    | ❌      | ❌    | ❌     |
| Invite members             | ✅    | ✅    | ❌      | ❌    | ❌     |
| Remove members             | ✅    | ✅    | ❌      | ❌    | ❌     |
| Change member roles        | ✅    | ✅    | ❌      | ❌    | ❌     |
| Manage properties          | ✅    | ✅    | ✅      | ❌    | ❌     |
| View properties            | ✅    | ✅    | ✅      | ✅    | ✅     |
| Assign agents              | ✅    | ✅    | ✅      | ❌    | ❌     |
| Update property status     | ✅    | ✅    | ✅      | ✅    | ❌     |
| View reports               | ✅    | ✅    | ✅      | ❌    | ✅     |

### Platform Admin Permissions

| Action                         | Super Admin | Operations | Support | Business |
|--------------------------------|-------------|------------|---------|----------|
| View all organizations         | ✅          | ✅         | ✅      | ✅       |
| Manage organizations           | ✅          | ✅         | ✅      | ❌       |
| Assign platform admin roles    | ✅          | ❌         | ❌      | ❌       |
| View activity reports          | ✅          | ❌         | ❌      | ✅       |
| View audit trails              | ✅          | ✅         | ❌      | ❌       |
| View compensation reports      | ✅          | ❌         | ❌      | ✅       |
| Export data                    | ✅          | ✅         | ✅      | ✅       |
| System configuration           | ✅          | ✅         | ❌      | ❌       |
| User account management        | ✅          | ✅         | ✅      | ❌       |
| Correct activity attribution   | ✅          | ❌         | ❌      | ❌       |

## Database Indexes (Recommendations)

### User Table
- Primary: `id` (UUID)
- Unique: `email` (case-insensitive, nullable)
- Unique: `phoneNumber` (nullable)
- Index: `status`, `createdAt`

### Organization Table
- Primary: `id` (UUID)
- Unique: `name` (case-insensitive)
- Unique: `slug`
- Index: `ownerId`, `status`, `lastActive`

### OrganizationMember Table
- Primary: `id` (UUID)
- Unique: `(userId, organizationId)`
- Index: `userId`, `organizationId`, `role`, `status`

### Invitation Table
- Primary: `id` (UUID)
- Unique: `token`
- Index: `organizationId`, `inviteeContact`, `status`, `expiresAt`
- Unique: `(inviteeContact, organizationId, status)` where `status = 'pending'`

### PlatformAdminRole Table
- Primary: `id` (UUID)
- Unique: `userId` where `status = 'active'`
- Index: `roleType`, `status`

### AdminActivity Table
- Primary: `id` (UUID)
- Index: `adminId`, `activityType`, `timestamp`, `organizationId`, `verificationStatus`
- Composite: `(adminId, timestamp)` for sorting

### AuditTrail Table
- Primary: `id` (UUID)
- Index: `adminId`, `actionType`, `timestamp`, `resultStatus`
- Composite: `(adminId, timestamp)` for sorting

### Session Table
- Primary: `id` (session ID)
- Index: `userId`, `expiresAt`
- Index: `(userId, organizationId)` for active workspace queries

## Caching Strategy

### TanStack Query Cache Times

**Frequent Updates (Short Cache)**:
- `['user']` - 30 seconds (current user data changes often)
- `['invitations', orgId]` - 1 minute (invitation status changes)
- `['admin', 'activities']` - 1 minute (real-time activity feed)

**Moderate Updates (Medium Cache)**:
- `['organizations', orgId, 'members']` - 5 minutes (members don't change often)
- `['organizations', orgId]` - 5 minutes (org settings stable)
- `['user', 'organizations']` - 5 minutes (user's org list stable)

**Infrequent Updates (Long Cache)**:
- `['admin', 'organizations']` - 10 minutes (org list for admins)
- `['admin', 'audit']` - 10 minutes (audit trails immutable)

**Stale-While-Revalidate**:
- Use `staleTime` for cache duration
- Use `cacheTime` for garbage collection (5x staleTime)
- Refetch on window focus for critical data
- Background refetch for less critical data

## Notes

- All dates should be stored in UTC and converted to user's timezone in UI
- All monetary values (compensation) stored as integers (cents) to avoid floating-point errors
- Organization names stored with original casing but queried case-insensitively
- Session IDs should be cryptographically secure (at least 128 bits of entropy)
- Invitation tokens should be cryptographically secure (at least 128 bits of entropy)
- Profile photos should be optimized (compressed, resized) on backend before storage
- Phone numbers always stored in E.164 format for consistency
- Emails always stored lowercase for consistent queries
