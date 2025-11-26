# Implementation Plan: Accounts Module & Landing Page

**Branch**: `001-accounts`  
**Date**: 2025-11-15  
**Spec**: [spec.md](./spec.md)

## Summary

Implement a complete accounts module with landing page, authentication (Google/email/phone), organization management, team invitations, role-based access control, and platform administration dashboard for a Next.js 16 property portal.

## Technical Context

**Language/Version**: TypeScript 5 with Next.js 16 (App Router)  
**Primary Dependencies**: 
- React 19
- TanStack Query 5 (for data fetching and client state management)
- shadcn/ui (for UI components, preferring component blocks)
- Sentry (for monitoring and error tracking)
- Tailwind CSS 4 (for styling)
- lucide-react (for icons)
- zod + react-hook-form (for form validation)

**Storage**: External REST API (backend manages PostgreSQL database)  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E)  
**Target Platform**: Web (modern browsers, mobile responsive down to 320px)  
**Project Type**: Next.js web application (App Router with Server Components)

**Performance Goals**: 
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Landing page Lighthouse score 90+

**Constraints**:
- WCAG 2.1 AA compliance
- Mobile-first responsive design
- SEO optimized (landing page)
- Offline-tolerant (graceful degradation)
- Bundle size < 500KB initial load

**Scale/Scope**: 
- 10,000 concurrent users
- Unlimited organizations per user (UI optimized for 2-10, scalable beyond)
- Responsive design 320px to 4K

## Constitution Check

### ✅ Compliance
- [x] Next.js 16 App Router architecture
- [x] TypeScript 5 with strict mode
- [x] shadcn/ui components (component blocks preferred: sidebar-07, etc.)
- [x] TanStack Query for all data fetching
- [x] Sentry integration at critical monitoring points
- [x] Tailwind CSS for all styling
- [x] lucide-react for all icons
- [x] PascalCase for components, camelCase for utilities
- [x] Server Components by default, Client Components marked with 'use client'
- [x] No code duplication - reuse components and utilities
- [x] Clean folder structure: app/ for routes, components/ for UI, lib/ for utilities

### ⚠️ Deviations
None - full compliance with constitution

### Complexity Tracking
No violations - implementation follows all established patterns

## Project Structure

### Documentation (this feature)

```
.specify/specs/001-accounts/
├── spec.md                     # Feature specification (624 lines)
├── clarifications.md           # Q&A sessions (224 lines)
├── plan.md                     # This file (implementation plan)
├── research.md                 # Technical research (475 lines)
├── data-model.md               # Data models and types (690 lines)
├── component-hierarchy.md      # Component architecture (648 lines)
├── quickstart.md               # Implementation guide (735 lines)
└── contracts/                  # API and type contracts
    ├── api.md                  # REST API definitions (776 lines)
    ├── types.ts                # TypeScript types (586 lines)
    └── queries.md              # TanStack Query hooks (843 lines)
```

### Source Code Structure

