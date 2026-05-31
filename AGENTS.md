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
    sitemap.xml/+server.ts  # generated sitemap
  lib/
    data/                   # source of truth: xf-lenses.json, third-party-lenses.json, index.ts loader
    components/             # NavBar, Sidebar, LensTable, FocalMap, Footer, FeedbackPopover
    types.ts                # Lens type and friends
    coverage.ts             # focal-coverage / gap math (+ coverage.test.ts)
    similarity.ts           # "Also Consider" related-lens logic
    filters.ts              # filter + URL-state logic
    kit.svelte.ts           # My Kit state (localStorage)
    preferences.svelte.ts   # theme / font-size state (localStorage)
scripts/check-slugs.ts      # build-time slug uniqueness guard
static/                     # fonts (self-hosted), favicon, og-image, robots.txt
docs/design-system/         # design tokens, styleguide, component previews
```

## 4. Local dev (for agents that can run commands)

Package manager is **pnpm** (`engine-strict=true` — do not use npm/yarn).

```sh
pnpm install
pnpm dev        # vite dev server
pnpm build      # check-slugs.ts → vite build (static, prerenders all routes)
pnpm preview    # serve the production build locally
pnpm check      # svelte-kit sync + svelte-check (type check)
```

## 5. Validation Matrix and Test Discipline

Before claiming work is done:

| Change type | Required gate |
|---|---|
| Any code change | `pnpm check` passes clean (no type/svelte errors) |
| Any change | `pnpm build` succeeds (slug check + full prerender) |
| Domain logic (`coverage.ts`, `similarity.ts`, …) | `pnpm test` passes (Vitest, `src/**/*.test.ts`) |
| Lens data edit | `pnpm build` (enforces unique slugs); confirm affected `lens/[slug]` pages prerender |
| UI / behavior change | Manually verify in `pnpm dev` or `pnpm preview`: table sort/filters, focal map, My Kit, URL state, theme + font-size toggles |

Notes:

- Tests run **locally only** via Vitest (`pnpm test` / `pnpm test:watch`); there is no CI yet, so run them yourself before pushing logic changes.
- There is no linter configured; `pnpm check` (svelte-check) is the type/lint gate.
- Treat green `pnpm check` **and** green `pnpm build` as the minimum bar before pushing.

## 6. Communication

- Be concise. Short bullets, concrete next steps.
- Ask targeted questions early when requirements are ambiguous.
- Present 1–3 options with trade-offs when decisions are needed.
- Push back on: security risk, architectural violations, overengineering, violation of best practices.
- Be correct first, agreeable second.
- Do not add busywork (summary docs, status reports) unless explicitly asked.
- Persist until the task is complete or genuinely blocked; if blocked, state what you tried and what you need.
- Keep commit messages short
