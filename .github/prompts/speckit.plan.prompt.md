---
agent: speckit.plan
---

# Speckit Plan Command

## Purpose

The `/speckit.plan` command transforms a completed feature specification into a detailed implementation plan. It creates technical architecture, defines file structure, establishes contracts, and outlines the development approach while ensuring constitution compliance.

## Prerequisites

Before running `/speckit.plan`:
- ✅ Specification exists at `.specify/specs/[###-feature-name]/spec.md`
- ✅ All critical clarifications are resolved (no blocking `[NEEDS CLARIFICATION]` markers)
- ✅ Feature branch is checked out (e.g., `001-accounts`)
- ✅ Constitution requirements are understood

## Workflow

### Phase 0: Research & Context Gathering

**Goal**: Understand the technical landscape and gather context for planning decisions.

#### Steps:

1. **Read the Constitution**
   - Review `.github/prompts/speckit.constitution.prompt.md`
   - Extract technical stack requirements
   - Identify mandatory patterns and conventions
   - Note prohibited practices

2. **Analyze the Specification**
   - Read `.specify/specs/[###-feature-name]/spec.md`
   - Extract functional requirements
   - Identify key entities and data models
   - Note dependencies and constraints
   - List all user scenarios

3. **Examine Current Codebase**
   - Review existing folder structure
   - Identify existing patterns and conventions
   - Find reusable components and utilities
   - Check for similar implementations
   - Review `package.json` for installed dependencies

4. **Constitution Check**
   - Verify specification aligns with constitution
   - Flag any conflicts or violations
   - Document justifications for necessary deviations
   - Confirm technology stack choices

5. **Document Research**
   - Create `.specify/specs/[###-feature-name]/research.md`
   - Summarize technical context
   - Document key findings
   - List relevant existing code/patterns
   - Note potential challenges

#### Research Document Template:

```markdown
# Research: [Feature Name]

**Date**: [DATE]
**Spec**: [link to spec.md]

## Constitution Requirements

### Mandatory Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript 5
- UI Components: shadcn/ui (prefer component blocks)
- Data Fetching: TanStack Query
- Monitoring: Sentry
- Styling: Tailwind CSS
- Icons: lucide-react

### Conventions
- File naming: [PascalCase for components, camelCase for utilities]
- Component structure: [Server Components default, Client Components marked]
- Folder organization: [app/ for routes, components/ for UI, lib/ for utilities]
- No duplication: [Reuse existing components]

## Existing Codebase Analysis

### Current Structure
[Document relevant folders and files]

### Reusable Components
- `components/ui/`: shadcn components already installed
- `lib/utils.ts`: Utility functions (cn(), etc.)
- [List other relevant existing code]

### Similar Patterns
[Any similar features already implemented]

## Feature Requirements Summary

### User Scenarios (Priority Order)
1. P1: [Scenario]
2. P1: [Scenario]
3. P2: [Scenario]
[etc.]

### Key Entities
- Entity 1: [attributes]
- Entity 2: [relationships]
[etc.]

### Critical Dependencies
- External: [Google OAuth, SMS provider, etc.]
- Internal: [Authentication system, etc.]

## Technical Challenges

1. **Challenge**: [Description]
   - **Impact**: [How it affects implementation]
   - **Approach**: [Proposed solution]

2. **Challenge**: [Description]
   - **Impact**: [How it affects implementation]
   - **Approach**: [Proposed solution]

## Recommended Approach

### Architecture Pattern
[e.g., "Next.js App Router with Server Components and TanStack Query for client state"]

### Component Strategy
[e.g., "Use shadcn sidebar-01 block for dashboard layout, form components for auth"]

### Data Flow
[e.g., "TanStack Query for API calls, optimistic updates for mutations"]

### Monitoring Points
[List where Sentry integration is needed]

## Open Questions
[Any remaining uncertainties that need resolution during planning]
```

---

### Phase 1: Design & Architecture

