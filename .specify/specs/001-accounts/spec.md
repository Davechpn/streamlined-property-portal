# Feature Specification: Accounts Module & Landing Page

**Feature Branch**: `001-accounts`  
**Created**: 2025-11-15  
**Status**: Draft  
**Input**: User description: "accounts module for user authentication, organization management, role-based access control, and platform administration - with landing page for the property portal dashboard"

## Clarifications

### Constitution Compliance
- Using Next.js 16 (App Router) with TypeScript
- Using TanStack Query for data fetching and state management
- Using shadcn/ui components, preferably component blocks from official registry
- Maintaining consistent casing (PascalCase for components, camelCase for utilities)
- Using Sentry for monitoring at essential authentication and authorization points
- Maintaining clean folder structure without duplicate files

### Session 2025-11-15
- Q: What are the specific platform admin role types and their permissions? → A: Operations Admin (system management), Customer Support Admin (user/org assistance), Business Admin (compensation & reporting)
- Q: Are organization names globally unique across the platform or scoped to individual users? → A: Globally unique across entire platform (no two organizations can have same name)
- Q: What is the specific tiered bonus structure for platform admin compensation? → A: Scaled tiers: 1-10 orgs=$30 each, 11-25=$50 each, 26+=$75 each (monthly)
- Q: How is the initial super admin account securely created during system setup? → A: Database seeding script with hardcoded initial super admin during setup
- Q: What are the OTP retry limits and rate limiting rules to prevent SMS abuse? → A: 5 OTP requests per phone number per 15 minutes, 3 verification attempts per OTP

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Landing Page & Initial Navigation (Priority: P1)

Visitors can access a professional landing page showcasing the property portal platform, with clear calls-to-action to sign up or sign in.

**Why this priority**: First impression is critical - without an effective landing page, users won't understand the value proposition or know how to get started. This is the entry point for all users.

**Independent Test**: Can be fully tested by visiting the root URL, viewing the landing page content, navigating through sections, and clicking sign-up/sign-in buttons to reach authentication pages.

**Acceptance Scenarios**:

1. **Given** a visitor arrives at the platform URL, **When** they view the landing page, **Then** they see a professional hero section with value proposition, feature highlights, and clear CTA buttons
2. **Given** a visitor is on the landing page, **When** they click "Get Started" or "Sign Up", **Then** they are directed to the registration page
3. **Given** a visitor is on the landing page, **When** they click "Sign In", **Then** they are directed to the login page
4. **Given** a visitor scrolls through the landing page, **When** they view different sections, **Then** they see features, benefits, testimonials (placeholders), and pricing information (if applicable)
5. **Given** a visitor is on mobile device, **When** they view the landing page, **Then** all content is responsive and properly formatted for mobile viewing

---

### User Story 2 - User Authentication & Account Creation (Priority: P1)

Users can sign up and sign in using Google OAuth, email/password, or phone number with OTP verification to access the property management platform dashboard.

**Why this priority**: Core functionality - without authentication, no other dashboard features are accessible. This provides immediate value by allowing users to create accounts and access the platform.

**Independent Test**: Can be fully tested by registering a new account with either Google, email/password, or phone number, then signing in with the same method, and accessing the dashboard.

**Acceptance Scenarios**:

1. **Given** a new user visits the sign-up page, **When** they choose to sign up with Google, **Then** they are authenticated via Google OAuth and a user account is created with their Google email and they are redirected to dashboard
2. **Given** a new user visits the sign-up page, **When** they choose to sign up with email and password, **Then** they create an account with email verification sent, and can access the dashboard immediately (email verification required for password reset)
3. **Given** a new user visits the sign-up page, **When** they choose to sign up with phone number, **Then** they receive an OTP via SMS valid for 10 minutes, verify it, a user account is created, and they are redirected to dashboard
4. **Given** an existing user with Google authentication, **When** they visit the sign-in page, **Then** they can sign in with Google without re-entering credentials and receive a 7-day session
5. **Given** an existing user with email/password authentication, **When** they visit the sign-in page, **Then** they enter their email and password and receive a 7-day session (or 1 hour if not using "remember me")
6. **Given** an existing user with phone authentication, **When** they visit the sign-in page, **Then** they enter their phone number, receive a 10-minute OTP, authenticate, and receive a 7-day session
7. **Given** a user authenticated via any method, **When** they access their profile settings, **Then** they can add additional authentication methods and all linked methods become available for future logins
8. **Given** a user forgets their password, **When** they request a password reset from the sign-in page, **Then** they receive a secure reset link via email that expires in 24 hours
9. **Given** a user completes authentication, **When** they are redirected, **Then** Sentry logs the successful authentication event for monitoring

---

### User Story 3 - Dashboard & Organization Creation (Priority: P2)

Users can access their dashboard after authentication and create organizations (property management companies/agencies) with the creator becoming the owner.

**Why this priority**: Enables users to set up their business context and provides the foundation for multi-user collaboration. Essential for transitioning from individual to business use.

**Independent Test**: Can be tested by signing in, viewing an empty dashboard state, creating a new organization, and verifying the creator becomes the owner with access to organization settings.

