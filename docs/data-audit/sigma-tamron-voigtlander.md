# Sigma, Tamron and Voigtländer source audit

Checked 2026-10-31 against the 22 entries in `src/lib/data/third-party-lenses.json`. This audit prioritizes `weightGrams` and physical `apertureRing`. The six corrections below are applied. Per-lens tables show current JSON values; the correction table preserves previous values for provenance.

**Scope limits:** This is not a verification of every field. Prices, retailer URLs, most release years, stabilization, weather resistance, AF and motor classifications remain unverified unless specifically discussed below. Product names/focal ranges identify the source, rather than constitute a full field-by-field certification. Manufacturer weights are specifications, not independently measured weights.

## Applied corrections

| Slug | Field | Previous | Manufacturer's X-mount value | Evidence |
|---|---|---:|---:|---|
| `tamron-17-70mm-f28` | weightGrams | 525 | 530 | [Tamron B070 specs](https://www.tamron.com/global/consumer/lenses/b070/spec.html): 525 g is Sony E; X is 530 g. |
| `tamron-17-70mm-f28` | releaseYear | 2023 | 2022 | Same source: X release July 8, 2022. |
| `tamron-18-300mm-f35` | releaseYear | 2023 | 2021 | [Tamron B061 specs](https://www.tamron.com/global/consumer/lenses/b061/spec.html): X release October 28, 2021. |
| `tamron-150-500mm-f50` | weightGrams | 1725 | 1710 | [Tamron A057 X specs](https://www.tamron.com/global/consumer/lenses/a057x/spec.html): excludes tripod mount. The [Sony/Nikon page](https://www.tamron.com/global/consumer/lenses/a057/spec.html) assigns 1725 g to Sony. |
| `tamron-150-500mm-f50` | releaseYear | 2023 | 2022 | X-specific source above: October 13, 2022. |
| `voigtlander-nokton-50mm-f12` | filterDiameterMm | 52 | 58 | [Cosina X-specific specifications](https://www.cosina.co.jp/voigtlander/en/x-mount/nokton-50mm-f1-2/). |

The two erroneous weights match Sony specifications exactly. That supports a wrong-mount explanation; it does **not** establish how the original values were selected or whether other records were averaged.

## Aperture evidence terminology

- **Explicit:** the manufacturer expressly describes the aperture ring or lists it in specifications.
- **Manual inference:** the manufacturer's complete external-parts list identifies focus/zoom rings and controls, without an aperture ring. This supports `false`, but is an inference from the operating manual, not an explicit manufacturer “No” specification. PDF page numbers below are one-based. No product photograph inspection is claimed.
- **Mount-specific gap:** a manual supports the general model, but an X-specific control diagram/text was not verified; retain the distinction rather than presenting absence as fully proven.

## Sigma — all eleven weights agree with X-specific manufacturer specifications

The product links in each row contain mount-labelled weight tables. Do not copy their introductory marketing weights, which often describe L or Sony E mount. Canon RF versions of the 12/1.4, 15/1.4 and 17–40/1.8 have a **control ring instead of the dedicated aperture ring**; that distinction does not change these X-mount entries.

| Slug | Current g / ring | Verified X g; other mounts illustrating ambiguity | Ring evidence and status |
|---|---|---|---|
| `sigma-12mm-f14` | 235 / true | [235; E 225, RF 250](https://www.sigma-global.com/en/lenses/c025_12_14/) | **Explicit true**, product feature section describes aperture ring and RF exception. |
| `sigma-15mm-f14` | 225 / true | [225; E 220, RF 240](https://www.sigma-global.com/en/lenses/c026_15_14/) | **Explicit true**, product feature section describes aperture ring and RF exception. |
| `sigma-16mm-f14` | 405 / false | [405; E/EF-M 405, L/RF 415, MFT 395, Z 420](https://www.sigma-global.com/en/lenses/c017_16_14/) | **Manual inference false**: [manual p1](https://www.sigma-global.com/en/support/download/16mm_F14_DC_DN_C017.pdf), parts 1–4 identify only focus ring, mount, filter thread and hood. |
| `sigma-23mm-f14` | 335 / false | [335; E 330, L 340, RF 345](https://www.sigma-global.com/en/lenses/c023_23_14/) | **Manual inference false**: [manual p1](https://www.sigma-global.com/en/support/download/23mm_f1.4_dc_dn_c023.pdf), parts 1–4 identify only focus ring, mount, filter thread and hood. |
| `sigma-30mm-f14` | 275 / false | [275; E 265, EF-M 270, L 280, RF/Z 285, MFT 260](https://www.sigma-global.com/en/lenses/c016_30_14/) | **Manual inference false**: [manual p1](https://www.sigma-global.com/en/support/download/30mm_F14_DC_DN_C016.pdf), parts 1–4 identify only focus ring, mount, filter thread and hood. |
| `sigma-56mm-f14` | 280 / false | [280; E/EF-M 280, L 285, RF 290, Z 295, MFT 256](https://www.sigma-global.com/en/lenses/c018_56_14/) | **Manual inference false**: [manual p1](https://www.sigma-global.com/en/support/download/56mm_F14_DC_DN_C018.pdf), parts 1–4 identify only focus ring, mount, filter thread and hood. |
| `sigma-10-18mm-f28` | 250 / false | [250; E 255, L 260, RF 270](https://www.sigma-global.com/en/lenses/c023_10_18_28/) | **Manual inference false**: [manual p1](https://www.sigma-global.com/en/support/download/10-18mm%20F2.8%20DC%20DN%20C023.pdf), parts 1–5 identify zoom and focus rings, mount, filter thread and hood. |
| `sigma-16-300mm-f35` | 615 / false | [615; E/L 615, RF 625, Z 630](https://www.sigma-global.com/en/lenses/c025_16_300_35_67/) | **Manual inference false**: [manual p5](https://www.sigma-global.com/en/support/download/16-300mm_F3.5-6.7_DC_C025.pdf), six-part list includes zoom, focus and zoom lock, no aperture control. |
| `sigma-17-40mm-f18` | 530 / true | [530; E 525, L 535, RF 560](https://www.sigma-global.com/en/lenses/a025_17_40_18/) | **Explicit true**, manufacturer describes aperture ring, click switch and lock, with RF exception. |
| `sigma-18-50mm-f28` | 285 / false | [285; E/L 290, RF 300](https://www.sigma-global.com/en/lenses/c021_18_50_28/) | **Manual inference false**: [manual p1](https://www.sigma-global.com/en/support/download/18_50_28_dc_dn_c021_ver2.pdf), parts 1–5 identify zoom and focus rings, mount, filter thread and hood. |
| `sigma-100-400mm-f50` | 1135 / false | [1135; L 1135, E 1140](https://www.sigma-global.com/en/lenses/c020_100_400_5_63/) | **Manual inference false, mount-specific gap**: [manual p1](https://www.sigma-global.com/en/support/download/100_400mm_F5_63_DG_DN_OS_C020.pdf) describes zoom/focus rings, buttons/switches, no aperture ring. Its listed controls are the original general version; the product page expressly says X switches differ. X-specific aperture-absence evidence still desirable. |

For the 100–400, the manufacturer includes protective cover PT-31 in its 1135 g specification and sells the tripod socket separately. That is a different accessory basis from the Tamron 150–500 figure excluding its tripod mount. Preserve those qualifications if comparing kit weight.

The Sigma 16–300 and 17–40 product pages explicitly identify HLA (High-response Linear Actuator); their existing `linearMotor: true` values are supported. Their other feature booleans were not exhaustively checked. The older Sigma pages often promise sealing **at the mount**, which should not automatically be described as equivalent to comprehensive barrel sealing; this audit does not redefine `weatherResistant`.

## Tamron

| Slug | Current g / ring | X weight finding | Ring evidence and status |
|---|---|---|---|
| `tamron-11-20mm-f28` | 335 / false | [335 confirmed; E 335, RF 340](https://www.tamron.com/global/consumer/lenses/b060/spec.html) | **Manual inference false**: [manufacturer manual p3](https://s3-ap-northeast-1.amazonaws.com/tamron-docs/consumer/support/download/inst/b060/b060_inst_2412_en.pdf) identifies focus and zoom rings and explicitly distinguishes X from RF controls. |
| `tamron-17-70mm-f28` | 530 / false | [530 confirmed (corrected from 525); E 525, RF 530, Z 540](https://www.tamron.com/global/consumer/lenses/b070/spec.html) | **Mount-specific gap**: [manufacturer manual hosted by B&H, p2](https://www.bhphotovideo.com/lit_files/852769.pdf) enumerates zoom/focus rings and no aperture ring, but this edition is Sony-only. X-specific manual text/photo still needs verification; do not certify `false` solely from Sony controls. |
| `tamron-18-300mm-f35` | 620 / false | [620 confirmed; E 620, RF 625, Z 635](https://www.tamron.com/global/consumer/lenses/b061/spec.html) | **Manual inference false**: [manufacturer manual p4](https://s3-ap-northeast-1.amazonaws.com/tamron-docs/consumer/support/download/inst/b061/b061_inst_2507_en.pdf) identifies focus/zoom and lock; the assignable control-ring footnote applies to Nikon Z, not X. |
| `tamron-150-500mm-f50` | 1710 / false | [1710 confirmed (corrected from 1725) excluding tripod mount](https://www.tamron.com/global/consumer/lenses/a057x/spec.html); mount itself 155 g. Sony 1725 and Nikon 1720 excluding mount. | **Manual inference false**: [manufacturer manual p4](https://s3-ap-northeast-1.amazonaws.com/tamron-docs/consumer/support/download/inst/a057/inst_2309_en.pdf) lists X-specific MF-speed and VC controls, zoom/focus rings, no aperture ring. The control-ring footnote applies to Nikon Z. |

All four Tamron filter sizes agree with the linked specifications (67, 67, 67, 82 mm). The 11–20 release year 2023 agrees with its X-specific May 30, 2023 release; corrections for the other three are above.

## Voigtländer — explicit aperture-ring specifications for all seven

Each linked Cosina page is specifically the X-mount product, and each lists an available manually operated aperture ring. All seven weights and ring values agree. Similar names in Nikon Z, Leica M or Sony E listings are insufficient evidence for the X version.

| Slug | Current g / ring | X evidence | Filter result |
|---|---|---|---|
| `voigtlander-color-skopar-18mm-f28` | 115 / true | [115 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/color-skopar-18mm-f2-8-aspherical/) | 43 mm confirmed |
| `voigtlander-nokton-23mm-f12` | 219 / true | [219 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/nokton-23mm-f1-2/) | 46 mm confirmed |
| `voigtlander-ultron-27mm-f2` | 120 / true | [120 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/ultron-27mm-f2/) | 43 mm confirmed |
| `voigtlander-nokton-35mm-f09` | 492 / true | [492 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/nokton-35mm-f0-9-aspherical/) | 62 mm confirmed |
| `voigtlander-nokton-35mm-f12` | 196 / true | [196 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/nokton-35mm-f1-2/) | 46 mm confirmed |
| `voigtlander-macro-apo-ultron-35mm-f2` | 265 / true | [265 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/macro-apo-ultron-35mm-f2-2/) | 49 mm confirmed |
| `voigtlander-nokton-50mm-f12` | 290 / true | [290 g, explicit ring](https://www.cosina.co.jp/voigtlander/en/x-mount/nokton-50mm-f1-2/) | **58 mm confirmed (corrected from 52)** |

All seven existing Voigtländer release years agree with the dated [Cosina X-mount lineup](https://www.cosina.co.jp/voigtlander/en/x-mount/): 2024, 2022, 2023, 2023, 2021, 2022, 2023 respectively. That page also identifies the lineup as manual focus with mechanical aperture rings, supporting their existing `autofocus: false`. New silver editions are separately listed in 2026; their weights were not checked, so do not assume finish variants share a weight if they are later represented separately.

## Remaining evidence work

- Obtain X-specific aperture-absence confirmation for Tamron 17–70 and Sigma 100–400. The other ten `false` entries have manufacturer-manual support, clearly marked as inference rather than an explicit “No” specification.
- For stricter evidence standards, inspect the actual diagrams/product photographs or a first-hand X review for every inferred `false`; this pass read the manuals' external-parts descriptions.
- Audit fields excluded from the scope paragraph before marking any lens record globally verified.
- Maintain field-level provenance with mount and accessory basis in these reports and applied-corrections.json; one generic product URL cannot preserve these distinctions by itself.
