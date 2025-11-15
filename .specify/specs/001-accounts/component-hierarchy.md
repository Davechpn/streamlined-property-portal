# Component Hierarchy: Accounts Module & Landing Page

**Date**: 2025-11-15  
**Spec**: [spec.md](./spec.md)

## shadcn Component Block Selection

### Primary Blocks (High Priority)

#### 1. Dashboard Layout - **sidebar-07**
**Why**: "A sidebar that collapses to icons" - perfect for our dashboard
- Collapsible sidebar for better mobile experience
- Icon-only collapsed state saves screen space
- Professional, production-ready layout
- Supports role-based menu items

**Usage**:
- Main dashboard layout (`app/(dashboard)/layout.tsx`)
- Navigation items change based on user's role in active organization
- Platform admin gets additional "Platform Admin" menu section

**Installation**:
```bash
npx shadcn@latest add sidebar-07
```

**Alternative**: `sidebar-01` (simple sidebar) if sidebar-07 is too complex

#### 2. Authentication Forms - Individual Components
**Why**: No pre-built auth blocks in registry, compose from components
- Form + Input + Button + Label
- Clean, accessible forms
- Built-in validation support

**Components Needed**:
- `form` - Form wrapper with validation
- `input` - Text inputs (email, password, phone)
- `input-otp` - OTP verification input
- `button` - Submit buttons
- `label` - Form labels
- `card` - Container for auth forms
- `separator` - Visual dividers
- `alert` - Error messages

**Installation**:
```bash
npx shadcn@latest add form input input-otp button label card separator alert
```

#### 3. Landing Page - Custom with Individual Components
**Why**: No hero blocks in @shadcn registry, build custom with components
- Card - Feature cards
- Button - CTA buttons
- Badge - Feature badges

**Components Needed**:
- `button` - CTA buttons
- `card` - Feature cards
- `badge` - Feature highlights
- `navigation-menu` - Header navigation

**Installation**:
```bash
npx shadcn@latest add button card badge navigation-menu
```

### Supporting Components (Medium Priority)

#### 4. Dialogs & Modals
- `dialog` - Organization creation, invitation modal
- `alert-dialog` - Confirmation dialogs (delete, remove member)
- `sheet` - Mobile-friendly side panels

**Installation**:
```bash
npx shadcn@latest add dialog alert-dialog sheet
```

#### 5. Dropdowns & Menus
- `dropdown-menu` - Workspace switcher, user menu, role selector
- `select` - Form select fields (role selection in forms)
- `command` - Future: command palette for workspace switching (if needed)

**Installation**:
```bash
npx shadcn@latest add dropdown-menu select command
```

#### 6. Data Display
- `table` - Member list, activity list
- `badge` - Status badges (role, invitation status)
- `avatar` - User profile photos
- `skeleton` - Loading states
- `empty` - Empty states

**Installation**:
```bash
npx shadcn@latest add table badge avatar skeleton empty
```

#### 7. Feedback Components
- `sonner` - Toast notifications (success, error messages)
- `alert` - Inline errors and warnings
- `progress` - File upload progress
- `spinner` - Loading indicators

**Installation**:
```bash
npx shadcn@latest add sonner alert progress spinner
```

### Optional Components (Nice to Have)

#### 8. Advanced Features
- `tabs` - Settings page sections
- `accordion` - FAQ, collapsible sections
- `hover-card` - User info on hover
- `tooltip` - Permission explanations
- `popover` - Quick actions
- `calendar` - Date pickers (future)
- `pagination` - Paginated lists

**Installation** (as needed):
```bash
npx shadcn@latest add tabs accordion hover-card tooltip popover calendar pagination
```

## Component Architecture

### Server Components (Default)

**Landing Page** (`app/page.tsx`):
```tsx
// Server Component - Static, SEO-optimized
export default function LandingPage() {
  return (
    <>
      <Navigation /> {/* Client Component for mobile menu */}
      <Hero /> {/* Server Component */}
      <Features /> {/* Server Component */}
      <CallToAction /> {/* Server Component */}
      <Footer /> {/* Server Component */}
    </>
  );
}
```

**Dashboard Layout** (`app/(dashboard)/layout.tsx`):
```tsx
// Server Component - Renders shell
export default function DashboardLayout({ children }) {
  return (
    <DashboardShell> {/* Client Component - sidebar-07 */}
      {children}
    </DashboardShell>
  );
}
```

