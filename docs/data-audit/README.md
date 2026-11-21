# Lens source audit

Audit of the lens records as of 2026-10-31 (111 records; five released models were added afterwards, see [catalog-additions.md](catalog-additions.md)). The data is the two JSON files under `src/lib/data`. The reports preserve corrected values, source URLs and remaining uncertainties; [applied-corrections.json](applied-corrections.json) records every correction's previous and current value and its evidence report.

The systematic pass covers physical aperture rings and weight provenance for every record. It is **not an all-fields certification** or a complete catalog of X-mount lenses. Exact source scope matters: a manufacturer's multi-mount weight is not a verified X-mount weight, and a review of Sony hardware is not an inspection of Fuji hardware.

## Reports

| Report | Records | Coverage |
|---|---:|---|
| [Fujinon](fujinon.md) | 48 | Exact-model manufacturer manuals, weights and physical controls, accessory exclusions |
| [Sigma / Tamron / Voigtländer](sigma-tamron-voigtlander.md) | 22 | Mount-labelled specifications, control evidence, Tamron dates, Voigtländer filters |
| [Viltrox / Sirui](viltrox-sirui.md) | 21 | X-specific weight tables and reviews, clickless rings, remaining control-evidence gaps |
| [TTArtisan](ttartisan.md) | 20 | Manufacturer ranges, ring reviews/manuals, uncertain weights and possible midpoint entries |

## Known open weight issues

- TTArtisan AF56 stores **225 g**, outside the [official 233–245 g range](https://ttartisan.com/static/upload/file/20240219/1708329488136330.pdf). No reliable X-specific replacement was found. Do not replace it with an average.
- Two TTArtisan values equal the exact midpoint of an official range, which suggests averaging but does not prove it: 35mm F0.95 **257** (range [247–267](https://www.ttartisan.com/?aps-c-lenses/70.html=)) and 100mm Macro **724** (range [700–748](https://www.ttartisan.com/?full-frame-lenses/TS-100-Macro.html=)). Neither is verified as an X-specific weight. Other TTArtisan values copy an endpoint or generic number; see the row-level findings.
- Viltrox 85mm F1.8 II stores **492 g** from Fuji-specific Viltrox Taiwan/distributor sources; global-manufacturer corroboration is still missing. See the [Viltrox report](viltrox-sirui.md).

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
| Catalog completeness | Five released non-tilt models added after the initial audit; see [catalog additions and evidence](catalog-additions.md). Tilt and upcoming models remain deferred. Not an exhaustive historical catalog. |

## Source and uncertainty policy

Use the **exact X-mount version**, model generation and finish. Preserve whether weights exclude caps, hood, tripod foot/collar, or include a protective cover. Published nominal weights and reviewer measurements should remain separate; rounding converted ounces can introduce errors. If only a range exists, retain uncertainty rather than a fabricated precise gram value.

Count clicked and clickless physical aperture rings as present. Distinguish dedicated aperture rings from programmable focus/control rings, switches and fixed-aperture lenses. Manufacturer manuals with labelled controls and explicit hands-on X reviews are stronger than absence from a feature list.

The manufacturer reports retain source URLs, evidence types, mount/accessory qualifications and the check date. The applied-corrections sidecar maps each changed field to its current value and evidence report. Keep these records updated with every data edit (see [CONTRIBUTING.md](../../CONTRIBUTING.md)). The current boolean/number-only model cannot represent unknowns or weight ranges; unresolved legacy values remain unchanged and explicitly flagged here.
