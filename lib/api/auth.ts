import apiClient from './client';
import * as Sentry from '@sentry/nextjs';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  OTPRequestRequest,
  OTPVerifyRequest,
  PasswordResetRequestRequest,
  PasswordResetRequest,
} from '@/lib/types';

// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Register new user
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    Sentry.setUser({ email: response.data.data.user.email || undefined });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'register', method: data.method },
    });
    throw error;
  }
}

// Login user
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    Sentry.setUser({ email: response.data.data.user.email || undefined });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'login', method: data.method },
    });
    throw error;
  }
}

// Logout user
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
    Sentry.setUser(null);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'logout' },
    });
    throw error;
  }
}

// Request OTP for phone authentication
export async function requestOTP(data: OTPRequestRequest): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>('/auth/otp/request', data);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'request_otp' },
    });
    throw error;
  }
}

// Verify OTP
export async function verifyOTP(data: OTPVerifyRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/otp/verify', data);
    Sentry.setUser({ email: response.data.data.user.email || undefined });
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'verify_otp' },
    });
    throw error;
  }
}

// Request password reset
export async function requestPasswordReset(data: PasswordResetRequestRequest): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>('/auth/password/reset-request', data);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'request_password_reset' },
    });
    throw error;
  }
}

// Reset password with token
export async function resetPassword(data: PasswordResetRequest): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>('/auth/password/reset', data);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'reset_password' },
    });
    throw error;
  }
}

// Get current user
export async function getCurrentUser(): Promise<AuthResponse['user']> {
  try {
    const response = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'get_current_user' },
    });
    throw error;
  }
}
