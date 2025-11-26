# API Contracts: Accounts Module & Landing Page

**Date**: 2025-11-15  
**Base URL**: `/api/v1` (assumed)  
**Authentication**: httpOnly cookie with session token

## Authentication Endpoints

### POST /auth/register

Register a new user account with email/password, phone/OTP, or Google OAuth.

**Request Body**:
```json
{
  "method": "email" | "phone" | "google",
  "email": "user@example.com", // Required for email method
  "password": "SecurePass123", // Required for email method
  "phoneNumber": "+1234567890", // Required for phone method
  "name": "John Doe", // Required for all methods
  "googleToken": "..." // Required for google method
}
```

**Response** (201 Created):
```json
{
  "user": { /* User object */ },
  "session": {
    "id": "session-uuid",
    "expiresAt": "2025-11-22T10:00:00Z",
    "rememberMe": false
  },
  "organization": null,
  "organizations": []
}
```

**Errors**:
- 400: Validation error (invalid email, weak password)
- 409: Email/phone already exists
- 429: Rate limit exceeded

---

### POST /auth/login

Sign in with existing credentials.

**Request Body**:
```json
{
  "method": "email" | "phone" | "google",
  "email": "user@example.com", // For email method
  "password": "SecurePass123", // For email method
  "phoneNumber": "+1234567890", // For phone method
  "googleToken": "...", // For google method
  "rememberMe": false // Optional, extends session to 7 days
}
```

**Response** (200 OK):
```json
{
  "user": { /* User object */ },
  "session": { /* SessionInfo */ },
  "organization": { /* Last active org */ },
  "organizations": [ /* Array of orgs */ ]
}
```

**Errors**:
- 401: Invalid credentials
- 423: Account locked (too many failed attempts)
- 429: Rate limit exceeded

---

### POST /auth/otp/request

Request OTP for phone authentication (register or login).

**Request Body**:
```json
{
  "phoneNumber": "+1234567890"
}
```

**Response** (200 OK):
```json
{
  "message": "OTP sent successfully",
  "expiresIn": 600, // 10 minutes in seconds
  "retriesRemaining": 2 // Remaining OTP requests in window
}
```

**Errors**:
- 429: Rate limit exceeded (5 requests per 15 minutes per phone)
- 400: Invalid phone number

---

### POST /auth/otp/verify

Verify OTP code for phone authentication.

**Request Body**:
```json
{
  "phoneNumber": "+1234567890",
  "code": "123456"
}
```

**Response** (200 OK):
```json
{
  "user": { /* User object */ },
  "session": { /* SessionInfo */ },
  "organization": { /* Org if exists */ },
  "organizations": []
}
```

**Errors**:
- 401: Invalid OTP code
- 410: OTP expired
- 423: Too many verification attempts (3 max per OTP)

---

### POST /auth/password/reset-request