**Dashboard Page** (`app/(dashboard)/dashboard/page.tsx`):
```tsx
// Server Component - Initial render
export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader /> {/* Client Component - user menu, workspace switcher */}
      <DashboardContent /> {/* Client Component - data fetching */}
    </div>
  );
}
```

### Client Components ('use client')

**Interactive UI Components**:
```tsx
'use client';

// DashboardShell.tsx - sidebar-07 wrapper
// WorkspaceSwitcher.tsx - dropdown-menu
// UserMenu.tsx - dropdown-menu
// AuthForms.tsx - form components
// InvitationDialog.tsx - dialog + form
// OrgCreationDialog.tsx - dialog + form
// MemberTable.tsx - table with actions
```

**Data Fetching Components**:
```tsx
'use client';

// Use TanStack Query hooks
// DashboardContent.tsx - fetches org data
// TeamManagement.tsx - fetches members
// PlatformAdminDashboard.tsx - fetches admin data
```

## Component Structure by Feature

### 1. Landing Page

```
app/
└── page.tsx (Server Component)

components/
└── landing/
    ├── Navigation.tsx (Client - mobile menu interaction)
    ├── Hero.tsx (Server)
    ├── Features.tsx (Server)
    ├── FeatureCard.tsx (Server - uses shadcn/card)
    ├── CallToAction.tsx (Server)
    └── Footer.tsx (Server)
```

**shadcn Components Used**:
- `button` - CTA buttons
- `card` - Feature cards
- `badge` - Feature highlights
- `navigation-menu` - Header navigation

### 2. Authentication

```
app/
├── (auth)/
│   ├── layout.tsx (Server - auth page shell)
│   ├── signin/
│   │   └── page.tsx (Server - renders SignInForm)
│   ├── signup/
│   │   └── page.tsx (Server - renders SignUpForm)
│   ├── reset-password/
│   │   └── page.tsx (Server - renders ResetForm)
│   └── invitations/
│       └── [token]/
│           └── page.tsx (Server - renders InvitationAcceptance)

components/
└── auth/
    ├── SignInForm.tsx (Client - form + TanStack Query)
    ├── SignUpForm.tsx (Client - form + TanStack Query)
    ├── ResetPasswordForm.tsx (Client - form + TanStack Query)
    ├── GoogleAuthButton.tsx (Client - OAuth flow)
    ├── EmailPasswordForm.tsx (Client - email/password fields)
    ├── PhoneOTPForm.tsx (Client - phone + OTP)
    ├── OTPVerification.tsx (Client - input-otp)
    └── AuthMethodSelector.tsx (Client - method selection)
```

**shadcn Components Used**:
- `form` - Form wrapper with validation
- `input` - Email, password, phone fields
- `input-otp` - OTP verification
- `button` - Submit buttons
- `label` - Form labels
- `card` - Auth form container
- `separator` - Visual dividers
- `alert` - Error messages

### 3. Dashboard & Organization

```
app/
├── (dashboard)/
│   ├── layout.tsx (Server - renders DashboardShell)
│   ├── dashboard/
│   │   ├── page.tsx (Server - renders DashboardContent)
│   │   ├── team/
│   │   │   └── page.tsx (Server - renders TeamManagement)
│   │   └── settings/
│   │       └── page.tsx (Server - renders OrgSettings)

components/
├── dashboard/
│   ├── DashboardShell.tsx (Client - sidebar-07 wrapper)
│   ├── DashboardHeader.tsx (Client - user menu, workspace switcher)
│   ├── DashboardContent.tsx (Client - TanStack Query)
│   ├── WorkspaceSwitcher.tsx (Client - dropdown-menu)
│   ├── UserMenu.tsx (Client - dropdown-menu)
│   ├── EmptyState.tsx (Server - static, uses shadcn/empty)
│   └── Sidebar.tsx (Client - sidebar-07)
│
└── organization/
    ├── CreateOrgDialog.tsx (Client - dialog + form)
    ├── OrgSettings.tsx (Client - form + tabs)
    ├── OrgCard.tsx (Server - card)
    └── OrgList.tsx (Client - data fetching)
```

**shadcn Components Used**:
- `sidebar-07` - Main dashboard sidebar
- `dropdown-menu` - Workspace switcher, user menu
- `dialog` - Organization creation
- `form` - Organization settings
- `card` - Organization cards
- `empty` - Empty state
- `tabs` - Settings sections
- `skeleton` - Loading states

