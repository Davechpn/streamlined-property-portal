# Quick Start Guide: Accounts Module Implementation

**Date**: 2025-11-15  
**Purpose**: Step-by-step implementation guide for building the accounts module

## Prerequisites

- Node.js 18+ installed
- Git repository initialized
- Next.js 16 project set up
- Feature branch `001-accounts` checked out

## Phase 1: Foundation Setup (Day 1)

### Step 1.1: Install Core Dependencies

```bash
# Install TanStack Query
npm install @tanstack/react-query

# Install Sentry
npx @sentry/wizard@latest -i nextjs

# Install form libraries
npm install zod react-hook-form @hookform/resolvers

# Install additional utilities
npm install date-fns
```

### Step 1.2: Install shadcn/ui Components

```bash
# Phase 1 core components (install all at once)
npx shadcn@latest add sidebar-07 form input input-otp button label card \
  dropdown-menu dialog alert-dialog table badge avatar skeleton alert \
  sonner separator select tooltip

# Verify installation
ls -la components/ui/
```

### Step 1.3: Configure Sentry

**File**: `instrumentation.ts` (root)

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
```

**File**: `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**File**: `sentry.server.config.ts` - Similar to client config

### Step 1.4: Set Up TanStack Query Provider

**File**: `lib/query-client.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // 5 minutes
      cacheTime: 10 * 60_000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

**File**: `app/providers.tsx`

```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**File**: `app/layout.tsx` (update)

```typescript
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Step 1.5: Set Up API Client

**File**: `lib/api/client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiError = {
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || 'An error occurred',
      details: error.response?.data?.error?.details,
      statusCode: error.response?.status || 500,
    };
    return Promise.reject(apiError);
  }
);
```

### Step 1.6: Copy Type Definitions

Copy `contracts/types.ts` to `lib/types/` directory:

```bash
mkdir -p lib/types
cp .specify/specs/001-accounts/contracts/types.ts lib/types/index.ts
```

---

## Phase 2: Landing Page (Day 1-2)

### Step 2.1: Create Landing Page Components

**File**: `components/landing/Navigation.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          PropertyPortal
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="#about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t md:hidden">
          <div className="container mx-auto space-y-4 p-4">
            <Link href="#features" className="block text-sm font-medium">
              Features
            </Link>
            <Link href="#about" className="block text-sm font-medium">
              About
            </Link>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild className="w-full">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
```

**File**: `components/landing/Hero.tsx`

```typescript
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 text-center md:py-32">
      <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
        Streamline Your Property Management
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Manage properties, tenants, and teams all in one place. Built for modern
        property management companies.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/signup">
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
```

**File**: `components/landing/Features.tsx`

```typescript
import { Card } from '@/components/ui/card';
import { Building, Users, Shield, BarChart } from 'lucide-react';

const features = [
  {
    icon: Building,
    title: 'Property Management',
    description: 'Manage unlimited properties with ease',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members with role-based access',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security for your data',
  },
  {
    icon: BarChart,
    title: 'Reports & Analytics',
    description: 'Insights to grow your business',
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <h2 className="mb-12 text-center text-3xl font-bold">
        Everything you need to manage properties
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <feature.icon className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

**File**: `app/page.tsx` (replace existing)

```typescript
import { Navigation } from '@/components/landing/Navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';

export const metadata = {
  title: 'Streamlined Property Portal - Property Management Made Easy',
  description: 'Modern property management platform for property companies and agencies',
};

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Features />
      </main>
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Streamlined Property Portal. All rights reserved.
        </div>
      </footer>
    </>
  );
}
```

---

## Phase 3: Authentication (Day 2-4)

### Step 3.1: Create Auth Hooks

**File**: `lib/hooks/useAuth.ts`

```typescript
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/lib/types';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.get('/auth/me'),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => api.post('/auth/register', data),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(['user'], response.user);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => api.post('/auth/login', data),
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(['user'], response.user);
      toast.success('Signed in successfully!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
      router.push('/');
      toast.success('Logged out successfully');
    },
  });
}
```

### Step 3.2: Create Auth Pages

**File**: `app/(auth)/layout.tsx`

```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
```

**File**: `app/(auth)/signin/page.tsx`

```typescript
import { SignInForm } from '@/components/auth/SignInForm';

export const metadata = {
  title: 'Sign In - Property Portal',
};

export default function SignInPage() {
  return <SignInForm />;
}
```

**File**: `components/auth/SignInForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useLogin } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

export function SignInForm() {
  const [method, setMethod] = useState<'email' | 'phone' | 'google'>('email');
  const { mutate: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  function onSubmit(data: z.infer<typeof emailSchema>) {
    login({
      method: 'email',
      ...data,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Sign in to your account to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {method === 'email' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        )}
        <Separator className="my-4" />
        <Button variant="outline" className="w-full" disabled>
          Continue with Google (Coming Soon)
        </Button>
      </CardContent>
      <CardFooter className="flex-col space-y-2 text-center text-sm">
        <div>
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <Link
          href="/reset-password"
          className="text-muted-foreground hover:underline"
        >
          Forgot password?
        </Link>
      </CardFooter>
    </Card>
  );
}
```

---

## Phase 4: Dashboard & Organizations (Day 4-6)

### Step 4.1: Create Organization Hooks

**File**: `lib/hooks/useOrganizations.ts`

```typescript
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { CreateOrganizationRequest } from '@/lib/types';

export function useOrganizations() {
  return useQuery({
    queryKey: ['user', 'organizations'],
    queryFn: () => api.get('/organizations'),
    staleTime: 5 * 60_000,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) =>
      api.post('/organizations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'organizations'] });
      toast.success('Organization created successfully!');
    },
    onError: (error: any) => {
      if (error.code === 'CONFLICT') {
        toast.error('An organization with this name already exists');
      } else {
        toast.error(error.message);
      }
    },
  });
}
```

### Step 4.2: Create Dashboard Layout with sidebar-07

**File**: `app/(dashboard)/layout.tsx`

```typescript
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
```

**File**: `components/dashboard/DashboardShell.tsx`

```typescript
'use client';

// Import sidebar-07 component and customize for our needs
// This will use the installed shadcn sidebar-07 block

import { useUser } from '@/lib/hooks/useAuth';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { UserMenu } from './UserMenu';
// Import sidebar components from shadcn sidebar-07

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const permissions = usePermissions();

  // Implement sidebar-07 with role-based navigation
  return (
    // Use sidebar-07 structure here
    <div>Sidebar with {children}</div>
  );
}
```

---

## Testing Approach

### Unit Tests

**File**: `__tests__/hooks/useAuth.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { useLogin } from '@/lib/hooks/useAuth';

const queryClient = new QueryClient();

describe('useLogin', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      method: 'email',
      email: 'test@example.com',
      password: 'password',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

---

## Checkpoints

- [ ] Landing page loads and is responsive
- [ ] Authentication forms render correctly
- [ ] TanStack Query hooks work
- [ ] Sentry captures events
- [ ] Dashboard layout displays
- [ ] Organization creation works
- [ ] Workspace switcher functions
- [ ] All shadcn components styled correctly

---

## Next Phase After Quick Start

Run `/speckit.tasks` to break down remaining features into granular implementation tasks.
