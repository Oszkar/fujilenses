# Lens source audit — 2026-10-31

Audited the **111 existing lens records** (48 Fujinon, 11 Sigma, 4 Tamron, 7 Sirui, 7 Voigtländer, 14 Viltrox, 20 TTArtisan). The database is the two JSON files under `src/lib/data`, not a server database. **16 sourced corrections have been applied across 13 lenses.** Application code and the data schema are unchanged. These reports preserve the corrected values, source URLs, and remaining uncertainties. [Applied corrections](applied-corrections.json) records each previous/current value and its evidence report.

The systematic pass covers physical aperture rings and weight provenance for every record. It is **not an all-fields certification** or a complete census of every available X-mount lens. Exact source scope matters: a manufacturer's approximate multi-mount weight is not a verified X-mount weight; a review of Sony hardware is not an independent inspection of Fuji hardware.

## Reports

| Report | Records | Coverage |
|---|---:|---|
| [Fujinon](fujinon.md) | 48 | Exact-model manufacturer manuals, weights and physical controls, accessory exclusions |
| [Sigma / Tamron / Voigtländer](sigma-tamron-voigtlander.md) | 22 | Mount-labelled specifications, control evidence, Tamron dates, Voigtländer filters |
| [Viltrox / Sirui](viltrox-sirui.md) | 21 | X-specific weight tables and reviews, clickless rings, remaining control-evidence gaps |
| [TTArtisan](ttartisan.md) | 20 | Manufacturer ranges, ring reviews/manuals, uncertain weights and possible midpoint entries |

## Applied corrections

Every correction below is applied. The left value is historical; the bold right value is the current JSON value. The linked reports provide the exact source for each row.