**Acceptance Scenarios**:

1. **Given** a newly registered user signs in, **When** they access the dashboard, **Then** they see an empty state with a prominent "Create Organization" button
2. **Given** a user clicks "Create Organization", **When** they enter organization details, **Then** they can create a new organization with a unique name and description
3. **Given** a user creates an organization, **When** the organization is created, **Then** they are automatically assigned as the organization owner and redirected to the organization dashboard
4. **Given** an organization owner, **When** they access organization settings, **Then** they can update organization name, description, and other basic settings using shadcn form components
5. **Given** a user belongs to multiple organizations, **When** they are in the dashboard, **Then** they see a workspace switcher (shadcn dropdown or command menu) to select which organization context to work in
6. **Given** a user switches organizations, **When** they select a different workspace, **Then** the dashboard updates to show the selected organization's data within 2 seconds

---

### User Story 4 - Team Member Invitations (Priority: P2)

Organization owners and admins can invite team members via email or phone number with role assignments and 14-day expiration using intuitive invitation UI.

**Why this priority**: Enables collaboration by allowing multiple users to work within the same organization. Critical for business users who need to delegate and collaborate.

**Independent Test**: Can be tested by accessing the team management page, sending an invitation to a new email/phone, having the recipient accept it via a unique link, and verifying they join the organization with the correct role.

**Acceptance Scenarios**:

1. **Given** an organization admin, **When** they access the team management page, **Then** they see a list of current members and an "Invite Member" button
2. **Given** an admin clicks "Invite Member", **When** they fill in email or phone number and select a role, **Then** an invitation is created and sent to the recipient with a 14-day expiration
3. **Given** an invitation is sent, **When** the recipient receives the notification, **Then** they get a unique invitation link that directs them to the acceptance page
4. **Given** a user receives an organization invitation, **When** they click the invitation link within 14 days, **Then** they are added to that organization with the assigned role (creating account if needed)
5. **Given** an invitation has been sent, **When** 14 days pass without acceptance, **Then** the invitation expires automatically and shows as "Expired" in the invitations list
6. **Given** an admin views pending invitations, **When** they access the invitations list, **Then** they can revoke pending invitations before they expire
7. **Given** an admin views the team page, **When** they see invitation statuses, **Then** invitations are clearly marked as "Pending", "Accepted", "Expired", or "Revoked" with visual indicators

---

### User Story 5 - Role-Based Access Control (Priority: P2)

Users have different permissions within organizations based on their assigned roles (Owner, Admin, Manager, Agent, Viewer) with clear UI indication of their permissions.

**Why this priority**: Essential for security and proper business workflow. Prevents unauthorized access and ensures users can only perform actions appropriate to their role.

**Independent Test**: Can be tested by assigning different roles to users and verifying each role can only access permitted features while being blocked from restricted actions with clear UI feedback.

**Acceptance Scenarios**:

1. **Given** a user is assigned an "Agent" role in an organization, **When** they attempt to access team management, **Then** the system blocks access and shows a message explaining their role doesn't permit member management
2. **Given** a user has "Admin" role in one organization and "Agent" role in another, **When** they switch workspaces, **Then** their available menu items and actions change according to their role in the active organization
3. **Given** a Manager views the organization dashboard, **When** they access property management features, **Then** they have full access, but member management and organization settings are hidden or disabled
4. **Given** an organization owner, **When** they access team management, **Then** they can assign roles to members, change any member's role, or remove members from the organization
5. **Given** a Viewer accesses the dashboard, **When** they attempt any modification, **Then** all edit buttons and forms are disabled with tooltips explaining read-only access
6. **Given** any user accesses a restricted feature, **When** authorization fails, **Then** Sentry logs the unauthorized access attempt for security monitoring

---

### User Story 6 - Platform Administration Dashboard (Priority: P3)

Super admins can access a platform administration dashboard to manage the entire platform, view all organizations, assign platform admin roles, and track admin activities for compensation.

**Why this priority**: Required for platform operations and business model (compensating platform admins). Lower priority as it's not customer-facing but essential for business operations.

**Independent Test**: Can be tested by accessing the platform admin dashboard with super admin credentials, viewing all organizations, performing trackable activities, and verifying compensation tracking works correctly.

**Acceptance Scenarios**:

1. **Given** a super admin signs in, **When** they access the navigation menu, **Then** they see a "Platform Admin" option that regular users don't see
2. **Given** a super admin accesses the platform admin dashboard, **When** the dashboard loads, **Then** they see a global view of all organizations, total users, and key system metrics
3. **Given** a super admin is viewing all organizations, **When** they select an organization from the list, **Then** they can view and manage that organization's details, members, and settings
4. **Given** a super admin wants to grant platform admin access, **When** they access the admin roles section and assign a platform admin role to a user, **Then** that user gains access to the platform admin dashboard with specified permissions
5. **Given** a platform admin onboards a new organization, **When** the onboarding is complete, **Then** the system creates a trackable activity record visible in the compensation report
6. **Given** a super admin reviews platform admin activities, **When** they access the activity report page, **Then** they see all tracked activities with timestamps, admins responsible, compensation values, and filtering options
7. **Given** a Business Admin views compensation reports, **When** they access the reports section, **Then** they see calculated compensation using tiered structure (1-10 orgs=$30, 11-25=$50, 26+=$75) with monthly breakdowns
8. **Given** any critical platform admin action occurs, **When** the action completes, **Then** Sentry logs the action for audit and monitoring purposes

