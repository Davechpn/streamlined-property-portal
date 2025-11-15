# Research: Accounts Module & Landing Page

**Date**: 2025-11-15  
**Spec**: [spec.md](./spec.md)  
**Branch**: 001-accounts

## Constitution Requirements

### Mandatory Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **UI Components**: shadcn/ui (prefer component blocks from registry)
- **Data Fetching**: TanStack Query
- **Monitoring**: Sentry
- **Styling**: Tailwind CSS
- **Icons**: lucide-react

### Conventions
- **File Naming**: 
  - PascalCase for components (e.g., `PropertyCard.tsx`, `AuthForm.tsx`)
  - camelCase for utilities (e.g., `formatPrice.ts`, `authUtils.ts`)
  - Next.js conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Component Structure**: 
  - Server Components by default (no `'use client'` directive)
  - Client Components marked with `'use client'` (only when necessary)
  - Single responsibility principle
  - Composition over inheritance
- **Folder Organization**: 
  - `app/` for routes (App Router)
  - `components/` for React components (feature-based organization)
  - `lib/` for utilities and helpers
  - `hooks/` for custom React hooks
- **No Duplication**: Reuse existing components and utilities, never duplicate code

### Component Selection Priority (CRITICAL)
1. **FIRST CHOICE**: shadcn component blocks (pre-built, full-featured compositions)
   - Examples: `sidebar-01`, `hero-section`, `login-form`, `dashboard-01`
   - View blocks: `npx shadcn@latest view @shadcn`
   - ALWAYS check for blocks before using individual components
2. **SECOND CHOICE**: Individual shadcn/ui components
   - Use when no suitable block exists
   - Common: Button, Card, Input, Form, Select, Dialog, Dropdown Menu
   - Install via: `npx shadcn@latest add [component-name]`
3. **LAST RESORT**: Custom components
   - Only when absolutely no shadcn solution exists
   - Must extend or wrap shadcn components internally

### TypeScript Standards
- Strict mode enabled
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use types for unions/intersections
- File extensions: `.tsx` for components, `.ts` for utilities

### Performance Requirements
- Code splitting via Next.js automatic splitting
- Image optimization via `next/image`
- Font optimization via `next/font`
- Dynamic imports for heavy components
- Bundle size monitoring

### Accessibility & Quality
- WCAG 2.1 AA compliance
- Semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Proper error boundaries
- Loading states for async operations

## Existing Codebase Analysis

### Current Structure
```
streamlined-property-portal/
├── app/
│   ├── favicon.ico
│   ├── globals.css       # Global styles, Tailwind directives
│   ├── layout.tsx        # Root layout with Geist fonts
│   └── page.tsx          # Home page (current landing page)
├── lib/
│   └── utils.ts          # cn() utility for className merging
├── public/               # Static assets (SVG icons)
├── components.json       # shadcn/ui configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── next.config.ts        # Next.js config
```

### Installed Dependencies
**Core**:
- `next@16.0.3` - Next.js framework
- `react@19.2.0` - React library
- `react-dom@19.2.0` - React DOM
- `typescript@^5` - TypeScript

**UI & Styling**:
- `tailwindcss@^4` - Tailwind CSS (v4)
- `lucide-react@^0.553.0` - Icon library
- `class-variance-authority@^0.7.1` - CVA for variants
- `clsx@^2.1.1` - className utility
- `tailwind-merge@^3.4.0` - Tailwind class merging
- `tw-animate-css@^1.4.0` - Tailwind animations

**Tooling**:
- `shadcn@^3.5.0` - shadcn CLI
- `eslint@^9` - Linting
- `@tailwindcss/postcss@^4` - PostCSS plugin

