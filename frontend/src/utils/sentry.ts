import * as Sentry from '@sentry/react';

// Sentry configuration
export const initSentry = () => {
  Sentry.init({
    dsn: "https://393cb3690314a422ab6b1200e770db73@o4509960786214912.ingest.us.sentry.io/4509961364897792",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    // Set sample rate for performance monitoring
    tracesSampleRate: 1.0,
    // Set sample rate for session replay
    replaysSessionSampleRate: 0.1,
    // Set sample rate for error sessions
    replaysOnErrorSampleRate: 1.0,
    // Configure integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Set environment
    environment: import.meta.env.MODE || 'development',
    // Add custom tags
    beforeSend(event) {
      // Add custom tags
      event.tags = {
        ...event.tags,
        component: 'frontend',
        version: '1.0.0',
      };
      return event;
    },
  });
};

// Helper function to capture API errors
export const captureApiError = (error: any, context: string) => {
  Sentry.captureException(error, {
    tags: {
      errorType: 'api',
      context,
    },
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
    },
  });
};

// Helper function to capture user actions
export const captureUserAction = (action: string, userId?: string) => {
  Sentry.addBreadcrumb({
    message: action,
    category: 'user-action',
    level: 'info',
    data: {
      userId,
      timestamp: new Date().toISOString(),
    },
  });
};

// Helper function to set user context
export const setUserContext = (user: { id: string; email: string; name: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

// Helper function to clear user context
export const clearUserContext = () => {
  Sentry.setUser(null);
};
