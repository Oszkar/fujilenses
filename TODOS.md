# TODOS

## Future Features

### Gap-to-browse: heatmap gap click filters to covering lenses
**What:** Clicking a coverage gap in the Kit heatmap filters the table/map to show lenses covering that focal range.
**Why:** Completes the "purchase decision" loop: see gap → find lens → add to kit. Without this, users see the gap but have to manually navigate to find what fills it.
**Pros:** Transforms heatmap from passive visualization to interactive decision tool.
**Cons:** Non-trivial interaction design (what focal range does a click represent? how to communicate the active filter?).
**Context:** The heatmap sweep line already knows gap boundaries in focal-length space. Passing those to the existing filter system (`filtersToSearchParams`) is straightforward. The main design challenge is: does clicking a gap navigate to the Map view with a focal range filter, or does it show an inline suggestion?
**Depends on:** Kit coverage heatmap (v1.1) must ship first.
**Added:** 2026-04-07 via /plan-design-review
