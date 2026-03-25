# FujiLenses Design System — Direction D "Technical Clarity"

Companion doc to the Paper mockups (Table View + Focal Map View).

## Color Tokens

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0F1318` | Page background |
| `--bg-surface` | `#161C24` | Sidebar, cards |
| `--bg-elevated` | `#1A2230` | Active sidebar items, tooltips |
| `--bg-accent` | `#1A2D42` | Active tabs, selected controls |
| `--border-subtle` | `#222A35` | Section dividers, chart borders |
| `--border-default` | `#2A323C` | Input borders, inactive controls |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#E6EDF3` | Headings, model names, key data |
| `--text-secondary` | `#9BA4B2` | Body text, secondary data, sortable table headers |
| `--text-muted` | `#6B7688` | Labels, inactive nav, placeholders |
| `--text-faint` | `#4D5768` | Year column, axis ticks, footer text |

Note: sortable table column headers use `--text-muted` (not `--text-faint`) since they are interactive controls. The active sorted column uses `--accent`.

### Accent — Interactive
| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#60A5FA` | Active states, sorted column header, focus rings |
| `--accent-bright` | `#A8D4FF` | Active tab text, selected control text |

Note: `--accent` is intentionally a cooler, brighter blue (`#60A5FA`) than `--mfr-fujinon` (`#7EB8F0`) to avoid ambiguity between UI chrome and Fujinon data elements.

### Manufacturer Colors
| Token | Value | Manufacturer |
|-------|-------|-------------|
| `--mfr-fujinon` | `#7EB8F0` | Fujinon (desaturated sky blue) |
| `--mfr-sigma` | `#C9A0FF` | Sigma (lavender) |
| `--mfr-viltrox` | `#FDBA74` | Viltrox (amber) |
| `--mfr-tamron` | `#6EE7B7` | Tamron (mint green) |

Badge backgrounds use the manufacturer color at 18% opacity (dark mode) or 25% opacity (light mode).

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--kit` | `#4ADE80` | "In Kit" badges, row highlight border |
| `--kit-bg` | `rgba(78,205,128,0.08)` | Kit row background tint |
| `--spec-wr` | `#2DD4BF` | Weather Resistant badge (teal) |
| `--spec-feature` | `#93C5FD` | OIS, LM badges |

Note: `--spec-wr` uses teal (`#2DD4BF`) to distinguish from `--mfr-tamron` (`#6EE7B7`).

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Logo / brand | Instrument Sans | 700 | 17px |
| Page heading | Instrument Sans | 600 | 22px |
| Nav / UI labels | Instrument Sans | 400–500 | 12–13px |
| Section headers (sidebar) | Instrument Sans | 500 | 11px, uppercase, 0.08em tracking |
| Table model names | Instrument Sans | 500 | 14px |
| Data values (focal, aperture, weight) | JetBrains Mono | 400–500 | 12–13px |
| Manufacturer badges | JetBrains Mono | 500 | 11px, uppercase |
| Spec badges (WR, OIS, LM) | JetBrains Mono | 500 | 10px, uppercase |
| Axis ticks / small labels | JetBrains Mono | 400 | 11px |

Font size selector (S/M/L) scales data rows proportionally across both Table and Map views. Minimum text size in any view is 11px to maintain legibility on 1080p non-retina displays.

## Layout

- **Sidebar:** 220px fixed width, left-aligned. Contains all filters and display settings. Shared across Table and Map views.
- **Content area:** Flexible, fills remaining width. 36px horizontal padding.
- **Nav bar:** Full width, 18px vertical padding, 40px horizontal. View tabs on left, status/sort on right.
- **Footer:** Full width, pinned to bottom.

## Kit Ownership Pattern

Consistent across both views:
- **Green left border** (3px solid `--kit`) on the row
- **Green background tint** (`--kit-bg`) on the row
- **Green label text** on the lens name
- **"IN KIT" badge** — green text on green-tinted background

