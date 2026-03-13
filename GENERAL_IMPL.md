# General Implementation Plan — Artisan Studio Showcase

> **Purpose**: High-level roadmap of all planned activities for the project.
> Check off items as they are completed. Each item will get its own detailed implementation plan when the time comes.

---

## 1. Booking Form Repositioning

- [ ] Move the booking form into the Hero section (right side, next to business name)
- [ ] Replace the main image placeholder with the form
- [ ] Ensure responsive layout (stacks on mobile)
- [ ] Validate the form still functions correctly in its new position

---

## 2. Backend Calendar Booking Integration

- [ ] Choose a calendar solution (Calendly embed, Cal.com, or custom Supabase)
- [ ] Integrate real-time availability / time-slot picker
- [ ] Connect booking form submissions to the calendar
- [ ] Handle timezone logic
- [ ] Confirmation flow after booking

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

> **Last updated**: 2026-03-13
> **Maintained by**: VasilisPats
