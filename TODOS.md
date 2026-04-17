# TODOS

## Future Features

### Component library: chips, toasts, confirm dialogs
**What:** Extract reusable primitives for active-filter chips (used by gap-to-browse), copy-link toasts, and a basic confirm/dialog flow. Right now these patterns are inlined per-feature.
**Why:** Shareable-kit URL will reuse the chip and toast patterns. Any future "import / replace" decisions need a dialog. Duplicating inline CSS and ARIA wiring across views will get painful fast.
**Depends on:** nothing; opportunistic refactor when the next chip/toast use-case lands.

### Multi-lens gap combination suggestions
**What:** When a gap is wider than any single available lens, suggest 1–3 minimum-count combinations that cover it end-to-end (Interval Cover, greedy).
**Why:** Gap-to-browse currently surfaces every overlapping lens and asks the user to self-assemble. For wide gaps (e.g. 14–135mm), a curated "here are 2 lenses that together cover this" is a meaningful upgrade.
**Design unknowns:** How to present a combination (stacked rows? a secondary tab?) without bloating the Table. Budget/weight ranking once price data is populated.
**Depends on:** gap-to-browse v1 (shipped).

### Shareable kit URL
**What:** Encode the current Kit as `?view=sharedkit&skit=slug1,slug2,...`. Visitor sees a read-only Kit view with an "Import to my kit" CTA that merges the shared slugs into their own localStorage kit. Full spec discussed in conversation 2026-04-16.
**Why:** Organic distribution — Reddit/forum kit lists become one-click. Low effort, zero backend.
**Depends on:** component library (ideally ships first so the "Copy link" toast and "Shared kit" banner reuse primitives).