### 4. Team Management

```
app/
└── (dashboard)/
    └── dashboard/
        └── team/
            └── page.tsx (Server - renders TeamManagement)

components/
└── team/
    ├── TeamManagement.tsx (Client - TanStack Query)
    ├── MemberTable.tsx (Client - table + actions)
    ├── MemberRow.tsx (Client - table row with actions)
    ├── InviteDialog.tsx (Client - dialog + form)
    ├── PendingInvitations.tsx (Client - data fetching)
    ├── InvitationCard.tsx (Client - card + badge)
    ├── RoleSelector.tsx (Client - dropdown-menu)
    ├── RoleBadge.tsx (Server - badge)
    └── RemoveMemberDialog.tsx (Client - alert-dialog)
```

**shadcn Components Used**:
- `table` - Member list
- `dialog` - Invitation modal
- `alert-dialog` - Confirmation dialogs
- `form` - Invitation form
- `input` - Email/phone input
- `select` - Role selection (in form)
- `dropdown-menu` - Role change (in table)
- `badge` - Role badges, status badges
- `button` - Action buttons
- `card` - Invitation cards

### 5. Platform Administration

```
app/
└── (admin)/
    ├── layout.tsx (Server - admin shell)
    └── admin/
        ├── page.tsx (Server - renders AdminDashboard)
        ├── organizations/
        │   ├── page.tsx (Server - renders OrgList)
        │   └── [id]/
        │       └── page.tsx (Server - renders OrgDetail)
        ├── activities/
        │   └── page.tsx (Server - renders ActivityTracker)
        └── audit/
            └── page.tsx (Server - renders AuditTrail)

components/
└── admin/
    ├── AdminDashboard.tsx (Client - metrics + charts)
    ├── AdminLayout.tsx (Client - sidebar with admin nav)
    ├── OrgList.tsx (Client - table + filters)
    ├── OrgDetail.tsx (Client - tabs + data)
    ├── ActivityTable.tsx (Client - table + filters)
    ├── CompensationReport.tsx (Client - calculations)
    ├── AuditTrailTable.tsx (Client - table + search)
    ├── AdminRoleManager.tsx (Client - form)
    └── MetricsCard.tsx (Server - card)
```

**shadcn Components Used**:
- `sidebar-07` - Admin sidebar (different nav items)
- `table` - Organizations, activities, audit trail
- `card` - Metric cards
- `tabs` - Organization detail sections
- `badge` - Status indicators
- `select` - Filters
- `button` - Action buttons
- `pagination` - Paginated lists
- `calendar` - Date range picker
- `chart` (if using dashboard-01) - Activity charts

### 6. Shared Components

```
components/
└── ui/
    ├── [shadcn components] (installed from registry)
    └── loading.tsx (Custom global loading)

lib/
├── utils.ts (cn() utility)
└── hooks/
    ├── useAuth.ts (TanStack Query - auth state)
    ├── useUser.ts (TanStack Query - user data)
    ├── useOrganizations.ts (TanStack Query - org list)
    ├── useActiveOrganization.ts (TanStack Query - active org context)
    ├── useMembers.ts (TanStack Query - org members)
    ├── useInvitations.ts (TanStack Query - invitations)
    ├── usePermissions.ts (RBAC helper)
    └── useAdmin.ts (TanStack Query - admin data)
```

## Permission-Based Rendering

### usePermissions Hook Pattern

```typescript
// lib/hooks/usePermissions.ts
'use client';

export function usePermissions() {
  const { data: user } = useUser();
  const { data: activeOrg } = useActiveOrganization();
  
  const userRole = useMemo(() => {
    if (!user || !activeOrg) return null;
    const membership = user.organizations.find(
      (m) => m.organization.id === activeOrg.id
    );
    return membership?.role || null;
  }, [user, activeOrg]);
  
  return {
    canInviteMembers: userRole === 'owner' || userRole === 'admin',
    canEditOrg: userRole === 'owner' || userRole === 'admin',
    canDeleteOrg: userRole === 'owner',
    canManageMembers: userRole === 'owner' || userRole === 'admin',
    canChangeRoles: userRole === 'owner' || userRole === 'admin',
    canManageProperties: ['owner', 'admin', 'manager'].includes(userRole || ''),
    canViewOnly: userRole === 'viewer',
    role: userRole,
  };
}
```

### Conditional Rendering Examples

