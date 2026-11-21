<p align="center">
  <img src="static/favicon.png" alt="FujiLenses" width="64" height="64" />
</p>

# FujiLenses

Interactive lens explorer for the Fujifilm X-mount ecosystem. Browse, filter, and compare lenses from Fujinon, TTArtisan, Viltrox, Sigma, Sirui, Voigtländer, and Tamron.

**[fujilenses.com](https://fujilenses.com)**

## Stack

- **SvelteKit** (static mode via `adapter-static`)
- **Tailwind CSS v4**
- **d3-scale** (focal map axis math)
- **TypeScript**
- **pnpm**
- **Vercel** (deployment)

## Features

- **Table view** — sortable by focal length, aperture, weight, year. Manufacturer color badges, spec badges (MF, WR, OIS, LM), kit toggle. "NEW" badge for recent lenses.
- **Focal map** — D3 log/linear-scale SVG showing focal ranges. Primes as circles, zooms as bars, color-coded by manufacturer. Hover tooltips.
- **Filters** — manufacturer, lens type, features (WR, OIS, aperture ring, autofocus), full-frame equivalent toggle. All filter state reflected in URL for bookmarking/sharing.
- **My Kit** — mark lenses you own via localStorage. Focal coverage map, filter size summary, and lens list. Kit persists across sessions.
- **Lens detail pages** — deep-linkable spec cards with OG tags and `ProductModel` JSON-LD for every lens.
- **Agent-readable** — [`/llms.txt`](https://fujilenses.com/llms.txt) (index) and [`/lenses.json`](https://fujilenses.com/lenses.json) (full spec dataset), both generated from the lens data at build time.
- **Dark/light theme** — system theme detection, manual toggle, persisted in localStorage.
- **Font size (S/M/L)** — scales all UI proportionally.
- **Mobile responsive** — sidebar drawer, scrollable tables and maps.
- **Feedback** — built-in feedback form via Web3Forms.

## Lens Data

Specs for Fujinon, TTArtisan, Viltrox, Sigma, Sirui, Voigtländer and Tamron lenses live in `src/lib/data/xf-lenses.json` and `src/lib/data/third-party-lenses.json`. Sourcing and corrections are tracked in [docs/data-audit](docs/data-audit/README.md); see [CONTRIBUTING.md](CONTRIBUTING.md) to add or fix a lens.

## Development

Node 24.13.0 and pnpm 11.5.0 are pinned in `.node-version` and `package.json`.

```sh
corepack enable
pnpm install
pnpm dev
```

## Build

```sh
pnpm build    # runs slug uniqueness check, then builds
pnpm preview  # preview production build locally
```

## Testing

```sh
pnpm test        # run unit tests (Vitest)
pnpm test:watch  # watch mode
```

CI runs `pnpm check`, `pnpm test`, and `pnpm build` on pull requests and main. Dependabot checks npm dependencies and GitHub Actions on Mondays at 09:00 Asia/Tokyo; security updates run independently.