### shadcn/ui Configuration
**Style**: `new-york`  
**RSC**: Enabled (Server Components)  
**Base Color**: `zinc`  
**CSS Variables**: Enabled  
**Icon Library**: `lucide`  
**Aliases**:
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`
- `@/ui` → `components/ui/`

**Note**: `components/` directory doesn't exist yet - will be created when first shadcn component is added

### Reusable Code
- `lib/utils.ts`: `cn()` function for className merging (essential for shadcn components)
- `app/globals.css`: Tailwind directives and CSS variables
- `app/layout.tsx`: Root layout with Geist fonts configured

### Missing Dependencies (To Install)
Based on specification requirements:
- `@tanstack/react-query` - Data fetching and state management (CRITICAL)
- `@sentry/nextjs` - Error tracking and monitoring (CRITICAL)
- `zod` - Schema validation for forms (recommended)
- `react-hook-form` - Form management (works with shadcn forms)
- Additional shadcn components as needed

## Feature Requirements Summary

### User Scenarios (Priority Order)
1. **P1: Landing Page** - Professional landing with hero, features, CTA (skip testimonials/pricing)
2. **P1: Authentication** - Google OAuth, email/password, phone/OTP with 3 methods
3. **P2: Dashboard** - Empty state, org creation, workspace switcher (dropdown)
4. **P2: Organizations** - Create, manage, switch between orgs (case-insensitive names)
5. **P2: Team Management** - Invite members (email/SMS), 14-day expiration, role assignment
6. **P2: RBAC** - 5 roles (Owner/Admin/Manager/Agent/Viewer) with UI enforcement
7. **P3: Platform Admin** - Super admin dashboard, org management, activity tracking, compensation

### Key Entities
- **User**: Auth methods, profile, status, platform admin role
- **Organization**: Globally unique name (case-insensitive), owner, members
- **OrganizationMember**: User-org relationship with role
- **Invitation**: 14-day expiring invites with unique tokens
- **PlatformAdminRole**: Super/Operations/Support/Business admin types
- **AdminActivity**: Tracked actions for compensation (tiered: $30/$50/$75)
- **AuditTrail**: Immutable logs, 3-year retention
- **Session**: httpOnly cookie + TanStack Query cache (hybrid approach)

### Critical Dependencies
**External Services**:
- SMS provider (Twilio/AWS SNS) for OTP delivery
- Google OAuth 2.0 for social authentication
- Email service (SendGrid/AWS SES) for invitations and verification
- Sentry account for monitoring

**Backend API**:
- REST API (confirmed in clarifications)
- Authentication endpoints (register, login, OTP, password reset)
- Organization CRUD endpoints
- Team/invitation management endpoints
- RBAC enforcement
- Platform admin endpoints
- Activity tracking and audit trail endpoints

## Technical Challenges

### Challenge 1: Multi-Organization Session Management
**Description**: Users can belong to unlimited orgs, need to track "active workspace" context throughout app

**Impact**: 
- Affects all API calls (need orgId context)
- Dashboard content changes based on active org
- Permissions vary by org (user can be Owner in one, Viewer in another)
- Workspace switching must be fast (<2s) and preserve state

**Approach**:
- Store active `organizationId` in TanStack Query cache
- Create `useActiveOrganization()` hook for easy access
- Wrap API calls with active org context
- Use TanStack Query's `queryKey` scoping: `['orgs', orgId, 'members']`
- Invalidate queries on workspace switch
- Prefetch data when hovering over workspace switcher

### Challenge 2: Hybrid Session Storage (Security + Performance)
**Description**: Need secure auth tokens (httpOnly cookies) + fast user data access (TanStack Query)

**Impact**:
- Auth token must never be accessible to JavaScript (XSS protection)
- User data needs to be cached for instant UI updates
- Session validation happens on every protected route
- Logout must clear both cookie and cache

**Approach**:
- **Auth Token**: httpOnly cookie set by backend, auto-sent with requests
- **User Data**: TanStack Query cache with `useUser()` hook
- **Middleware**: Next.js middleware validates cookie, redirects if invalid
- **Logout**: API endpoint clears cookie + frontend invalidates all queries
- **Session Refresh**: Background refresh before token expiry

### Challenge 3: Role-Based UI Rendering
**Description**: Need to show/hide/disable UI elements based on user's role in active organization

**Impact**:
- Navigation items change per role
- Buttons disabled for insufficient permissions
- Forms show different fields per role
- Need clear feedback when action is blocked

**Approach**:
- Create `usePermissions()` hook: `canInviteMembers`, `canEditOrg`, etc.
- Higher-order component `<ProtectedAction>` for role checks
- Disable buttons with tooltips explaining required role
- Show `<AccessDenied>` component for blocked routes
- Log unauthorized attempts to Sentry

### Challenge 4: Invitation Flow Complexity
**Description**: Invitations must handle both existing users and new signups, with 14-day expiration

**Impact**:
- Invitation link must work for users not signed in
- Need to preserve invitation context through signup flow
- Expired invitations must show clear message
- Invitation status must update in real-time for inviter

**Approach**:
- Invitation acceptance page at `/invitations/[token]`
- Check token validity on load
- If user not signed in: redirect to signup with `?invitationToken=xxx`
- If signed in: directly add to org
- Use TanStack Query mutations for invitation actions
- Polling or WebSocket for real-time status updates (or simple refetch on focus)

### Challenge 5: Platform Admin Activity Tracking
**Description**: Accurately track admin actions for tiered compensation ($30/$50/$75 per org)

**Impact**:
- Must capture every onboarding and property creation
- Attribution conflicts if multiple admins work simultaneously
- Compensation calculations must be accurate to $0.01
- Audit trail required for disputes

**Approach**:
- Backend emits events for trackable actions
- Optimistic locking for conflict resolution
- Super admin dashboard shows activity feed with filtering
- Monthly compensation reports with tiered breakdown
- Export to CSV/JSON/PDF for accounting
- Sentry monitoring for tracking failures

### Challenge 6: Landing Page Performance
**Description**: Landing page must load in <2s on 4G, achieve Lighthouse 90+ score

**Impact**:
- First impression for all visitors
- SEO ranking affected by Core Web Vitals
- Images can slow down LCP if not optimized
- Bundle size matters for initial load

**Approach**:
- Use shadcn hero block (optimized, production-ready)
- `next/image` with proper `priority` for above-fold images
- Lazy load features section components
- Inline critical CSS
- Defer non-critical scripts
- Metadata API for SEO
- Static generation (SSG) for landing page

## Recommended Approach

### Architecture Pattern
**Next.js App Router with Server Components + TanStack Query Client State**

- **Server Components (default)**: Landing page, static sections, initial layouts
- **Client Components**: Forms, interactive UI, workspace switcher, real-time data
- **Route Groups**: `(auth)/` for auth pages, `(dashboard)/` for protected pages, `(admin)/` for platform admin
- **Middleware**: Auth validation, redirect logic
- **API Routes**: Proxy to backend (if needed), client-side mutations

### Component Strategy

**Landing Page**:
- Search shadcn registry for hero blocks: `hero-01`, `hero-02`, etc.
- Feature grid block for features section
- CTA block for bottom section
- Responsive layout with mobile-first design

**Dashboard**:
- **Primary**: `sidebar-01`, `sidebar-02`, or `sidebar-03` block (MUST research which fits best)
- Workspace switcher: shadcn Dropdown Menu (confirmed in clarifications)
- Empty state: Custom component with shadcn Card + Button
- User menu: shadcn Dropdown Menu

**Forms**:
- Auth forms: shadcn Form + Input + Button + Label
- Invitation dialog: shadcn Dialog + Form
- Organization creation: shadcn Dialog + Form + Input + Textarea

**Data Display**:
- Member table: shadcn Table component with sorting
- Activity feed: shadcn Card list
- Audit trail: shadcn Data Table (advanced)

### Data Flow

**Authentication**:
1. User submits auth form (Client Component)
2. TanStack Query mutation calls backend API
3. Backend returns auth token + user data
4. Backend sets httpOnly cookie
5. Frontend caches user data in TanStack Query
6. Redirect to dashboard

**Organization Data**:
1. Dashboard loads (Server Component renders shell)
2. Client Component fetches user's orgs via `useOrganizations()` hook
3. TanStack Query caches org list with 5-minute stale time
4. User switches workspace via dropdown
5. Active org context updates
6. Dashboard re-fetches org-specific data with new context
7. Cache keys include orgId: `['properties', orgId]`

**Invitation Flow**:
1. Admin clicks "Invite Member" (opens Dialog)
2. Fills form, submits
3. TanStack Query mutation: `useInviteMember()`
4. Optimistic update adds "Sending..." to pending list
5. Backend sends email/SMS, returns invitation record
6. Query invalidates `['invitations', orgId]` to refetch list
7. Recipient receives link, clicks
8. Frontend validates token, shows acceptance page
9. User accepts, mutation adds to org
10. Dashboard shows new member

### Monitoring Points (Sentry Integration)

**Critical Events**:
- Authentication success/failure (FR-MONITOR-002)
- Authorization failures (FR-MONITOR-003)
- Platform admin actions (FR-MONITOR-004)
- Payment processing errors (future)
- Data corruption (FR-MONITOR-005)

**Performance Monitoring**:
- Page load times (LCP, FID, CLS)
- API call durations
- TanStack Query cache hit rates
- Slow database queries (backend)

**Error Tracking**:
- Form validation failures
- API errors (network, 500, 404)
- OTP delivery failures
- Invitation send failures
- Session expiration events

**Context Included**:
- User ID, organization ID, role
- Active workspace
- Request path, method
- Browser, device info

### TanStack Query Structure

**Query Keys Convention**:
```typescript
// User data
['user'] // Current user
['user', 'organizations'] // User's orgs

