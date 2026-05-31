# FujiLenses Design Tokens — "Technical Clarity, refined"

Single source of truth is **`colors_and_type.css`**. This file is the human-readable reference and usage rules. Maker / kit / semantic colors are authored in `oklch()`; approximate hex is given for tooling that needs it.

---

## Theming model

```
:root, :root[data-theme="dark"]   → dark (default)
:root[data-theme="light"]          → light (explicit)
@media (prefers-color-scheme: light) + no explicit data-theme → light
```

Default follows the OS. An explicit `data-theme` attribute on `<html>` always wins. Persist the user's choice (`auto` / `dark` / `light`) in `localStorage`.

---

## Color — surfaces & borders

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--bg-base` | `#0d1117` | `#f6f8fa` | Page background, table header bg |
| `--bg-surface` | `#161b22` | `#ffffff` | Sidebar, cards, panels |
| `--bg-elevated` | `#1c232d` | `#f0f3f6` | Hover, active rows/items |
| `--bg-accent` | *accent-mix* | *accent-mix* | Selected tab/control fill (16% accent over surface) |
| `--bg-overlay` | `rgba(8,11,16,.72)` | `rgba(27,31,36,.4)` | Mobile drawer scrim |
| `--border-subtle` | `#21262d` | `#e6e9ee` | Dividers, gridlines, card borders |
| `--border-default` | `#2d343d` | `#d3d9e0` | Inputs, inactive controls |
| `--border-strong` | `#3a424d` | `#bfc7d1` | Hover borders |

## Color — text

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--text-primary` | `#e9eef4` | `#161b22` | Headings, model names, key data |
| `--text-secondary` | `#9ba4b2` | `#4a5260` | Body, secondary data |
| `--text-muted` | `#6b7688` | `#6b7688` | Labels, inactive nav, placeholders |
| `--text-faint` | `#4d5768` | `#9ba4b2` | Ticks, year column, footer — **decorative only** |
| `--text-on-accent` | `#0d1117` | `#ffffff` | Text on a filled accent button |

`--text-faint` must never be used for interactive or essential informational content (it does not meet AA for body). All other text meets WCAG AA.

## Color — accent (interactive UI chrome)

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--accent` | `#818cf8` | `#4f46e5` | Links, focus rings, sorted column, active states |
| `--accent-bright` | `#aab4ff` | `#4338ca` | Active-tab / selected-control text |
| `--accent-hover` | `#99a2fb` | `#4338ca` | Primary-button hover |

**Indigo** is intentionally distinct from every maker hue (especially Fujinon sky-blue) so chrome and catalogue never read as the same thing. Alternates explored in `styleguide.html`: Violet, Azure (collides with Fujinon), Amber (collides with Viltrox), Graphite (monochrome extreme).

## Color — maker palette (one OKLCH family)

Shared lightness & chroma, hue varies. Badge fill = maker color at `--mfr-badge-fill` opacity (16% dark / 18% light).

| Token | Dark `oklch` | ~Hex (dark) | Light `oklch` | Maker |
|---|---|---|---|---|
| `--mfr-fujinon` | `0.81 0.10 245` | `#7fb5e8` | `0.53 0.15 250` | Fujinon — sky blue |
| `--mfr-sigma` | `0.79 0.11 305` | `#c9a4ec` | `0.52 0.17 305` | Sigma — violet |
| `--mfr-viltrox` | `0.82 0.12 75` | `#e0b066` | `0.62 0.14 65` | Viltrox — amber |
| `--mfr-voigtlander` | `0.83 0.10 110` | `#c2c884` | `0.58 0.11 105` | Voigtländer — gold-olive |
| `--mfr-tamron` | `0.81 0.10 168` | `#7fcdb0` | `0.55 0.12 165` | Tamron — mint |
| `--mfr-sirui` | `0.78 0.11 350` | `#e5a3bd` | `0.56 0.16 352` | Sirui — rose |
| `--mfr-ttartisan` | `0.76 0.12 28` | `#e69f8e` | `0.56 0.18 28` | TTArtisan — coral |

Hex values are approximate; **author against the `oklch()` tokens**, not the hex.

