# TODOS

## Future Features

### Component library: chips, toasts, confirm dialogs
**What:** Extract reusable primitives for active-filter chips (used by gap-to-browse), copy-link feedback, and a basic confirm/dialog flow. Right now these patterns are inlined per-feature.
**Why:** Duplicating inline CSS and ARIA wiring across views will get painful with more features. Shareable-kit and gap-to-browse already inline similar chip/feedback patterns.
**Depends on:** nothing; opportunistic refactor when the next use-case lands.

### Multi-lens gap combination suggestions
**What:** When a gap is wider than any single available lens, suggest 1-3 minimum-count combinations that cover it end-to-end (Interval Cover, greedy).
**Why:** Gap-to-browse currently surfaces every overlapping lens and asks the user to self-assemble. For wide gaps (e.g. 14-135mm), a curated "here are 2 lenses that together cover this" is a meaningful upgrade.
**Design unknowns:** How to present a combination (stacked rows? a secondary tab?) without bloating the Table. Budget/weight ranking once price data is populated.
**Depends on:** gap-to-browse v1 (shipped).

### Named shared kits
**What:** Add optional `name` URL param to shareable kit URLs (`?skit=slug1,slug2&name=Travel+kit`). Display the name in the shared kit banner heading instead of generic "Shared Kit".
**Why:** Lets users title their kit shares ("Bob's travel setup", "Portrait kit under $2k"), adds personality. Deferred from initial shareable-kit implementation to keep scope tight.
**Depends on:** shareable kit URL (shipped).
