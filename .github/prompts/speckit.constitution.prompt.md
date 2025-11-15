---
agent: speckit.constitution
---

# Streamlined Property Portal - Constitution

This document defines the core principles, standards, and best practices for the Streamlined Property Portal project.

## Project Overview

A modern, streamlined property portal built with Next.js 16 (App Router), React 19, TypeScript, and shadcn/ui components.

## Core Principles

### 1. Next.js Best Practices

- **App Router**: Use the App Router (`app/` directory) for all routing
- **File Naming**: Follow Next.js conventions:
  - `page.tsx` for route pages
  - `layout.tsx` for layouts
  - `loading.tsx` for loading states
  - `error.tsx` for error boundaries
  - `not-found.tsx` for 404 pages
- **Server Components**: Default to Server Components; use Client Components (`'use client'`) only when necessary (interactivity, hooks, browser APIs)
- **Metadata**: Use the Metadata API for SEO in layout/page files
- **Image Optimization**: Always use `next/image` for images
- **Font Optimization**: Use `next/font` for web fonts
- **Link Navigation**: Use `next/link` for internal navigation

### 2. TypeScript Standards

- **Strict Mode**: Maintain strict TypeScript configuration
- **Type Safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes, types for unions/intersections
- **File Extensions**: Use `.tsx` for React components, `.ts` for utilities

### 3. File Structure & Naming Conventions

**Directory Structure:**
```
app/                    # Next.js App Router
├── (routes)/          # Route groups (optional)
├── api/               # API routes
├── layout.tsx         # Root layout
├── page.tsx           # Home page
└── globals.css        # Global styles

components/            # React components
├── ui/               # shadcn/ui components
└── [feature]/        # Feature-specific components

lib/                  # Utilities and helpers
├── utils.ts          # Utility functions
└── [module].ts       # Additional modules

hooks/                # Custom React hooks
public/               # Static assets
```