## Color — semantic

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--kit` | `oklch(.82 .16 150)` | `oklch(.58 .15 150)` | Ownership: row border, label, "IN KIT" |
| `--kit-bg` | `kit @ 9%` | `kit @ 10%` | Kit row tint |
| `--spec-wr` | `oklch(.81 .10 195)` | `oklch(.55 .10 195)` | Weather-Resistant badge (teal — distinct from Tamron mint) |
| `--spec-feature` | `oklch(.81 .08 250)` | `oklch(.53 .14 255)` | OIS / LM badges |
| `--new` | `= --accent` | `= --accent` | "NEW" badge |
| `--danger` | `oklch(.72 .16 25)` | `oklch(.55 .20 27)` | Destructive (remove), coverage gaps |
| `--danger-bg` | `danger @ 15%` | `danger @ 12%` | Danger tint |

---

## Typography

Families: `--font-sans: 'Geist'`, `--font-mono: 'Geist Mono'`. Mono always uses `font-variant-numeric: tabular-nums`.

### Scale

| Token | px | Role |
|---|---|---|
| `--text-4xl` | 40 | Display / empty-state |
| `--text-3xl` | 32 | Lens detail hero name |
| `--text-2xl` | 24 | Page heading |
| `--text-xl` | 20 | Panel / card title |
| `--text-lg` | 16 | Sub-section heading |
| `--text-md` | 14 | Body, table model names |
| `--text-base` | 13 | Default UI / control labels |
| `--text-sm` | 12 | Secondary UI, counts |
| `--text-xs` | 11 | Eyebrow labels, section headers, ticks |
| `--text-2xs` | 10 | Micro badges (spec chips) |

Weights: 400 regular · 500 medium (UI labels, model names, badges) · 600 semibold (headings) · 700 bold (display). Tracking: `-0.01em`/`-0.02em` on large display; `+0.06em` uppercase labels; `+0.04em` uppercase badges.

### Semantic type classes

`.t-display` `.t-page-title` `.t-panel-title` `.t-section` `.t-label` `.t-body` `.t-ui` `.t-data` `.t-caption` — pair a token set with intent; prefer these over re-declaring font/size/weight per component.

### Font-size accessibility scale

`--font-scale` (S = 0.92 / M = 1 / L = 1.12) multiplies UI + data sizes. Minimum rendered text in any view is 11px.

---

## Spacing, radius, elevation

**Spacing** (4px base): `--space-1 … --space-16` → 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

**Radius:** `--radius-xs` 3 · `--radius-sm` 5 · `--radius-md` 7 · `--radius-lg` 10 · `--radius-xl` 14 · `--radius-full` 999.

**Elevation:** `--shadow-sm` resting cards · `--shadow-md` tooltips/popovers · `--shadow-lg` mobile drawer only. Dark UI prefers borders to shadows.

---

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 120ms | Hover color/bg |
| `--dur-base` | 180ms | State changes, toggles |
| `--dur-slow` | 260ms | View transitions |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Default |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Symmetric moves |

Svelte mapping: row reorder `animate:flip` 250ms; filter change `fade` ~150ms crossfade; tooltip `fade` ~120ms; entrance stagger capped at 8 rows. Everything collapses under `prefers-reduced-motion`.

---

## Layout

- **Sidebar:** 240px fixed, left. All filters + display settings, shared across views. Becomes a left drawer < 1024px.
- **Content:** fills remaining width, max 1200px, 32px gutters (16px on mobile).
- **Top bar:** 56px, sticky, translucent + blur. Brand + view tabs (left), kit count (right).
- **Z-index:** sticky 5 · nav 30 · drawer-overlay 40 · drawer 50 · tooltip 60.

---

## Key patterns

**Kit ownership** (consistent across views): 3px inset left border in `--kit` + `--kit-bg` row tint + green model label + "IN KIT" mono badge. On the focal map, dots/bars keep their **maker** color — kit status shows only via row/label, never by recoloring the data mark.

**Focal map / coverage** (responsive): every mark is positioned by **percentage of container width** on a log scale (10–600mm) — no fixed pixel widths, so it reflows on phones with no horizontal scroll. Primes = 11px dots, zooms = 8px pill bars, colored by maker. The My-Kit coverage band is a single full-width track: green segments = covered, diagonal-hatch red = gaps; significant gaps (> 1.25× ratio) surface as tappable chips that deep-link to the table.

**Lens detail** has dedicated slots for a **4:3 product photo** (hatched placeholder until a real photo exists) and a stacked **retailer/price link list** with an affiliate disclosure — ready for the roadmap's photo + purchase-link work.

**Accessibility:** color is never the sole encoding (shape on the map, labels on every badge); keyboard `:focus-visible` rings everywhere; AA contrast on all functional text.
