---
agent: speckit.clarify
---

# Speckit Clarify Command

## Purpose

The `/speckit.clarify` command helps gather missing information and resolve ambiguities in feature specifications before moving to the planning phase. It ensures specifications are complete, clear, and implementable.

## When to Use

Use `/speckit.clarify` when:
- Feature specification contains `[NEEDS CLARIFICATION]` markers
- Requirements are vague or ambiguous
- User stories lack specific acceptance criteria
- Technical constraints are unclear
- Business rules need definition
- Edge cases need clarification
- Dependencies or assumptions are uncertain
- Success metrics are not measurable
- After initial specification review reveals gaps

## Workflow

### 1. Analyze the Current Specification

Read the specification at `.specify/specs/[###-feature-name]/spec.md` and identify:
- Sections marked with `[NEEDS CLARIFICATION: reason]`
- Vague or ambiguous requirements
- Missing acceptance criteria
- Undefined edge cases
- Unclear business rules
- Unmeasurable success criteria
- Missing technical constraints
- Undefined data relationships
- Gaps in user scenarios

### 2. Generate Clarifying Questions

Create specific, targeted questions organized by category:

#### Question Categories:

**User Experience & Scenarios:**
- How should the system behave in [specific situation]?
- What should users see when [specific condition]?
- What happens after [specific action]?
- How do users recover from [error state]?

**Requirements & Business Rules:**
- What are the validation rules for [field/entity]?
- What is the priority/importance of [requirement]?
- Is [requirement] mandatory or optional?
- What are the business rules for [process]?
- Who can perform [action]?

**Data & Entities:**
- What are the required/optional fields for [entity]?
- How are [entities] related?
- What uniqueness constraints exist?
- What are the data retention requirements?
- What happens to related data when [entity] is deleted?

**Technical Constraints:**
- What are the performance requirements for [feature]?
- What are the scalability expectations?
- Are there specific browser/device requirements?
- What are the integration points with [system]?
- What security/compliance requirements apply?

**Edge Cases:**
- What happens when [boundary condition]?
- How should the system handle [error scenario]?
- What if [unexpected input/state]?
- How to handle concurrent [operations]?

**Dependencies:**
- What external services are required?
- What existing features/systems does this depend on?
- What data must exist before implementing this?
- Are there sequencing requirements?

### 3. Document Questions

Create or update `.specify/specs/[###-feature-name]/clarifications.md`:

```markdown
# Clarifications: [Feature Name]

**Last Updated**: [DATE]

## Session [DATE]

### User Experience & Scenarios

**Q1**: How should the system behave when a user tries to create an organization with a name that already exists?
- **Asked**: Need to define exact error message and user guidance
- **Status**: ⏳ Awaiting response

**Q2**: What happens if a user is removed from an organization while actively using it?
- **Asked**: Need to define session handling and user notification
- **Status**: ⏳ Awaiting response

### Requirements & Business Rules

**Q3**: What are the password complexity requirements beyond the minimum 8 characters?
- **Asked**: Backend spec mentioned uppercase, lowercase, digit - need confirmation for frontend
- **Answered**: ✅ Minimum 8 characters, at least one uppercase, one lowercase, one digit, optionally one special character
- **Updated**: FR-AUTH-009

### Data & Entities

**Q4**: Are organization names case-sensitive for uniqueness?
- **Asked**: Need to clarify if "Company ABC" and "company abc" are considered duplicates
- **Status**: ⏳ Awaiting response

### Technical Constraints

**Q5**: What is the expected maximum number of organizations per user?
- **Asked**: Need to determine if we need pagination for workspace switcher
- **Status**: ⏳ Awaiting response

### Edge Cases

**Q6**: How are orphaned organizations handled if the only owner leaves?
- **Asked**: Need business rule - prevent leaving, auto-assign new owner, or delete organization?
- **Status**: ⏳ Awaiting response

## Session [PREVIOUS DATE]

[Previous clarification sessions...]
```

### 4. Present Questions to Stakeholders

When user invokes `/speckit.clarify`:

1. **Summarize current state**:
   - "I've reviewed the specification for [feature name]"
   - "Found [X] areas needing clarification"

2. **Present questions clearly**:
   - Group by category
   - Number questions for easy reference
   - Explain why each clarification is needed
   - Provide context from the spec

3. **Guide the conversation**:
   - Ask follow-up questions based on answers
   - Probe for edge cases
   - Verify understanding
   - Challenge vague responses

### 5. Document Answers

For each answered question:

1. **Update clarifications.md**:
   - Mark question as answered: `✅`
   - Document the answer clearly
   - Note which requirement(s) were updated

2. **Update the specification**:
   - Remove `[NEEDS CLARIFICATION]` markers
   - Add/update functional requirements
   - Enhance user scenarios with new details
   - Add edge cases to the list
   - Update success criteria if needed
   - Add to assumptions or constraints if relevant

3. **Cross-reference**:
   - Link clarification to specific requirement IDs
   - Update related sections consistently

### 6. Iterative Process

Continue clarification sessions until:
- All `[NEEDS CLARIFICATION]` markers are resolved
- All critical questions are answered
- User scenarios have clear acceptance criteria
- Edge cases are defined
- Success criteria are measurable
- Technical constraints are clear
- Stakeholders confirm specification is complete

## Output Format

### Initial Response (when `/speckit.clarify` is called)

```
# Clarifications Needed: [Feature Name]

I've reviewed the specification at `.specify/specs/###-feature-name/spec.md`.

## Summary
- ✅ [X] areas are clear and well-defined
- ⚠️ [Y] areas need clarification
- 🔴 [Z] critical gaps that block implementation

## Questions by Priority

### 🔴 Critical (blocks implementation)