```
app/
├── (auth)/                     # Auth route group (public)
│   ├── layout.tsx             # Centered auth layout
│   ├── signin/
│   │   └── page.tsx           # Sign in page
│   ├── signup/
│   │   └── page.tsx           # Sign up page
│   ├── reset-password/
│   │   └── page.tsx           # Password reset
│   └── invitations/
│       └── [token]/
│           └── page.tsx       # Invitation acceptance
├── (dashboard)/                # Dashboard route group (protected)
│   ├── layout.tsx             # Dashboard shell with sidebar-07
│   ├── dashboard/
│   │   ├── page.tsx           # Main dashboard
│   │   ├── team/
│   │   │   └── page.tsx       # Team management
│   │   └── settings/
│   │       └── page.tsx       # Organization settings
│   └── (admin)/               # Nested admin route group
│       └── admin/
│           ├── page.tsx       # Admin dashboard
│           ├── organizations/
│           │   ├── page.tsx   # All organizations
│           │   └── [id]/
│           │       └── page.tsx # Organization detail
│           ├── activities/
│           │   └── page.tsx   # Activity tracking
│           └── audit/
│               └── page.tsx   # Audit trail
├── page.tsx                    # Landing page (root)
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles
├── providers.tsx               # TanStack Query + Toaster
└── middleware.ts               # Auth validation

components/
├── ui/                         # shadcn components (auto-generated)
│   ├── sidebar.tsx            # From sidebar-07 block
│   ├── button.tsx             # Individual components
│   ├── card.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── input-otp.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── skeleton.tsx
│   ├── alert.tsx
│   └── [other shadcn components]
├── landing/                    # Landing page components (Server)
│   ├── Navigation.tsx         # Header navigation (Client for mobile menu)
│   ├── Hero.tsx               # Hero section
│   ├── Features.tsx           # Features grid
│   ├── FeatureCard.tsx        # Individual feature card
│   ├── CallToAction.tsx       # CTA section
│   └── Footer.tsx             # Footer
├── auth/                       # Authentication components (Client)
│   ├── SignInForm.tsx         # Sign in form
│   ├── SignUpForm.tsx         # Sign up form
│   ├── ResetPasswordForm.tsx  # Password reset form
│   ├── GoogleAuthButton.tsx   # Google OAuth button
│   ├── EmailPasswordForm.tsx  # Email/password fields
│   ├── PhoneOTPForm.tsx       # Phone + OTP fields
│   ├── OTPVerification.tsx    # OTP input
│   └── AuthMethodSelector.tsx # Method selection
├── dashboard/                  # Dashboard components
│   ├── DashboardShell.tsx     # sidebar-07 wrapper (Client)
│   ├── DashboardHeader.tsx    # Header with user menu (Client)
│   ├── DashboardContent.tsx   # Dashboard content (Client)
│   ├── WorkspaceSwitcher.tsx  # Org dropdown (Client)
│   ├── UserMenu.tsx           # User dropdown (Client)
│   ├── EmptyState.tsx         # No org empty state (Server)
│   └── Sidebar.tsx            # Sidebar navigation (Client)
├── organization/               # Organization components
│   ├── CreateOrgDialog.tsx    # Creation dialog (Client)
│   ├── OrgSettings.tsx        # Settings form (Client)
│   ├── OrgCard.tsx            # Organization card (Server)
│   └── OrgList.tsx            # Organization list (Client)
├── team/                       # Team management components
│   ├── TeamManagement.tsx     # Team page (Client)
│   ├── MemberTable.tsx        # Members table (Client)
│   ├── MemberRow.tsx          # Table row (Client)
│   ├── InviteDialog.tsx       # Invitation dialog (Client)
│   ├── PendingInvitations.tsx # Pending invites (Client)
│   ├── InvitationCard.tsx     # Invitation card (Client)
│   ├── RoleSelector.tsx       # Role dropdown (Client)
│   ├── RoleBadge.tsx          # Role badge (Server)
│   └── RemoveMemberDialog.tsx # Confirmation dialog (Client)
├── admin/                      # Platform admin components
│   ├── AdminDashboard.tsx     # Admin dashboard (Client)
│   ├── AdminLayout.tsx        # Admin sidebar (Client)
│   ├── OrgList.tsx            # Organizations table (Client)
│   ├── OrgDetail.tsx          # Organization detail (Client)
│   ├── ActivityTable.tsx      # Activity reports (Client)
│   ├── CompensationReport.tsx # Compensation (Client)
│   ├── AuditTrailTable.tsx    # Audit trail (Client)
│   ├── AdminRoleManager.tsx   # Role assignment (Client)
│   └── MetricsCard.tsx        # Metric card (Server)
└── shared/                     # Shared components
    ├── AccessDenied.tsx       # Access denied alert (Client)
    ├── ErrorDisplay.tsx       # Error display (Client)
    └── LoadingSpinner.tsx     # Loading indicator (Client)

lib/
├── utils.ts                    # Utility functions (cn, etc.)
├── query-client.ts             # TanStack Query configuration
├── api/                        # API client layer
│   ├── client.ts              # Axios instance with interceptors
│   ├── auth.ts                # Auth API calls
│   ├── organizations.ts       # Organization API calls
│   ├── members.ts             # Team API calls
│   └── admin.ts               # Admin API calls
├── hooks/                      # TanStack Query hooks
│   ├── useAuth.ts             # Auth hooks (useUser, useLogin, etc.)
│   ├── useOrganizations.ts    # Organization hooks
│   ├── useMembers.ts          # Team management hooks
│   ├── useInvitations.ts      # Invitation hooks
│   ├── usePermissions.ts      # RBAC helper hook
│   └── useAdmin.ts            # Platform admin hooks
├── types/                      # TypeScript types
│   └── index.ts               # All type definitions (copied from contracts/types.ts)
├── auth/                       # Auth utilities
│   ├── session.ts             # Session management
│   ├── permissions.ts         # Permission helpers
│   └── sentry.ts              # Auth Sentry tracking
└── constants/
    └── roles.ts               # Role definitions and permissions

middleware.ts                   # Auth middleware for protected routes
instrumentation.ts              # Sentry instrumentation
sentry.client.config.ts         # Sentry client config
sentry.server.config.ts         # Sentry server config
```

