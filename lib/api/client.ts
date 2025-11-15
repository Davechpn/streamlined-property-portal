import axios from 'axios';
import * as Sentry from '@sentry/nextjs';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token from cookie
apiClient.interceptors.request.use(
  (config) => {
    // Token will be automatically sent via httpOnly cookie
    // No need to manually add Authorization header
    return config;
  },
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors to Sentry
    Sentry.captureException(error, {
      contexts: {
        api: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
        },
      },
    });

    // Handle 401 Unauthorized - redirect to sign in
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/signin')) {
        window.location.href = '/signin';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      Sentry.captureMessage('Access forbidden', {
        level: 'warning',
        contexts: {
          api: {
            url: error.config?.url,
            method: error.config?.method,
          },
        },
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