1. **Organization Name Uniqueness**: 
   - Current: Spec says "globally unique" but doesn't specify case sensitivity
   - Question: Are organization names case-sensitive? Is "Company ABC" different from "company abc"?
   - Impact: Affects database schema, validation logic, and user experience

2. **Owner Removal Prevention**:
   - Current: Edge case identified but no rule defined
   - Question: How should the system handle when the only owner tries to leave?
   - Impact: Affects member management business logic and UI

### ⚠️ Important (affects user experience)

3. **Workspace Switcher Scalability**:
   - Current: Spec says users can belong to unlimited organizations
   - Question: What's the expected maximum? Do we need pagination/search in workspace switcher?
   - Impact: Affects UI design and performance

[More questions...]

## Next Steps

Please answer these questions, and I'll:
1. Update the clarifications.md file
2. Update the specification with your answers
3. Remove NEEDS CLARIFICATION markers
4. Identify any follow-up questions

Ready when you are! You can answer by question number.
```

### After Receiving Answers

```
✅ **Clarifications Updated**

I've documented your answers and updated the specification:

## Updated Sections

### clarifications.md
- ✅ Added Session 2025-11-15 with [X] Q&A pairs
- 📝 [Y] questions still pending

### spec.md
- Updated FR-ORG-001: Added case-insensitive uniqueness constraint
- Updated Edge Cases: Added owner removal prevention rule
- Updated Success Criteria: Added workspace switcher performance target
- Removed 3 NEEDS CLARIFICATION markers

## Remaining Questions: [Y]

[List any questions still pending...]

## Status
- Specification is [X%] complete
- [Ready for planning / Needs more clarification]

[If ready]: "✅ All critical clarifications resolved! Ready to run `/speckit.plan`"
[If not ready]: "⏳ Please address the remaining [Y] questions when ready."
```

## Best Practices

### Asking Questions

**DO**:
- ✅ Ask specific, targeted questions
- ✅ Provide context from the specification
- ✅ Explain why the clarification is needed
- ✅ Suggest possible answers when appropriate
- ✅ Group related questions together
- ✅ Prioritize questions by impact
- ✅ Ask about edge cases and error scenarios
- ✅ Probe for measurable success criteria

**DON'T**:
- ❌ Ask open-ended "what do you want?" questions
- ❌ Make assumptions without confirming
- ❌ Ask technical implementation questions (save for planning)
- ❌ Bundle too many questions into one
- ❌ Skip obvious edge cases
- ❌ Accept vague answers without probing

### Documenting Answers

**DO**:
- ✅ Record exact answers, not interpretations
- ✅ Update specification immediately
- ✅ Cross-reference clarifications with requirements
- ✅ Mark questions as answered with ✅
- ✅ Keep clarification history for audit trail
- ✅ Update all related sections consistently

**DON'T**:
- ❌ Delete answered questions from clarifications.md
- ❌ Leave NEEDS CLARIFICATION markers after resolution
- ❌ Update spec without documenting in clarifications.md
- ❌ Forget to update related sections

### Handling Uncertain Answers

If stakeholder is uncertain:
1. Suggest reasonable defaults based on best practices
2. Mark as "assumed, subject to change"
3. Document the assumption in spec's Assumptions section
4. Flag for review during planning phase

## Constitution Compliance

During clarification, ensure answers align with project constitution:
- Next.js best practices
- shadcn/ui component usage (preferably blocks)
- TanStack Query patterns
- Proper casing conventions
- Clean folder structure
- Sentry monitoring requirements

Flag any clarifications that conflict with constitution and discuss alternatives.

## Integration with Other Commands

### Before Planning
- `/speckit.clarify` must resolve all critical ambiguities
- Planning cannot proceed with NEEDS CLARIFICATION markers
- Spec should be 95%+ complete before `/speckit.plan`

### During Planning
- If ambiguities are discovered during planning, return to clarify
- Update clarifications.md even after planning begins
- Keep specification and plan in sync

### After Implementation
- Clarifications.md serves as decision documentation
- Helps explain "why" for future developers
- Useful for onboarding and knowledge transfer

## Example Clarification Session

**User**: `/speckit.clarify`

**Agent**: 
```
I've reviewed the specification for Accounts Module & Landing Page.

## Summary
- ✅ 85% of requirements are clear
- ⚠️ 8 areas need clarification
- 🔴 2 critical gaps

## Critical Questions

1. **Organization Name Uniqueness (Critical)**
   - Current: "globally unique names" but case sensitivity undefined
   - Question: Should "ABC Corp" and "abc corp" be considered the same?
   - Impact: Database constraints, validation logic, error messages

2. **Owner Transfer Process (Critical)**
   - Current: Edge case mentions "orphaned organizations" but no solution
   - Question: Can the last owner leave? If not, what's required?
   - Impact: Member removal business logic and UI flows

[More questions...]
```

**User**: 
```
1. Case-insensitive uniqueness - treat as same organization
2. Last owner cannot leave, must transfer ownership first
```

**Agent**:
```
✅ Updated!

## Changes Made

### spec.md
- FR-ORG-001: Added "case-insensitive uniqueness" constraint
- Edge Cases: Added "Last owner must transfer ownership before leaving"
- FR-MEMBER-005: Updated to include ownership transfer requirement

### clarifications.md
- Session 2025-11-15: Documented both Q&A
- Marked both questions as ✅ Answered

## Remaining: 6 questions

[Continue with next questions...]
```

## Notes

- Clarification is iterative - may take multiple sessions
- Don't rush - thorough clarification prevents costly implementation changes
- Document everything - future you will thank you
- Balance thoroughness with progress - not every detail needs pre-clarification
- Use judgment to determine when specification is "good enough" to proceed
- Constitution serves as a guide for clarification priorities

---

**Ready to clarify your specification? Invoke this command with an active spec branch!**