**Structure Decision**: Using Next.js App Router with route groups to separate public (`(auth)`), protected (`(dashboard)`), and admin routes. Components organized by feature. Server Components by default for static content, Client Components for interactivity and data fetching. shadcn/ui sidebar-07 block for dashboard layout. TanStack Query hooks in `lib/hooks/` for all data fetching.

## Implementation Phases

### Phase 1: Foundation & Landing (Priority: P1)
**Timeline**: Days 1-2 (2 days)  
**User Stories**: US1 (Landing Page)

**Deliverables**:
- [ ] Install dependencies (TanStack Query, Sentry, shadcn components)
- [ ] Configure Sentry instrumentation
- [ ] Set up TanStack Query provider
- [ ] Create API client with interceptors
- [ ] Copy type definitions from contracts/types.ts
- [ ] Create landing page (Hero, Features, Navigation, Footer)
- [ ] Implement responsive design (mobile-first)
- [ ] Optimize images with next/image
- [ ] Add metadata for SEO
- [ ] Achieve Lighthouse scores: Performance 90+, Accessibility 95+

**Files to Create**:
- `lib/query-client.ts`
- `lib/api/client.ts`
- `lib/types/index.ts`
- `app/providers.tsx`
- `instrumentation.ts`, `sentry.client.config.ts`, `sentry.server.config.ts`
- `components/landing/Navigation.tsx`
- `components/landing/Hero.tsx`
- `components/landing/Features.tsx`
- `components/landing/FeatureCard.tsx`
- `components/landing/CallToAction.tsx`
- `components/landing/Footer.tsx`
- `app/page.tsx` (replace existing)

**Testing**:
- Manual: Navigate landing page, click CTAs, test responsive breakpoints
- Lighthouse: Run audit, verify scores
- Accessibility: Keyboard navigation, screen reader testing

---

### Phase 2: Authentication (Priority: P1)
**Timeline**: Days 3-5 (3 days)  
**User Stories**: US2 (User Authentication & Account Creation)

**Deliverables**:
- [ ] Install auth-related shadcn components (form, input, input-otp, button, label, card, alert)
- [ ] Create auth hooks (useUser, useRegister, useLogin, useLogout, useRequestOTP, useVerifyOTP)
- [ ] Create auth layout (centered form layout)
- [ ] Create sign-up page with method selection (email/password, phone/OTP, Google OAuth)
- [ ] Implement email/password registration and sign-in
- [ ] Implement phone/OTP registration and sign-in (with OTP timer, retry limits)
- [ ] Implement Google OAuth flow (button ready, integration pending backend)
- [ ] Create password reset flow
- [ ] Add session management
- [ ] Integrate Sentry for auth events
- [ ] Add rate limiting UI feedback
- [ ] Add form validation (zod schemas)

