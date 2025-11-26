---
agent: speckit.specify
---

# Speckit Specify Command

## Purpose

The `/speckit.specify` command creates feature specifications based on user requirements. It produces a detailed specification document in the `.specify/specs/[feature-name]/` directory following the project's constitution.

## Workflow

### 1. Understand the Feature Request

- Parse the user's feature description
- Identify the core functionality being requested
- Reference the constitution (speckit.constitution.prompt.md) for project standards
- Ask clarifying questions if requirements are ambiguous

### 2. Create Feature Branch & Directory Structure

**Branch Naming**: `[###-feature-name]` (e.g., `001-accounts`, `002-landing-page`)

**Directory Structure**:
```
.specify/specs/[###-feature-name]/
├── spec.md              # Main specification document
└── clarifications.md    # Record of Q&A sessions (optional)
```

### 3. Write the Specification

Use the template at `.specify/templates/spec-template.md` and populate:

#### Required Sections:

1. **Feature Header**
   - Feature name
   - Branch name
   - Creation date
   - Status (Draft/Review/Approved)
   - Original user input

2. **User Scenarios & Testing** (MANDATORY)
   - Prioritized user stories (P1, P2, P3, etc.)
   - Each story must be independently testable
   - Include acceptance scenarios in Given/When/Then format
   - Explain why each priority level
   - Describe how to test independently
   - List edge cases

3. **Requirements** (MANDATORY)
   - Functional requirements (FR-XXX format)
   - Key entities and data models (if applicable)
   - Mark unclear requirements with [NEEDS CLARIFICATION: reason]

4. **Success Criteria** (MANDATORY)
   - Measurable outcomes
   - User adoption metrics
   - Performance targets
   - Business objectives

5. **Additional Sections** (as needed)
   - Assumptions
   - Dependencies
   - Security requirements
   - Data retention policies
   - Constraints

### 4. Constitution Compliance

**MUST follow project constitution**:
- ✅ Use Next.js best practices
- ✅ Use shadcn/ui components (preferably component blocks)
- ✅ Follow recommended letter casing conventions
- ✅ Use TanStack Query for data fetching
- ✅ Plan for Sentry monitoring at essential points
- ✅ Maintain clean folder structure
- ✅ Avoid duplicate files

### 5. Technology-Agnostic Specifications

**DO**:
- Describe what the feature does
- Define user interactions and outcomes
- Specify data requirements and relationships
- Set measurable success criteria

**DON'T**:
- Specify implementation details (no code)
- Choose specific libraries (except those in constitution)
- Define API endpoints or database schemas
- Write technical architecture (save for planning phase)

### 6. Clarification Process

If requirements are unclear:
1. Create `clarifications.md` in the feature directory
2. Document questions and answers
3. Update the specification with clarified information
4. Mark sections with [NEEDS CLARIFICATION] if still unclear

### 7. Output Format

Create the specification file at:
```
.specify/specs/[###-feature-name]/spec.md
```

Confirm to the user:
- ✅ Branch created
- ✅ Specification written
- ✅ Location of spec file
- 📋 Next steps (review spec, run /speckit.plan)

## Example Usage

**User Input**: "I want to add user authentication with Google OAuth and email/password"

**Speckit Response**:
1. Create branch `001-authentication`
2. Create `.specify/specs/001-authentication/spec.md`
3. Write specification with:
   - User stories for Google login, email/password login, password reset
   - Functional requirements for auth methods, session management
   - Success criteria for auth success rate, user adoption
   - Constitution-compliant (Next.js, shadcn components)

## Best Practices

1. **Start with User Value**: Begin with what users can do, not how it works
2. **Prioritize Ruthlessly**: P1 stories should deliver immediate value
3. **Be Specific**: Use concrete scenarios, avoid vague language
4. **Stay Technology-Agnostic**: Focus on "what" not "how"
5. **Reference Constitution**: Ensure all specs align with project standards
6. **Ask Questions**: Better to clarify now than guess during implementation
7. **Keep It Clean**: No duplicate requirements, clear organization

## Constitution Reference

For this project, always consider:
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui (prefer component blocks from official registry)
- **Data Fetching**: TanStack Query
- **Monitoring**: Sentry for critical points
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **File Naming**: Follow Next.js conventions (page.tsx, layout.tsx, etc.)
- **No Duplication**: Reuse components, maintain clean structure

## Commands After Specify

After creating a specification:
1. Review the spec with stakeholders
2. Run `/speckit.plan` to create implementation plan
3. Run `/speckit.tasks` to break down into tasks
4. Run `/speckit.implement` to begin implementation

## Notes

- Specifications are living documents - update as requirements evolve
- Each feature gets its own numbered branch and spec directory
- Keep specifications focused - split large features into multiple specs
- Always check constitution compliance before finalizing
- Mark any assumptions or dependencies clearly