On the focal map, bars/dots always use manufacturer color. Kit status is only shown via the row highlight — no color mixing on the data visualization elements.

## Focal Map Specifics

- **Zoom lenses:** Horizontal bars, 8px tall, rounded ends, manufacturer-colored
- **Prime lenses:** 10px circles, manufacturer-colored
- **Axis:** Logarithmic by default (linear toggle available), tick labels in JetBrains Mono 11px
- **Tooltip on hover:** Dark elevated card with lens name, manufacturer, key specs (equivalent, weight, aperture). Kit badge shown if owned. Tooltip trigger areas are keyboard-focusable.
- **Sidebar additions (map only):** Legend section, Native/FF Equiv toggle, Log/Linear scale toggle

## Sidebar Controls by View

| Control | Table | Map |
|---------|-------|-----|
| Manufacturer | Yes | Yes |
| Lens Type | Yes | Yes |
| Features (WR, OIS, AR) | Yes | Yes |
| FF Equivalent | Yes | Yes (as Native/FF toggle) |
| Font Size (S/M/L) | Yes | Yes |
| Theme (Dark/Light) | Yes | Yes |
| Scale (Log/Linear) | No | Yes |
| Legend | No | Yes |

## Accessibility

- **Focus rings:** All interactive elements (nav tabs, filter controls, table headers, sidebar toggles, kit buttons) show a `2px solid var(--accent)` outline with `2px` offset on keyboard focus. Uses `:focus-visible` to avoid showing rings on mouse clicks.
- **Color is not the sole encoding:** Focal map uses shape (circles for primes, bars for zooms) in addition to manufacturer color. Kit ownership uses row highlight + badge + label color, not bar/dot color alone.
- **Contrast:** All text meets WCAG AA minimum (4.5:1 for body, 3:1 for large text). `--text-faint` is reserved for non-essential decorative labels only — never for interactive or informational content.

## Light Mode

Full light mode token set:

### Backgrounds (Light)
| Token | Value |
|-------|-------|
| `--bg-base` | `#F5F7FA` |
| `--bg-surface` | `#FFFFFF` |
| `--bg-elevated` | `#FFFFFF` |
| `--bg-accent` | `#E0EDFF` |
| `--border-subtle` | `#E5E8ED` |
| `--border-default` | `#CDD3DC` |

### Text (Light)
| Token | Value |
|-------|-------|
| `--text-primary` | `#1A1E24` |
| `--text-secondary` | `#4A5264` |
| `--text-muted` | `#6B7688` |
| `--text-faint` | `#9BA4B2` |

### Manufacturer Colors (Light)
Manufacturer colors shift to deeper saturations for contrast on light backgrounds:

| Token | Value |
|-------|-------|
| `--mfr-fujinon` | `#3B82D6` |
| `--mfr-sigma` | `#8B5CF6` |
| `--mfr-viltrox` | `#D97706` |
| `--mfr-tamron` | `#059669` |

Badge backgrounds use manufacturer color at 25% opacity in light mode (vs 18% in dark).

### Accent & Semantic (Light)
| Token | Value |
|-------|-------|
| `--accent` | `#2563EB` |
| `--accent-bright` | `#1D4ED8` |
| `--kit` | `#16A34A` |
| `--kit-bg` | `rgba(22,163,74,0.08)` |
| `--spec-wr` | `#0D9488` |
| `--spec-feature` | `#2563EB` |

## Motion (Svelte)

- **Table sort:** `animate:flip` on row reorder
- **Filter changes:** `transition:fade` with 150ms crossfade on table content
- **Tooltip:** `transition:fade` with 100ms on show/hide
- **Sidebar toggles:** CSS transitions on background-color (200ms ease)
- **Page entrance:** Staggered row fade-in using `in:fly` with incremental delay, capped at 8 rows. Rows beyond the initial 8 appear instantly. On subsequent filter changes, no stagger — only crossfade.
