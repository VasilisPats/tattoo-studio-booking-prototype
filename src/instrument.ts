import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    // Send default PII (request headers, IP) for user context
    sendDefaultPii: true,

    integrations: [
        // Performance monitoring via browser tracing
        Sentry.browserTracingIntegration(),

        // Session Replay for visual debugging
        Sentry.replayIntegration(),
    ],

    // Capture 100% of transactions in dev/staging; lower in production
    tracesSampleRate: 1.0,

    // Replay 10 % of all sessions, 100 % of sessions with errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only send traces for your own origins
    tracePropagationTargets: [/^\//, /^https:\/\/.*\.vercel\.app/],

    // Disable Sentry entirely when no DSN is provided (local dev without .env)
    enabled: !!import.meta.env.VITE_SENTRY_DSN,
});
