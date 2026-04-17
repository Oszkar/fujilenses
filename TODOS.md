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

### Filter-diameter-match filter
**What:** Add a sidebar toggle: "Show only lenses matching my kit's filter threads." Computes the distinct filter sizes in the user's kit and filters the lens list to only those sizes.
**Why:** Photographers buy to avoid carrying extra step-up rings. A user with 67mm filters immediately wants to know which other lenses fit.
**Size:** S — data exists (`filterDiameterMm`), pure UI glue.

### Kit weight budget
**What:** Show a running weight total in the Kit tab header. Optionally let user set a "travel target" (e.g. 1500g) that visually flags when the kit exceeds it.
**Why:** Travel and street photographers constantly trade reach for pack weight.
**Size:** S — all weight data present.

### "See all similar" link on lens detail pages
**What:** Add a "See all similar" link below the "Also Consider" section that navigates to the Table view pre-filtered to a focal range around the current lens (reuses existing `fmin`/`fmax` params).
**Why:** "Also Consider" shows the top 3 most similar lenses. Users who want to explore more options need a path to the full filtered catalog without manually setting filters.
**Size:** S — link that builds a URL with `fmin`/`fmax` centered on the lens's focal length.
**Depends on:** "Also Consider" section (shipped), gap-to-browse fmin/fmax filtering (shipped).

### Affiliate / purchase links (deferred until traffic justifies)
**What:** Populate `retailerUrl` and `approxPriceUSD` fields. Add "Check price" button on detail pages and optional price column in table. Use Geniuslink for geo-targeted affiliate links (routes visitors to their country's Amazon/B&H store).
**Why deferred:** At ~7 visitors/week (as of 2026-04-17), affiliate revenue would be near-zero even with perfect conversion. Affiliate links don't drive traffic — they monetize it. Better to invest in traffic-driving features first (YouTube embeds, comparison view, quiz for SEO). Revisit when traffic reaches 100+/week, at which point Geniuslink setup is a one-afternoon task since data fields are already stubbed.
**Recommended approach when ready:** Geniuslink ($6/mo) + Amazon Associates + B&H affiliate program. Best geo-targeting, 0% commission share. Amazon PA-API deprecated April 2026 — use Creators API instead.

### Named shared kits
**What:** Add optional `name` URL param to shareable kit URLs (`?skit=slug1,slug2&name=Travel+kit`). Display the name in the shared kit banner heading instead of generic "Shared Kit".
**Why:** Lets users title their kit shares ("Bob's travel setup", "Portrait kit under $2k"), adds personality. Deferred from initial shareable-kit implementation to keep scope tight.
**Depends on:** shareable kit URL (shipped).