// Organization data
['organizations', orgId] // Specific org
['organizations', orgId, 'members'] // Org members
['organizations', orgId, 'invitations'] // Pending invites

// Platform admin
['admin', 'organizations'] // All orgs
['admin', 'activities', filters] // Activity feed
['admin', 'audit', filters] // Audit trail
```

**Mutation Patterns**:
```typescript
// Optimistic updates for instant feedback
useMutation({
  mutationFn: inviteMember,
  onMutate: async (newInvite) => {
    // Cancel queries
    await queryClient.cancelQueries(['invitations', orgId])
    // Snapshot previous
    const previous = queryClient.getQueryData(['invitations', orgId])
    // Optimistic update
    queryClient.setQueryData(['invitations', orgId], old => [...old, newInvite])
    return { previous }
  },
  onError: (err, newInvite, context) => {
    // Rollback
    queryClient.setQueryData(['invitations', orgId], context.previous)
  },
  onSettled: () => {
    // Refetch
    queryClient.invalidateQueries(['invitations', orgId])
  }
})
```

## Open Questions

### For Design Phase
1. Which specific shadcn sidebar block should we use? (sidebar-01, sidebar-02, sidebar-03)?
   - Need to view examples and choose based on feature requirements
   - Consider: collapsible vs persistent, icon placement, mobile behavior

2. Should invitation acceptance page be a full page or a modal/dialog?
   - Full page: Better for deep linking, clearer focus
   - Modal: Lighter weight, maintains context
   - Recommendation: Full page for better UX

3. What's the UX for workspace switching when user has slow connection?
   - Show loading skeleton?
   - Keep showing previous org data with loading indicator?
   - Disable interactions until loaded?

4. Should we implement real-time updates for team/invitation changes or use polling?
   - Real-time: WebSocket/SSE for instant updates
   - Polling: TanStack Query refetchInterval (simpler)
   - Hybrid: Refetch on window focus + manual refresh button

### For Implementation
5. Should we create custom hooks for common patterns early?
   - `useActiveOrganization()`, `usePermissions()`, `useUser()`
   - Recommendation: Yes, define in quickstart guide

6. What's the error handling strategy for optimistic updates that fail?
   - Toast notification?
   - Inline error in component?
   - Rollback silently and retry?

7. How should we handle partial API failures (e.g., invitation created but email failed to send)?
   - Show in UI as "Sent (email pending)"?
   - Retry email in background?
   - Manual resend option?

## Next Steps

1. **Phase 1: Design & Architecture**
   - Create `data-model.md` with TypeScript interfaces
   - Create `contracts/` directory with API shapes
   - Design component hierarchy (which shadcn blocks to use)
   - Create `quickstart.md` with implementation sequence

2. **Phase 2: Create Implementation Plan**
   - Fill out `plan.md` with all design decisions
   - Define implementation phases matching spec priorities
   - Document risks and mitigations
   - Set checkpoints and milestones

3. **Review & Approval**
   - Review plan with stakeholders
   - Confirm shadcn block selections
   - Validate API contract assumptions
   - Get approval to proceed

4. **Implementation**
   - Run `/speckit.tasks` to break into granular tasks
   - Run `/speckit.implement` to begin coding
   - Follow quickstart guide sequence
   - Test incrementally per phase
