# 📋 Booking Form — Style Quiz Implementation Plan

> **Goal:** Replace the cold, form-first experience with a warm, quiz-first funnel.
> The user "plays" through 3 visual quiz steps before seeing any form fields.
> The data collected during the quiz pre-fills the existing form fields invisibly,
> so by the time they reach the contact step, the form is shorter and feels easy.

---

## Overview: Before vs After

### Before
```
Step 1: Name / Email / Phone
Step 2: Describe idea + Placement (dropdown)
Step 3: Size + Budget
Step 4: Artist preference + Review
```

### After
```
Quiz Step A: Style selection       ← new, visual cards
Quiz Step B: Body placement        ← new, SVG body map
Quiz Step C: Size selection        ← new, large button chips
──────────────────────────────────
Form Step 1: Name / Email / Phone  ← unchanged
Form Step 2: Describe your idea    ← unchanged, placement pre-filled
Form Step 3: Budget                ← unchanged, size pre-filled
Form Step 4: Artist + Review       ← unchanged
```

The quiz is **Step 0** — it runs before the existing form steps.
The booking form's step counter starts at `-3` and increments to `0` (contact info).

---

## Component Architecture

### New Files
| File | Purpose |
|---|---|
| `src/components/quiz/StyleQuiz.tsx` | Container — orchestrates all quiz steps |
| `src/components/quiz/QuizStepStyle.tsx` | Step A: tattoo style cards |
| `src/components/quiz/QuizStepBody.tsx` | Step B: front/back body SVG map |
| `src/components/quiz/QuizStepSize.tsx` | Step C: size chips |
| `src/components/quiz/BodySilhouette.tsx` | Reusable SVG silhouette (front or back) |

### Modified Files
| File | Change |
|---|---|
| `src/components/BookingForm.tsx` | Render `<StyleQuiz>` before step 0; receive quiz data as props and pre-fill fields |

---

## State Management

All quiz data lives in `BookingForm.tsx` state alongside existing form state:

```ts
// Existing form state (already there)
const [form, setForm] = useState({
  name, email, phone, idea, placement, size, budget, artist, files
});

// New quiz state (added to BookingForm)
const [quiz, setQuiz] = useState({
  style: "",       // e.g. "Fine Line"
  zones: [],       // e.g. ["Αντιβράχιο", "Πλάτη"]
  size: "",        // e.g. "Μεσαίο"
});

// Quiz drives the step counter
// step === -3 → Quiz Step A (Style)
// step === -2 → Quiz Step B (Body)
// step === -1 → Quiz Step C (Size)
// step ===  0 → Form Step 1 (Contact)
```

When the quiz completes, `quiz.zones` is joined into a string and written to `form.placement`, and `quiz.size` is written to `form.size`. These fields are then hidden from the form UI (no need to show them since quiz captured them).

---

## Quiz Step A — Style Selection

### Visual Design
- Heading: *"Τι στυλ σε εκφράζει;"*
- 6 cards in a responsive grid (2 cols mobile, 3 cols md)
- Each card contains:
  - A simple SVG icon representing the style
  - The style name in the site's serif font
  - A one-line Greek descriptor
- On hover: card lifts slightly (border highlight in primary color)
- On select: card fills with primary color tint, checkmark appears
- Single selection only

### Styles & Icons
| Style | Icon concept | Descriptor |
|---|---|---|
| Fine Line | Single thin horizontal stroke | Λεπτό,섬세, αιώνιο |
| Realism | Shaded circle gradient | Φωτογραφική ακρίβεια |
| Blackwork | Bold filled square | Δυνατό, μοντέρνο |
| Japanese | Wave/koi outline | Παραδοσιακό, αφήγηση |
| Traditional | Bold star outline | Κλασικό, τολμηρό |
| Geometric | Triangle/hexagon | Μαθηματική αρμονία |

### Behaviour
- Selecting any card immediately enables the "Επόμενο →" button
- No auto-advance — user must click next intentionally
- Selection persists if user goes back

---

## Quiz Step B — Body Placement

### Visual Design
- Heading: *"Πού θέλεις το τατουάζ;"*
- Sub-label: *"Μπορείς να επιλέξεις πάνω από ένα σημείο"*
- Two SVG silhouettes side by side:
  - Left: Front of body, labelled **"Μπροστά"** in small caps above
  - Right: Back of body, labelled **"Πίσω"** in small caps above
- Below both silhouettes: a row of selected-zone tags (removable chips)
- "Επόμενο →" enabled once at least 1 zone is selected

### Silhouette SVG Spec
- Size: Each silhouette ~120px wide × 280px tall on desktop
- Style: Minimal single-stroke outline, gender-neutral
- Fill: `currentColor` at 10% opacity (barely visible — just a guide)
- Stroke: `currentColor` at 20% opacity
- No facial features, no hair, no clothing details
- The silhouette is the scaffold — the interactive zones are overlaid on top

