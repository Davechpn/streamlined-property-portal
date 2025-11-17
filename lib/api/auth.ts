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
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/lib/types';

// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Register new user
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Store tokens in both localStorage and cookies
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('tokenExpiresAt', response.data.expiresAt);
      
      // Set cookie for middleware authentication check
      document.cookie = `auth_token=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
    
    Sentry.setUser({ email: response.data.user.email || undefined });
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'register' },
    });
    throw error;
  }
}

// Login user
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Store tokens in both localStorage and cookies
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('tokenExpiresAt', response.data.expiresAt);
      
      // Set cookie for middleware authentication check
      document.cookie = `auth_token=${response.data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
    
    Sentry.setUser({ email: response.data.user.email || undefined });
    return response.data;
  } catch (error: any) {
    // Handle rate limiting with a more specific error message
    if (error.response?.status === 429) {
      const retryAfter = error.response?.headers['retry-after'];
      const message = retryAfter 
        ? `Too many login attempts. Please try again in ${retryAfter} seconds.`
        : 'Too many login attempts. Please try again later.';
      
      const enhancedError = new Error(message);
      (enhancedError as any).status = 429;
      (enhancedError as any).retryAfter = retryAfter;
      
      Sentry.captureException(enhancedError, {
        tags: { auth_action: 'login', error_type: 'rate_limit' },
        extra: { retry_after: retryAfter },
      });
      
      throw enhancedError;
    }
    
    Sentry.captureException(error, {
      tags: { auth_action: 'login' },
    });
    throw error;
  }
}

// Logout user
export async function logout(): Promise<void> {
  let logoutError = null;
  
  try {
    // Call the logout API endpoint with payload to logout from all devices
    await apiClient.post('/auth/logout', {
      logoutFromAllDevices: true
    });
  } catch (error) {
    // Store error but don't send to Sentry yet
    logoutError = error;
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
    localStorage.removeItem('currentOrganizationId');
    
    // Clear Sentry user context and flush any pending events
    Sentry.setUser(null);
    
    // Only log the logout error if it happened (after cleanup)
    if (logoutError) {
      Sentry.captureException(logoutError, {
        tags: { auth_action: 'logout' },
      });
    }
    
    // Flush Sentry to send any remaining events before user leaves
    try {
      await Sentry.flush(2000); // Wait up to 2 seconds
    } catch (flushError) {
      // Ignore flush errors
      console.warn('Sentry flush failed:', flushError);
    }
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

// Profile response interface
interface ProfileResponse {
  success: boolean;
  data: {
    user: AuthResponse['user'];
    organizations: any[];
    activeSessions: any[];
    permissions: Record<string, any>;
  };
  message: string;
  errors: string[];
  timestamp: string;
}

// Get current user profile
export async function getCurrentUser(): Promise<AuthResponse['user']> {
  try {
    const response = await apiClient.get<ProfileResponse>('/auth/profile');
    return response.data.data.user;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'get_current_user' },
    });
    throw error;
  }
}

// Get full user profile with organizations and permissions
export async function getProfile(): Promise<ProfileResponse['data']> {
  try {
    const response = await apiClient.get<ProfileResponse>('/auth/profile');
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'get_profile' },
    });
    throw error;
  }
}

// Update user profile
export async function updateProfile(data: UpdateProfileRequest): Promise<AuthResponse['user']> {
  try {
    const response = await apiClient.put<{ success: boolean; data: AuthResponse['user']; message: string }>('/auth/profile', data);
    return response.data.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'update_profile' },
    });
    throw error;
  }
}

// Change password (for authenticated users)
export async function changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/change-password', data);
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { auth_action: 'change_password' },
    });
    throw error;
  }
}
