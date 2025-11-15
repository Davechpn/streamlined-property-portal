# Clarifications: Accounts Module & Landing Page

**Last Updated**: 2025-11-15  
**Feature**: 001-accounts  
**Status**: Awaiting responses

## Session 2025-11-15 (Initial Review)

### 🔴 Critical Questions

**Q1**: **Backend API Format**
- **Asked**: Is the backend API REST or GraphQL? This affects TanStack Query hook design and data fetching patterns.
- **Context**: Spec mentions "RESTful or GraphQL API" in dependencies but doesn't specify which
- **Impact**: Completely changes how we structure API client, query hooks, and data transformations
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-DATA-001 to FR-DATA-008

**Q2**: **Organization Name Case Sensitivity**
- **Asked**: Should organization names be case-insensitive for uniqueness? (e.g., should "ABC Corp" and "abc corp" be considered the same organization?)
- **Context**: FR-ORG-001 says "globally unique names" but doesn't specify case handling
- **Impact**: Affects validation logic, database constraints, error messages, and user experience during org creation
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-ORG-001, FR-ORG-UI-002

---

### ⚠️ Important Questions

**Q3**: **Workspace Switcher Component Choice**
- **Asked**: Which specific shadcn component should we use for workspace switcher? Dropdown menu or command palette (⌘K style)?
- **Context**: FR-DASH-005 mentions "shadcn dropdown or command palette" without specifying preference
- **Impact**: Affects UX for users with many organizations, keyboard shortcuts, and search functionality
- **Considerations**:
  - Dropdown: Simpler, good for < 10 organizations
  - Command Palette: Better for power users, supports search, keyboard shortcuts
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-DASH-005, FR-ORG-UI-006

**Q4**: **Landing Page Content Specifics**
- **Asked**: 
  a) Should we include a testimonials section (with placeholders)?
  b) Should pricing information be displayed on the landing page?
- **Context**: FR-LAND-004 mentions "testimonials (placeholders)" and "pricing information (if applicable)"
- **Impact**: Affects landing page structure, number of sections, component selection from shadcn blocks
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-LAND-004

**Q5**: **Profile Photo Storage**
- **Asked**: How should profile photos be uploaded and stored? 
  - Option A: Direct upload to backend API (backend handles storage)
  - Option B: Client gets presigned URL, uploads to S3/cloud storage directly
  - Option C: Other mechanism?
- **Context**: Constraints mention "File uploads (profile photos) MUST be limited to 5MB" but no upload mechanism specified
- **Impact**: Affects file upload implementation, progress indicators, error handling, and API design
- **Status**: ⏳ Awaiting response
- **Related Requirements**: Constraints section, User entity

**Q6**: **Session Storage Mechanism**
- **Asked**: Should sessions be stored exclusively in httpOnly cookies, or use a combination (httpOnly cookie for token + localStorage for client-side state)?
- **Context**: FR-AUTH-018 mentions "secure session management" and security requires "httpOnly cookies"
- **Considerations**:
  - httpOnly cookies only: More secure, but requires server-side session checks
  - Hybrid: Cookie for auth token, localStorage for user preferences/UI state
- **Impact**: Affects authentication middleware, session persistence, TanStack Query configuration, and server/client component split
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-AUTH-018, Security Requirements

---

### 📋 Nice to Have Questions

**Q7**: **Email Verification Enforcement**
- **Asked**: Is email verification required for any features beyond password reset? Can unverified users fully use the platform?
- **Context**: US2 acceptance scenario 2 says "email verification required for password reset" but doesn't specify if other features require it
- **Impact**: Affects UI messaging, feature gating, user onboarding flow, and email verification prompts
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-AUTH-011, User Story 2

**Q8**: **Maximum Organizations per User**
- **Asked**: What's a reasonable expected maximum number of organizations per user?
- **Context**: Assumptions say "Users can belong to unlimited organizations" but no practical limit defined
- **Considerations**:
  - If most users have < 10 orgs: Simple dropdown works well
  - If 20+ orgs expected: Command palette with search is better
  - If 100+ orgs possible: Need pagination/virtualization
- **Impact**: Affects workspace switcher design, performance optimization, and UI/UX decisions
- **Status**: ⏳ Awaiting response
- **Related Requirements**: FR-DASH-005, Assumptions

---

## Suggested Component Blocks (For Planning Phase)

These are recommendations for shadcn component blocks to research during planning:

### Landing Page
- **Hero Section**: `hero-01`, `hero-02`, or similar blocks from registry
- **Features Section**: `feature-grid-01` or feature card blocks
- **CTA Section**: `cta-01` or call-to-action blocks

### Dashboard Layout
- **Main Layout**: `sidebar-01`, `sidebar-02`, or `sidebar-03`
  - Question: Should sidebar be collapsible or persistent?
- **Empty States**: Check for empty state blocks
- **User Menu**: Dropdown menu components

### Forms & Dialogs
- **Auth Forms**: Form blocks with validation
- **Invitation Dialog**: Dialog + form blocks
- **Organization Settings**: Settings page blocks

**Note**: Exact block names will be confirmed during planning phase by searching shadcn registry.

---

## Previous Clarifications (Resolved)

### Session 2025-11-15 (From Backend Spec)

These clarifications were already addressed in the initial specification:

**Q**: What are the specific platform admin role types and their permissions?  
**A**: ✅ Operations Admin (system management), Customer Support Admin (user/org assistance), Business Admin (compensation & reporting)  
**Updated**: FR-ADMIN-005

**Q**: Are organization names globally unique across the platform or scoped to individual users?  
**A**: ✅ Globally unique across entire platform (no two organizations can have same name)  
**Updated**: FR-ORG-001

**Q**: What is the specific tiered bonus structure for platform admin compensation?  
**A**: ✅ Scaled tiers: 1-10 orgs=$30 each, 11-25=$50 each, 26+=$75 each (monthly)  
**Updated**: FR-ACTIVITY-006

**Q**: How is the initial super admin account securely created during system setup?  
**A**: ✅ Database seeding script with hardcoded initial super admin during setup  
**Updated**: Assumptions

**Q**: What are the OTP retry limits and rate limiting rules to prevent SMS abuse?  
**A**: ✅ 5 OTP requests per phone number per 15 minutes, 3 verification attempts per OTP  
**Updated**: FR-AUTH-007, FR-AUTH-008

---

## Summary

**Total Questions**: 8
- 🔴 Critical: 2
- ⚠️ Important: 4
- 📋 Nice to Have: 2

**Status**: ⏳ Awaiting responses before proceeding to planning phase

**Next Steps**:
1. Await answers to critical questions (Q1, Q2)
2. Await answers to important questions (Q3-Q6)
3. Optionally address nice-to-have questions (Q7-Q8)
4. Update spec.md with clarified requirements
5. Proceed to `/speckit.plan` once critical questions are resolved

---

**Please provide answers by question number or let's discuss each in detail!**
