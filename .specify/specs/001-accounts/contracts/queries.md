# TanStack Query Hook Specifications

**Date**: 2025-11-15  
**Purpose**: Define all TanStack Query hooks for data fetching, mutations, and state management

## Query Key Convention

All query keys follow a hierarchical structure:

```typescript
// User queries
['user'] // Current user
['user', 'organizations'] // User's organizations

// Organization queries
['organizations', orgId] // Specific organization
['organizations', orgId, 'members'] // Organization members
['organizations', orgId, 'invitations'] // Invitations for org

// Platform admin queries
['admin', 'dashboard'] // Admin dashboard metrics
['admin', 'organizations', filters] // All organizations with filters
['admin', 'activities', filters] // Activity reports
['admin', 'audit', filters] // Audit trail
```

## Authentication Hooks

### useUser()

Get current authenticated user data.

**Usage**:
```typescript
const { data: user, isLoading, error } = useUser();
```

**Implementation**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.get('/auth/me'),
    staleTime: 30_000, // 30 seconds
    retry: 1,
  });
}
```

**Invalidation**: On login, logout, profile updates

---

### useRegister()

Register a new user account.

**Usage**:
```typescript
const { mutate: register, isPending } = useRegister();

register({
  method: 'email',
  email: 'user@example.com',
  password: 'password',
  name: 'John Doe',
});
```

**Implementation**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => api.post('/auth/register', data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.user);
      queryClient.setQueryData(['user', 'organizations'], response.organizations);
      toast.success('Account created successfully');
      router.push('/dashboard');
    },
    onError: (error: APIError) => {
      toast.error(error.message);
    },
  });
}
```

---

### useLogin()

Sign in with existing credentials.

**Usage**:
```typescript
const { mutate: login, isPending } = useLogin();

login({
  method: 'email',
  email: 'user@example.com',
  password: 'password',
  rememberMe: true,
});
```

**Implementation**: Similar to useRegister(), invalidates ['user'] on success

---

### useLogout()

Sign out and clear session.

**Usage**:
```typescript
const { mutate: logout } = useLogout();

logout();
```

**Implementation**:
```typescript
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data
      router.push('/');
      toast.success('Logged out successfully');
    },
  });
}
```

---

### useRequestOTP()

Request OTP for phone authentication.

**Usage**:
```typescript
const { mutate: requestOTP, isPending } = useRequestOTP();

requestOTP({ phoneNumber: '+1234567890' });
```

**Implementation**:
```typescript
export function useRequestOTP() {
  return useMutation({
    mutationFn: (data: OTPRequestRequest) => api.post('/auth/otp/request', data),
    onSuccess: (response) => {
      toast.success(`OTP sent. ${response.retriesRemaining} retries remaining.`);
    },
    onError: (error: APIError) => {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        toast.error('Too many OTP requests. Please wait 15 minutes.');
      } else {
        toast.error(error.message);
      }
    },
  });
}
```

---

### useVerifyOTP()

Verify OTP code.

**Implementation**: Similar to useRegister(), sets user data on success

---

## Organization Hooks

### useOrganizations()

Get current user's organizations.

**Usage**:
```typescript
const { data: organizations, isLoading } = useOrganizations();
```

**Implementation**:
```typescript
export function useOrganizations(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: ['user', 'organizations', filters],
    queryFn: () => api.get('/organizations', { params: filters }),
    staleTime: 5 * 60_000, // 5 minutes
  });
}
```

**Invalidation**: On organization create, update, delete, member add/remove

---

### useOrganization()

Get specific organization details.

**Usage**:
```typescript
const { data: org, isLoading } = useOrganization(orgId);
```

**Implementation**:
```typescript
export function useOrganization(organizationId: string) {
  return useQuery({
    queryKey: ['organizations', organizationId],
    queryFn: () => api.get(`/organizations/${organizationId}`),
    staleTime: 5 * 60_000,
    enabled: !!organizationId,
  });
}
```

---

### useActiveOrganization()

Get currently active workspace.

**Usage**:
```typescript
const { data: activeOrg } = useActiveOrganization();
```

**Implementation**:
```typescript
// Custom hook that reads from user session context
export function useActiveOrganization() {
  const { data: user } = useUser();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  
  // Initialize from session or first org
  useEffect(() => {
    if (user && !activeOrgId) {
      const firstOrg = user.organizations[0]?.organization.id;
      setActiveOrgId(firstOrg || null);
    }
  }, [user, activeOrgId]);
  
  return useOrganization(activeOrgId || '');
}
```

---

### useCreateOrganization()

Create a new organization.

**Usage**:
```typescript
const { mutate: createOrg, isPending } = useCreateOrganization();

createOrg({
  name: 'Acme Properties',
  description: 'Property management',
});
```

**Implementation**:
```typescript
export function useCreateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) => 
      api.post('/organizations', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'organizations'] });
      toast.success('Organization created successfully');
    },
    onError: (error: APIError) => {
      if (error.code === 'CONFLICT') {
        toast.error('An organization with this name already exists');
      } else {
        toast.error(error.message);
      }
    },
  });
}
```