**Hide/Show Navigation Items**:
```tsx
// components/dashboard/Sidebar.tsx
'use client';

export function Sidebar() {
  const { canManageMembers, canManageProperties } = usePermissions();
  
  return (
    <SidebarNav>
      <SidebarNavItem href="/dashboard">Dashboard</SidebarNavItem>
      
      {canManageProperties && (
        <SidebarNavItem href="/dashboard/properties">Properties</SidebarNavItem>
      )}
      
      {canManageMembers && (
        <SidebarNavItem href="/dashboard/team">Team</SidebarNavItem>
      )}
    </SidebarNav>
  );
}
```

**Disable Buttons**:
```tsx
// components/team/MemberTable.tsx
'use client';

export function MemberRow({ member }) {
  const { canChangeRoles } = usePermissions();
  
  return (
    <TableRow>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <RoleSelector
          value={member.role}
          onChange={handleRoleChange}
          disabled={!canChangeRoles}
        />
        {!canChangeRoles && (
          <Tooltip content="You don't have permission to change roles">
            <InfoIcon />
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}
```

**Access Denied Component**:
```tsx
// components/shared/AccessDenied.tsx
'use client';

export function AccessDenied({ requiredRole }: { requiredRole: Role }) {
  const { role } = usePermissions();
  
  return (
    <Alert variant="destructive">
      <AlertTitle>Access Denied</AlertTitle>
      <AlertDescription>
        This action requires {requiredRole} role. Your current role is {role}.
      </AlertDescription>
    </Alert>
  );
}
```

## Loading States

### Skeleton Pattern

```tsx
// components/dashboard/DashboardContent.tsx
'use client';

export function DashboardContent() {
  const { data: organization, isLoading } = useActiveOrganization();
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (!organization) {
    return <EmptyState />;
  }
  
  return <Dashboard organization={organization} />;
}

// components/dashboard/DashboardSkeleton.tsx
export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
```

## Error States

### Error Boundary + Alert Pattern

```tsx
// components/shared/ErrorDisplay.tsx
'use client';

export function ErrorDisplay({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}

// Usage in TanStack Query
export function MemberTable() {
  const { data, error, isError } = useMembers(orgId);
  
  if (isError) {
    return <ErrorDisplay error={error} />;
  }
  
  return <Table data={data} />;
}
```

## Toast Notifications

### Sonner Integration

```tsx
// lib/hooks/useInvitations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useInviteMember(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries(['invitations', organizationId]);
    },
    onError: (error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });
}
```

## Component Installation Checklist

### Phase 1: Foundation (Required for MVP)
- [ ] `sidebar-07` - Dashboard layout
- [ ] `form` - Forms with validation
- [ ] `input` - Text inputs
- [ ] `input-otp` - OTP verification
- [ ] `button` - Buttons
- [ ] `label` - Form labels
- [ ] `card` - Cards
- [ ] `dropdown-menu` - Dropdowns
- [ ] `dialog` - Modals
- [ ] `alert-dialog` - Confirmations
- [ ] `table` - Data tables
- [ ] `badge` - Badges
- [ ] `avatar` - Avatars
- [ ] `skeleton` - Loading states
- [ ] `alert` - Alerts
- [ ] `sonner` - Toast notifications

### Phase 2: Enhancement (Post-MVP)
- [ ] `select` - Form selects
- [ ] `tabs` - Tabbed interfaces
- [ ] `empty` - Empty states
- [ ] `separator` - Separators
- [ ] `tooltip` - Tooltips
- [ ] `hover-card` - Hover cards
- [ ] `popover` - Popovers
- [ ] `pagination` - Pagination
- [ ] `calendar` - Date pickers
- [ ] `command` - Command palette (future workspace switcher upgrade)

### Phase 3: Admin Features
- [ ] `sheet` - Side panels
- [ ] `progress` - Progress bars
- [ ] `spinner` - Spinners
- [ ] `accordion` - Accordions
- [ ] `chart` (if needed) - Charts for admin dashboard

## Notes

- Prioritize shadcn component blocks (sidebar-07) over building from scratch
- Use Server Components by default, Client Components only when necessary
- All interactive components need 'use client' directive
- TanStack Query hooks must be in Client Components
- shadcn components automatically support dark mode via CSS variables
- All forms should use shadcn Form component with zod validation
- Use sonner for all toast notifications (success, error, info)
- Skeleton components for all loading states
- Alert component for all error states
- Permission checks should happen in both UI (hide/disable) and backend (enforce)
