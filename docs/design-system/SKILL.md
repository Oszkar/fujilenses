---
name: fujilenses-design
description: Use this skill to generate well-branded interfaces and assets for FujiLenses (an interactive Fujifilm X-mount lens explorer), either for production or throwaway prototypes/mocks. Contains the refined "Technical Clarity" design tokens, color & type system, fonts, component CSS, and an interactive UI kit.
user-invocable: true
---

Read `README.md` first, then `DESIGN-TOKENS.md`, then explore the other files.

Key files:
- `colors_and_type.css` — the single source of truth for tokens (both themes + OS-preference). Link or copy this into any artifact.
- `styleguide.html` — every token and component rendered live; the fastest way to see and grab markup.
- `ui_kits/web/` — interactive recreation of the app (Table, Focal Map, My Kit, Lens Detail) with `app.css` of component styles that map onto the SvelteKit components.

Rules of the system (do not violate without asking):
- **Color belongs to the data.** Surfaces stay cool-neutral grey; the only color comes from the harmonized maker palette, the single indigo accent, and semantic signals (kit green, WR teal, danger red, NEW). No decorative color, no gradients, no background imagery.
- **Type:** Geist (interface) + Geist Mono (every number, `tabular-nums`). Sentence case everywhere except uppercase eyebrow labels and mono badges.
- **Borders over shadows.** Small consistent radii. Line icons only (1.5px stroke, `currentColor`) — no emoji, no decorative icons.
- **Color is never the sole signal** — label every badge; use shape (dot vs bar) as well as color on the map. Keyboard `:focus-visible` rings everywhere.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy the assets/CSS out and produce static HTML for the user to view. If working on production code, copy the tokens and follow the rules to design as an expert in this brand.

If invoked without guidance, ask what the user wants to build, ask a few focused questions, then act as an expert designer who outputs HTML artifacts or production code as needed.