Request password reset link via email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset email sent",
  "expiresIn": 86400 // 24 hours
}
```

**Note**: Always returns 200 even if email doesn't exist (security)

---

### POST /auth/password/reset

Reset password using token from email.

**Request Body**:
```json
{
  "token": "reset-token-uuid",
  "newPassword": "NewSecurePass123"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset successfully"
}
```

**Errors**:
- 401: Invalid or expired token
- 400: Weak password

---

### POST /auth/logout

Sign out and invalidate session.

**Request**: Empty body

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/me

Get current authenticated user info.

**Response** (200 OK):
```json
{
  "user": { /* User object with full details */ },
  "organizations": [ /* Array of OrganizationMembershipInfo */ ],
  "platformAdminRole": { /* PlatformAdminRole */ } | null
}
```

**Errors**:
- 401: Not authenticated

---

## Organization Endpoints

### POST /organizations

Create a new organization.

**Request Body**:
```json
{
  "name": "Acme Properties",
  "description": "A property management company"
}
```

**Response** (201 Created):
```json
{
  "organization": { /* Organization object */ },
  "member": { /* OrganizationMember with role: owner */ }
}
```

**Errors**:
- 400: Invalid name
- 409: Organization name already exists (case-insensitive)
- 401: Not authenticated

---

### GET /organizations

Get current user's organizations.

**Query Parameters**:
- `status` (optional): Filter by status (active, inactive, archived)

**Response** (200 OK):
```json
{
  "organizations": [
    {
      "organization": { /* Organization */ },
      "role": "owner",
      "joinedAt": "2025-01-01T00:00:00Z",
      "lastActive": "2025-11-15T10:00:00Z"
    }
  ]
}
```

---

### GET /organizations/:id

Get organization details with members and permissions.

**Response** (200 OK):
```json
{
  "organization": { /* Organization */ },
  "members": [ /* Array of OrganizationMemberWithUser */ ],
  "pendingInvitations": [ /* Array of Invitation */ ],
  "userRole": "admin",
  "permissions": {
    "canManageMembers": true,
    "canEditOrganization": true,
    "canDeleteOrganization": false,
    "canInviteMembers": true,
    "canRemoveMembers": true,
    "canChangeRoles": true
  }
}
```

**Errors**:
- 404: Organization not found
- 403: User is not a member of this organization

---

### PATCH /organizations/:id

Update organization settings.

**Request Body**:
```json
{
  "name": "Updated Name", // Optional
  "description": "Updated description", // Optional
  "settings": { /* OrganizationSettings */ } // Optional
}
```

**Response** (200 OK):
```json
{
  "organization": { /* Updated Organization */ }
}
```

**Errors**:
- 403: Insufficient permissions (requires admin or owner)
- 409: Organization name already exists
- 400: Invalid data

---

### DELETE /organizations/:id

Delete organization (soft delete).

**Response** (204 No Content)

**Errors**:
- 403: Only owner can delete organization
- 400: Cannot delete with active members (must remove all first)

---

### POST /organizations/:id/switch

Switch active workspace context.

**Response** (200 OK):
```json
{
  "organization": { /* Organization */ },
  "session": { /* Updated session with new organizationId */ }
}
```

**Errors**:
- 404: Organization not found
- 403: User is not a member

---

## Team & Invitation Endpoints

### POST /organizations/:id/invitations

Invite a new member to organization.

**Request Body**:
```json
{
  "inviteeContact": "user@example.com" | "+1234567890",
  "role": "admin" | "manager" | "agent" | "viewer",
  "message": "Join our team!" // Optional
}
```

**Response** (201 Created):
```json
{
  "invitation": { /* Invitation object */ }
}
```

**Errors**:
- 403: Insufficient permissions (requires admin or owner)
- 409: User already invited or is a member
- 400: Invalid contact or role

---

### GET /organizations/:id/invitations

Get organization's invitations.

**Query Parameters**:
- `status` (optional): Filter by status (pending, accepted, expired, revoked)

**Response** (200 OK):
```json
{
  "pending": [ /* Array of InvitationWithDetails */ ],
  "accepted": [ /* Array of InvitationWithDetails */ ],
  "expired": [ /* Array of InvitationWithDetails */ ],
  "revoked": [ /* Array of InvitationWithDetails */ ]
}
```

---

### DELETE /organizations/:id/invitations/:invitationId

Revoke a pending invitation.

**Response** (204 No Content)

**Errors**:
- 403: Insufficient permissions
- 404: Invitation not found
- 400: Invitation already accepted/expired

---

### GET /invitations/:token

Get invitation details by token (public endpoint).

**Response** (200 OK):
```json
{
  "invitation": { /* Invitation with organization details */ },
  "organization": { /* Organization name, description */ }
}
```

**Errors**:
- 404: Invalid or expired invitation

---

### POST /invitations/:token/accept

Accept an invitation.

**Response** (200 OK):
```json
{
  "organization": { /* Organization */ },
  "member": { /* New OrganizationMember */ }
}
```

**Errors**:
- 404: Invalid or expired invitation
- 409: User already a member
- 401: Not authenticated (must sign in/up first)

---

### GET /organizations/:id/members

Get organization members.

**Query Parameters**:
- `role` (optional): Filter by role
- `status` (optional): Filter by status

**Response** (200 OK):
```json
{
  "members": [ /* Array of OrganizationMemberWithUser */ ]
}
```

---

### PATCH /organizations/:id/members/:memberId

Update member role.

**Request Body**:
```json
{
  "role": "manager"
}
```

**Response** (200 OK):
```json
{
  "member": { /* Updated OrganizationMember */ }
}
```

**Errors**:
- 403: Insufficient permissions (requires admin or owner)
- 400: Cannot change owner role
- 400: Organization must have at least one owner

---

### DELETE /organizations/:id/members/:memberId

Remove member from organization.

**Response** (204 No Content)

**Errors**:
- 403: Insufficient permissions
- 400: Cannot remove last owner

---

## Platform Admin Endpoints

### GET /admin/dashboard

Get platform admin dashboard metrics.

**Response** (200 OK):
```json
{
  "metrics": {
    "totalOrganizations": 150,
    "totalUsers": 1200,
    "activeUsers": 890,
    "newOrganizationsThisMonth": 12,
    "newUsersThisMonth": 67
  },
  "recentOrganizations": [ /* Last 10 orgs */ ],
  "recentActivities": [ /* Last 20 activities */ ]
}
```

**Errors**:
- 403: Not a platform admin

---

### GET /admin/organizations

Get all organizations (platform admin).

**Query Parameters**:
- `page` (default: 1)
- `pageSize` (default: 20)
- `status` (optional): Filter by status
- `search` (optional): Search by name

**Response** (200 OK):
```json
{
  "organizations": [ /* Array of Organization */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

---

### GET /admin/organizations/:id

Get organization details (platform admin view).

**Response** (200 OK):
```json
{
  "organization": { /* Full Organization */ },
  "members": [ /* All members */ ],
  "activities": [ /* Related AdminActivity */ ],
  "stats": {
    "totalMembers": 8,
    "totalProperties": 45,
    "activeSince": "2025-01-01T00:00:00Z"
  }
}
```

---

### POST /admin/roles

Assign platform admin role to user.

**Request Body**:
```json
{
  "userId": "user-uuid",
  "roleType": "operations_admin" | "customer_support_admin" | "business_admin",
  "permissions": [ /* Array of PlatformAdminPermission */ ]
}
```

**Response** (201 Created):
```json
{
  "platformAdminRole": { /* PlatformAdminRole */ }
}
```

**Errors**:
- 403: Only super admins can assign roles
- 409: User already has an active platform admin role

---

### DELETE /admin/roles/:roleId

Revoke platform admin role.

**Response** (204 No Content)

**Errors**:
- 403: Only super admins can revoke roles

---

### GET /admin/activities

Get admin activity reports.

**Query Parameters**:
- `adminId` (optional): Filter by admin
- `activityType` (optional): Filter by type
- `organizationId` (optional): Filter by organization
- `startDate`, `endDate` (optional): Date range
- `page`, `pageSize`: Pagination

**Response** (200 OK):
```json
{
  "activities": [ /* Array of AdminActivityWithDetails */ ],
  "compensation": { /* CompensationSummary for filtered admin */ },
  "pagination": { /* Pagination */ }
}
```

---

### GET /admin/audit

Get audit trail entries.

**Query Parameters**:
- `adminId` (optional): Filter by admin
- `actionType` (optional): Filter by action
- `startDate`, `endDate` (optional): Date range
- `page`, `pageSize`: Pagination

**Response** (200 OK):
```json
{
  "entries": [ /* Array of AuditTrailWithDetails */ ],
  "pagination": { /* Pagination */ }
}
```

---

### GET /admin/audit/:id

Get detailed audit trail entry.

**Response** (200 OK):
```json
{
  "entry": {
    "id": "audit-uuid",
    "admin": { /* Admin user details */ },
    "actionType": "role_assignment",
    "timestamp": "2025-11-15T10:00:00Z",
    "affectedResources": [ /* Array of resources */ ],
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla...",
    "requestDetails": { /* JSON */ },
    "resultStatus": "success",
    "beforeState": { /* JSON */ },
    "afterState": { /* JSON */ }
  }
}
```

---

### POST /admin/activities/:id/correct

Correct activity attribution (super admin only).

**Request Body**:
```json
{
  "newAdminId": "correct-admin-uuid",
  "reason": "Attribution error corrected"
}
```

**Response** (200 OK):
```json
{
  "activity": { /* Updated AdminActivity */ },
  "auditEntry": { /* New audit trail entry for correction */ }
}
```

**Errors**:
- 403: Only super admins can correct attribution

---

## Upload Endpoints

### POST /uploads/profile-photo

Upload user profile photo.

**Request**: multipart/form-data
```
photo: File (JPEG, PNG, WebP, max 5MB)
```

**Response** (200 OK):
```json
{
  "url": "https://cdn.example.com/photos/user-uuid.jpg",
  "thumbnailUrl": "https://cdn.example.com/photos/user-uuid-thumb.jpg"
}
```

**Errors**:
- 400: File too large or invalid format
- 413: Payload too large

---

## Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": ["Error 1", "Error 2"]
    },
    "statusCode": 400
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limits

- **OTP Requests**: 5 per phone number per 15 minutes
- **OTP Verification**: 3 attempts per OTP code
- **Login Attempts**: 5 per account per 15 minutes
- **API Requests**: 100 per minute per user (general)
- **Search Endpoints**: 20 per minute per user

## Headers

**Required for Authenticated Requests**:
- Cookie with httpOnly session token (automatically sent by browser)

**Optional**:
- `X-Organization-Id`: Override active workspace (if user has permission)
- `X-Request-ID`: Client-generated request ID for tracing

**Response Headers**:
- `X-Rate-Limit-Limit`: Rate limit threshold
- `X-Rate-Limit-Remaining`: Remaining requests
- `X-Rate-Limit-Reset`: When rate limit resets (Unix timestamp)