---

### Edge Cases

- What happens when a user tries to create an organization with a name that already exists globally on the platform? → Show clear error message, suggest alternatives
- How does the system handle when a user tries to sign up with a phone number or email already in use? → Show error message indicating account exists, offer sign-in or password reset
- What happens if a user is removed from an organization while actively using it? → Detect session invalidation, redirect to dashboard with notification, refresh workspace switcher
- How are orphaned organizations handled if the only owner leaves? → Prevent owner removal if they're the last owner, require owner transfer first
- What happens if authentication provider (Google) is temporarily unavailable? → Show error message, offer alternative authentication methods, log error to Sentry
- What happens if a platform admin is demoted or deactivated? → Maintain previous activity records, remove admin dashboard access, show message on next login
- How does the system prevent super admin accounts from being accidentally deleted or locked out? → Require special confirmation, maintain at least one active super admin, audit all super admin changes
- What happens if multiple platform admins onboard the same organization simultaneously? → Use optimistic locking or timestamps to attribute to first completer, log conflict to Sentry
- How are compensation disputes handled when activities are attributed to the wrong admin? → Super admins can correct attribution with audit trail, original and corrected admin are notified
- What happens when a user tries to access the dashboard without being authenticated? → Redirect to sign-in page with return URL preserved
- How does the landing page handle slow network connections? → Progressive loading with skeleton states, optimized images, critical CSS inline
- What happens if OTP SMS fails to deliver? → Provide resend option after 60 seconds, log delivery failures to Sentry, show support contact if repeated failures

## Requirements *(mandatory)*

### Functional Requirements

#### Landing Page (FR-LAND)
- **FR-LAND-001**: System MUST display a professional landing page at the root URL (/) with hero section showcasing the property portal
- **FR-LAND-002**: Landing page MUST include clear value proposition describing the platform's benefits
- **FR-LAND-003**: Landing page MUST include prominent "Sign Up" and "Sign In" call-to-action buttons in hero section
- **FR-LAND-004**: Landing page MUST display key features section highlighting main platform capabilities
- **FR-LAND-005**: Landing page MUST be fully responsive across mobile, tablet, and desktop viewports
- **FR-LAND-006**: Landing page MUST use shadcn/ui components, preferably component blocks (e.g., hero blocks, feature blocks)
- **FR-LAND-007**: Landing page MUST implement smooth scrolling between sections
- **FR-LAND-008**: Landing page MUST include a navigation header with links to key sections and auth CTAs
- **FR-LAND-009**: Landing page MUST load critical content within 2 seconds on standard connections
- **FR-LAND-010**: Landing page MUST use optimized images via next/image component

#### Authentication UI (FR-AUTH-UI)
- **FR-AUTH-UI-001**: System MUST provide a dedicated sign-up page (/signup) with authentication method selection
- **FR-AUTH-UI-002**: System MUST provide a dedicated sign-in page (/signin) with authentication method selection
- **FR-AUTH-UI-003**: Sign-up page MUST offer three authentication methods: Google OAuth, Email/Password, Phone/OTP using shadcn form components
- **FR-AUTH-UI-004**: Sign-in page MUST offer authentication via any previously registered method for the user
- **FR-AUTH-UI-005**: System MUST display clear loading states during authentication process
- **FR-AUTH-UI-006**: System MUST show validation errors inline on form fields using shadcn form validation
- **FR-AUTH-UI-007**: System MUST provide "Forgot Password" link on sign-in page directing to password reset flow
- **FR-AUTH-UI-008**: Password reset page MUST display form to enter email address using shadcn input components
- **FR-AUTH-UI-009**: System MUST show success message after sending password reset email
- **FR-AUTH-UI-010**: System MUST provide "Remember Me" checkbox on sign-in page extending session to 7 days
- **FR-AUTH-UI-011**: OTP verification page MUST display countdown timer showing remaining time (10 minutes)
- **FR-AUTH-UI-012**: OTP verification page MUST provide "Resend OTP" button disabled for 60 seconds after sending
- **FR-AUTH-UI-013**: System MUST display rate limit warnings when OTP request limits are reached
- **FR-AUTH-UI-014**: System MUST redirect authenticated users to dashboard after successful sign-in

