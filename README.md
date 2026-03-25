# FujiLenses

Interactive lens explorer for the Fujifilm X-mount ecosystem. Browse, filter, and compare lenses from Fujinon, Sigma, Viltrox, Tamron and more.

## Stack

- **SvelteKit** (static mode via `adapter-static`)
- **Tailwind CSS v4**
- **d3-scale** (focal map axis math)
- **TypeScript**
- **pnpm**
- **Vercel** (deployment)

## Features

- **Table view** — sortable by focal length, aperture, weight, year. Manufacturer color badges, spec badges (WR, OIS, LM), kit toggle.
- **Focal map** — D3 log/linear-scale SVG showing focal ranges. Primes as circles, zooms as bars, color-coded by manufacturer. Hover tooltips.
- **Filters** — manufacturer, lens type, features (WR, OIS, aperture ring), full-frame equivalent toggle. All filter state reflected in URL for bookmarking/sharing.
- **My Kit** — mark lenses you own via localStorage. Kit lenses highlighted across both views.

## Lens Data

- 48 Fujinon lenses (41 XF + 7 XC)
- 11 Sigma lenses

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