**Goal**: Create detailed technical design including file structure, component architecture, data contracts, and implementation approach.

#### Steps:

1. **Define Project Structure**
   - Based on constitution and existing structure
   - Follow Next.js App Router conventions
   - Organize by feature when appropriate
   - Document folder purposes

2. **Design Data Models**
   - Create `.specify/specs/[###-feature-name]/data-model.md`
   - Define TypeScript interfaces for entities
   - Specify relationships
   - Document validation rules
   - Define API contracts

3. **Plan Component Hierarchy**
   - Identify shadcn component blocks to use
   - List individual shadcn components needed
   - Design custom components (only if necessary)
   - Define component props and composition
   - Specify Server vs Client Components

4. **Define API Contracts**
   - Create `.specify/specs/[###-feature-name]/contracts/`
   - Document request/response shapes
   - Define error responses
   - Specify authentication requirements
   - List TanStack Query hooks

5. **Create Quick Start Guide**
   - Create `.specify/specs/[###-feature-name]/quickstart.md`
   - Outline implementation sequence
   - List files to create in order
   - Provide code scaffolds
   - Include testing approach

6. **Update Implementation Plan**
   - Fill out the complete plan template
   - Reference all design documents
   - Define development phases
   - Set checkpoints and milestones

#### Data Model Document Template:

```markdown
# Data Model: [Feature Name]

**Date**: [DATE]

## Entities

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  profilePhoto: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  authMethods: AuthMethod[];
  lastActive: Date;
  createdAt: Date;
  status: 'active' | 'inactive' | 'suspended';
  platformAdminRole?: PlatformAdminRole;
}

type AuthMethod = 'google' | 'email' | 'phone';
```

[Define all entities...]

## Relationships

- User 1:N OrganizationMember
- Organization 1:N OrganizationMember
- Organization 1:N Invitation
[etc.]

## Validation Rules

### User
- Email: Valid email format, unique when present
- Phone: Valid E.164 format, unique when present
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit
[etc.]

## API Response Shapes

### Authentication Response
```typescript
interface AuthResponse {
  user: User;
  session: Session;
  organization?: Organization;
}
```