#### Authentication Backend (FR-AUTH)
- **FR-AUTH-001**: System MUST support user authentication via Google OAuth (Sign in with Google)
- **FR-AUTH-002**: System MUST support user authentication via phone number with OTP verification
- **FR-AUTH-003**: System MUST support user authentication via email and password
- **FR-AUTH-004**: System MUST send OTP to phone numbers via SMS for phone-based authentication
- **FR-AUTH-005**: System MUST validate OTP codes within 10 minutes of generation
- **FR-AUTH-006**: System MUST invalidate OTP codes after successful use or after 10-minute expiration
- **FR-AUTH-007**: System MUST limit OTP requests to 5 per phone number per 15-minute period
- **FR-AUTH-008**: System MUST allow maximum 3 verification attempts per OTP code
- **FR-AUTH-009**: System MUST enforce password complexity requirements (minimum 8 characters, uppercase, lowercase, digit)
- **FR-AUTH-010**: System MUST hash passwords using secure hashing algorithms
- **FR-AUTH-011**: System MUST send email verification links upon registration with email/password
- **FR-AUTH-012**: System MUST support password reset functionality with secure tokens
- **FR-AUTH-013**: System MUST expire password reset tokens after 24 hours
- **FR-AUTH-014**: System MUST store email, phone number, and authentication methods for each user
- **FR-AUTH-015**: System MUST allow users to authenticate using any linked authentication method
- **FR-AUTH-016**: System MUST prevent duplicate accounts for the same email address
- **FR-AUTH-017**: System MUST prevent duplicate accounts for the same phone number
- **FR-AUTH-018**: System MUST maintain secure session management with configurable session duration
- **FR-AUTH-019**: System MUST provide "remember me" functionality extending sessions to 7 days (default 1 hour)
- **FR-AUTH-020**: System MUST support account lockout after 5 failed login attempts within 15 minutes
- **FR-AUTH-021**: System MUST log all authentication events to Sentry for security monitoring

#### Dashboard UI (FR-DASH)
- **FR-DASH-001**: System MUST provide a main dashboard page (/dashboard) accessible only to authenticated users
- **FR-DASH-002**: Dashboard MUST display user information in header (name, avatar, current organization)
- **FR-DASH-003**: Dashboard MUST show empty state with "Create Organization" CTA when user has no organizations using shadcn empty state components
- **FR-DASH-004**: Dashboard MUST display organization-specific content when user has active organization
- **FR-DASH-005**: Dashboard MUST include workspace switcher component (shadcn dropdown or command palette) for users with multiple organizations
- **FR-DASH-006**: Dashboard MUST display navigation sidebar with role-appropriate menu items using shadcn sidebar components
- **FR-DASH-007**: Dashboard MUST highlight current active section in navigation
- **FR-DASH-008**: Dashboard MUST show user's role badge in appropriate locations
- **FR-DASH-009**: Dashboard MUST include sign-out functionality in user menu
- **FR-DASH-010**: Dashboard layout MUST use shadcn layout components (preferably sidebar blocks from registry)

#### Organization Management UI (FR-ORG-UI)
- **FR-ORG-UI-001**: System MUST provide organization creation modal/page with form for name and description using shadcn dialog and form components
- **FR-ORG-UI-002**: Organization creation form MUST validate name uniqueness and show inline error if name exists
- **FR-ORG-UI-003**: System MUST provide organization settings page accessible to Owner and Admin roles
- **FR-ORG-UI-004**: Organization settings page MUST use shadcn form components with sections for basic info, members, and advanced settings
- **FR-ORG-UI-005**: System MUST show loading skeleton states while fetching organization data using shadcn skeleton components
- **FR-ORG-UI-006**: Workspace switcher MUST display organization names, user's role, and last active timestamp
- **FR-ORG-UI-007**: Workspace switcher MUST include "Create Organization" option at the bottom
- **FR-ORG-UI-008**: System MUST show confirmation dialog (shadcn alert dialog) before sensitive organization actions

#### Organization Backend (FR-ORG)
- **FR-ORG-001**: Users MUST be able to create new organizations with globally unique names across the entire platform
- **FR-ORG-002**: System MUST assign the creating user as the organization owner automatically
- **FR-ORG-003**: System MUST support users belonging to multiple organizations simultaneously
- **FR-ORG-004**: System MUST provide workspace switching functionality for users with multiple organization memberships
- **FR-ORG-005**: System MUST maintain active workspace context for each user session
- **FR-ORG-006**: System MUST record the last active timestamp for each organization whenever any member performs an action
- **FR-ORG-007**: System MUST store organization profile data including name, description, and settings
- **FR-ORG-008**: System MUST use TanStack Query for organization data fetching and caching

#### Team Management UI (FR-TEAM-UI)
- **FR-TEAM-UI-001**: System MUST provide team management page (/dashboard/team) showing current members and pending invitations
- **FR-TEAM-UI-002**: Team page MUST display members in a table/list using shadcn table or card components
- **FR-TEAM-UI-003**: Member list MUST show name, email/phone, role, join date, and last active timestamp
- **FR-TEAM-UI-004**: System MUST provide "Invite Member" button opening invitation dialog (shadcn dialog component)
- **FR-TEAM-UI-005**: Invitation dialog MUST include fields for email/phone, role selection (shadcn select), and optional message
- **FR-TEAM-UI-006**: System MUST display pending invitations section with status badges (shadcn badge component)
- **FR-TEAM-UI-007**: Each pending invitation MUST show invitee contact, role, sent date, expiration countdown, and "Revoke" button
- **FR-TEAM-UI-008**: System MUST provide role change dropdown for each member (shadcn dropdown menu) accessible to Owner/Admin
- **FR-TEAM-UI-009**: System MUST provide "Remove Member" action with confirmation dialog
- **FR-TEAM-UI-010**: Team page MUST be accessible only to users with Owner or Admin roles
- **FR-TEAM-UI-011**: System MUST show loading states while sending invitations or updating roles

