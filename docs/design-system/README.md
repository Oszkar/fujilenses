# FujiLenses Design System

The visual language and component reference for **FujiLenses** — an interactive lens explorer for the Fujifilm X-mount ecosystem (browse, filter, compare lenses from Fujinon, Sigma, Viltrox, Tamron, Sirui, Voigtländer, and TTArtisan).

This design system documents the **"Technical Clarity"** direction: a calm, data-dense interface where the lens data is the only thing allowed to carry color.

> **Live product:** [fujilenses.com](https://fujilenses.com)
> **Source:** [github.com/Oszkar/fujilenses](https://github.com/Oszkar/fujilenses) — SvelteKit (static) · Tailwind CSS v4 · TypeScript · d3-scale · Vercel

---

## Index — what's in this folder

| File / folder | What it is |
|---|---|
| **`styleguide.html`** | The living styleguide. Every token, type ramp, and component rendered live, with a theme switch (Auto/Dark/Light) and an interactive **accent explorer**. Start here. |
| **`colors_and_type.css`** | The single source of truth for tokens. Drop-in replacement for the `:root` block in `src/routes/layout.css`. Both themes + OS-preference fallback. |
| **`DESIGN-TOKENS.md`** | Human-readable token reference and usage rules (replaces the old doc). |
| **`ui_kits/web/`** | Interactive, high-fidelity recreation of the app in the refreshed system — Table, Focal Map, My Kit, and Lens Detail. `index.html` + `app.css`. |
| **`SKILL.md`** | Agent Skill manifest, so this system can be used by Claude Code. |
| **`preview/`** | Small card files that populate the Design System tab. |
| **`screenshots/`** | Reference captures. |

---

## CONTENT FUNDAMENTALS

How FujiLenses writes.

- **Voice:** plain, factual, photographer-to-photographer. No marketing gloss, no exclamation points. The data does the talking.
- **Person:** addresses the user as **"you"** and their gear as **"My Kit" / "your kit."** First person is reserved for that ownership feature.
- **Casing:** **Sentence case** for headings, body, and buttons ("Add to My Kit", "Clear filters", "Also consider"). The only uppercase is **eyebrow labels and badges** — sidebar section headers ("MANUFACTURER", "LENS TYPE") and mono badges ("WR", "OIS", "NEW", "IN KIT", maker names).
- **Specs are terse and unit-suffixed:** `56mm`, `f/1.2`, `405g`, `2022`. Ranges use an en-dash: `16–55mm`. Full-frame equivalence is always labelled "FF equivalent" / "equivalent", never assumed.
- **Buttons are verb-first:** "Add to My Kit", "Browse lenses", "Clear filters". Toggled state is shown inline ("In My Kit — Remove").
- **Empty & helper states are encouraging and instructive,** never cute: *"Your kit is empty — Add lenses from the Table or Map to map your focal coverage and spot the gaps."*
- **Abbreviations** are the camera-world standard and never expanded inline: WR (weather resistant), OIS (optical image stabilisation), LM (linear motor), MF (manual focus), AR (aperture ring), FF (full frame).
- **No emoji.** Ever. Iconography is line-SVG and color dots only.
- **Numbers are honest:** prices are marked "indicative", affiliate links are disclosed plainly.

---

## VISUAL FOUNDATIONS

The motifs that make it feel like FujiLenses.

- **Color philosophy — "color belongs to the data."** Surfaces are cool, near-neutral greys (very slightly blue). Body chrome is monochrome. Color appears in exactly three places: the **maker palette** (categorical data), the **single accent** (interactivity), and **semantic signals** (kit green, WR teal, danger red, NEW). This restraint is the whole identity — resist adding decorative color.
- **Maker palette** is one harmonized OKLCH family (L ≈ 0.81 / C ≈ 0.10 in dark, deeper in light). Badges are the maker color over a low-opacity fill of itself (`--mfr-badge-fill`). **Color is never the only signal** — every badge is also labelled, and the focal map encodes prime vs zoom as *shape* (dot vs bar).
- **Type:** Geist (interface) + Geist Mono (every number). Mono runs `tabular-nums` always, so columns of focal lengths and weights align. Headings are semibold/bold with tight tracking (-0.01 to -0.02em); labels are 11px uppercase with +0.06em tracking.
- **Backgrounds:** flat solid surfaces. **No gradients, no images, no texture** behind UI. The only "texture" is a diagonal hatch used purely to mark *placeholders* (empty product-photo frame) and *gaps* (uncovered focal ranges) — it always signals absence, never decoration.
- **Borders over shadows.** Structure comes from 1px hairline borders (`--border-subtle` for dividers, `--border-default` for controls). Shadows are restrained: `sm` for resting cards, `md` for tooltips/popovers, `lg` for the mobile drawer only. Dark mode leans almost entirely on borders.
- **Corner radii** are small and consistent: 3px micro-badges, 5px chips, 7px buttons/inputs, 10px cards/panels, 14px hero/photo frames, full-pill for toggles and dots.
- **Cards** = `--bg-surface` + 1px `--border-subtle` + 10px radius, no shadow at rest. Hover lifts the border to `--accent` and the fill to `--bg-elevated`.
- **Transparency & blur:** used sparingly — a translucent + `backdrop-filter: blur(12px)` sticky top bar, and the mobile drawer scrim (`--bg-overlay`). Badge and tint fills use `color-mix` against transparent so they adapt to either theme.
- **Hover state:** background steps up one surface level (`transparent → --bg-elevated`) and/or text brightens one tier; links go to `--accent`. **Press/active:** selected controls fill with `--bg-accent` and text becomes `--accent-bright`. Kit rows get a 3px green inset left border + green tint + green label.
- **Motion:** quick and unshowy. `--dur-fast` 120ms for hovers, `--dur-base` 180ms for state changes, `--dur-slow` 260ms for view transitions. Easing is a gentle `ease-out` (`cubic-bezier(.22,1,.36,1)`). Table sorts flip rows; filter changes crossfade; tooltips fade 120ms. All motion is disabled under `prefers-reduced-motion`.
- **Layout:** fixed 240px left sidebar holds all filters + settings (shared across views); content fills the rest, capped at 1200px with 32px gutters; a 56px sticky top bar carries brand + view tabs + kit count. On mobile (<1024px) the sidebar becomes a left drawer.
- **Focus:** keyboard-only focus rings — `2px solid var(--accent)` with 2px offset via `:focus-visible`, never on mouse.
- **Density:** comfortable, not cramped — 4px base grid, ~11px vertical cell padding in the table. Data-dense but breathing.

---

## ICONOGRAPHY

- **Approach:** sparse, functional, **line icons only** — 1.5px stroke, `currentColor`, `stroke-linecap="round"`. Drawn inline as small SVGs (hamburger/drawer, close ×, sort chevron, back arrow, the camera glyph in photo placeholders, the Ko-fi cup). There is **no icon font and no icon-heavy UI** — the interface deliberately avoids decorative icons.
- **Color dots & shapes carry most "iconographic" load:** an 8px filled circle in the maker color is the manufacturer "icon"; prime vs zoom is a dot vs a bar; kit status is a green dot.
- **Logo / brand mark:** a small rounded square containing a ring outline in the accent color (a lens iris abstraction) next to the **FujiLenses** wordmark in Geist Bold. The favicon in the repo is `static/favicon.png`. *(The wordmark mark used in these mockups is a lightweight stand-in built from tokens — swap in the real favicon/logo asset when integrating.)*
- **Emoji / unicode:** none as UI. Plain unicode arrows (`↗`, `←`, `▲`) and the en-dash/middot are used as typographic glyphs only.
- **If you need an icon not present here,** match the existing style: 1.5px stroke, rounded caps, `currentColor`, 18–24px box. Lucide is the closest CDN match if a set is ever needed.

---

## Using this system

**Source of truth:** `colors_and_type.css` defines the tokens (both themes + OS-preference fallback). The app's tokens live in `src/routes/layout.css`, with Geist and Geist Mono self-hosted from `static/fonts/`. Keep the two in sync when changing a token. Component CSS in `ui_kits/web/app.css` maps onto the Svelte components.

**For prototypes / mocks:** open `styleguide.html` to grab tokens and component markup, or lift screens from `ui_kits/web/`.

**Notes:** maker, kit and semantic colors are authored in `oklch()` (hex equivalents in `DESIGN-TOKENS.md`). The brand mark in the mockups is a token-built stand-in; the real asset is `static/favicon.png`.
