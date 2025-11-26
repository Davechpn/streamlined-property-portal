import * as Sentry from '@sentry/nextjs';

// Session management helpers
export function setAuthToken(token: string) {
  // In a real app, this would set the httpOnly cookie via API response
  // Here we just track it for Sentry
  Sentry.setContext('auth', { hasToken: true });
}

export function clearAuthToken() {
  Sentry.setContext('auth', { hasToken: false });
  Sentry.setUser(null);
}

export function trackAuthEvent(event: string, metadata?: Record<string, any>) {
  Sentry.addBreadcrumb({
    category: 'auth',
    message: event,
    level: 'info',
    data: metadata,
  });
}
