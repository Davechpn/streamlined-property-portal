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
- **Answered**: ✅ **REST API**
- **Status**: ✅ Resolved
- **Related Requirements**: FR-DATA-001 to FR-DATA-008
- **Implementation Notes**: 
  - Use standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
  - TanStack Query with clear cache keys per endpoint
  - Axios or fetch for API client

**Q2**: **Organization Name Case Sensitivity**
- **Asked**: Should organization names be case-insensitive for uniqueness? (e.g., should "ABC Corp" and "abc corp" be considered the same organization?)
- **Context**: FR-ORG-001 says "globally unique names" but doesn't specify case handling
- **Impact**: Affects validation logic, database constraints, error messages, and user experience during org creation
- **Answered**: ✅ **Case-insensitive** - "ABC Corp" and "abc corp" are considered the same
- **Status**: ✅ Resolved
- **Related Requirements**: FR-ORG-001, FR-ORG-UI-002
- **Implementation Notes**:
  - Store original case in database (preserve user's input)
  - Validate uniqueness using lowercase comparison
  - Backend should enforce case-insensitive unique constraint
  - Error message: "An organization with this name already exists"

---

### ⚠️ Important Questions

**Q3**: **Workspace Switcher Component Choice**
- **Asked**: Which specific shadcn component should we use for workspace switcher? Dropdown menu or command palette (⌘K style)?
- **Context**: FR-DASH-005 mentions "shadcn dropdown or command palette" without specifying preference
- **Impact**: Affects UX for users with many organizations, keyboard shortcuts, and search functionality
- **Answered**: ✅ **Dropdown Menu (Option A)** - Simple shadcn dropdown menu component
- **Status**: ✅ Resolved
- **Related Requirements**: FR-DASH-005, FR-ORG-UI-006, FR-ORG-UI-007
- **Implementation Notes**:
  - Use shadcn Dropdown Menu component
  - Show organization name and user's role
  - Display last active timestamp
  - Include "Create Organization" option at bottom
  - If many orgs become an issue, can upgrade to command palette later

**Q4**: **Landing Page Content Specifics**
- **Asked**: 
  a) Should we include a testimonials section (with placeholders)?
  b) Should pricing information be displayed on the landing page?
- **Context**: FR-LAND-004 mentions "testimonials (placeholders)" and "pricing information (if applicable)"
- **Impact**: Affects landing page structure, number of sections, component selection from shadcn blocks
- **Answered**: ✅ **Skip testimonials and pricing for now**
- **Status**: ✅ Resolved
- **Related Requirements**: FR-LAND-001 to FR-LAND-010
- **Implementation Notes**:
  - **Include**: Hero, Features, How It Works (optional 3-step process), Secondary CTA, Footer
  - **Skip**: Testimonials, Pricing
  - **Can add later**: When real testimonials available, when pricing model finalized
  - Focus on clean, simple landing page that drives signups

**Q5**: **Profile Photo Storage**
- **Asked**: How should profile photos be uploaded and stored? 
  - Option A: Direct upload to backend API (backend handles storage)
  - Option B: Client gets presigned URL, uploads to S3/cloud storage directly
  - Option C: Other mechanism?
- **Context**: Constraints mention "File uploads (profile photos) MUST be limited to 5MB" but no upload mechanism specified
- **Impact**: Affects file upload implementation, progress indicators, error handling, and API design
- **Answered**: ✅ **Option A - Direct Backend Upload**
- **Status**: ✅ Resolved
- **Related Requirements**: Constraints section, User entity
- **Implementation Notes**:
  - Use FormData to upload file to backend API endpoint
  - Backend handles validation (file type, size limit 5MB)
  - Backend stores in S3/cloud storage and returns URL
  - Show upload progress with progress bar
  - Image preview before upload
  - Accept: image/jpeg, image/png, image/webp
  - Display errors clearly (file too large, invalid format, etc.)