---

### useUpdateOrganization()

Update organization settings.

**Usage**:
```typescript
const { mutate: updateOrg } = useUpdateOrganization(orgId);

updateOrg({ name: 'New Name' });
```

**Implementation**:
```typescript
export function useUpdateOrganization(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateOrganizationRequest) =>
      api.patch(`/organizations/${organizationId}`, data),
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ 
        queryKey: ['organizations', organizationId] 
      });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['organizations', organizationId]);
      
      // Optimistically update
      queryClient.setQueryData(['organizations', organizationId], (old: any) => ({
        ...old,
        organization: { ...old.organization, ...newData },
      }));
      
      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['organizations', organizationId],
        context?.previous
      );
      toast.error('Failed to update organization');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['organizations', organizationId] 
      });
    },
  });
}
```

---

### useSwitchWorkspace()

Switch active organization context.

**Usage**:
```typescript
const { mutate: switchWorkspace } = useSwitchWorkspace();

switchWorkspace(newOrgId);
```

**Implementation**:
```typescript
export function useSwitchWorkspace() {
  const queryClient = useQueryClient();
  const [, setActiveOrgId] = useActiveOrganizationContext(); // Custom context
  
  return useMutation({
    mutationFn: (organizationId: string) =>
      api.post(`/organizations/${organizationId}/switch`),
    onMutate: (orgId) => {
      // Immediately update UI
      setActiveOrgId(orgId);
    },
    onSuccess: (response, orgId) => {
      // Prefetch new org data
      queryClient.prefetchQuery({
        queryKey: ['organizations', orgId],
        queryFn: () => api.get(`/organizations/${orgId}`),
      });
      toast.success('Switched workspace');
    },
  });
}
```

---

## Team Management Hooks

### useMembers()

Get organization members.

**Usage**:
```typescript
const { data: members, isLoading } = useMembers(orgId);
```

**Implementation**:
```typescript
export function useMembers(
  organizationId: string,
  filters?: MemberFilters
) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'members', filters],
    queryFn: () => 
      api.get(`/organizations/${organizationId}/members`, { params: filters }),
    staleTime: 5 * 60_000,
    enabled: !!organizationId,
  });
}
```

---

### useInvitations()

Get organization invitations.

**Usage**:
```typescript
const { data: invitations } = useInvitations(orgId);
```

**Implementation**:
```typescript
export function useInvitations(
  organizationId: string,
  filters?: InvitationFilters
) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'invitations', filters],
    queryFn: () =>
      api.get(`/organizations/${organizationId}/invitations`, { params: filters }),
    staleTime: 60_000, // 1 minute
    enabled: !!organizationId,
  });
}
```

---

### useInviteMember()

Invite a new member to organization.

**Usage**:
```typescript
const { mutate: inviteMember } = useInviteMember(orgId);

inviteMember({
  inviteeContact: 'user@example.com',
  role: 'admin',
  message: 'Join our team!',
});
```

**Implementation**:
```typescript
export function useInviteMember(organizationId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InviteMemberRequest) =>
      api.post(`/organizations/${organizationId}/invitations`, data),
    onMutate: async (newInvite) => {
      await queryClient.cancelQueries({
        queryKey: ['organizations', organizationId, 'invitations'],
      });
      
      const previous = queryClient.getQueryData([
        'organizations',
        organizationId,
        'invitations',
      ]);
      
      // Optimistically add invitation to pending list
      queryClient.setQueryData(
        ['organizations', organizationId, 'invitations'],
        (old: InvitationListResponse) => ({
          ...old,
          pending: [
            ...old.pending,
            {
              ...newInvite,
              id: 'temp',
              status: 'pending' as const,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          ],
        })
      );
      
      return { previous };
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully');
    },
    onError: (err, newInvite, context) => {
      queryClient.setQueryData(
        ['organizations', organizationId, 'invitations'],
        context?.previous
      );
      toast.error('Failed to send invitation');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', organizationId, 'invitations'],
      });
    },
  });
}
```

---

### useRevokeInvitation()

Revoke a pending invitation.

**Implementation**: Similar optimistic update pattern, removes from pending list

---

### useUpdateMemberRole()

Change a member's role.

**Usage**:
```typescript
const { mutate: updateRole } = useUpdateMemberRole(orgId);

updateRole({ memberId: 'member-id', role: 'manager' });
```

**Implementation**: Optimistic update with rollback on error

---

### useRemoveMember()

Remove a member from organization.

**Implementation**: Optimistic update, filters member from list

---

## Platform Admin Hooks

### useAdminDashboard()

Get platform admin dashboard metrics.

**Usage**:
```typescript
const { data: dashboard } = useAdminDashboard();
```

**Implementation**:
```typescript
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get('/admin/dashboard'),
    staleTime: 60_000, // 1 minute
  });
}
```

---

### useAdminOrganizations()

Get all organizations (admin view).

**Usage**:
```typescript
const { data: orgs } = useAdminOrganizations({
  page: 1,
  search: 'acme',
});
```

