# Contributing Lens Data

Lens data lives in JSON files under `src/lib/data/`:

- `xf-lenses.json` — Fujinon XF, XC, and GF mount lenses
- `third-party-lenses.json` — Sigma, Viltrox, Tamron, and other third-party X-mount lenses

## Adding a Lens

Each lens entry must conform to the `Lens` interface in `src/lib/types.ts`:

```json
{
  "slug": "xf-35mm-f14-r",
  "manufacturer": "Fujinon",
  "model": "XF 35mm F1.4 R",
  "mountType": "XF",
  "lensType": "Prime",
  "minFocalLength": 35,
  "maxFocalLength": 35,
  "maxAperture": 1.4,
  "autofocus": true,
  "imageStabilization": false,
  "weatherResistant": false,
  "apertureRing": true,
  "linearMotor": false,
  "releaseYear": 2012,
  "weightGrams": 187,
  "filterDiameterMm": 52,
  "approxPriceUSD": 0,
  "priceUpdatedYear": 0,
  "retailerUrl": ""
}
```

## Slug Convention

Slugs follow `{mount}-{focal}-f{aperture}-{suffix}`:

- Mount prefix: `xf`, `xc`, `gf`, or manufacturer name for third-party (`sigma`, `viltrox`, `tamron`)
- Focal length: `35mm` for primes, `18-50mm` for zooms
- Aperture: `f14` (drop the decimal — `1.4` becomes `f14`, `2.8` becomes `f28`)
- Suffix: short Fujifilm model suffix if part of official name (`r`, `wr`, `lm`); omit for third-party unless needed for disambiguation

**Slugs must be unique.** The build will fail if duplicates are detected.

## Fields Not Yet in Use

`approxPriceUSD`, `priceUpdatedYear`, and `retailerUrl` are reserved for a future version. Set them to `0`, `0`, and `""` respectively.