**Naming Conventions:**
- **Components**: PascalCase (e.g., `PropertyCard.tsx`, `SearchBar.tsx`)
- **Utilities**: camelCase (e.g., `formatPrice.ts`, `validateEmail.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePropertySearch.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `Property`, `SearchFilters`)

### 4. Component Standards

#### ALWAYS Use shadcn/ui Components

**MANDATORY**: All UI components must be built using shadcn/ui as the foundation. Never create custom UI components from scratch.

**Component Selection Priority (in order):**

1. **FIRST CHOICE - Component Blocks** (HIGHLY PREFERRED)
   - Search for shadcn component blocks (pre-built, full-featured compositions)
   - Examples: `sidebar-01`, `login-form`, `dashboard-01`, `hero-section`
   - View blocks: `npx shadcn@latest view @shadcn`
   - Search blocks: Use the MCP shadcn tools to find relevant blocks
   - Blocks are production-ready and follow best practices
   - **ALWAYS check for blocks before using individual components**

2. **SECOND CHOICE - Individual shadcn/ui Components**
   - Use when no suitable block exists
   - Common components: Button, Card, Input, Form, Select, Dialog, Dropdown Menu
   - Install via: `npx shadcn@latest add [component-name]`
   - Compose multiple shadcn components together

3. **LAST RESORT - Custom Components**
   - Only create when absolutely no shadcn solution exists
   - Must extend or wrap shadcn components, not replace them
   - Custom components should use shadcn primitives internally

**How to Find shadcn Components:**
- Search component blocks: Use MCP tools `mcp_shadcn_search_items_in_registries`
- View examples: Use `mcp_shadcn_get_item_examples_from_registries`
- Browse registry: `npx shadcn@latest view @shadcn`
- Check documentation: https://ui.shadcn.com

**Installation:**
- Add components: `npx shadcn@latest add [component-name]`
- Add multiple: `npx shadcn@latest add button card input form`
- Components are installed in `components/ui/`

**Customization Rules:**
- ✅ **DO**: Extend shadcn components with additional props
- ✅ **DO**: Compose shadcn components together
- ✅ **DO**: Override styles using Tailwind classes
- ❌ **DON'T**: Duplicate shadcn component code
- ❌ **DON'T**: Create alternatives to existing shadcn components
- ❌ **DON'T**: Build UI from scratch when shadcn has a solution

**Available shadcn Resources:**
- **Component Blocks**: Full-featured, production-ready compositions (PREFERRED)
  - Examples: `sidebar-01`, `sidebar-02`, `login-01`, `dashboard-01`, `card-01`
  - Search: `npx shadcn@latest view @shadcn` or use MCP tools
  - These are complete solutions, not just single components
- **Individual Components**: Button, Card, Input, Form, Select, Dialog, Tabs, etc.
  - Use when blocks don't fit your needs
  - Compose multiple components together
- **Icons**: lucide-react (already included in project)
- **Utilities**: `cn()` for className merging, CVA for variants

#### Component Best Practices

- **Single Responsibility**: Each component should do one thing well
- **Composition**: Favor composition over inheritance
- **Props**: Use TypeScript interfaces for props
- **Default Exports**: Use default exports for page/layout files, named exports for components
- **No Duplication**: Avoid creating duplicate or unnecessary files

### 5. Styling Standards

- **Tailwind CSS**: Use Tailwind utility classes for styling
- **CSS Variables**: Leverage shadcn's CSS variable system for theming
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- **Dark Mode**: Support dark mode using Tailwind's `dark:` variant
- **Class Organization**: Use `cn()` utility from `lib/utils.ts` for conditional classes

### 6. Code Quality

- **DRY Principle**: Don't Repeat Yourself - extract reusable logic
- **Clean Code**: Write self-documenting code with clear naming
- **Comments**: Add comments only when code intent isn't obvious
- **Error Handling**: Implement proper error boundaries and error states
- **Loading States**: Provide loading indicators for async operations
- **Accessibility**: Follow WCAG guidelines, use semantic HTML

### 7. Performance

- **Code Splitting**: Leverage Next.js automatic code splitting
- **Dynamic Imports**: Use dynamic imports for heavy components
- **Image Optimization**: Properly configure `next/image` with appropriate sizes
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` judiciously
- **Bundle Size**: Monitor and minimize bundle size

### 8. Project-Specific Rules

#### Property Portal Features

- **Property Listings**: Use card-based layouts for properties
- **Search & Filters**: Implement robust search with multiple filter options
- **Responsive Design**: Ensure all features work seamlessly on mobile/tablet/desktop
- **Performance**: Optimize for fast page loads and smooth interactions

#### Data Management

- **Type Definitions**: Define clear TypeScript interfaces for all data models
- **State Management**: Use React hooks for local state, consider context for shared state
- **API Integration**: Prepare structure for future API integration

### 9. Development Workflow

- **Incremental Development**: Build features incrementally
- **Testing Mindset**: Structure code to be testable
- **Git Practices**: Use meaningful commit messages
- **Documentation**: Document complex logic and architectural decisions

### 10. File Creation Rules

**AVOID:**
- Creating duplicate files
- Creating unnecessary abstraction layers
- Creating files that should be handled by existing components
- **Building UI components from scratch when shadcn has a solution**
- **Ignoring shadcn component blocks in favor of custom implementations**

**DO:**
- **ALWAYS search shadcn component blocks first**
- **Use shadcn blocks for complex UI patterns (forms, dashboards, sidebars, etc.)**
- Reuse existing components and utilities
- Extend shadcn components when customization is needed
- Create new files only when they serve a clear, unique purpose
- **Check the shadcn registry before writing any UI code**

**Before Creating Any Component:**
1. Search shadcn blocks: `npx shadcn@latest view @shadcn` or use MCP tools
2. If no block exists, check individual shadcn components
3. Only then consider creating a custom component that wraps shadcn primitives

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **React**: React 19
- **TypeScript**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Summary

This constitution ensures the Streamlined Property Portal is built with:
- Modern Next.js best practices
- Proper TypeScript typing
- Consistent naming and file structure
- **shadcn/ui component blocks as the PRIMARY foundation (always check blocks first)**
- **shadcn/ui individual components as the secondary option**
- **Custom components ONLY when shadcn has no solution**
- Responsive, accessible, performant code
- No unnecessary duplication
- DRY principles throughout

**Golden Rule: Always search shadcn component blocks before writing any UI code.**

All development should align with these principles to maintain a clean, maintainable, and scalable codebase.
