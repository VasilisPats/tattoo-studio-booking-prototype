# Sentry Setup Guide

## 1. Create Account
1. Go to [sentry.io/signup](https://sentry.io/signup/) and create an account.
2. Create a new Organization (e.g., "Artisan Studio").

## 2. Create Project
1. Click **Projects** → **Create Project**.
2. Platform: Choose **React**.
3. Alert Frequency: Choose "Alert me on every new issue" (you can tune this later).
4. Project Name: `artisan-studio-showcase`.
5. Team: Create or select a team.

## 3. Get Your DSN
1. After project creation, Sentry will show you configuration instructions.
2. Find your **DSN** (it looks like `https://public@sentry.example.com/1`).
3. Add this locally to your `.env` / `.env.local` file:
   ```env
   VITE_SENTRY_DSN=your-dsn-url-here
   ```

## 4. Install SDK
Run this in your terminal:
```bash
npm install @sentry/react @sentry/tracing
```
*(Or use `bun add @sentry/react @sentry/tracing` since you have a `bun.lockb`)*

## 5. Initialize Sentry
In your `src/main.tsx` (or `index.tsx`), initialize Sentry before rendering your app:

```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```

## 6. Verify Install
To verify Sentry is working, trigger a test error anywhere in your app:
```typescript
<button onClick={() => { throw new Error("This is your first Sentry error!"); }}>
  Test Sentry Error
</button>
```
Click it, then check your Sentry dashboard to see if the issue appears!
