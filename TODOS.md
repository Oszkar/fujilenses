# TODOS

## Future Features

### Component library: chips, toasts, confirm dialogs
Extract reusable primitives for active-filter chips, copy-link feedback, and a basic confirm/dialog flow. These patterns are currently inlined per feature (shareable kit, gap-to-browse). Do it opportunistically when the next use-case lands.

### Multi-lens gap combination suggestions
When a gap is wider than any single lens, suggest 1–3 minimum-count combinations that cover it (greedy interval cover). Gap-to-browse currently lists every overlapping lens and leaves the user to assemble a combination.
**Open question:** how to present combinations without bloating the table; weight/budget ranking once price data exists.

### Filter-diameter-match filter
Sidebar toggle: only show lenses matching the filter threads already in the user's kit. Size S: `filterDiameterMm` data exists, this is UI glue.

### Kit weight budget
Running weight total in the Kit tab header, with an optional "travel target" (e.g. 1500g) that flags when exceeded. Size S: weight data exists.

### "See all similar" link on lens detail pages
Link below "Also Consider" to the table pre-filtered to a focal range around the lens (reuses `fmin`/`fmax`). Size S.

### Named shared kits
Optional `name` URL param on shared kit URLs (`?skit=a,b&name=Travel+kit`), shown in the shared-kit banner instead of "Shared Kit".

### Affiliate / purchase links (deferred until traffic justifies)
Populate `retailerUrl` and `approxPriceUSD`, add a "Check price" button on detail pages and an optional table price column. Deferred: traffic was ~7 visitors/week as of 2026-04-17, so revenue would be near zero; traffic-driving features come first. Revisit at 100+/week (Geniuslink for geo-targeted Amazon/B&H links; Amazon PA-API is deprecated, use the Creators API).
**When prices go live:** add `offers` to the JSON-LD in `src/lib/seo.ts` (only with real, visible prices) and decide whether `/lenses.json` should expose them.
