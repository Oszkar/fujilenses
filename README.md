<p align="center">
  <img src="static/favicon.png" alt="FujiLenses" width="64" height="64" />
</p>

# FujiLenses

Interactive lens explorer for the Fujifilm X-mount ecosystem. Browse, filter, and compare lenses from Fujinon, Sigma, Viltrox, Tamron, Sirui, and Voigtlander.

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

91 lenses across 7 manufacturers:

| Manufacturer | Lenses |
|---|---|
| Fujinon | 48 (41 XF + 7 XC) |
| Viltrox | 14 |
| Sigma | 11 |
| Sirui | 7 |
| Voigtlander | 7 |
| Tamron | 4 |

Data files: `src/lib/data/xf-lenses.json` and `src/lib/data/third-party-lenses.json`.

## Development

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build    # runs slug uniqueness check, then builds
pnpm preview  # preview production build locally
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or correct lens data.