**Files to Create**:
- `lib/hooks/useAuth.ts`
- `app/(auth)/layout.tsx`
- `app/(auth)/signin/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `components/auth/SignInForm.tsx`
- `components/auth/SignUpForm.tsx`
- `components/auth/ResetPasswordForm.tsx`
- `components/auth/GoogleAuthButton.tsx`
- `components/auth/EmailPasswordForm.tsx`
- `components/auth/PhoneOTPForm.tsx`
- `components/auth/OTPVerification.tsx`
- `components/auth/AuthMethodSelector.tsx`
- `lib/auth/sentry.ts`
- `middleware.ts` (auth validation)

**Testing**:
- All three auth methods work (email, phone, Google placeholder)
- Error states display correctly
- Rate limiting shows warnings
- OTP timer counts down
- Form validation catches errors
- Sentry captures auth events
- Password reset emails sent
- Session persists with "remember me"

---

### Phase 3: Dashboard & Organizations (Priority: P2)
**Timeline**: Days 6-8 (3 days)  
**User Stories**: US3 (Dashboard & Organization Creation)

**Deliverables**:
- [ ] Install sidebar-07 block and related components
- [ ] Create organization hooks (useOrganizations, useCreateOrganization, useUpdateOrganization, useSwitchWorkspace)
- [ ] Create dashboard layout with sidebar-07
- [ ] Implement workspace switcher dropdown
- [ ] Create main dashboard page
- [ ] Implement empty state ("Create Organization" CTA)
- [ ] Create organization creation dialog
- [ ] Implement organization settings page
- [ ] Add loading and error states (skeleton components)
- [ ] Integrate Sentry for org operations
- [ ] Add optimistic updates for UI responsiveness

**Files to Create**:
- `lib/hooks/useOrganizations.ts`
- `lib/api/organizations.ts`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `components/dashboard/DashboardShell.tsx`
- `components/dashboard/DashboardHeader.tsx`
- `components/dashboard/DashboardContent.tsx`
- `components/dashboard/WorkspaceSwitcher.tsx`
- `components/dashboard/UserMenu.tsx`
- `components/dashboard/EmptyState.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/organization/CreateOrgDialog.tsx`
- `components/organization/OrgSettings.tsx`
- `components/organization/OrgCard.tsx`

**Testing**:
- Dashboard renders with sidebar-07
- Empty state shows for new users
- Organization creation works
- Name uniqueness validation (case-insensitive)
- Workspace switcher shows all orgs
- Switching updates context (<2s)
- Settings page updates org
- TanStack Query caching works
- Sidebar collapses on mobile

---

### Phase 4: Team Management (Priority: P2)
**Timeline**: Days 9-12 (4 days)  
**User Stories**: US4 (Team Member Invitations), US5 (RBAC)

**Deliverables**:
- [ ] Create team/invitation hooks (useMembers, useInvitations, useInviteMember, useRevokeInvitation, useUpdateMemberRole, useRemoveMember)
- [ ] Create permissions hook (usePermissions)
- [ ] Create team management page
- [ ] Implement member table with role badges
- [ ] Create invitation dialog (email/phone input, role selection)
- [ ] Implement pending invitations view with status badges
- [ ] Create invitation acceptance page (public route)
- [ ] Implement role change dropdown
- [ ] Add remove member dialog (confirmation)
- [ ] Implement role-based UI restrictions (hide/disable based on permissions)
- [ ] Add inline permission tooltips
- [ ] Integrate Sentry for unauthorized access attempts
- [ ] Add optimistic updates for invitations

**Files to Create**:
- `lib/hooks/useMembers.ts`
- `lib/hooks/useInvitations.ts`
- `lib/hooks/usePermissions.ts`
- `lib/api/members.ts`
- `lib/auth/permissions.ts`
- `app/(auth)/invitations/[token]/page.tsx`
- `app/(dashboard)/dashboard/team/page.tsx`
- `components/team/TeamManagement.tsx`
- `components/team/MemberTable.tsx`
- `components/team/MemberRow.tsx`
- `components/team/InviteDialog.tsx`
- `components/team/PendingInvitations.tsx`
- `components/team/InvitationCard.tsx`
- `components/team/RoleSelector.tsx`
- `components/team/RoleBadge.tsx`
- `components/team/RemoveMemberDialog.tsx`
- `components/shared/AccessDenied.tsx`

**Testing**:
- Invitation emails/SMS sent
- Invitation acceptance flow works
- Role changes take effect immediately
- RBAC enforced (buttons disabled, routes protected)
- Owners cannot be removed if last owner
- Expired invitations show correctly
- Revoke invitation works
- 14-day expiration countdown accurate
- Permission tooltips display
- Sentry logs unauthorized attempts

---

### Phase 5: Platform Administration (Priority: P3)
**Timeline**: Days 13-17 (5 days)  
**User Stories**: US6 (Platform Administration Dashboard)

**Deliverables**:
- [ ] Create admin hooks (useAdminDashboard, useAdminOrganizations, useAdminActivities, useAdminAuditTrail)
- [ ] Create platform admin layout with admin sidebar
- [ ] Implement admin dashboard with metrics
- [ ] Create organizations list with search and filters
- [ ] Implement organization detail view
- [ ] Create admin role management page
- [ ] Implement activity tracking table with filters
- [ ] Create compensation calculation reports (tiered: $30/$50/$75)
- [ ] Implement audit trail viewer with search and export
- [ ] Add date range filters
- [ ] Implement CSV/JSON/PDF export
- [ ] Integrate comprehensive Sentry logging for admin actions
- [ ] Add pagination for large datasets

**Files to Create**:
- `lib/hooks/useAdmin.ts`
- `lib/api/admin.ts`
- `lib/admin/sentry.ts`
- `app/(dashboard)/(admin)/admin/page.tsx`
- `app/(dashboard)/(admin)/admin/organizations/page.tsx`
- `app/(dashboard)/(admin)/admin/organizations/[id]/page.tsx`
- `app/(dashboard)/(admin)/admin/activities/page.tsx`
- `app/(dashboard)/(admin)/admin/audit/page.tsx`
- `components/admin/AdminDashboard.tsx`
- `components/admin/AdminLayout.tsx`
- `components/admin/OrgList.tsx`
- `components/admin/OrgDetail.tsx`
- `components/admin/ActivityTable.tsx`
- `components/admin/CompensationReport.tsx`
- `components/admin/AuditTrailTable.tsx`
- `components/admin/AdminRoleManager.tsx`
- `components/admin/MetricsCard.tsx`

**Testing**:
- Admin dashboard shows correct metrics
- Only platform admins can access
- Organization list filters work
- Activity tracking captures all actions
- Compensation calculations accurate
- Tiered compensation ($30/$50/$75) correct
- Audit trail searchable
- Export to CSV/JSON/PDF works
- Pagination handles 1000+ entries
- Sentry captures all admin actions

---

## Risk & Mitigation

### Technical Risks

1. **Risk**: TanStack Query cache invalidation complexity with multi-organization context
   - **Impact**: Stale data shown to users, incorrect permissions displayed
   - **Mitigation**: Clear cache invalidation rules, use query key scoping with orgId, test workspace switching thoroughly

2. **Risk**: sidebar-07 customization might be complex or not fit requirements
   - **Impact**: Extra development time, potential need to fork component
   - **Mitigation**: Review sidebar-07 source before Phase 3, have fallback to sidebar-01 (simpler), budget extra time for customization

3. **Risk**: Sentry event volume high in production
   - **Impact**: Cost overruns, alert fatigue
   - **Mitigation**: Use sampling for non-critical events, filter out noisy errors, set up alert thresholds

4. **Risk**: Session management with multiple organizations causes confusion
   - **Impact**: Users perform actions on wrong organization, data corruption
   - **Mitigation**: Prominent workspace indicator in UI, confirmation dialogs for critical actions, Sentry logging

5. **Risk**: Optimistic updates fail and cause UI inconsistencies
   - **Impact**: Users see success but action failed
   - **Mitigation**: Proper rollback logic in mutations, show real error states, retry failed mutations

### Dependency Risks

1. **Risk**: Backend API not ready or incomplete
   - **Impact**: Frontend development blocked
   - **Mitigation**: Use MSW (Mock Service Worker) for development, define API contracts early, parallel development

2. **Risk**: SMS provider reliability for OTP delivery
   - **Impact**: Users cannot sign up with phone
   - **Mitigation**: Retry logic, fallback to email auth, clear error messages, Sentry monitoring

3. **Risk**: Google OAuth downtime or issues
   - **Impact**: Users cannot sign in with Google
   - **Mitigation**: Offer alternative methods, clear error messaging, cache user data

### Timeline Risks

1. **Risk**: shadcn component customization takes longer than expected
   - **Impact**: Delays in Phase 3 and 4
   - **Mitigation**: Start Phase 3 early if ahead of schedule, reduce customization if needed

2. **Risk**: RBAC implementation more complex than anticipated
   - **Impact**: Phase 4 extends beyond 4 days
   - **Mitigation**: Simplify initial implementation, add advanced features later, use helper hooks

## Design Documents

- **Research**: [research.md](./research.md) - Technical context, constitution analysis, challenges
- **Data Model**: [data-model.md](./data-model.md) - TypeScript interfaces, relationships, validation
- **Component Hierarchy**: [component-hierarchy.md](./component-hierarchy.md) - shadcn blocks, component structure
- **Quick Start**: [quickstart.md](./quickstart.md) - Implementation guide with code examples
- **API Contracts**: [contracts/api.md](./contracts/api.md) - REST API endpoint definitions
- **Type Definitions**: [contracts/types.ts](./contracts/types.ts) - Complete TypeScript types
- **Query Hooks**: [contracts/queries.md](./contracts/queries.md) - TanStack Query hook specifications

## Success Metrics

**Landing Page**:
- LCP < 2.5s ✓
- Lighthouse Performance 90+ ✓
- Lighthouse Accessibility 95+ ✓
- 70% click-through to sign-up/sign-in ✓

**Authentication**:
- 99% success rate for all methods ✓
- < 2 minute account creation ✓
- Password reset 90% completion ✓
- OTP delivery 98% success ✓

**Dashboard & Organizations**:
- Dashboard load < 1s ✓
- Workspace switch < 2s ✓
- 90% successful first org creation ✓
- Organization creation < 30s ✓

**Team Management**:
- 85% invite at least one member (week 1) ✓
- Invitation acceptance < 3 minutes ✓
- Role changes immediate (no re-login) ✓

**Security**:
- Zero unauthorized access incidents ✓
- 100% admin actions logged ✓
- Audit trail exportable < 30s ✓
- Security incident detection < 5 min ✓

**Performance**:
- TanStack Query cache hit > 70% ✓
- API P95 < 200ms ✓
- Bundle size < 500KB ✓
- Zero N+1 queries ✓

## Next Steps

1. **Review Plan**: Review this plan and all design documents with team
2. **Backend Coordination**: Confirm REST API contracts with backend team
3. **Environment Setup**: Set up Sentry account, configure environment variables
4. **Run /speckit.tasks**: Break down each phase into granular implementation tasks
5. **Begin Implementation**: Follow quickstart.md for Phase 1
6. **Test Incrementally**: Test each phase before moving to next
7. **Monitor Sentry**: Check Sentry dashboard daily during development

---

**Total Estimated Timeline**: 17-20 development days (~4 weeks with QA and review)

**Ready to proceed? Run `/speckit.tasks` to create granular task breakdown for implementation.**