#### Invitation System (FR-INVITE)
- **FR-INVITE-001**: Authorized users (Owner, Admin) MUST be able to invite new members to their organization by email or phone number
- **FR-INVITE-002**: System MUST create invitation records with inviter, invitee contact, organization, assigned role, and 14-day expiration date
- **FR-INVITE-003**: System MUST send invitation notifications via email (for email invites) or SMS (for phone invites)
- **FR-INVITE-004**: Invitation notifications MUST include unique invitation link with token
- **FR-INVITE-005**: System MUST provide invitation acceptance page (/invitations/[token]) with invitation details
- **FR-INVITE-006**: Invitees MUST be able to accept invitations within 14 days and be added to the organization
- **FR-INVITE-007**: System MUST handle invitations to existing users by adding them to the organization
- **FR-INVITE-008**: System MUST handle invitations to new users by directing them to sign-up with pre-filled data
- **FR-INVITE-009**: System MUST track invitation status (pending, accepted, expired, revoked)
- **FR-INVITE-010**: Authorized users MUST be able to revoke pending invitations
- **FR-INVITE-011**: System MUST automatically expire invitations 14 days after creation
- **FR-INVITE-012**: System MUST prevent acceptance of expired invitations with clear error message
- **FR-INVITE-013**: System MUST prevent duplicate active invitations to the same contact for the same organization

#### Role-Based Access Control UI (FR-RBAC-UI)
- **FR-RBAC-UI-001**: System MUST display user's current role badge prominently in dashboard header
- **FR-RBAC-UI-002**: System MUST conditionally show/hide navigation menu items based on user's role
- **FR-RBAC-UI-003**: System MUST disable action buttons for unauthorized actions with tooltips explaining permission requirements
- **FR-RBAC-UI-004**: System MUST show "Access Denied" message (shadcn alert component) when user attempts unauthorized actions
- **FR-RBAC-UI-005**: System MUST display role information tooltip (shadcn tooltip) explaining role capabilities
- **FR-RBAC-UI-006**: Role selection dropdown MUST display role descriptions when hovering over options

#### Role-Based Access Control Backend (FR-RBAC)
- **FR-RBAC-001**: System MUST enforce role-based permissions for all organization-scoped actions
- **FR-RBAC-002**: System MUST support five role types: Owner, Admin, Manager, Agent, and Viewer
- **FR-RBAC-003**: System MUST define role permissions as follows:
  - **Owner**: Full control including organization deletion, billing, owner transfer, member management, and all lower permissions
  - **Admin**: Manage members (invite, remove, change roles), organization settings, and all lower permissions
  - **Manager**: Manage properties (create, update, delete), assign agents, and all lower permissions
  - **Agent**: Basic property operations (view assigned properties, update status, communicate with tenants)
  - **Viewer**: Read-only access to organization data
- **FR-RBAC-004**: System MUST apply role permissions based on the user's role in their currently active organization
- **FR-RBAC-005**: System MUST prevent users from performing actions beyond their role permissions
- **FR-RBAC-006**: System MUST log unauthorized access attempts to Sentry for security monitoring

#### Platform Administration UI (FR-ADMIN-UI)
- **FR-ADMIN-UI-001**: System MUST provide platform admin navigation menu item visible only to platform admins
- **FR-ADMIN-UI-002**: System MUST provide platform admin dashboard page (/admin) with overview metrics
- **FR-ADMIN-UI-003**: Platform admin dashboard MUST display total organizations, total users, and system health metrics
- **FR-ADMIN-UI-004**: System MUST provide organizations list page with search and filtering using shadcn table with filters
- **FR-ADMIN-UI-005**: System MUST provide organization detail view showing all organization data and members
- **FR-ADMIN-UI-006**: System MUST provide admin roles management page to assign/revoke platform admin roles
- **FR-ADMIN-UI-007**: Admin roles page MUST use shadcn form components with role type selection and permission checkboxes
- **FR-ADMIN-UI-008**: System MUST provide activity tracking dashboard with filtering by admin, date range, activity type
- **FR-ADMIN-UI-009**: Activity dashboard MUST display compensation calculations with tiered breakdown
- **FR-ADMIN-UI-010**: System MUST provide audit trail viewer with search and export functionality
- **FR-ADMIN-UI-011**: All platform admin pages MUST use consistent layout with admin-specific navigation