**Q6**: **Session Storage Mechanism**
- **Asked**: Should sessions be stored exclusively in httpOnly cookies, or use a combination (httpOnly cookie for token + localStorage for client-side state)?
- **Context**: FR-AUTH-018 mentions "secure session management" and security requires "httpOnly cookies"
- **Answered**: ✅ **Option B - Hybrid Approach**
- **Status**: ✅ Resolved
- **Related Requirements**: FR-AUTH-018, FR-AUTH-019, Security Requirements
- **Implementation Notes**:
  - **Auth Token**: Stored in httpOnly cookie (secure, XSS-proof)
    - Backend sets cookie on successful login
    - Frontend never accesses token directly
    - Automatically sent with API requests
  - **User Data**: Cached by TanStack Query (client-side, fast access)
    - Initial fetch on app load
    - Cached for performance
    - Invalidated on logout/role change
  - **UI Preferences**: localStorage (non-sensitive data only)
    - Theme, language, etc.
  - **Middleware**: Validates httpOnly cookie on protected routes
  - **Session Duration**: 1 hour default, 7 days with "remember me"

---

### 📋 Nice to Have Questions

**Q7**: **Email Verification Enforcement**
- **Asked**: Is email verification required for any features beyond password reset? Can unverified users fully use the platform?
- **Context**: US2 acceptance scenario 2 says "email verification required for password reset" but doesn't specify if other features require it
- **Impact**: Affects UI messaging, feature gating, user onboarding flow, and email verification prompts
- **Answered**: ✅ **Option A - Verification Optional (only required for password reset)**
- **Status**: ✅ Resolved
- **Related Requirements**: FR-AUTH-011, User Story 2
- **Implementation Notes**:
  - Unverified users can access all platform features
  - Email verification only blocks password reset functionality
  - Show dismissible banner: "Please verify your email address"
  - Resend verification email option in user settings
  - Better user experience, higher conversion rates

**Q8**: **Maximum Organizations per User**
- **Asked**: What's a reasonable expected maximum number of organizations per user?
- **Context**: Assumptions say "Users can belong to unlimited organizations" but no practical limit defined
- **Impact**: Affects workspace switcher design, performance optimization, and UI/UX decisions
- **Answered**: ✅ **Option A - No limit, monitor and adjust**
- **Status**: ✅ Resolved
- **Related Requirements**: FR-DASH-005, Assumptions
- **Implementation Notes**:
  - Build for 2-10 organizations initially (simple dropdown works well)
  - No hard limit enforced
  - Monitor actual usage patterns
  - If users consistently exceed 10 orgs, can add:
    - Search functionality in dropdown
    - Upgrade to command palette
    - Pagination or virtualization
  - Simple dropdown sufficient for MVP, optimize later if needed

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
- 🔴 Critical: 2 → ✅ All Resolved
- ⚠️ Important: 4 → ✅ All Resolved
- 📋 Nice to Have: 2 → ✅ All Resolved

**Status**: ✅ **ALL CLARIFICATIONS COMPLETE - READY FOR PLANNING**

### Resolved Decisions Summary

1. ✅ **Backend API**: REST
2. ✅ **Organization Names**: Case-insensitive uniqueness
3. ✅ **Workspace Switcher**: Simple dropdown menu
4. ✅ **Landing Page**: Skip testimonials & pricing (Hero, Features, CTA, Footer)
5. ✅ **Profile Photos**: Direct backend upload
6. ✅ **Sessions**: Hybrid (httpOnly cookie + TanStack Query cache)
7. ✅ **Email Verification**: Optional (only required for password reset)
8. ✅ **Max Organizations**: No limit, build for 2-10, monitor and adjust

**Next Steps**:
1. ✅ Update spec.md with clarified requirements
2. ✅ Commit clarifications
3. 🚀 **Ready to run `/speckit.plan`**

---

**Please provide answers by question number or let's discuss each in detail!**
