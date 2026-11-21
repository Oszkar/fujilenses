# AGENTS.md — Operational Contract

Repo: `Oszkar/fujilenses` | Branch: `main`
Agents: Claude Code, Copilot, Gemini, Windsurf

## 0. Prime Rule: Clarify Before Acting

If requirements are ambiguous, incomplete, or conflicting:

1. Stop.
2. Ask targeted questions.
3. Propose 1–3 concrete interpretations.
4. Wait for confirmation **OR** proceed with the assumption stated explicitly, depending on impact.

**Calibration:**

- High-impact / hard-to-reverse (schema changes, deletions, deploys, secrets, cross-cutting refactors) → **wait**.
- Low-impact / reversible (a small CLI flag default, a doc rewording, a test addition, a UI tweak) → **state the assumption and proceed**.
- When in doubt, wait.

## 1. System Context

Fujilenses = a simple, clean website to browse the Fujifilm X-mount lens ecosystem, keep track of your gear, and identify which lens to buy next.

- **Static site**, no backend, no database. All lens data ships as JSON in the repo.
- Stack: SvelteKit (`adapter-static`, prerendered) · Svelte 5 (runes) · Tailwind CSS v4 · TypeScript · d3-scale · pnpm · deployed on Vercel.
- State that matters to users (My Kit, theme, font size) lives in `localStorage`; shareable state lives in the URL.

## 2. Engineering Principles

Apply at all times:

- **12-Factor App** — Config in env, stateless processes, strict dev/prod parity.
- **DRY** — No duplication of domain logic.
- **YAGNI** — No speculative abstractions.
- **KISS** — Simplest viable implementation.
- **PoLP** — Least privilege always.
- **MVP Bias** — side project; ship fast, document tech debt, do not gold-plate, do not architect for imaginary scale.

Correctness > Cleverness · Security > Convenience · Simplicity > Flexibility · Precision > Agreeability

### 2.1 Project conventions

- Follow conventional commit style, even in PR titles
- PRs merged via squash
- Svelte 5 runes only (`$state`/`$derived`/`$props`); no legacy `export let` / stores for new code
- Reactive client state belongs in `*.svelte.ts` modules (see `src/lib/kit.svelte.ts`, `src/lib/preferences.svelte.ts`)
- Lens slugs must stay unique — the build enforces this (`scripts/check-slugs.ts`)

## 3. Repo Map

```
src/
  routes/
    +page.svelte            # home: table / focal map / My Kit tabs
    +layout.svelte, .ts     # shell, nav, theme/font setup
    layout.css              # global styles + theme tokens
    lens/[slug]/            # prerendered lens detail pages (+page.svelte, +page.ts)
    sitemap.xml/, llms.txt/, lenses.json/   # prerendered +server.ts endpoints, generated from lens data
  lib/
    data/                   # source of truth: xf-lenses.json, third-party-lenses.json, index.ts loader
    components/             # NavBar, Sidebar, LensTable, FocalMap, Footer, FeedbackPopover, Seo (all <head> tags)
    types.ts                # Lens type and friends
    seo.ts                  # SITE_URL, lens descriptions, JSON-LD builders (+ seo.test.ts)
    agent-data.ts           # llms.txt text and lenses.json dataset builders (+ test)
    format.ts, aperture.ts  # shared focal-range / aperture display helpers
    coverage.ts             # focal-coverage / gap math (+ coverage.test.ts)
    similarity.ts           # "Also Consider" related-lens logic
    filters.ts              # filter + URL-state logic
    kit.svelte.ts           # My Kit state (localStorage)
    preferences.svelte.ts   # theme / font-size state (localStorage)
scripts/check-slugs.ts      # build-time slug uniqueness guard
scripts/og-image.html       # source for static/og-image.png (1200×630)
static/                     # fonts (self-hosted), icons, site.webmanifest, og-image, robots.txt
vercel.json                 # security headers, font caching
docs/design-system/         # design tokens, styleguide, component previews
docs/data-audit/            # lens data sources and corrections (see CONTRIBUTING.md)
```

## 4. SEO and agent surfaces

Canonical host is the apex `https://fujilenses.com` (`www` 308-redirects to it in Vercel). Rules:

- **All `<head>` tags go through `Seo.svelte`**, and URLs come from `SITE_URL` in `src/lib/seo.ts`. Never hardcode the domain or duplicate meta tags in a page.
- **Generated, no manual upkeep:** sitemap, `/llms.txt`, `/lenses.json`, JSON-LD and meta descriptions are all built from the lens data at build time. Adding or editing a lens updates them.
- **Schema changes:** if the `Lens` type gains or changes a field, review `seo.ts` and `agent-data.ts` (and their tests) so the new field is exposed or deliberately omitted.
- **No fabricated structured data.** JSON-LD is `ProductModel` with no `offers`/`review`/`aggregateRating`, because price and review data are unpopulated (`Product` without them is a Search Console error). Add `offers` only when real prices exist and are shown on the page.
- **Slugs are public URLs.** Renaming one breaks inbound links and indexed pages; add a redirect instead.
- **Static assets:** regenerate `apple-touch-icon.png`, `icon-192/512.png` if `favicon.png` changes, and `og-image.png` from `scripts/og-image.html` if branding changes. Keep `theme_color` in `site.webmanifest` and `src/app.html` in sync.
- **After a deploy that touches headers, redirects or JSON-LD:** check a live lens URL with Google's Rich Results Test and `curl -sI` (headers, `www` redirect). These cannot be verified locally.

## 5. Local dev (for agents that can run commands)

Package manager is **pnpm** (`engine-strict=true` — do not use npm/yarn).

```sh
pnpm install    # re-run after pulling dependency changes
pnpm dev        # vite dev server
pnpm build      # check-slugs.ts → vite build (static, prerenders all routes)
pnpm preview    # serve the production build locally
pnpm check      # svelte-kit sync + svelte-check (type check)
```

## 6. Validation Matrix and Test Discipline

Before claiming work is done:

| Change type | Required gate |
|---|---|
| Any code change | `pnpm check` passes clean (no type/svelte errors) |
| Any change | `pnpm build` succeeds (slug check + full prerender) |
| Domain logic (`coverage.ts`, `similarity.ts`, …) | `pnpm test` passes (Vitest, `src/**/*.test.ts`) |
| Lens data edit | `pnpm build` (enforces unique slugs); confirm affected `lens/[slug]` pages prerender |
| Head / SEO / agent-file change | `pnpm build`, then inspect `build/`: one title, canonical and JSON-LD block per page; `llms.txt`, `lenses.json`, `sitemap.xml` present |
| UI / behavior change | Manually verify in `pnpm dev` or `pnpm preview`: table sort/filters, focal map, My Kit, URL state, theme + font-size toggles |

Notes:

- Tests run via Vitest (`pnpm test` / `pnpm test:watch`). GitHub Actions runs check, test, and build on pull requests and main; also run them locally before pushing.
- There is no linter configured; `pnpm check` (svelte-check) is the type/lint gate.
- Treat green `pnpm check` **and** green `pnpm build` as the minimum bar before pushing.

## 7. Communication

- Be concise. Short bullets, concrete next steps.
- Ask targeted questions early when requirements are ambiguous.
- Present 1–3 options with trade-offs when decisions are needed.
- Push back on: security risk, architectural violations, overengineering, violation of best practices.
- Be correct first, agreeable second.
- Do not add busywork (summary docs, status reports) unless explicitly asked.
- Persist until the task is complete or genuinely blocked; if blocked, state what you tried and what you need.
- Keep commit messages short
