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
} from '@/lib/types';

// Query keys
export const authKeys = {
  user: ['user'] as const,
};

// Get current user
export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      // Set user in cache
      queryClient.setQueryData(authKeys.user, data.user);
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(authKeys.user, null);
      // Clear all queries
      queryClient.clear();
      // Redirect to landing page
      router.push('/');
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
