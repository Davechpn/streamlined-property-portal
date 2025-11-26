// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c8a734cb15f3f111cd554a327f7b842e@o4509641844588544.ingest.us.sentry.io/4510367423725568",

  // Add optional integrations for additional features
  integrations: [
    // Disable replay in development to avoid extension conflicts
    ...(process.env.NODE_ENV === 'production' ? [Sentry.replayIntegration()] : []),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1 : 0.1,
  
  // Enable logs to be sent to Sentry
  enableLogs: process.env.NODE_ENV === 'production',

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  
  // Filter out certain errors
  beforeSend(event, hint) {
    // Don't send errors after user has logged out
    if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
      // Check if error is related to authentication
      const error = hint.originalException;
      const errorMessage = error?.toString() || '';
      if (errorMessage.includes('authentication') || 
          errorMessage.includes('No authentication token') ||
          event.request?.url?.includes('/organizations') ||
          event.request?.url?.includes('/members') ||
          event.request?.url?.includes('/admin')) {
        return null; // Don't send to Sentry
      }
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;