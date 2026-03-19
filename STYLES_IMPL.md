# Artistic Themes Implementation Plan

This plan details the implementation of a 3-way artistic style toggle that dynamically changes the visual aesthetic of the entire landing page (colors, fonts, borders, shadows) without changing the underlying content, photos, or booking flow.

## Goal Description
Implement an always-visible toggle labeled "switch style here!" that switches the entire website between three distinct visual aesthetics:
1. **Old School Punk Hardcore** (Gritty DIY, harsh blacks/whites, neon accents, brutalist borders, typed/scribbled fonts)
2. **Fine Line / Minimalist** (Clean art gallery vibe, warm creams, elegant serifs, massive whitespace, no harsh borders)
3. **Dark Occult / Blackwork** (Pitch black, ash text, gold/blood red accents, gothic fonts, sharp blocky edges)

The site will read a URL parameter (e.g. `?style=punk`) allowing you to send tailored links directly to clients. It will also allow manual switching via the floating toggle component, saving the user's preference locally.

## User Review Required
> [!NOTE] 
> Please review the design choices in the CSS section. Should the "switch style here!" toggle be sticky at the top-right corner, bottom-right corner, or somewhere else? (I'll add it floating bottom-right so it doesn't clash with the top navigation, unless you specify otherwise).

## Proposed Changes

### Configuration & Global Styles
#### [MODIFY] `index.css`
- Inject `@import` statements for the necessary Google Fonts (`Permanent Marker`, `Courier Prime`, `Playfair Display`, `UnifrakturMaguntia`, etc.).
- Delete hardcoded Tailwind colors if they conflict, replacing them entirely with CSS variables.
- Add specific `.theme-punk`, `.theme-minimal`, and `.theme-occult` classes assigned to the root element. Each class overrides the CSS variables for:
  - `--background`
  - `--foreground` (text)
  - `--primary` (buttons/accents)
  - `--radius` (border roundness)
  - `--font-heading` and `--font-body`

### State Management
#### [NEW] `src/contexts/ThemeContext.tsx`
- Create a `ThemeProvider` context to track the active style.
- Startup Logic: Check URL param `?style=` first, then fallback to `localStorage`, then default to a base theme.
- Update the DOM element `<html class="...">` whenever the theme changes to rapidly repaint the CSS variables globally.

### Components
#### [NEW] `src/components/ThemeToggle.tsx`
- Create a fixed-position component with the explicit text "switch style here!".
- Add a 3-way selector (e.g. a stylized dropdown or 3 toggle buttons).
- Ensure high `z-index` so it sits above all other content.

### Application Root
#### [MODIFY] `src/App.tsx` (or `main.tsx`)
- Wrap the main application component tree inside the new `<ThemeProvider>`.
- Render the `<ThemeToggle />` globally so it is always visible.

## Verification Plan
### Automated / Manual Verification
- **Visual Tests:** Select each of the three styles and visually verify the typography, button borders, and background change instantly.
- **URL Overrides:** Navigate to `localhost:8080/?style=punk` and ensure the site automatically mounts in the Punk theme.
- **Persistence:** Switch to "Minimalist", refresh the page, and ensure it remembers "Minimalist" via `localStorage`.
