# Logout Implementation

## API Endpoint
- **URL**: `https://streamlined-properties.com/api/v1/auth/logout`
- **Method**: POST
- **Full Path**: Constructed from base URL + `/auth/logout`

## Implementation Details

### 1. Logout API Function (`lib/api/auth.ts`)

The logout function now includes comprehensive cleanup:

```typescript
export async function logout(): Promise<void> {
  try {
    // Call the logout API endpoint
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Log error but continue with cleanup
    Sentry.captureException(error, {
      tags: { auth_action: 'logout' },
    });
    console.error('Logout API call failed, continuing with local cleanup:', error);
  } finally {
    // Always perform cleanup, even if API call fails
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
    
    // Clear auth cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    // Clear any other potential auth-related items
    localStorage.removeItem('currentOrganization');
    
    // Clear Sentry user context
    Sentry.setUser(null);
  }
}
```

**Key Features:**
- Uses `try-catch-finally` to ensure cleanup happens even if API call fails
- Clears all authentication tokens from localStorage
- Removes authentication cookie
- Clears additional auth-related data
- Clears Sentry user context for privacy

### 2. Logout Hook (`lib/hooks/useAuth.ts`)

The `useLogout` hook handles the mutation and ensures proper cleanup:

```typescript
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(authKeys.user, null);
      // Clear all cached queries
      queryClient.clear();
      // Redirect to signin page
      router.push('/signin');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data and redirect
      queryClient.setQueryData(authKeys.user, null);
      queryClient.clear();
      router.push('/signin');
    },
  });
}
```

**Key Features:**
- Clears React Query cache on success
- Handles errors gracefully - still cleans up and redirects even if API fails
- Redirects to `/signin` page after logout
- Ensures user data is removed from cache

### 3. Component Integration

Both sidebars now use the `useLogout` hook:

#### Dashboard Sidebar (`components/dashboard/app-sidebar.tsx`)
```typescript
const logout = useLogout()

const handleLogout = async () => {
  await logout.mutateAsync()
}
```

#### Admin Sidebar (`components/admin/admin-sidebar.tsx`)
```typescript
const logout = useLogout()

const handleLogout = async () => {
  await logout.mutateAsync()
}
```

## Cleanup Checklist

When a user logs out, the following cleanup occurs:

✅ **API Call**: POST to `/auth/logout` endpoint  
✅ **localStorage**: Removes `accessToken`, `refreshToken`, `tokenExpiresAt`, `currentOrganization`  
✅ **Cookies**: Clears `auth_token` cookie  
✅ **React Query Cache**: All cached queries cleared  
✅ **User Data**: User data removed from cache  
✅ **Sentry**: User context cleared for privacy  
✅ **Navigation**: Redirects to `/signin` page  

## Error Handling

The logout process is designed to be resilient:

1. **API Failure**: If the API call fails, local cleanup still proceeds
2. **Network Issues**: Local cleanup ensures user is logged out even without server confirmation
3. **Partial Failures**: Each cleanup step is independent

## Security Considerations

- Tokens are cleared from both localStorage and cookies
- Session is invalidated on the server (via API call)
- All cached user data is removed
- User is redirected to signin page
- Middleware will prevent access to protected routes without valid token

## Testing

To test logout:
1. Log in to the application
2. Click "Logout" from the user menu in sidebar
3. Verify you're redirected to `/signin`
4. Verify localStorage is cleared (check DevTools > Application > Local Storage)
5. Verify cookie is cleared (check DevTools > Application > Cookies)
6. Try accessing protected routes - should redirect to signin