#### Platform Administration Backend (FR-ADMIN)
- **FR-ADMIN-001**: System MUST support a super admin role with unrestricted access to all organizations and system functions
- **FR-ADMIN-002**: System MUST provide platform admin dashboard data accessible only to users with platform admin roles
- **FR-ADMIN-003**: Super admins MUST be able to view and manage all organizations across the platform
- **FR-ADMIN-004**: Super admins MUST be able to assign platform admin roles to users with configurable permissions
- **FR-ADMIN-005**: System MUST support three platform admin role types: Operations Admin (system management and configuration), Customer Support Admin (user and organization assistance), and Business Admin (compensation tracking and reporting)
- **FR-ADMIN-006**: System MUST prevent platform admin users from being regular members of customer organizations
- **FR-ADMIN-007**: System MUST log all platform admin actions to Sentry for audit and monitoring

#### Activity Tracking & Compensation (FR-ACTIVITY)
- **FR-ACTIVITY-001**: System MUST track all platform admin actions that are relevant for compensation calculation
- **FR-ACTIVITY-002**: System MUST record organization onboarding activities with admin identity, timestamp, and organization details
- **FR-ACTIVITY-003**: System MUST record property creation activities with admin identity, timestamp, organization, and property details
- **FR-ACTIVITY-004**: Super admins MUST be able to view comprehensive activity reports for all platform admins
- **FR-ACTIVITY-005**: System MUST provide filtering and aggregation of activities by admin, date range, activity type, and organization
- **FR-ACTIVITY-006**: System MUST calculate compensation using a tiered bonus model: 1-10 organizations at $30 each, 11-25 organizations at $50 each, 26+ organizations at $75 each (calculated monthly per platform admin)
- **FR-ACTIVITY-007**: Activity records MUST be immutable once created to ensure audit integrity
- **FR-ACTIVITY-008**: System MUST support activity attribution correction only by super admins with audit trail
- **FR-ACTIVITY-009**: System MUST display compensation calculations in admin dashboard with monthly breakdowns

#### Audit Trail (FR-AUDIT)
- **FR-AUDIT-001**: System MUST create audit trail entries for all platform admin actions
- **FR-AUDIT-002**: Audit trail entries MUST include timestamp, admin identity, action type, affected resources, IP address, and result status
- **FR-AUDIT-003**: System MUST record audit trails for: role assignments, permission changes, organization management, user account modifications, system configuration changes
- **FR-AUDIT-004**: Audit trails MUST be immutable and stored securely
- **FR-AUDIT-005**: Super admins MUST be able to search and filter audit trails by admin, action type, date range, and affected resources
- **FR-AUDIT-006**: System MUST retain audit trails for 3 years from creation date
- **FR-AUDIT-007**: System MUST export audit trails in CSV, JSON, and PDF formats for compliance reporting
- **FR-AUDIT-008**: Audit trail viewer MUST use shadcn data table components with sorting and filtering

#### Data Fetching & State Management (FR-DATA)
- **FR-DATA-001**: System MUST use TanStack Query for all API data fetching
- **FR-DATA-002**: System MUST implement optimistic updates for user actions (role changes, invitations)
- **FR-DATA-003**: System MUST cache organization data to minimize API calls
- **FR-DATA-004**: System MUST implement query invalidation on relevant mutations
- **FR-DATA-005**: System MUST show loading states using shadcn skeleton components during data fetching
- **FR-DATA-006**: System MUST show error states using shadcn alert components when queries fail
- **FR-DATA-007**: System MUST implement retry logic for failed queries
- **FR-DATA-008**: System MUST prefetch organization data on workspace switch

#### Monitoring & Error Tracking (FR-MONITOR)
- **FR-MONITOR-001**: System MUST integrate Sentry for error tracking and monitoring
- **FR-MONITOR-002**: System MUST log all authentication events to Sentry (success, failure, lockout)
- **FR-MONITOR-003**: System MUST log authorization failures to Sentry
- **FR-MONITOR-004**: System MUST log platform admin actions to Sentry
- **FR-MONITOR-005**: System MUST log critical errors (payment processing, data corruption) to Sentry
- **FR-MONITOR-006**: System MUST include user context in Sentry events (user ID, organization ID, role)
- **FR-MONITOR-007**: System MUST set up Sentry performance monitoring for page loads and API calls

### Key Entities

- **User**: Represents an individual person using the platform. Key attributes: unique identifier, name, email (nullable initially), phone number (nullable initially), profile photo, password hash (for email/password auth), email verification status, phone verification status, authentication methods used, last active timestamp, account creation date, account status, platform admin role (if applicable).

- **Organization**: Represents a property management company or agency. Key attributes: unique identifier, globally unique name, description, owner reference, last active timestamp, creation date, organization status, onboarded by (platform admin reference if applicable).

- **OrganizationMember**: Represents the relationship between a user and an organization. Key attributes: user reference, organization reference, role (Owner/Admin/Manager/Agent/Viewer), membership status (active/inactive/pending), joined date, invited by reference.

- **Invitation**: Represents a pending invitation to join an organization. Key attributes: unique identifier, unique token for acceptance link, inviter (user reference), invitee contact (email or phone), organization reference, assigned role, invitation status (pending/accepted/expired/revoked), created date, expiration date (created date + 14 days), acceptance date.

- **PlatformAdminRole**: Represents platform admin role assignments. Key attributes: unique identifier, user reference, role type (Super Admin/Operations Admin/Customer Support Admin/Business Admin), permissions array, assigned by (super admin reference), assigned date, status (active/inactive).

