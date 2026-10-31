<p align="center">
  <img src="static/favicon.png" alt="FujiLenses" width="64" height="64" />
</p>

# FujiLenses

Interactive lens explorer for the Fujifilm X-mount ecosystem. Browse, filter, and compare lenses from Fujinon, TTArtisan, Viltrox, Sigma, Sirui, Voigtländer, and Tamron.

**[www.fujilenses.com](https://www.fujilenses.com)**

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
- **Lens detail pages** — deep-linkable spec cards with OG tags for every lens.
- **Dark/light theme** — system theme detection, manual toggle, persisted in localStorage.
- **Font size (S/M/L)** — scales all UI proportionally.
- **Mobile responsive** — sidebar drawer, scrollable tables and maps.
- **Feedback** — built-in feedback form via Web3Forms.

## Lens Data

116 lenses across 7 manufacturers:

| Manufacturer | Lenses |
|---|---|
| Fujinon | 49 (42 XF + 7 XC) |
| TTArtisan | 21 |
| Viltrox | 16 |
| Sigma | 12 |
| Sirui | 7 |
| Voigtländer | 7 |
| Tamron | 4 |

Data files: `src/lib/data/xf-lenses.json` and `src/lib/data/third-party-lenses.json`.

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or correct lens data.
