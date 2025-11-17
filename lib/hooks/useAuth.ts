import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import type {
  RegisterRequest,
  LoginRequest,
  OTPRequestRequest,
  OTPVerifyRequest,
  PasswordResetRequestRequest,
  PasswordResetRequest,
  UpdateProfileRequest,
} from '@/lib/types';

// Query keys
export const authKeys = {
  user: ['user'] as const,
};

// Get current user
export function useUser() {
  // Check if user has a token before attempting to fetch
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  
  return useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: hasToken, // Only fetch if we have a token
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      // Set user in cache
      queryClient.setQueryData(authKeys.user, data.user);
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      console.log('Login successful, user data:', data.user);
      // Set user in cache
      queryClient.setQueryData(authKeys.user, data.user);
      // Redirect to dashboard
      console.log('Redirecting to dashboard...');
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onMutate: async () => {
      // Cancel all outgoing queries before logout
      await queryClient.cancelQueries();
    },
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(authKeys.user, null);
      // Remove all queries from cache and stop refetching
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

// Request OTP mutation
export function useRequestOTP() {
  return useMutation({
    mutationFn: (data: OTPRequestRequest) => authApi.requestOTP(data),
  });
}

// Verify OTP mutation
export function useVerifyOTP() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: OTPVerifyRequest) => authApi.verifyOTP(data),
    onSuccess: (data) => {
      // Set user in cache
      queryClient.setQueryData(authKeys.user, data.user);
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

// Request password reset mutation
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestRequest) => authApi.requestPasswordReset(data),
  });
}

// Reset password mutation
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: PasswordResetRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      // Redirect to sign in
      router.push('/signin?reset=success');
    },
  });
}

// Get full user profile with organizations and permissions
export function useProfile() {
  const hasToken = typeof window !== 'undefined' && (
    localStorage.getItem('accessToken') !== null ||
    document.cookie.includes('auth_token=')
  );

  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.user, updatedUser);
      
      // Update profile data in cache
      queryClient.setQueryData(['profile'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          user: updatedUser,
        };
      });
      
      // Invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}
