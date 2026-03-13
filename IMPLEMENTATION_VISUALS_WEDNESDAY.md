# 🎨 Visual & UX Enhancements — Wednesday Session

> Implementation plan for premium visual upgrades to The Living Canvas website.
> Track progress using the checkboxes below.

---

## 1. Page Load Animation (Intro Sequence)
> *Eliminate the blank white screen on load. Create a premium branded entrance.*

- [x] Install `framer-motion` package
- [x] Create `LoadingScreen.tsx` component
  - [x] Dark screen with THE LIVING CANVAS logo centered
  - [x] Logo fade-in with subtle scale animation
  - [x] Loading bar or dot pulse below logo
  - [x] Screen slides/fades away to reveal the site
- [x] Integrate in `App.tsx` with state to control visibility
- [x] Add staggered fade-in to Hero section elements (title → subtitle → CTA button)
- [x] Test: reload page, verify smooth intro → content reveal

---

## 2. ~~Mega Dropdown Navigation~~ *(Removed)*
> *Decided against — too complex and impactful on the clean nav aesthetic.*

---

## 3. Enhanced Hover States & Micro-Interactions
> *Make every interactive element feel alive and responsive.*

- [x] **Buttons**: Subtle scale bounce on hover (1.02x → 1x), magnetic pull effect near cursor
- [x] **Cards** (Reviews, Safety items): Gentle lift + shadow on hover
- [x] **Navbar links**: Underline slide-in animation
- [x] **Booking Form inputs**: Glow border on focus, smooth label float
- [x] **Footer links**: Color transition with slight shift
- [x] Test: hover over every interactive element, verify smoothness

---

## 4. CTA Improvements
> *Make the booking call-to-action more prominent and persuasive.*

- [x] Add **floating CTA button** (bottom-right corner)
  - [x] "Κλείσε Συνεδρία" with a subtle pulse/glow animation
  - [x] Appears after scrolling past the Hero section
  - [x] Smooth scroll to BookingForm on click
  - [x] Disappears when BookingForm section is in view
- [x] Improve Hero CTA button styling (larger, more contrast, hover animation)
- [x] Add CTA at the bottom of the Διαδρομή section ("Ξεκίνα τη Διαδρομή σου")
- [x] Test: scroll through entire page, verify CTA visibility and behavior

---

## 5. Sticky Section Indicator (Side Dots) ✅
> *Tattoo needle marker sliding along a vertical line — niche-appropriate and discreet.*

- [x] Create `SectionIndicator.tsx` component
  - [x] Vertical line fixed on the left edge
  - [x] Tattoo needle SVG slides to active section
  - [x] Each dot = one section (Hero, Gallery, Artists, Process, Safety, Reviews, Booking)
  - [x] Active section dot highlights in primary color
  - [x] Clicking a dot smooth-scrolls to that section
  - [x] Section label reveals on hover
- [x] Added `id="hero"` and `id="reviews"` to missing sections
- [x] Use `IntersectionObserver` to detect active section
- [x] Hidden on mobile
- [x] Removed "Κλείσε Συνεδρία" CTA from navbar (desktop + mobile)
- [x] Added `font-feature-settings: "case" 1` to strip Greek accent marks on uppercase text

---

## 6. Number Counter Animations (Social Proof Stats)
> *A stats bar that counts up dynamically — builds instant credibility.*

- [x] Create `StatsBar.tsx` component
  - [x] Horizontal row of 3-4 key numbers
  - [x] Suggested stats: `500+ Tattoos` | `5.0★ Google Rating` | `8+ Years Experience` | `5 Artists`
  - [x] Numbers animate from 0 → final value when scrolled into view
  - [x] Use `IntersectionObserver` to trigger only once
  - [x] Clean typography: large bold number + small label below
- [x] Decide placement (between Hero & Gallery, or between Process & Safety)
- [x] Subtle separator lines between each stat
- [x] Test: scroll to section, verify numbers count up smoothly

---

## 7. Additional Suggestions ✨

### 7a. Parallax Scroll Effects
- [x] Hero background with subtle parallax movement
- [x] Section dividers with parallax depth layers (ink splash blobs)
- [x] Artists cards with 3D tilt-on-hover effect

### 7b. Text Reveal Animations
- [x] Section titles: words animate in one by one (masked slide-up)
- [x] Replaced simple fade-in with dynamic framer-motion reveals

### 7c. Smooth Scroll Behavior
- [x] Enable `scroll-behavior: smooth` globally
- [x] All anchor links use smooth scrolling with offset for fixed navbar (`scroll-padding-top: 80px`)

### 7d. Image Lazy Loading with Blur Effect
- [ ] When artist/gallery images are added later, load with a blurred placeholder → sharp reveal
- [ ] Creates a premium "Progressive loading" feel

### 7e. Cursor Trail Effect ✅
- [x] Ink drop cursor that follows the mouse with spring lag
- [x] Only on desktop, disabled on mobile/touch devices

---

## Priority Order

| # | Feature | Impact | Effort | Priority |
|---|---------|--------|--------|----------|
| 1 | Page Load Animation | 🔥🔥🔥 | Medium | **DO FIRST** |
| 2 | CTA Improvements | 🔥🔥🔥 | Low | **DO SECOND** |
| 3 | Number Counter Animations | 🔥🔥🔥 | Low | **DO THIRD** |
| 4 | Hover States & Micro-Interactions | 🔥🔥 | Medium | **DO FOURTH** |
| 5 | Mega Dropdown | 🔥🔥🔥 | High | **DO FIFTH** |
| 6 | Sticky Section Dots | 🔥 | Medium | Nice to have |
| 7 | Additional Suggestions | 🔥 | Varies | Pick & choose |

---

*Created: 24 Feb 2026 | Session planned for: Wednesday 26 Feb 2026*