- **AdminActivity**: Represents tracked activities performed by platform admins for compensation purposes. Key attributes: unique identifier, admin user reference, activity type (org_onboarding/property_creation/etc.), timestamp, organization reference (if applicable), resource references (property, user, etc.), metadata (JSON), compensation value (calculated based on tier), verification status.

- **AuditTrail**: Represents immutable audit log entries for platform admin actions. Key attributes: unique identifier, admin user reference, action type, timestamp, affected resources (array), IP address, user agent, request details (JSON), result status (success/failure), before/after state snapshots (JSON).

- **Session**: Represents user authentication sessions. Key attributes: session ID, user reference, organization reference (active workspace), created at, expires at, remember me flag, device information, IP address.

## Success Criteria *(mandatory)*

### Landing Page Metrics
- Landing page loads within 2 seconds on standard 4G connection (Lighthouse score 90+)
- 70% of landing page visitors click through to sign-up or sign-in within 30 seconds
- Landing page achieves 95+ accessibility score on Lighthouse
- Landing page is fully functional and visually correct on mobile, tablet, and desktop viewports

### User Adoption & Authentication
- Users can complete account creation within 2 minutes using any authentication method
- Authentication success rate of 99% or higher for all methods (Google, email/password, phone/OTP)
- 95% of invited users successfully join their organizations within 14 days
- Password reset completion rate of 90% or higher
- Account lockout false positive rate below 0.1%

### Dashboard & Organization Management
- Dashboard loads within 1 second after authentication for users with active organizations
- Workspace switching completes in under 2 seconds
- Organization creation completes in under 30 seconds including validation
- 90% of users successfully create their first organization without support assistance

### Team Collaboration
- Invitation delivery success rate of 98% or higher via email and SMS
- Invitation acceptance flow completes in under 3 minutes for new users
- Role changes take effect immediately without requiring user re-login
- 85% of organizations invite at least one additional team member within first week

### Security & Compliance
- Zero unauthorized access incidents through role-based permissions
- 100% of platform admin actions are logged in audit trails
- All audit trails are exportable in required formats (CSV, JSON, PDF) within 30 seconds
- Sentry captures 100% of authentication failures, authorization failures, and critical errors
- Average time to detect security incidents is under 5 minutes via Sentry alerts

### Platform Operations
- Platform admins can onboard new organizations in under 10 minutes
- Activity tracking captures 100% of compensation-relevant actions with accurate attribution
- Super admins can generate activity reports for any time period within 60 seconds
- Compensation calculations are accurate to within $0.01
- Audit trail search returns results in under 2 seconds for any query

### User Experience
- All UI interactions provide immediate feedback (loading states, success messages, errors)
- Error messages are clear and actionable, guiding users to resolution
- Forms validate in real-time with helpful inline error messages
- All components are fully keyboard accessible
- Screen reader compatibility for all key user flows
- Mobile experience maintains feature parity with desktop

### Technical Performance
- TanStack Query cache hit rate above 70% for organization data
- API response times stay under 200ms for P95
- Zero N+1 query problems in production
- Bundle size stays under 300KB for initial page load
- All images use next/image with proper optimization
- All shadcn components render without hydration errors

## Assumptions

- SMS gateway service is available and reliable for OTP delivery
- Google OAuth service maintains 99.9% uptime for authentication
- Users have access to email or SMS for receiving invitations and verification
- Platform will start with a single super admin account created via database seeding script during system initialization
- Organization names are globally unique across the platform (enforced at database level)
- Users can belong to unlimited organizations simultaneously
- Platform admin compensation is calculated monthly based on tracked activities
- Audit trail storage can accommodate 3-year retention requirements with automatic archival
- Initial platform admin role types include Operations Admin, Customer Support Admin, and Business Admin
- Backend API already exists or will be developed in parallel (this spec focuses on frontend dashboard)
- Email service provider is configured and operational
- Domain is configured with proper DNS and SSL certificates
- Hosting platform supports Next.js 16 with App Router features

## Dependencies

### External Services
- SMS service provider (e.g., Twilio, AWS SNS) for OTP delivery
- Google OAuth 2.0 integration for social authentication
- Email service provider (e.g., SendGrid, AWS SES) for invitation delivery and verification emails
- Sentry account and project for error tracking and monitoring

### Backend API
- RESTful or GraphQL API providing authentication endpoints
- Organization management endpoints
- Team and invitation management endpoints
- Role-based access control enforcement
- Platform admin endpoints
- Activity tracking and audit trail endpoints
- Real-time session validation

### Frontend Dependencies
- Next.js 16 with App Router
- React 19
- TypeScript 5
- TanStack Query for data fetching and state management
- shadcn/ui component library (preferably using component blocks from registry)
- lucide-react for icons
- Tailwind CSS for styling
- Sentry SDK for Next.js

### Development Tools
- Node.js 18+ for development
- Package manager (npm, yarn, or pnpm)
- Git for version control
- ESLint for code quality
- TypeScript compiler

## Security Requirements

