# FujiLenses

Interactive lens explorer for the Fujifilm X-mount ecosystem. Browse, filter, and compare lenses from Fujinon, Sigma, Viltrox, Tamron and more.

## Stack

- **SvelteKit** (static mode via `adapter-static`)
- **Tailwind CSS v4**
- **d3-scale** (focal map axis math)
- **TypeScript**
- **pnpm**

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
