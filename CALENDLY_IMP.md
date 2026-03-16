# Phase C — Calendly Synchronization: Implementation Plan

> **Status**: DRAFT v2 — Updated per feedback. Awaiting final review.
> **Last updated**: 2026-03-16 (v2)
> **Parent document**: `GENERAL_IMPL.md` → Section 2 → Phase C

---

## Table of Contents

1. [Goal & Context](#1-goal--context)
2. [Critical Constraint: Calendly Free Tier](#2-critical-constraint-calendly-free-tier)
3. [Architecture Overview](#3-architecture-overview)
4. [Environment Variables & Config](#4-environment-variables--config)
5. [Step-by-Step Implementation](#5-step-by-step-implementation)
   - [Step 1: Remove Dead Code (Date Picker)](#step-1-remove-dead-code-date-picker)
   - [Step 2: Update Calendly URL to Production](#step-2-update-calendly-url-to-production)
   - [Step 3: Enhance the Calendly Widget Step (UX)](#step-3-enhance-the-calendly-widget-step-ux)
   - [Step 4: Fix the Browser Listener & Final Sync](#step-4-fix-the-browser-listener--final-sync)
   - [Step 5: Abandonment Protection](#step-5-abandonment-protection)
   - [Step 6: Premium Success State](#step-6-premium-success-state)
   - [Step 7: Skeleton Loader for Calendly Iframe](#step-7-skeleton-loader-for-calendly-iframe)
   - [Step 8: i18n — Add Missing Translation Keys](#step-8-i18n--add-missing-translation-keys)
   - [Step 9: Update .env.example](#step-9-update-envexample)
   - [Step 10: Supabase Migration](#step-10-supabase-migration)
6. [Files Changed Summary](#6-files-changed-summary)
7. [What We Are NOT Doing (and Why)](#7-what-we-are-not-doing-and-why)
8. [Verification Plan](#8-verification-plan)
9. [Future Upgrades (When Upgrading Calendly Tier)](#9-future-upgrades-when-upgrading-calendly-tier)

---

## 1. Goal & Context

**The user's booking flow today:**
1. **Style Quiz** → user picks tattoo style, placement, size
2. **Form Steps 0–3** → Contact info → Tattoo idea + reference images → Details → Review
3. **Step 3 "Submit"** → "Safety Save" to Supabase (status: `pending_scheduling`, images uploaded to `tattoo-references` bucket)
4. **Step 4** → Calendly InlineWidget appears — **currently has a placeholder URL** (`https://calendly.com/your-calendly-link`)
5. **On Calendly Event Scheduled** → `finalizeBooking()` is called, updates Supabase record to `scheduled`

**What Phase C must accomplish:**
- ✅ Swap the placeholder Calendly URL for the real studio link
- ✅ Ensure the browser listener correctly captures event data and updates Supabase
- ✅ Remove any dead date-picker code that's no longer needed
- ✅ Add premium UX: skeleton loader, abandonment protection, sleek transitions, success state
- ✅ Handle the Free Tier limitation gracefully

---

## 2. Critical Constraint: Calendly Free Tier

> [!CAUTION]
> **Calendly Free does NOT provide API access, webhooks, or the Scheduling API.**
> This means we **cannot** build a Vercel API route to fetch the scheduled date/time from Calendly's servers.

### What we CAN get from the Free Tier:

The `react-calendly` package's `useCalendlyEventListener` fires an `onEventScheduled` callback. On the Free tier, the event payload looks like this:

```json
{
  "event": "calendly.event_scheduled",
  "payload": {
    "event": {
      "uri": "https://calendly.com/api/v2/scheduled_events/XXXXXXX"
    },
    "invitee": {
      "uri": "https://calendly.com/api/v2/scheduled_events/XXXXXXX/invitees/YYYYYYY"
    }
  }
}
```

> [!IMPORTANT]
> The payload contains **URIs only** — NOT the actual date/time. To resolve those URIs into real data, you need a paid Calendly plan with API access.

### Our Strategy (Free Tier Workaround):

| Data Point             | Source of Truth        | Notes                                                                 |
|------------------------|------------------------|-----------------------------------------------------------------------|
| Tattoo idea, images, style, budget | **Supabase** (our DB) | Already saved by Phase B "Safety Save"                               |
| Appointment date/time  | **Calendly / Google Calendar** | The artist sees dates in their own calendar, NOT in Supabase         |
| Booking status         | **Supabase** (`pending_scheduling` → `scheduled`) | Updated when `onEventScheduled` fires                               |
| Calendly event URI     | **Supabase** (`calendly_event_uri` column) | Stored for future use if/when upgrading to a paid Calendly tier       |
| Artist reference link  | **Calendly event notes** (via UTM `utmContent`) | Already injected as `utmContent` — visible in Calendly event details |

**Bottom line**: On the Free tier, we mark the booking as `scheduled` and store the Calendly URIs. The *actual date* lives in Calendly/Google Calendar. If the user upgrades Calendly later, we can retroactively resolve those URIs.

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React / Vite)                    │
│                                                             │
│  ┌──────────┐   Safety Save   ┌──────────────┐             │
│  │ Form     │ ──────────────► │ Supabase     │             │
│  │ Steps    │   (booking +    │ (bookings    │             │
│  │ 0–3      │    images)      │  table)      │             │
│  └────┬─────┘                 └──────┬───────┘             │
│       │                              │                      │
│       │ step → 4                     │                      │
│       ▼                              │                      │
│  ┌──────────────────┐                │                      │
│  │ Calendly Inline  │                │                      │
│  │ Widget (iframe)  │                │                      │
│  │                  │                │                      │
│  │ Pre-filled:      │                │                      │
│  │  - name          │                │                      │
│  │  - email         │                │                      │
│  │ UTM params:      │                │                      │
│  │  - booking_id    │                │                      │
│  │  - ref link      │                │                      │
│  └────────┬─────────┘                │                      │
│           │                          │                      │
│  calendly.event_scheduled            │                      │
│           │                          │                      │
│           ▼                          │                      │
│  ┌──────────────────┐    UPDATE      │                      │
│  │ finalizeBooking  │ ──────────────►│                      │
│  │  status →        │  status:       │                      │
│  │  'scheduled'     │  'scheduled'   │                      │
│  │  + event URIs    │  + URIs        │                      │
│  └──────────────────┘                │                      │
│           │                          │                      │
│           ▼                          │                      │
│  ┌──────────────────┐                                       │
│  │ Success Screen   │                                       │
│  │ 🎉               │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

**No Vercel API routes needed.** Everything happens browser-side.

---

## 4. Environment Variables & Config

### New Environment Variable

Add to `.env`:
```
VITE_CALENDLY_URL=https://calendly.com/patsialasvasilis/new-meeting
```

### Update `.env.example`
```
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Sentry — Get your DSN from https://sentry.io → Project Settings → Client Keys (DSN)
VITE_SENTRY_DSN=

# Calendly — Your Calendly event scheduling link
VITE_CALENDLY_URL=https://calendly.com/your-studio/your-event-type
```

> [!NOTE]
> The Supabase env vars are already consumed in `src/lib/supabase.ts` but were never added to `.env.example`. We fix that here for completeness.

---

## 5. Step-by-Step Implementation

### Step 1: Remove Dead Code (Date Picker)

#### Why
The `BookingForm.tsx` currently imports `DayPicker` from `react-day-picker` and date-fns locale utilities — **none of which are used in the rendered JSX anymore**. These are leftovers from before the Calendly integration was scaffolded.

#### Changes

##### [MODIFY] [BookingForm.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/BookingForm.tsx)

Remove these unused imports (lines 4–8):
```diff
- import { DayPicker } from "react-day-picker";
- import { format } from "date-fns";
- import { el as elLocale } from "date-fns/locale";
- import { enUS as enLocale } from "date-fns/locale";
- import "react-day-picker/dist/style.css";
```

**Impact**: Zero behavior change. Just dead code cleanup.

---

### Step 2: Update Calendly URL to Production

#### Why
Line 387 of `BookingForm.tsx` currently says:
```tsx
url="https://calendly.com/your-calendly-link" // TODO: Add actual studio link
```
This must be swapped to read from the env variable.

#### Changes

##### [MODIFY] [BookingForm.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/BookingForm.tsx)

Replace the hardcoded URL:
```diff
- url="https://calendly.com/your-calendly-link" // TODO: Add actual studio link
+ url={import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/patsialasvasilis/new-meeting"}
```

> [!IMPORTANT]
> The fallback string ensures the widget still loads even if the env var is accidentally missing. In production on Vercel, the env var MUST be set.

---

### Step 3: Enhance the Calendly Widget Step (UX)

#### Why
Step 4 currently works but feels abrupt. We need a smooth "liquid" transition from the review step into the calendar.

#### Changes

##### [MODIFY] [BookingForm.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/BookingForm.tsx)

1. **Replace the submit button text during Safety Save**: Instead of just "Saving...", change the animated text to:
   ```
   "Securing your vision..." → (success) → auto-transition to step 4
   ```

2. **Animated transition to Calendly step**: The step 4 container should use `framer-motion` to fade in with a slight upward slide (`initial={{ opacity: 0, y: 20 }}`), which is already partially handled by the `AnimatePresence` wrapper. We enhance the Calendly-specific step with a slightly longer duration and spring easing.

3. **Widget container styling**: Add a subtle pulsing border glow effect on the Calendly container to draw the eye:
   ```css
   .calendly-container {
     animation: calendly-glow 2s ease-in-out infinite alternate;
   }
   @keyframes calendly-glow {
     from { border-color: hsl(var(--border)); }
     to { border-color: hsl(var(--primary) / 0.3); }
   }
   ```

4. **Pass `pageSettings` to match the dark theme** of the site:
   ```tsx
   pageSettings={{
     backgroundColor: '1a1a1a',
     textColor: 'f5f5f5',
     primaryColor: 'c9a55a', // or whatever your --primary HSL resolves to
     hideLandingPageDetails: true,
     hideEventTypeDetails: true,
   }}
   ```
   > Note: On Calendly Free, `pageSettings` customization is limited. We set it optimistically — Calendly will apply what it can and ignore the rest.

---

### Step 4: Fix the Browser Listener & Final Sync

#### Why
The current `finalizeBooking()` in `useBookingSubmit.ts` tries to write `eventData.start_time` to Supabase. But on the Free tier, the payload does NOT contain `start_time` — only URIs. We must fix this to avoid writing `undefined` to the database.

#### Changes

##### [MODIFY] [useBookingSubmit.ts](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/hooks/useBookingSubmit.ts)

**Before** (current code):
```ts
const { error: updateError } = await supabase
  .from('bookings')
  .update({
    status: 'scheduled',
    scheduled_at: eventData.start_time,       // ← undefined on Free tier!
    calendly_payload: eventData
  })
  .eq('id', bookingId);
```

**After** (Fixed for Free tier):
```ts
const { error: updateError } = await supabase
  .from('bookings')
  .update({
    status: 'scheduled',
    calendly_event_uri: eventData?.event?.uri || null,
    calendly_invitee_uri: eventData?.invitee?.uri || null,
    // scheduled_at is intentionally left empty on Free tier.
    // The appointment time lives in Calendly/Google Calendar.
    // If we upgrade to a paid Calendly plan in the future,
    // we can resolve these URIs to get the actual datetime.
  })
  .eq('id', bookingId);
```

> [!WARNING]
> This requires a **Supabase migration** to add `calendly_event_uri` and `calendly_invitee_uri` columns to the `bookings` table and remove `scheduled_at` + `calendly_payload` if they are unused elsewhere. **Check with the user before running the migration.**

##### Supabase Migration (to be confirmed)

```sql
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
  ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT;

-- Drop the old columns if they are not used elsewhere:
-- ALTER TABLE bookings DROP COLUMN IF EXISTS scheduled_at;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS calendly_payload;
```

> [!IMPORTANT]
> We should keep `scheduled_at` and `calendly_payload` for now (don't drop them). If the user upgrades Calendly later, we'll populate `scheduled_at` via the API. Having it ready avoids a future migration.

**Revised approach**: Keep the existing columns but just don't write to `scheduled_at` when the data isn't available:
```ts
const updateData: Record<string, any> = {
  status: 'scheduled',
  calendly_event_uri: eventData?.event?.uri || null,
  calendly_invitee_uri: eventData?.invitee?.uri || null,
};

// Only set scheduled_at if the payload actually contains a start_time
// (possible on paid Calendly tiers)
if (eventData?.event?.start_time) {
  updateData.scheduled_at = eventData.event.start_time;
}

const { error: updateError } = await supabase
  .from('bookings')
  .update(updateData)
  .eq('id', bookingId);
```

This is **forward-compatible**: works on Free today, auto-upgrades when moving to a paid tier.

---

### Step 5: Abandonment Protection

#### Why
After the "Safety Save" succeeds and the user is on Step 4 (Calendly), if they close the tab without picking a date, we want to gently remind them.

#### Changes

##### [MODIFY] [BookingForm.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/BookingForm.tsx)

Add a `useEffect` that registers a `beforeunload` listener ONLY when `step === 4` and `!submitted`:

```tsx
useEffect(() => {
  if (step === 4 && !submitted) {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore custom messages but still show the prompt
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }
}, [step, submitted]);
```

**Impact**: The browser shows a native "Leave site? Changes you made may not be saved." dialog. This is lightweight and respects standard browser behavior — no custom modal needed.

---

### Step 6: Premium Success State

#### Why
The current success screen (`submitted === true`) is minimal — just a checkmark icon and two text lines. We want something that feels clean and professional — a polished confirmation that reassures the client everything went through.

#### Changes

##### [MODIFY] [BookingForm.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/BookingForm.tsx)

Enhance the `successContent` block (lines 145–153):

1. **Animated check icon**: Wrap the `<Check>` icon in a `motion.div` with `scale` + `opacity` spring animation.
2. **Staggered text reveal**: Title and subtitle appear with slight delays using `framer-motion` stagger.
3. **Booking summary checklist**: A clean card with three confirmation lines:
   - "✓ Your tattoo idea is securely saved"
   - "✓ Check your email for the Calendly confirmation"
   - "✓ Your artist will review your references before the session"
4. **Next steps text**: A soft closing line like "You're one step closer to your new ink."

> [!NOTE]
> No extra libraries added. All animations use the existing `framer-motion` dependency. The design stays clean, professional, and on-brand.

---

### Step 7: Skeleton Loader for Calendly Iframe

#### Why
The Calendly iframe takes 1–3 seconds to load. During that time, the user sees a blank bordered box. We need a pulsing skeleton that matches the expected calendar layout.

#### Changes

##### [NEW] [CalendlySkeleton.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/CalendlySkeleton.tsx)

A new component that renders:
- A fake calendar grid header (Mon–Sun)
- 5 rows of pulsing gray placeholder blocks
- A "Loading available times..." text at the bottom

The skeleton uses Tailwind's `animate-pulse` class.

##### [MODIFY] [BookingForm.tsx](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/src/components/BookingForm.tsx)

In Step 4, add state tracking for Calendly load:
```tsx
const [calendlyLoaded, setCalendlyLoaded] = useState(false);
```

Use `useCalendlyEventListener({ onProfilePageViewed: () => setCalendlyLoaded(true) })` to detect when the widget has rendered.

Render the skeleton BELOW (behind) the iframe, and fade it out once loaded:
```tsx
<div className="calendly-container relative min-h-[400px]">
  {!calendlyLoaded && <CalendlySkeleton />}
  <div className={calendlyLoaded ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}>
    <InlineWidget ... />
  </div>
</div>
```

---

### Step 8: i18n — Add Missing Translation Keys

#### Why
Several strings in Step 4 and the success screen use hardcoded English fallbacks (e.g., `t.booking.scheduleTitle || "Finalize Your Slot"`). These need proper translation keys.

#### Changes

##### [MODIFY] Translation files in `src/i18n/`

Add the following keys to both language files (EN and GR):
- `booking.scheduleTitle` → "Finalize Your Slot" / Greek equivalent
- `booking.scheduleSubtitle` → "Your details are saved. Pick a time below to lock it in." / Greek
- `booking.skipScheduling` → "I'll schedule later" / Greek
- `booking.securingVision` → "Securing your vision..." / Greek
- `booking.successChecklist.ideaSaved` → "Your tattoo idea is securely saved"
- `booking.successChecklist.emailConfirm` → "Check your email for confirmation"
- `booking.successChecklist.artistReady` → "Your artist will review your references before the session"

---

### Step 9: Update .env.example

#### Changes

##### [MODIFY] [.env.example](file:///c:/Users/patsi/OneDrive/%CE%A5%CF%80%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CF%83%CF%84%CE%AE%CF%82/GitHub%20repos/tattoo-studio-booking-prototype/tattoo-studio-booking-prototype/.env.example)

```env
# Supabase — Get from https://supabase.com → Project Settings → API
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Sentry — Get your DSN from https://sentry.io → Project Settings → Client Keys (DSN)
VITE_SENTRY_DSN=

# Calendly — Your Calendly event scheduling link
VITE_CALENDLY_URL=https://calendly.com/your-studio/your-event-type
```

---

### Step 10: Supabase Migration

#### Why
The current `bookings` table has `scheduled_at` (timestamp) and `calendly_payload` (JSONB) columns from the original implementation. We need to add two new TEXT columns to store the Calendly URIs that the Free tier provides. We keep the existing columns intact for forward-compatibility.

#### Migration SQL

```sql
-- Add Calendly URI tracking columns (Free tier stores URIs, not datetimes)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
  ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT;

-- Add a comment explaining the purpose
COMMENT ON COLUMN bookings.calendly_event_uri IS 'Calendly event URI from browser event. Can be resolved via API on paid tier.';
COMMENT ON COLUMN bookings.calendly_invitee_uri IS 'Calendly invitee URI from browser event. Can be resolved via API on paid tier.';
```

#### Execution Method

This migration will be applied via the Supabase MCP tool (`apply_migration`) during implementation. The migration is non-destructive:
- **Does NOT drop** any existing columns
- **Does NOT modify** any existing data
- Uses `IF NOT EXISTS` so it's safe to re-run

#### Column Inventory After Migration

| Column                  | Type      | Purpose                                    | Written By       |
|-------------------------|-----------|--------------------------------------------|-----------------|
| `id`                    | UUID      | Primary key                                | Supabase auto   |
| `created_at`            | TIMESTAMP | Record creation time                       | Supabase auto   |
| `full_name`             | TEXT      | Client's full name                         | Safety Save     |
| `email`                 | TEXT      | Client's email                             | Safety Save     |
| `instagram_handle`      | TEXT      | Future field (currently empty string)       | Safety Save     |
| `style_quiz_data`       | JSONB     | All quiz + form data merged                | Safety Save     |
| `preferred_date`        | TIMESTAMP | Legacy field (unused, kept for compat)      | —               |
| `reference_images`      | TEXT[]    | Array of Supabase Storage public URLs       | Safety Save     |
| `status`                | TEXT      | `pending_scheduling` → `scheduled`          | Safety Save / Finalize |
| `scheduled_at`          | TIMESTAMP | **Kept empty on Free tier**, populated on paid tier | Finalize (paid only) |
| `calendly_payload`      | JSONB     | Legacy field, kept for compat               | —               |
| `calendly_event_uri`    | TEXT      | **NEW** — Calendly event URI from browser event | Finalize        |
| `calendly_invitee_uri`  | TEXT      | **NEW** — Calendly invitee URI from browser event | Finalize      |

---

## 6. Files Changed Summary

| #  | Action   | File                          | What Changes                                                  |
|----|----------|-------------------------------|---------------------------------------------------------------|
| 1  | MODIFY   | `src/components/BookingForm.tsx` | Remove dead imports, swap URL to env var, add skeleton, abandonment `beforeunload`, enhance success screen, improve submit button text |
| 2  | MODIFY   | `src/hooks/useBookingSubmit.ts`  | Fix `finalizeBooking()` to handle Free tier payload correctly |
| 3  | NEW      | `src/components/CalendlySkeleton.tsx` | Skeleton loader component for Calendly iframe                |
| 4  | MODIFY   | `src/i18n/en.ts` (or equivalent) | Add missing translation keys for Step 4 + success screen     |
| 5  | MODIFY   | `src/i18n/el.ts` (or equivalent) | Greek translations for the same keys                         |
| 6  | MODIFY   | `.env.example`                | Add `VITE_CALENDLY_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| 7  | MODIFY   | `.env`                        | Add `VITE_CALENDLY_URL=https://calendly.com/patsialasvasilis/new-meeting` |
| 8  | MIGRATE  | Supabase `bookings` table     | Add `calendly_event_uri` (TEXT) and `calendly_invitee_uri` (TEXT) columns — non-destructive, uses `IF NOT EXISTS` |

---

## 7. What We Are NOT Doing (and Why)

| Feature                              | Why Not                                                                                  |
|--------------------------------------|------------------------------------------------------------------------------------------|
| Vercel API route to fetch Calendly event details | **Calendly Free has no API access.** Cannot call `/scheduled_events/` endpoints.         |
| Storing `scheduled_at` datetime in Supabase | Free tier event payload doesn't include the actual time. Would write `undefined`.         |
| Webhooks from Calendly              | Only available on Premium plan and above.                                                 |
| Custom Calendly branding             | Not available on Free tier. We apply `pageSettings` optimistically but Calendly may ignore them. |
| Dropping existing columns            | `scheduled_at` and `calendly_payload` are kept for forward-compatibility with a future paid tier. |

---

## 8. Verification Plan

### 8.1 Automated Tests

**Existing test infrastructure**: `vitest` + `@testing-library/react` (see `vitest.config.ts`, `src/test/setup.ts`).

#### Test 1: `useBookingSubmit` — `finalizeBooking` handles Free tier payload

**File**: `src/hooks/__tests__/useBookingSubmit.test.ts` (NEW)

**What it tests**:
- Given a Free tier Calendly payload `{ event: { uri: "..." }, invitee: { uri: "..." } }`, the `finalizeBooking` function should call `supabase.update()` with `status: 'scheduled'` and `calendly_event_uri` set, but NOT set `scheduled_at` to `undefined`.
- Given a paid tier payload that includes `start_time`, the function SHOULD set `scheduled_at`.

**How to run**:
```
npm run test -- --run src/hooks/__tests__/useBookingSubmit.test.ts
```

#### Test 2: `CalendlySkeleton` renders correctly

**File**: `src/components/__tests__/CalendlySkeleton.test.tsx` (NEW)

**What it tests**: The skeleton renders day headers and placeholder rows. Snapshot test.

**How to run**:
```
npm run test -- --run src/components/__tests__/CalendlySkeleton.test.tsx
```

### 8.2 Manual Verification (Browser Testing)

> [!IMPORTANT]
> These steps require a running dev server (`npm run dev`) and the real Calendly link.

#### Manual Test 1: Full Booking Flow (Happy Path)
1. Open `http://localhost:8080` in the browser
2. Complete the Style Quiz
3. Fill in Contact info (Step 0), Idea + images (Step 1), Details (Step 2)
4. On Step 3 (Review), click "Book Now" / submit button
5. **Verify**: The button text changes to "Securing your vision..." with a spinner
6. **Verify**: After ~1-2s, the form smoothly transitions to Step 4 (Calendly widget)
7. **Verify**: While the Calendly iframe loads, a skeleton loader is visible (pulsing gray calendar grid)
8. **Verify**: Once loaded, the skeleton fades out and the real calendar appears
9. **Verify**: The Name and Email fields in Calendly are pre-filled
10. Select a date and time, confirm the booking in Calendly
11. **Verify**: The success screen appears with animated checkmark and summary checklist
12. **Verify**: In Supabase → `bookings` table, the record has `status: 'scheduled'` and `calendly_event_uri` is populated

#### Manual Test 2: Abandonment Protection
1. Complete Steps 0–3 and reach Step 4 (Calendly widget)
2. Try to close the browser tab or navigate away
3. **Verify**: A native browser dialog appears: "Leave site? Changes you made may not be saved."
4. Click "Stay" → remain on the page
5. Click "Leave" → the page navigates away (data is safe in Supabase from the Safety Save)

#### Manual Test 3: "Skip Scheduling" Path
1. Reach Step 4 (Calendly widget)
2. Click the "I'll schedule later" link at the bottom
3. **Verify**: The success screen appears (the booking remains `pending_scheduling` in Supabase)

#### Manual Test 4: Mobile Responsiveness
1. Open the site on a mobile device or Chrome DevTools mobile view (375px width)
2. Complete the full booking flow
3. **Verify**: The Calendly widget is full-width and scrollable
4. **Verify**: The success screen looks good on mobile
5. **Verify**: The skeleton loader scales properly

---

## 9. Future Upgrades (When Upgrading Calendly Tier)

When the studio upgrades to Calendly **Standard** ($10/mo) or higher, we unlock full API access. Here's exactly what changes, and why it's safe.

### 9.1 What Gets Added

| Item | Description |
|------|-------------|
| **1 new file** | `api/calendly-sync.ts` — a Vercel serverless function (~40 lines of code) |
| **1 new env var** | `CALENDLY_API_TOKEN` — a Calendly Personal Access Token (server-side only) |
| **1 small edit** | `useBookingSubmit.ts` — after `finalizeBooking()` saves the URIs, it fires a `fetch()` to the new API route |

That's it. **Zero changes** to database schema, routes, components, or any other file.

### 9.2 How It Works

```
Browser: calendly.event_scheduled fires
   │
   ├── 1. finalizeBooking() saves URIs to Supabase (same as today)
   │
   └── 2. fetch("/api/calendly-sync", { booking_id, event_uri })
              │
              ▼
         Vercel Serverless Function (server-side)
              │
              ├── Calls Calendly API: GET /scheduled_events/{uuid}
              │   (uses CALENDLY_API_TOKEN from env)
              │
              ├── Extracts: start_time, end_time, location
              │
              └── Updates Supabase: SET scheduled_at = start_time
```

### 9.3 Will It Make the Website Slow?

**No.** Here's why:

- The API call runs **server-side on Vercel's edge** — NOT in the user's browser
- The user sees the success screen **immediately** after `finalizeBooking()` completes (Step 1 above)
- The Vercel function (Step 2) runs **asynchronously in the background** — a fire-and-forget `fetch()`
- Even if the Vercel function takes 2 seconds, the user never waits for it
- The function code is ~40 lines — it cold-starts in under 100ms on Vercel

### 9.4 Can Information Leak?

**No.** Here's the security model:

| Secret | Where It Lives | Exposed to Browser? |
|--------|---------------|--------------------|
| `CALENDLY_API_TOKEN` | Vercel server-side env var (NOT prefixed with `VITE_`) | ❌ Never |
| `VITE_SUPABASE_ANON_KEY` | Browser env var | ✅ Yes, but this is a **public** key with RLS protection |
| `VITE_CALENDLY_URL` | Browser env var | ✅ Yes, but this is just a public Calendly link (anyone can see it) |

**Key points:**
- The `CALENDLY_API_TOKEN` **never** appears in the frontend JavaScript bundle. Vite only bundles env vars prefixed with `VITE_`. Since this one is just `CALENDLY_API_TOKEN` (no prefix), it is impossible for it to leak to the browser.
- The Vercel serverless function runs in an isolated Node.js environment. It's the same security model used by Stripe, Twilio, and every serious SaaS integration.
- No user data travels through any third-party service other than Supabase (which we already trust) and Calendly (which already has the booking data).

### 9.5 Is It Easy to Set Up?

**Yes — 3 steps, ~15 minutes total:**

1. **Generate a Calendly Personal Access Token**: Go to [calendly.com/integrations/api_webhooks](https://calendly.com/integrations/api_webhooks) → Create token
2. **Add it to Vercel**: Project Settings → Environment Variables → Add `CALENDLY_API_TOKEN` → paste token → Server-side only
3. **Deploy**: We push the new `api/calendly-sync.ts` file and the small edit to `useBookingSubmit.ts`. Done.

### 9.6 Full Upgrade Checklist

- [ ] Upgrade Calendly plan to Standard or higher
- [ ] Generate Personal Access Token from Calendly dashboard
- [ ] Add `CALENDLY_API_TOKEN` as a server-side env var on Vercel
- [ ] Create `api/calendly-sync.ts` (Vercel serverless function)
- [ ] Update `useBookingSubmit.ts` to call the API route after `finalizeBooking()`
- [ ] **(Optional)** Set up Calendly webhook for even more reliability (works if user closes browser)
- [ ] **(Optional)** Run backfill script to populate `scheduled_at` for all existing bookings that have a `calendly_event_uri`
- [ ] **(Optional)** Enable full `pageSettings` branding customization on the widget

---

> **End of Plan v2 — Awaiting Final Review**