**Implementation**:
```typescript
export function useAdminOrganizations(filters: AdminOrganizationFilters) {
  return useQuery({
    queryKey: ['admin', 'organizations', filters],
    queryFn: () => api.get('/admin/organizations', { params: filters }),
    staleTime: 10 * 60_000, // 10 minutes
    keepPreviousData: true, // For pagination
  });
}
```

---

### useAdminActivities()

Get admin activity reports.

**Usage**:
```typescript
const { data: report } = useAdminActivities({
  adminId: 'admin-uuid',
  startDate: new Date('2025-11-01'),
  endDate: new Date('2025-11-30'),
});
```

**Implementation**: Similar to useAdminOrganizations with filters

---

### useAdminAuditTrail()

Get audit trail entries.

**Implementation**: Paginated query with filters

---

## Permission Hook

### usePermissions()

Get current user's permissions in active organization.

**Usage**:
```typescript
const { canInviteMembers, canEditOrg, role } = usePermissions();
```

**Implementation**:
```typescript
export function usePermissions() {
  const { data: activeOrg } = useActiveOrganization();
  const { data: user } = useUser();
  
  return useMemo(() => {
    if (!user || !activeOrg) {
      return {
        canInviteMembers: false,
        canEditOrg: false,
        canDeleteOrg: false,
        canManageMembers: false,
        canChangeRoles: false,
        canManageProperties: false,
        canViewOnly: false,
        role: null,
      };
    }
    
    const role = activeOrg.userRole;
    
    return {
      canInviteMembers: ['owner', 'admin'].includes(role),
      canEditOrg: ['owner', 'admin'].includes(role),
      canDeleteOrg: role === 'owner',
      canManageMembers: ['owner', 'admin'].includes(role),
      canChangeRoles: ['owner', 'admin'].includes(role),
      canManageProperties: ['owner', 'admin', 'manager'].includes(role),
      canViewOnly: role === 'viewer',
      role,
    };
  }, [user, activeOrg]);
}
```

---

## Query Client Configuration

### Default Options

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // 5 minutes default
      cacheTime: 10 * 60_000, // 10 minutes garbage collection
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
    },
  },
});
```

---

## Cache Invalidation Rules

**On Login**:
- Set ['user'] data
- Set ['user', 'organizations'] data

**On Logout**:
- Clear all queries: `queryClient.clear()`

**On Organization Create**:
- Invalidate ['user', 'organizations']

**On Organization Update**:
- Invalidate ['organizations', orgId]
- Invalidate ['user', 'organizations']

**On Member Invite**:
- Invalidate ['organizations', orgId, 'invitations']

**On Member Add**:
- Invalidate ['organizations', orgId, 'members']
- Invalidate ['organizations', orgId, 'invitations']

**On Member Role Change**:
- Invalidate ['organizations', orgId, 'members']
- Invalidate ['organizations', orgId] (permissions may change)

**On Member Remove**:
- Invalidate ['organizations', orgId, 'members']
- If current user: invalidate ['user', 'organizations']

**On Workspace Switch**:
- Prefetch ['organizations', newOrgId]
- Prefetch ['organizations', newOrgId, 'members']

---

## Prefetching Strategy

**On Hover Over Workspace Switcher Item**:
```typescript
const queryClient = useQueryClient();

function handleOrgHover(orgId: string) {
  queryClient.prefetchQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => api.get(`/organizations/${orgId}`),
  });
}
```

**On Page Load (Dashboard)**:
```typescript
// Prefetch likely next pages
useEffect(() => {
  if (activeOrgId) {
    queryClient.prefetchQuery({
      queryKey: ['organizations', activeOrgId, 'members'],
      queryFn: () => api.get(`/organizations/${activeOrgId}/members`),
    });
  }
}, [activeOrgId]);
```

---

## Error Handling Pattern

All hooks should handle errors consistently:

```typescript
onError: (error: APIError) => {
  // Log to Sentry
  Sentry.captureException(error, {
    tags: { feature: 'organizations', action: 'create' },
    user: { id: user?.id },
  });
  
  // Show user-friendly message
  if (error.code === 'VALIDATION_ERROR') {
    // Show field-specific errors
  } else if (error.code === 'UNAUTHORIZED') {
    toast.error('Please sign in again');
    router.push('/signin');
  } else if (error.code === 'FORBIDDEN') {
    toast.error('You don\'t have permission to perform this action');
  } else {
    toast.error(error.message || 'An error occurred');
  }
}
```

---

## Testing Hooks

Use MSW (Mock Service Worker) for API mocking:

```typescript
// __tests__/hooks/useOrganizations.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { server } from '@/mocks/server';
import { rest } from 'msw';

describe('useOrganizations', () => {
  it('fetches user organizations', async () => {
    const { result } = renderHook(() => useOrganizations(), {
      wrapper: QueryClientProvider,
    });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toHaveLength(2);
  });
  
  it('handles errors', async () => {
    server.use(
      rest.get('/api/organizations', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    const { result } = renderHook(() => useOrganizations(), {
      wrapper: QueryClientProvider,
    });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```
