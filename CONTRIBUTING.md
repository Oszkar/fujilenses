# Contributing Lens Data

Lens data lives in JSON files under `src/lib/data/`:

- `xf-lenses.json` — Fujinon XF, XC, and GF mount lenses
- `third-party-lenses.json` — Sigma, Viltrox, Tamron, Sirui, Voigtländer, TTArtisan, and other third-party X-mount lenses

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

## Optional Fields

- `filterViaAdapter` (boolean) — add and set to `true` only when the filter size refers to a threaded adapter included with the lens, not a native front thread (e.g. TTArtisan 10mm F2). Omit otherwise. The UI shows the filter size with an asterisk and a footnote.

## Adding Reviews

Each lens can have an optional `reviews` array of curated YouTube video reviews:

```json
"reviews": [
  { "videoId": "L7CkQ9aMlzo", "title": "Fujinon XF 56mm F1.2 R Review", "channel": "Dustin Abbott" }
]
```

- `videoId` — the 11-character YouTube video ID (from the URL after `v=` or after `youtu.be/`)
- `title` — video title as displayed on YouTube
- `channel` — creator/channel name

**Curation criteria:**
- Max 3 videos per lens, prioritized by quality
- **Preferred sources:** PetaPixel (formerly DPReview TV), Dustin Abbott, Christopher Frost, Pal2Tech
- Reviews over unboxings — actual shooting experience, sample images, optical tests
- No sponsored content unless from a reviewer with strong editorial independence
- English preferred; other languages accepted if no quality English review exists

**Finding the video ID:** On YouTube, the video ID is the 11 characters after `v=` in the URL (e.g. `youtube.com/watch?v=L7CkQ9aMlzo` → `L7CkQ9aMlzo`). For short URLs, it's after `youtu.be/`.

## Fields Not Yet in Use

`approxPriceUSD`, `priceUpdatedYear`, and `retailerUrl` are reserved for a future version. Set them to `0`, `0`, and `""` respectively.