### Authentication Security
- System MUST encrypt sensitive data at rest and in transit (HTTPS only)
- System MUST implement rate limiting on authentication attempts (5 OTP requests per phone per 15 minutes, 3 attempts per OTP, 5 login attempts per 15 minutes)
- System MUST log all authentication events to Sentry for security audit purposes
- System MUST use secure, httpOnly cookies for session management
- System MUST implement CSRF protection for all state-changing operations
- System MUST validate and sanitize all user inputs
- Super admin accounts MUST use multi-factor authentication (MFA)
- Password reset tokens MUST be single-use and expire after 24 hours

### Authorization Security
- System MUST enforce role-based access control on both frontend and backend
- System MUST validate user permissions on every API request
- System MUST prevent privilege escalation attacks
- System MUST log all authorization failures to Sentry
- Platform admin access MUST be restricted to specific IP ranges when configured
- Session tokens MUST be invalidated on logout and role changes

### Data Protection & Privacy
- System MUST comply with GDPR requirements for data protection and user privacy
- System MUST provide data subject access request (DSAR) functionality for GDPR compliance
- System MUST support right to erasure (right to be forgotten) per GDPR requirements
- System MUST encrypt personal identifiable information (PII) in database
- System MUST mask sensitive data in logs and error messages
- System MUST implement data access audit trails

### Frontend Security
- System MUST implement Content Security Policy (CSP) headers
- System MUST prevent XSS attacks through proper input sanitization
- System MUST prevent clickjacking through X-Frame-Options headers
- System MUST validate and sanitize all data rendered in UI
- System MUST not expose sensitive data in client-side storage
- System MUST implement proper CORS policies

## Data Retention

- System MUST retain user activity logs for 3 years
- System MUST retain audit trails for 3 years with automatic archival after 1 year
- System MUST retain expired invitations for 90 days before permanent deletion
- System MUST provide 30-day grace period for deleted user accounts before permanent data deletion
- System MUST anonymize rather than delete user data when account deletion would break referential integrity (e.g., activity records, audit trails)
- System MUST automatically clean up expired sessions after 30 days
- System MUST archive inactive organizations (no activity for 2 years) with ability to restore

## Constraints

- Landing page and authentication pages MUST work without JavaScript (progressive enhancement preferred)
- Dashboard MUST support all modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile viewports MUST be fully functional down to 320px width
- All features MUST be accessible via keyboard navigation
- All components MUST meet WCAG 2.1 AA accessibility standards
- Initial page load MUST complete within 3 seconds on 3G connection
- Application bundle size MUST not exceed 500KB (compressed)
- Database queries MUST complete within 100ms for p95
- API endpoints MUST respond within 200ms for p95
- System MUST handle up to 10,000 concurrent users
- File uploads (profile photos) MUST be limited to 5MB
- Organization names MUST be limited to 100 characters
- User sessions MUST expire after configured duration (1 hour default, 7 days with remember me)

## Non-Functional Requirements

### Performance
- First Contentful Paint (FCP) under 1.5 seconds
- Largest Contentful Paint (LCP) under 2.5 seconds
- Cumulative Layout Shift (CLS) under 0.1
- First Input Delay (FID) under 100ms
- Time to Interactive (TTI) under 3.5 seconds

### Scalability
- System architecture MUST support horizontal scaling
- Static assets MUST be served via CDN
- Database queries MUST use proper indexing
- API MUST implement pagination for list endpoints

### Reliability
- System uptime MUST be 99.9% or higher
- System MUST gracefully handle service degradation
- System MUST implement automatic retry for transient failures
- System MUST provide meaningful error messages to users

### Maintainability
- Code MUST follow Next.js and React best practices
- Components MUST be reusable and well-documented
- All functions MUST have clear, single responsibilities
- TypeScript MUST be used throughout with proper types
- Code MUST be organized in clean, logical folder structure
- No duplicate code or files with same functionality

### Usability
- All user flows MUST be intuitive and require minimal training
- Error messages MUST be clear and actionable
- Loading states MUST be shown for all async operations
- Success feedback MUST be provided for all actions
- Help text and tooltips MUST be available for complex features
- Forms MUST provide real-time validation feedback

## Future Considerations

While not part of this specification, consider these for future phases:

- Multi-factor authentication (MFA) for all users (not just super admins)
- Social authentication with additional providers (Microsoft, Apple)
- Advanced organization settings (custom branding, subdomain)
- Organization templates for quick setup
- Batch member invitation via CSV upload
- Advanced role customization (custom permissions)
- Activity dashboard for regular users (non-admin)
- Organization transfer workflow
- API keys for programmatic access
- Webhook support for integrations
- Advanced audit trail visualization
- Automated compliance reporting
- Mobile app for dashboard access
- Offline support for critical features
- Real-time collaboration features (presence indicators, live updates)
- Advanced search across organizations
- Data export for organization owners
- Integration marketplace

---

**Next Steps**: 
1. Review this specification with stakeholders
2. Run `/speckit.plan` to create detailed implementation plan
3. Run `/speckit.tasks` to break down into actionable tasks
4. Begin implementation with `/speckit.implement`