| Lens | Field | Previous → current value | Evidence |
|---|---|---|---|
| Viltrox AF 23mm F1.4 | apertureRing | false → **true** | [Fuji hands-on review](https://www.fenchel-janisch.com/viltrox-23mm-f-1-4-review-for-video-tested-on-the-fujifilm-x-t4/) |
| Viltrox AF 33mm F1.4 | apertureRing | false → **true** | [Fuji hands-on review](https://keithwee.com/portfolio/the-contender-ii-review-of-the-viltrox-33mm-f1-4-for-fujifilm-x-mount/) |
| Viltrox AF 56mm F1.4 | apertureRing | false → **true** | [Fuji product description](https://www.viltroxindonesia.co.id/product/viltrox-56mm-f1-4-stm-af-lens-for-fujifilm-x-mount-garansi-resmi/) |
| TTArtisan AF 17mm F1.8 Air | apertureRing | true → **false** | [X-mount hands-on review](https://radojuva.com/en/2026/04/ttartisan-af-17-1-8-ed/) |
| Fujinon XC 13–33 | weightGrams | 130 → **125** | [Manufacturer](https://www.fujifilm-x.com/global/products/lenses/xc13-33mmf35-63-ois/specifications/) |
| Fujinon XC 15–45 | weightGrams | 136 → **135** | [Manufacturer](https://www.fujifilm-x.com/global/products/lenses/xc15-45mmf35-56-ois-pz/specifications/) |
| Tamron 17–70 | weightGrams | 525 → **530** | [Manufacturer: 525 is Sony E](https://www.tamron.com/global/consumer/lenses/b070/spec.html) |
| Tamron 150–500 | weightGrams | 1725 → **1710** | [Manufacturer: X, tripod mount excluded](https://www.tamron.com/global/consumer/lenses/a057x/spec.html) |
| Sirui Aurora 85 | weightGrams | 540 → **550** | [Manufacturer: 540 is E, 550 is X](https://store.sirui.com/products/sirui-aurora-series-85mm-full-frame-autofocus-lens) |
| TTArtisan AF 27mm F2.8 | weightGrams | 84 → **93** | [X-specific specification](https://www.cliftoncameras.co.uk/uploads/specifications/TTArtisan%20AF%2027mm%20f2.8%20APS-C%20-%20Fujifilm%20X%20Mount%20Specifications.pdf) |
| Tamron 17–70 | releaseYear | 2023 → **2022** | [X release July 8, 2022](https://www.tamron.com/global/consumer/lenses/b070/spec.html) |
| Tamron 18–300 | releaseYear | 2023 → **2021** | [X release October 28, 2021](https://www.tamron.com/global/consumer/lenses/b061/spec.html) |
| Tamron 150–500 | releaseYear | 2023 → **2022** | [X release October 13, 2022](https://www.tamron.com/global/consumer/lenses/a057x/spec.html) |
| TTArtisan AF 27mm F2.8 | releaseYear | 2023 → **2022** | [X launch October 27, 2022](https://petapixel.com/2022/10/27/ttartisan-unveils-new-autofocus-27mm-f-2-8-xf-lens-for-fuji-x/) |
| Voigtländer Nokton 50mm F1.2 | filterDiameterMm | 52 → **58** | [Cosina X specification](https://www.cosina.co.jp/voigtlander/en/x-mount/nokton-50mm-f1-2/) |

Applied qualified correction: Viltrox 85mm F1.8 II now stores **492 g**, replacing 484 g, based on Fuji-specific Viltrox Taiwan/distributor sources. See [Viltrox report](viltrox-sirui.md) for sources and the remaining global-manufacturer corroboration gap.

TTArtisan AF56's **225 g** is outside the [official 233–245 g range](https://ttartisan.com/static/upload/file/20240219/1708329488136330.pdf). The stored number is unsupported, but this pass did not establish a reliable X-specific replacement. Do not replace it with an average.

## Were weights averaged?

No averaging policy or admission was found in the available data commit messages or repository documentation. A GBrain semantic lookup returned unrelated results and supplied no usable project provenance; that is not evidence that no prior conversation exists.

Two values are suspicious because they equal the exact midpoints of official ranges:

- TTArtisan 35mm F0.95: **257 = (247 + 267) / 2**. [Official range](https://www.ttartisan.com/?aps-c-lenses/70.html=).
- TTArtisan 100mm Macro: **724 = (700 + 748) / 2**. [Official range](https://www.ttartisan.com/?full-frame-lenses/TS-100-Macro.html=).

This arithmetic is consistent with averaging, **not proof of how the data was entered**. Neither is verified as an X-specific weight. Other TTArtisan values copy an endpoint or generic number; see the row-level findings.

By contrast, all 11 Sigma weights match explicit X specifications and all five Sirui Sniper weights match the manufacturer's X column. The Tamron and Aurora errors match another mount's published value, supporting wrong-mount selection rather than averaging.

Relevant local history: `14fa2c6` says Viltrox weights were corrected using Viltrox JP, Dustin Abbott and Phillip Reeve, without per-field URLs. `32a7901` says Voigtländer data came from Cosina and corrected 23mm to 219 g. `f6f9f12` cites Sirui and Dustin Abbott generally. `02dec51` cites Sigma generally. `a24599d` adds the TTArtisan data without recording a weighting/averaging method. These messages are historical claims, not substitutes for the current cited evidence.

## What remains unsourced or unresolved

| Field or question | Status |
|---|---|
| weightGrams | Every record reviewed; exact X figures, generic numbers, multi-mount ranges and conflicts are distinguished in the reports. Several TTArtisan weights remain unresolved. |
| apertureRing | Every record reviewed; explicit evidence, manual-parts-list inference and cross-mount construction evidence are distinguished. Remaining X-specific gaps include Sigma100–400, Tamron17–70, Viltrox85 II/56 F1.7/27 Pro, both Aurora lenses and several TTArtisan manual lenses. |
| releaseYear | Tamron and Voigtländer verified systematically; selected other discrepancies flagged. Most other dates remain unverified. XC13–33 needs a policy on announcement vs kit vs standalone sale. |
| filterDiameterMm / filterViaAdapter | Tamron, Voigtländer and TTArtisan checked where stated. Other records not systematically verified. No front thread is different from no possible rear/specialty filter. |
| autofocus / focal lengths / maxAperture / lensType | Selected checks in manufacturer reports only. Do not mark the entire dataset verified. |
| weatherResistant / imageStabilization / linearMotor | Not comprehensively verified. Explicit local observations are identified. A mount gasket, full sealing, VCM, STM and linear actuator need consistent definitions. Silence is not a sourced false. |
| mountType | Existing XF/XC convention is an application taxonomy; third-party XF means X compatibility here. This is not a manufacturer series designation. |
| approxPriceUSD / priceUpdatedYear / retailerUrl | Intentionally unused placeholders per CONTRIBUTING.md; zero/empty is missing data, not a sourced retail price. |
| reviews | Existing video identity/content not audited. |
| Catalog completeness | Not exhaustive. Fujifilm's current XF400mm F4.5 is missing; see Fujinon report. Other missing/new lenses may exist. |

## Source and uncertainty policy

Use the **exact X-mount version**, model generation and finish. Preserve whether weights exclude caps, hood, tripod foot/collar, or include a protective cover. Published nominal weights and reviewer measurements should remain separate; rounding converted ounces can introduce errors. If only a range exists, retain uncertainty rather than a fabricated precise gram value.

Count clicked and clickless physical aperture rings as present. Distinguish dedicated aperture rings from programmable focus/control rings, switches and fixed-aperture lenses. Manufacturer manuals with labelled controls and explicit hands-on X reviews are stronger than absence from a feature list.

The manufacturer reports retain source URLs, evidence types, mount/accessory qualifications and the check date. The applied-corrections sidecar maps each changed field to its current value and evidence report. Keep these records updated with future data edits. The current boolean/number-only model cannot represent unknowns or weight ranges; unresolved legacy values remain unchanged and explicitly flagged here. No missing-lens additions or uncertain date/naming changes were made.
