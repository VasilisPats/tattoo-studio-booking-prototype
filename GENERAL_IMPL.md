# General Implementation Plan — Tattoo Studio Booking Prototype

> **Purpose**: High-level roadmap of all planned activities for the project.
> Check off items as they are completed. Each item will get its own detailed implementation plan when the time comes.

---

## 1. Booking Form Repositioning

- [x] Move the booking form into the Hero section (right side, next to business name)
- [x] Replace the main image placeholder with the form
- [x] Ensure responsive layout (stacks on mobile)
- [x] Validate the form still functions correctly in its new position

---

## 2. Backend Calendar Booking Integration (Refined Hybrid Strategy)

**Core Concept**: A frictionless "Art-First" flow. Skip manual date picking in the custom form to avoid redundancy, capturing rich metadata in **Supabase** first, and finalizing the appointment via **Calendly** as the source of truth for time.

### Implementation Checklist
- [x] **Phase A: Infrastructure**: Initialize Supabase client and storage bucket (`tattoo-references`).
- [x] **Phase B: The Safety Save (Art-First)**:
  - Captures Style Quiz + Tattoo Idea + Reference Images.
  - Saves as a `pending_scheduling` record in Supabase *before* the calendar step.
  - Generates a unique `booking_id`.
- [ ] **Phase C: Calendly Synchronization (The Liquid Flow)**:
  - **Remove Manual Date Picker**: Custom form focus is 100% on the project details.
  - **The Pass-Off**: Open Calendly Inline Widget with the `booking_id` passed as a hidden pre-fill value.
  - **Browser-Side Listener**: Use the Calendly Event Listener to detect successful booking confirmation without needing complex webhooks.
  - **Final Sync**: On confirmation, update the Supabase record with the final date/time and update status to `scheduled`.
- [x] **Phase D: The Artist Gallery (Utility Page)**:
  - **One-Tap Access**: Dedicated `/ref/:bookingId` route for artists.
  - **Calendar Injection**: The link is automatically included in the Calendly event notes.
  - **Mobile-Optimized**: High-contrast, read-only view for use at the tattoo station.

### Design Principles: FLAWLESS UX
- **No Redundancy**: The user only picks a date **once** (inside the Calendly widget).
- **Data Integrity**: Even if they quit during Calendly, the "Safety Save" ensures the artist doesn't lose the tattoo idea or the reference photos.
- **Decoupled Logic**: The `ArtistGallery` remains a lean, separate component to prevent "code spaghetti."

---

## 3. Backend Email Automation

- [ ] Set up transactional email provider (n8n webhooks, Resend, or SendGrid)
- [ ] Booking confirmation email on successful submission
- [ ] Appointment reminder emails (e.g. 24h before)
- [ ] Follow-up email after session
- [ ] GDPR-compliant unsubscribe handling

---

## 4. Payment Processing

- [ ] Integrate Stripe (Checkout or Elements)
- [ ] Vercel API route for creating payment intents
- [ ] Handle Stripe webhooks for payment confirmation
- [ ] Store payment status in Supabase
- [ ] Deposit vs full payment options

---

## 5. SEO / AEO / GEO Optimization

- [ ] Add proper meta tags and title tags across all pages
- [ ] Inject JSON-LD structured data (LocalBusiness, FAQPage, etc.)
- [ ] Generate `sitemap.xml`
- [ ] Configure `robots.txt`
- [ ] Optimize for AI answer engines (AEO) with FAQ content
- [ ] Local/geo search optimization (Google Business Profile references)

---

## 6. Style Toggle — Multiple Artistic Themes

- [ ] Design a theming system (CSS variables / Tailwind theme configs)
- [ ] Create the "Luxurious" theme (current default)
- [ ] Create additional themes (minimalist, traditional, neo-traditional, etc.)
- [ ] Build a toggle UI component for switching between styles
- [ ] Ensure all components respect the active theme
- [ ] Polish each theme to demo quality

---

## 7. Hero Form Concept: Glass Liquid Hybrid

- [x] Combine **Glassmorphism** with **Liquid Flow** transitions
- [x] Implement a floating glassmorphic card (backdrop-blur, transparency)
- [x] Replace the Hero image placeholder with the new form card
- [x] Develop the "Ink Wipe" transition effect for multi-step reveals
- [x] **Mobile Strategy**: Headline -> Description -> CTA Button -> Form
- [x] Ensure the CTA button acts as a trigger/focus to the form on small screens
- [x] Optimize form layout to be full-width on mobile for better accessibility

---

> **Last updated**: 2026-03-14
> **Maintained by**: VasilisPats