### Clickable Zones (SVG `<g>` groups)
Each zone is an SVG `<ellipse>` or simplified `<path>` positioned over the corresponding anatomy. They are invisible by default (`opacity: 0`) and become visible on hover or when selected.

#### Front Zones
| Zone name (Greek) | Anatomical position |
|---|---|
| Λαιμός | Neck |
| Στήθος | Chest / pec area |
| Πλευρά | Ribs / side |
| Στομάχι | Abdomen |
| Ώμος | Shoulder |
| Μπράτσο | Upper arm (front) |
| Αντιβράχιο | Forearm (front) |
| Καρπός | Wrist |
| Χέρι | Hand |
| Μηρός | Thigh (front) |
| Γόνατο | Knee |
| Κνήμη | Shin |
| Αστράγαλος | Ankle |

#### Back Zones
| Zone name (Greek) | Anatomical position |
|---|---|
| Άνω Πλάτη | Upper back / shoulder blades |
| Κάτω Πλάτη | Lower back |
| Σπονδυλική | Spine strip |
| Ώμος (πίσω) | Rear shoulder |
| Μπράτσο (πίσω) | Upper arm (back) |
| Αντιβράχιο (πίσω) | Forearm (back) |
| Γλουτός | Glute / upper hip |
| Μηρός (πίσω) | Thigh (back) |
| Γάμπα | Calf |

### Zone Interaction States
| State | Visual |
|---|---|
| Default | Invisible (`opacity: 0`) |
| Hover | Soft primary-colour fill, 25% opacity |
| Selected | Primary-colour fill, 55% opacity + thin primary border |
| Selected + Hover | Same as selected (no change on hover once selected) |

### Zone Label Behaviour
- On zone hover: a small floating tooltip with the zone name appears above the cursor
- On zone select: the zone name is added as a chip tag below the silhouettes
- Clicking a chip tag deselects that zone

---

## Quiz Step C — Size Selection

### Visual Design
- Heading: *"Πόσο μεγάλο;"*
- 4 large horizontal button chips, full-width, stacked vertically
- Each chip includes:
  - Size label (bold serif)
  - A real-world reference in muted text
  - A small line-art scale illustration (optional)

### Size Options
| Label | Reference | Maps to form value |
|---|---|---|
| Μικρό | Χωράει στην παλάμη — έως 5cm | Μικρό (< 5cm) |
| Μεσαίο | Μέγεθος αντιβραχίου — 5–15cm | Μεσαίο (5-15cm) |
| Μεγάλο | Καλύπτει μια επιφάνεια — 15–30cm | Μεγάλο (15-30cm) |
| Full Sleeve | Ολόκληρο μέλος | Full Sleeve |

### Behaviour
- Single selection only
- Selecting any chip enables "Επόμενο →"
- On next: quiz data is written into form state, step advances to 0 (contact info)

---

## Transition & Animation

- Each quiz step transitions with a **slide + fade**: current step slides left out, next step slides in from the right (framer-motion `AnimatePresence`)
- Going back reverses direction (current slides right, previous slides in from left)
- Quiz steps use the same visual frame as the existing form (max-w-2xl, same card style)

### Progress Indicator
- Existing form has a 4-step progress bar at the top
- This extends to a **7-step bar** (3 quiz + 4 form) — or alternatively, a **separate quiz progress indicator** (dots A / B / C) that transitions into the existing bar when the form begins
- Recommendation: separate quiz dots (●●○) then existing form bar — keeps the two phases visually distinct

---

## Data Flow Summary

```
QuizStepA → quiz.style = "Fine Line"
QuizStepB → quiz.zones = ["Αντιβράχιο", "Πλάτη"]
QuizStepC → quiz.size  = "Μεσαίο"
                ↓
On quiz complete:
  form.placement = quiz.zones.join(", ")   → "Αντιβράχιο, Πλάτη"
  form.size      = quiz.size               → "Μεσαίο"
                ↓
Form step 2 (Idea/Placement):
  placement field is PRE-FILLED and hidden (read-only summary shown instead)
Form step 3 (Size/Budget):
  size field is PRE-FILLED and hidden
```

---

## What Does NOT Change

- All existing form validation logic
- All existing form steps and their field labels
- The success/thank-you state after submission
- The multi-step progress bar during form steps
- Mobile layout (quiz steps are fully responsive)

---

## Implementation Order

1. `BodySilhouette.tsx` — SVG silhouette component (front + back variants)
2. `QuizStepStyle.tsx` — Style card grid
3. `QuizStepBody.tsx` — Body placement with silhouettes
4. `QuizStepSize.tsx` — Size chips
5. `StyleQuiz.tsx` — Container that orchestrates A → B → C with transitions
6. `BookingForm.tsx` — Integrate quiz, extend step counter, hide pre-filled fields

---

*Created: 25 Feb 2026*