[Define all API shapes...]
```

#### Contracts Directory Structure:

```
.specify/specs/[###-feature-name]/contracts/
├── api.md           # API endpoint definitions
├── types.ts         # TypeScript type definitions
└── queries.md       # TanStack Query hook specifications
```

#### Quick Start Document Template:

```markdown
# Quick Start: [Feature Name]

**Date**: [DATE]

## Implementation Sequence

### Phase 1: Foundation (Priority: P1)
**Goal**: Set up basic authentication and landing page

#### Step 1: Install Dependencies
```bash
npm install @tanstack/react-query @sentry/nextjs
npx shadcn@latest add button card input form dialog
```

#### Step 2: Configure Sentry
**File**: `instrumentation.ts`
```typescript
// Sentry setup code
```

#### Step 3: Set up TanStack Query
**File**: `app/providers.tsx`
```typescript
// Query provider setup
```

#### Step 4: Create Landing Page
**Files**: `app/page.tsx`
- Use shadcn hero block: `npx shadcn@latest add [hero-block-name]`
- Customize with property portal messaging
- Add CTA buttons

[Continue with detailed steps...]

### Phase 2: Authentication (Priority: P1)
[Steps for authentication implementation]

### Phase 3: Dashboard (Priority: P2)
[Steps for dashboard implementation]

## Testing Approach

### Unit Tests
- Test utility functions in `lib/`
- Test data transformations
- Test validation logic

### Integration Tests
- Test authentication flows
- Test TanStack Query hooks
- Test form submissions

### E2E Tests
- Test complete user journeys
- Test critical paths from spec

## Sentry Integration Points

1. Authentication events: `lib/auth/sentry.ts`
2. Authorization failures: `middleware.ts`
3. Platform admin actions: `lib/admin/sentry.ts`
4. Critical errors: All API error boundaries

## Checkpoints

- [ ] Landing page renders with shadcn components
- [ ] Authentication flow works (all 3 methods)
- [ ] Dashboard displays correctly
- [ ] Organization creation functional
- [ ] Team invitations work
- [ ] RBAC enforced
- [ ] Platform admin dashboard accessible
- [ ] Sentry captures events
- [ ] TanStack Query caching works
- [ ] All tests pass
```

---

### Phase 2: Create Implementation Plan

**Goal**: Compile all research and design into a comprehensive implementation plan document.

#### Steps:

1. **Use Plan Template**
   - Copy `.specify/templates/plan-template.md`
   - Save as `.specify/specs/[###-feature-name]/plan.md`

2. **Fill Technical Context**
   - Language: TypeScript 5
   - Dependencies: Next.js 16, React 19, TanStack Query, shadcn/ui, Sentry
   - Storage: External API (Backend handles DB)
   - Testing: Jest, React Testing Library, Playwright
   - Platform: Web (Next.js)
   - Performance: LCP < 2.5s, FID < 100ms
   - Constraints: From spec (bundle size, browser support, etc.)
   - Scale: From spec (concurrent users, data volume, etc.)

3. **Document Project Structure**
   - Use Next.js App Router structure (NOT the generic template options)
   - Show actual file paths for this feature
   - Explain folder organization
   - Reference existing structure

4. **Constitution Check Section**
   - List all constitution requirements
   - Confirm compliance with each
   - Document any justified deviations
   - Fill complexity tracking table if needed

5. **Link to Design Documents**
   - Reference research.md
   - Reference data-model.md
   - Reference quickstart.md
   - Reference contracts/

6. **Define Implementation Phases**
   - Break feature into phases matching spec priorities
   - Assign user stories to phases
   - Define phase deliverables
   - Set testing requirements per phase

7. **Identify Risks & Mitigations**
   - Technical risks
   - Dependency risks
   - Timeline risks
   - Mitigation strategies

#### Implementation Plan Structure:

```markdown
# Implementation Plan: [Feature Name]

**Branch**: `###-feature-name`  
**Date**: [DATE]  
**Spec**: [link to spec.md]

## Summary
[2-3 sentence summary of feature and approach]

## Technical Context

**Language/Version**: TypeScript 5 with Next.js 16  
**Primary Dependencies**: 
- React 19
- TanStack Query (for data fetching and state)
- shadcn/ui (for UI components)
- Sentry (for monitoring)
- Tailwind CSS (for styling)
- lucide-react (for icons)

**Storage**: External REST/GraphQL API (backend manages persistence)  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E)  
**Target Platform**: Web (modern browsers, mobile responsive)  
**Project Type**: Next.js web application (App Router)  
**Performance Goals**: 
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle size < 500KB

**Constraints**:
- WCAG 2.1 AA compliance
- Mobile-first responsive
- SEO optimized (landing page)
- Offline-tolerant (graceful degradation)

**Scale/Scope**: 
- 10,000 concurrent users
- Unlimited organizations per user
- Responsive down to 320px width

## Constitution Check

### ✅ Compliance
- [x] Next.js 16 App Router
- [x] TypeScript 5 with strict mode
- [x] shadcn/ui components (component blocks preferred)
- [x] TanStack Query for data fetching
- [x] Sentry integration at critical points
- [x] Tailwind CSS for styling
- [x] lucide-react for icons
- [x] PascalCase components, camelCase utilities
- [x] Server Components by default
- [x] No code duplication
- [x] Clean folder structure

### ⚠️ Deviations
[None expected - or document justified deviations]

### Complexity Tracking
[Empty - no violations expected]

## Project Structure

### Documentation (this feature)

```
.specify/specs/001-accounts/
├── spec.md              # Feature specification
├── clarifications.md    # Q&A sessions
├── plan.md             # This file
├── research.md         # Technical research
├── data-model.md       # Data models and types
├── quickstart.md       # Implementation guide
└── contracts/          # API and type contracts
    ├── api.md
    ├── types.ts
    └── queries.md
```

### Source Code Structure

```
app/
├── (auth)/                    # Auth route group
│   ├── signin/
│   │   └── page.tsx          # Sign in page
│   ├── signup/
│   │   └── page.tsx          # Sign up page
│   ├── reset-password/
│   │   └── page.tsx          # Password reset
│   └── invitations/
│       └── [token]/
│           └── page.tsx      # Invitation acceptance
├── (dashboard)/              # Dashboard route group (requires auth)
│   ├── dashboard/
│   │   ├── page.tsx         # Main dashboard
│   │   ├── team/
│   │   │   └── page.tsx     # Team management
│   │   └── settings/
│   │       └── page.tsx     # Organization settings
│   └── admin/               # Platform admin
│       ├── page.tsx         # Admin dashboard
│       ├── organizations/
│       ├── activities/
│       └── audit/
├── page.tsx                  # Landing page
├── layout.tsx                # Root layout
├── globals.css               # Global styles
└── providers.tsx             # Query provider, etc.

components/
├── ui/                       # shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   ├── form.tsx
│   ├── dialog.tsx
│   └── [other shadcn components]
├── auth/                     # Authentication components
│   ├── GoogleAuthButton.tsx
│   ├── EmailPasswordForm.tsx
│   ├── PhoneOTPForm.tsx
│   └── OTPVerification.tsx
├── dashboard/                # Dashboard components
│   ├── DashboardLayout.tsx  # Using shadcn sidebar block
│   ├── WorkspaceSwitcher.tsx
│   ├── EmptyState.tsx
│   └── UserMenu.tsx
├── organization/             # Organization components
│   ├── CreateOrgDialog.tsx
│   ├── OrgSettings.tsx
│   └── OrgCard.tsx
├── team/                     # Team management components
│   ├── MemberTable.tsx
│   ├── InviteDialog.tsx
│   ├── PendingInvitations.tsx
│   └── RoleBadge.tsx
├── admin/                    # Platform admin components
│   ├── AdminLayout.tsx
│   ├── OrgList.tsx
│   ├── ActivityTable.tsx
│   └── AuditTrail.tsx
└── landing/                  # Landing page components
    ├── Hero.tsx             # Using shadcn hero block
    ├── Features.tsx
    ├── CTA.tsx
    └── Navigation.tsx

lib/
├── utils.ts                  # Utility functions (cn, etc.)
├── api/                      # API client
│   ├── client.ts            # Base API client
│   ├── auth.ts              # Auth endpoints
│   ├── organizations.ts     # Org endpoints
│   └── admin.ts             # Admin endpoints
├── hooks/                    # TanStack Query hooks
│   ├── useAuth.ts
│   ├── useOrganizations.ts
│   ├── useMembers.ts
│   ├── useInvitations.ts
│   └── useAdmin.ts
├── auth/                     # Auth utilities
│   ├── session.ts
│   ├── permissions.ts
│   └── sentry.ts            # Auth Sentry tracking
├── types/                    # TypeScript types
│   ├── user.ts
│   ├── organization.ts
│   ├── invitation.ts
│   └── admin.ts
└── constants/
    └── roles.ts             # Role definitions and permissions

middleware.ts                 # Auth middleware
instrumentation.ts            # Sentry setup
```

**Structure Decision**: Using Next.js App Router with route groups to separate authenticated and unauthenticated routes. Components organized by feature domain. TanStack Query hooks in `lib/hooks/` for data fetching. Sentry integration in `instrumentation.ts` and feature-specific tracking modules.

## Implementation Phases

### Phase 1: Foundation & Landing (P1)
**User Stories**: US1 (Landing Page)

**Deliverables**:
- [ ] Install and configure dependencies (TanStack Query, Sentry, shadcn components)
- [ ] Set up Sentry instrumentation
- [ ] Create landing page using shadcn hero block
- [ ] Implement responsive navigation
- [ ] Add CTA buttons routing to auth pages
- [ ] Optimize images with next/image
- [ ] Achieve Lighthouse scores: Performance 90+, Accessibility 95+

**Files**:
- `app/page.tsx`
- `components/landing/*`
- `instrumentation.ts`
- `app/providers.tsx`

**Testing**: Lighthouse audit, responsive testing, navigation functionality

---

### Phase 2: Authentication (P1)
**User Stories**: US2 (User Authentication & Account Creation)

**Deliverables**:
- [ ] Create sign-up page with method selection
- [ ] Implement Google OAuth flow
- [ ] Implement email/password authentication
- [ ] Implement phone/OTP authentication
- [ ] Create sign-in page
- [ ] Implement password reset flow
- [ ] Set up session management
- [ ] Integrate Sentry for auth events
- [ ] Add rate limiting UI feedback

**Files**:
- `app/(auth)/signin/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `components/auth/*`
- `lib/api/auth.ts`
- `lib/hooks/useAuth.ts`
- `lib/auth/*`
- `middleware.ts`

**Testing**: All auth flows, error states, rate limiting, Sentry event capture

---

### Phase 3: Dashboard & Organizations (P2)
**User Stories**: US3 (Dashboard & Organization Creation)

**Deliverables**:
- [ ] Install shadcn sidebar block for dashboard layout
- [ ] Create main dashboard page
- [ ] Implement empty state with create org CTA
- [ ] Create organization creation dialog
- [ ] Implement workspace switcher
- [ ] Set up TanStack Query for organization data
- [ ] Add loading and error states
- [ ] Integrate Sentry for org operations

**Files**:
- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/*`
- `components/organization/*`
- `lib/api/organizations.ts`
- `lib/hooks/useOrganizations.ts`

**Testing**: Dashboard rendering, org creation, workspace switching, TanStack Query caching

---

### Phase 4: Team Management (P2)
**User Stories**: US4 (Team Member Invitations), US5 (RBAC)

**Deliverables**:
- [ ] Create team management page
- [ ] Implement member table/list
- [ ] Create invitation dialog
- [ ] Implement pending invitations view
- [ ] Create invitation acceptance page
- [ ] Implement role selection and display
- [ ] Add role-based UI restrictions
- [ ] Integrate Sentry for unauthorized access

**Files**:
- `app/(dashboard)/dashboard/team/page.tsx`
- `app/(auth)/invitations/[token]/page.tsx`
- `components/team/*`
- `lib/api/invitations.ts`
- `lib/hooks/useMembers.ts`
- `lib/hooks/useInvitations.ts`
- `lib/auth/permissions.ts`

**Testing**: Invitation flows, RBAC enforcement, role changes, email/SMS delivery

---

### Phase 5: Platform Administration (P3)
**User Stories**: US6 (Platform Administration Dashboard)

**Deliverables**:
- [ ] Create platform admin dashboard
- [ ] Implement organizations list with filters
- [ ] Create organization detail view
- [ ] Implement admin role management
- [ ] Create activity tracking dashboard
- [ ] Implement compensation calculations
- [ ] Create audit trail viewer
- [ ] Integrate comprehensive Sentry logging

**Files**:
- `app/(dashboard)/admin/*`
- `components/admin/*`
- `lib/api/admin.ts`
- `lib/hooks/useAdmin.ts`
- `lib/admin/sentry.ts`

**Testing**: Admin access control, activity tracking, compensation calculations, audit exports

---

## Risk & Mitigation

### Technical Risks

1. **Risk**: TanStack Query cache invalidation complexity
   - **Impact**: Stale data displayed to users
   - **Mitigation**: Define clear invalidation rules, use optimistic updates, comprehensive testing

2. **Risk**: shadcn component blocks may not fit exact design needs
   - **Impact**: Customization overhead
   - **Mitigation**: Preview blocks first, fork if needed, maintain consistency

3. **Risk**: Sentry event volume may be high
   - **Impact**: Cost and noise
   - **Mitigation**: Careful event selection, sampling in production, filtering

4. **Risk**: Session management across multiple organizations
   - **Impact**: User confusion, context switching bugs
   - **Mitigation**: Clear workspace indicator, TanStack Query per-org caching

### Dependency Risks

1. **Risk**: Backend API not ready
   - **Impact**: Frontend blocked
   - **Mitigation**: Mock API responses, use MSW for development, define contracts early

2. **Risk**: SMS provider reliability
   - **Impact**: OTP delivery failures
   - **Mitigation**: Retry logic, fallback to email, Sentry monitoring

3. **Risk**: Google OAuth downtime
   - **Impact**: Users can't sign in
   - **Mitigation**: Offer alternative auth methods, clear error messaging

## Design Documents

- **Research**: [./research.md](./research.md)
- **Data Model**: [./data-model.md](./data-model.md)
- **Quick Start**: [./quickstart.md](./quickstart.md)
- **API Contracts**: [./contracts/api.md](./contracts/api.md)
- **Type Definitions**: [./contracts/types.ts](./contracts/types.ts)
- **Query Hooks**: [./contracts/queries.md](./contracts/queries.md)

## Success Metrics

Tracked via Sentry, Lighthouse, and analytics:

- Landing page: LCP < 2.5s, Accessibility 95+
- Auth success rate: 99%+
- Dashboard load: < 1s
- Workspace switch: < 2s
- RBAC: 0 unauthorized access incidents
- Sentry event capture: 100% of critical events
- TanStack Query cache hit rate: 70%+

## Next Steps

1. Review this plan with team
2. Run `/speckit.tasks` to break down into granular tasks
3. Set up development environment
4. Begin Phase 1 implementation
5. Test incrementally per phase
6. Monitor Sentry dashboard throughout development
```

---

## Output Format

When user invokes `/speckit.plan`:

### Initial Response

```
# Creating Implementation Plan: [Feature Name]

I'll create a detailed implementation plan for the feature specified in `.specify/specs/###-feature-name/spec.md`.

## Planning Process

### Phase 0: Research (5-10 minutes)
- [⏳] Reading constitution and specification
- [⏳] Analyzing current codebase structure
- [⏳] Identifying reusable components
- [⏳] Documenting technical context

### Phase 1: Design (10-15 minutes)
- [⏳] Defining project structure
- [⏳] Creating data models
- [⏳] Planning component hierarchy
- [⏳] Defining API contracts
- [⏳] Writing quick start guide

### Phase 2: Plan Document (5 minutes)
- [⏳] Compiling implementation plan
- [⏳] Defining phases and deliverables
- [⏳] Documenting risks and mitigations

Starting Phase 0...
```

### Progress Updates

```
✅ Phase 0 Complete: Research

Key findings:
- Constitution requires: Next.js 16, TanStack Query, shadcn/ui blocks, Sentry
- Existing structure: app/ directory with basic setup
- Reusable: components/ui/ has button, card, input
- Challenge: Multi-org workspace switching needs careful TanStack Query setup

Created: research.md

Starting Phase 1: Design...
```

### Completion Response

```
✅ Implementation Plan Complete!

I've created a comprehensive implementation plan for [Feature Name].

## Documents Created

1. **research.md** - Technical research and context
2. **data-model.md** - TypeScript interfaces and API shapes
3. **quickstart.md** - Step-by-step implementation guide
4. **contracts/** - API definitions and query hooks
5. **plan.md** - Complete implementation plan

## Plan Summary

### Structure
- Next.js App Router with route groups
- shadcn/ui component blocks (sidebar, hero, forms)
- TanStack Query for data fetching
- Sentry at critical monitoring points

### Implementation Phases
1. **Phase 1** (P1): Foundation & Landing - 2-3 days
2. **Phase 2** (P1): Authentication - 3-4 days  
3. **Phase 3** (P2): Dashboard & Organizations - 2-3 days
4. **Phase 4** (P2): Team Management - 3-4 days
5. **Phase 5** (P3): Platform Administration - 4-5 days

**Total Estimate**: 14-19 days

### Constitution Compliance
✅ All requirements met
✅ No deviations needed
✅ TanStack Query for data fetching
✅ Sentry monitoring integrated
✅ shadcn/ui component blocks used

## Next Steps

1. **Review**: Check plan.md and design documents
2. **Clarify**: Address any remaining questions
3. **Tasks**: Run `/speckit.tasks` to break into granular tasks
4. **Implement**: Run `/speckit.implement` to begin coding

Ready to proceed? The plan is in `.specify/specs/###-feature-name/plan.md`
```

---

## Best Practices

### Research Phase

**DO**:
- ✅ Read constitution thoroughly
- ✅ Examine existing code patterns
- ✅ Look for reusable components
- ✅ Check installed dependencies
- ✅ Identify similar features
- ✅ Document findings clearly

**DON'T**:
- ❌ Skip constitution review
- ❌ Ignore existing patterns
- ❌ Reinvent solved problems
- ❌ Plan in isolation from codebase

### Design Phase

**DO**:
- ✅ Follow constitution strictly
- ✅ Use shadcn component blocks first
- ✅ Design for TanStack Query patterns
- ✅ Plan Sentry integration points
- ✅ Create reusable components
- ✅ Think in Next.js App Router paradigms
- ✅ Document all contracts clearly

**DON'T**:
- ❌ Ignore component blocks
- ❌ Create unnecessary abstractions
- ❌ Skip TypeScript types
- ❌ Plan duplicate components
- ❌ Forget about monitoring
- ❌ Overcomplicate structure

### Planning Phase

**DO**:
- ✅ Break into logical phases
- ✅ Align phases with spec priorities
- ✅ Define clear deliverables
- ✅ Include testing approach
- ✅ Document risks
- ✅ Estimate realistically

**DON'T**:
- ❌ Create waterfall dependencies
- ❌ Skip testing considerations
- ❌ Ignore risks
- ❌ Over-promise timelines

## Constitution Integration

For this project, always ensure:

1. **Next.js Best Practices**
   - App Router file conventions
   - Server Components by default
   - Metadata API for SEO
   - next/image for images
   - next/link for navigation

2. **shadcn/ui Priority**
   - Search component blocks FIRST
   - Use individual components second
   - Custom components LAST resort
   - Document which blocks/components used

3. **TanStack Query Integration**
   - Define query keys clearly
   - Plan cache invalidation
   - Use optimistic updates
   - Handle loading/error states

4. **Sentry Monitoring**
   - Auth events
   - Authorization failures
   - Critical errors
   - Admin actions
   - Performance tracking

5. **Clean Code**
   - No duplication
   - Clear naming
   - Proper TypeScript types
   - Reusable utilities
   - Feature-based organization

## Integration with Other Commands

### After Planning

1. **Review Plan**: Stakeholders review all design documents
2. **Run `/speckit.tasks`**: Break plan into granular implementation tasks
3. **Run `/speckit.implement`**: Begin implementation following quick start guide

### During Implementation

- Reference plan.md for structure decisions
- Use quickstart.md as implementation guide
- Follow contracts/ for API integration
- Check data-model.md for types
- Refer to research.md for context

## Notes

- Planning should take 20-30 minutes total (not including breaks for user input)
- All design documents are living documents - update as you implement
- Constitution compliance is NON-NEGOTIABLE
- When in doubt, prefer simpler solutions
- TanStack Query and Sentry are mandatory for this project
- shadcn component blocks save significant development time
- Good planning prevents implementation churn

---

**Ready to transform your specification into an actionable plan? Invoke this command with your feature branch checked out!**
