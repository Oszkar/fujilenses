# TTArtisan audit — 2026-10-31

Scope: all 20 existing records; physical aperture rings and weight provenance. Three corrections are applied: AF17 Air ring=false, AF27 weight=93 g and releaseYear=2022. Unresolved weights remain unchanged. **Generic** means the manufacturer supplies one approximate number for multiple mounts; **unresolved** means no defensible X-specific number was established. A number falling inside a range does not verify it. Reviews of other mounts support construction only, not X-mount weight.

## Per-lens findings

| Slug | Current ring / grams | Ring evidence | Weight result and source |
|---|---|---|---|
| ttartisan-af-14mm-f35 | yes / 98 | Confirmed: manufacturer explicitly describes clicked ring [P1]. | Generic 98 g, E/X table [P1]; no separate X measurement. |
| ttartisan-af-17mm-f18-air | no / 161 | **Corrected: no ring**, explicitly reported in X-mount hands-on review [R1]. | Manufacturer gives 161–178 g across E/X/Z [P2]. Reviewer measured bare X lens at 163 g [R1]; distinguish measured sample from nominal specification. Exact nominal X weight unresolved. |
| ttartisan-af-23mm-f18 | no / 210 | Confirmed by Fujifilm review [R2]. | Generic approximately 210 g for E/X/Z [P3]. |
| ttartisan-af-27mm-f28 | yes / 93 | Confirmed by X-mount review [R3]. | **Corrected to approximately 93 g** in X-specific retailer specification [W1], corroborated by X review [R3]. 84 g is not supported. |
| ttartisan-af-35mm-f18-ii | no / 176 | Confirmed by X-Pro3 review [R4] and manufacturer X/E/Z product illustration [P4]. | Manufacturer range 176–193 g [P4]; 176 g also appears in Sony review [R5], so it is not independently verified as X-specific. |
| ttartisan-af-56mm-f18 | no / 225 | Confirmed by launch report covering X and E [R6]. | **225 g unsupported and outside official 233–245 g range** [P5]. X-specific replacement unresolved; do not substitute midpoint. |
| ttartisan-af-75mm-f2 | yes / 326 | Confirmed by manufacturer's X launch [P6]. | Official X launch gives 326–340 g across mounts [P6], whereas product table gives 328–340 g excluding hood [P7]. 326 g is only a range endpoint, not an explicitly mapped X value. Unresolved. |
| ttartisan-7-5mm-f2-fisheye | yes / 370 | Manufacturer describes clicked ring for current E/X/Z/RF/M43 silver edition [P8]; same-model X review has ring chapter [R7]. | Official range 343–370 g [P9]; X-specific value unresolved. Color/revision should be recorded if different. |
| ttartisan-10mm-f2 | yes / 340 | Confirmed by Fuji review [R8]. | Official range 333–345 g [P10]; 340 g not verified as X-specific. 72 mm external filter holder is explicitly confirmed, matching filterViaAdapter=true. |
| ttartisan-17mm-f14 | yes / 248 | Explicit aperture-control discussion in same-model review [R9] (Sony; construction evidence only). | Generic approximately 248 g E/X/Z/M43/RF [P11]. |
| ttartisan-23mm-f14 | yes / 224 | Official manual's aperture scale/ring illustration [P12]; product description also specifies clicked aperture [R10]. | Current official range 222–250 g [P13]; older manual says 222–224 g [P12]. Neither maps values to X. Unresolved. |
| ttartisan-25mm-f2 | yes / 167 | Confirmed by Fuji review [R11]. | Official range 166–189 g [P14]; exact X value unresolved. |
| ttartisan-35mm-f095 | yes / 257 | Confirmed by X-mount review [R12]. | Official range 247–267 g [P15]. **257 is exactly its midpoint**; no proof it is X specification or proof of intentional averaging. Unresolved. |
| ttartisan-35mm-f14 | yes / 180 | Confirmed by X-Pro2 review [R13]. | Generic approximately 180 g E/X/Z/RF/EOS-M/L/MFT [P16]. |
| ttartisan-40mm-f28-macro | yes / 371 | Confirmed by Fuji review [R14] and labelled official manual [P17]. | Official text says 371 g but spec table says 371–403 g [P18]; Fuji review reports 380 g [R14]. Unresolved; do not treat range minimum as X proof. |
| ttartisan-50mm-f095 | yes / 411 | Manufacturer indexed product description explicitly lists clicked ring [P19]. | Generic approximately 411 g E/X/Z/RF/L/M43 [P19]. |
| ttartisan-50mm-f12 | yes / 336 | Explicit clicked-ring description in same-model Sony review [R15]; X-specific visual confirmation not separately completed. | Generic approximately 336 g multi-mount spec [P20]. |
| ttartisan-50mm-f2 | yes / 205 | Manufacturer explicitly describes clicked ring [P21]. | Official range 190–210 g [P21]; exact X value unresolved. |
| ttartisan-100mm-f28-macro | yes / 724 | Same-model 2X Macro hands-on review describes ring [R16] (Nikon; construction evidence only). Do not confuse with Bubble Bokeh or tilt-shift versions. | Official range 700–748 g [P22]. **724 is exactly its midpoint**; X value unresolved. |
| ttartisan-500mm-f63 | yes / 1610 | Official manual labels aperture ring [P23]. | Official table gives 1564–1617 g and omits X in its mount list [P24]. X version does exist: retailer SKU F50063-B-X [W2] and 2024 announcement [R17]. 1610 g remains unverified; accessory inclusion also unresolved. |

## Other fields

Focal lengths, maximum apertures, prime type, AF/MF and filter sizes agree with the cited manufacturer specification tables for the corresponding 20 products (the 500mm X mount is separately supported by W2). This is a consistency check, not independent measurement. For 7.5mm, `filterDiameterMm=0` represents no ordinary front thread; specialty rear ND filters need separate semantics.

Release-year discrepancies: AF27mm releaseYear was corrected from 2023 to **2022**, matching the October 27, **2022 X-mount announcement** [R18]. AF35mm II DB2025 needs review: X-mount launch posts date to December 2024 [R19], while the multi-mount announcement is January 2025 [R20]. Define releaseYear as X-mount first availability, and avoid using later mounts' launch dates. Other release years have **not** been comprehensively verified.

Weather resistance, stabilization (apart from individual explicit specifications), linearMotor and price fields have **not** been comprehensively sourced here. A silent product page is not evidence for false. No claims are made that every boolean in these records is verified. Price zeros/empty retailer URLs remain missing data.

## Sources

Manufacturer pages, manuals and official announcements:

- [P1: AF14](https://www.ttartisan.com/af-lens/AF14.html)
- [P2: AF17 Air](https://ttartisan.store/en-cn/products/af-17mm-f1-8-air)
- [P3: AF23](https://www.ttartisan.com/?af-lens/AF23.html=)
- [P4: AF35 II](https://ttartisan.store/products/ttartisan-af-35mm-f1-8); [inspected mount comparison image](https://cdn.shopify.com/s/files/1/0433/2224/5282/files/AF35II_3913f2a7-d2b1-4d29-b06a-178a17dda641.png?v=1739872914)
- [P5: AF56 official manual](https://ttartisan.com/static/upload/file/20240219/1708329488136330.pdf)
- [P6: official AF75 X launch, 2025-08-14](https://www.youtube.com/watch?v=rEwCeCT-zpE) — description, not a watched video.
- [P7: AF75](https://www.ttartisan.com/?af-lens/FF-AF75.html=)
- [P8: official 7.5mm silver announcement](https://www.youtube.com/watch?v=biYugrJb45k) — description, not a watched video.
- [P9: 7.5mm](https://www.ttartisan.com/?aps-c-lenses/72.html=)
- [P10: 10mm](https://www.ttartisan.com/?aps-c-lenses/79.html=)
- [P11: 17mm F1.4](https://www.ttartisan.com/?aps-c-lenses/74.html=)
- [P12: 23mm F1.4 manual](https://ttartisan.com/static/upload/file/20240219/1708336040157165.pdf)
- [P13: 23mm F1.4](https://www.ttartisan.com/?aps-c-lenses/76.html=)
- [P14: 25mm](https://ttartisan.store/products/aps-c-25mm-f2)
- [P15: 35mm F0.95](https://www.ttartisan.com/?aps-c-lenses/70.html=)
- [P16: 35mm F1.4](https://www.ttartisan.com/?aps-c-lenses/71.html=)
- [P17: 40mm manual](https://www.ttartisan.com/static/upload/file/20240219/1708336043140301.pdf)
- [P18: 40mm](https://www.ttartisan.com/?aps-c-lenses/75.html=)
- [P19: APS-C 50mm F0.95](https://ttartisan.store/products/aps-c-50mm-f0-95)
- [P20: 50mm F1.2](https://www.ttartisan.com/?aps-c-lenses/73.html=)
- [P21: 50mm F2](https://www.ttartisan.com/?full-frame-lenses/TTArtisan-50-F2.html=)
- [P22: 100mm Macro 2X](https://www.ttartisan.com/?full-frame-lenses/TS-100-Macro.html=)
- [P23: 500mm manual](https://ttartisan.com/static/upload/file/20240219/1708329265123390.pdf)
- [P24: 500mm product table](https://www.ttartisan.com/?full-frame-lenses/500-F6-3.html=)

Reviews and supporting sources:

- [R1: Radojuva AF17 X review](https://radojuva.com/en/2026/04/ttartisan-af-17-1-8-ed/)
- [R2: Alik Griffin AF23 Fuji review](https://alikgriffin.com/ttartisan-af-23mm-f1-8-lens-review-sample-photos/)
- [R3: Keith Wee AF27 Fuji review](https://keithwee.com/2022/11/08/review-of-the-ttartisan-27mm-f2-8-for-fujifilm-x-perfectly-fun/)
- [R4: AF35 II on X-Pro3](https://schlueter-enterprises.com/test/review-of-the-ttartisan-af-35mm-f1-8-ii-lens-on-the-fujifim-x-pro-3/)
- [R5: AF35 II Sony review](https://sonyalpha.blog/2025/01/25/ttartisan-35mm-f1-8-ii/)
- [R6: DPReview AF56 launch](https://www.dpreview.com/news/8666687939/ttartisan-releases-new-af-56mm-f1-8-lens-for-fujifilm-and-sony/)
- [R7: 7.5mm X review, chapter 8:10](https://www.youtube.com/watch?v=Cnhuz6h8pz0) — indexed chapter only, not watched.
- [R8: Alwin Kok 10mm](https://alwinkok.com/2024/04/01/ttartisan-10mm-f2-the-first-ultrawide-lens-from-ttartisan/)
- [R9: Sony Alpha Blog 17mm F1.4](https://sonyalpha.blog/2021/05/31/ttartisan-17mm-f1-4/)
- [R10: Adorama 23mm product description](https://www.adorama.com/ttartisan-23-mm-f-1-4-lens/p/tta2314esb)
- [R11: Alwin Kok 25mm](https://alwinkok.com/2022/11/07/ttartisan-25mm-f2-a-tiny-street-lens/)
- [R12: Keith Wee 35mm F0.95 X](https://keithwee.com/2022/11/25/ttartisan-35mm-f0-95-review-is-this-the-noctilux-for-fujifilm-x-mount/)
- [R13: Alik Griffin 35mm F1.4](https://alikgriffin.com/hands-on-with-ttartisan-35mm-f1-4-review/)
- [R14: Alwin Kok 40mm](https://alwinkok.com/2023/05/24/ttartisan-40mm-f2-8-a-macro-lens-for-street/)
- [R15: Sony Alpha Blog 50mm F1.2](https://sonyalpha.blog/2020/12/23/ttartisan-50mm-f1-2/)
- [R16: Phillip Reeve 100mm Macro 2X](https://phillipreeve.net/blog/review-ttartisan-100mm-f-2-8-macro-2x/)
- [R17: Optyczne 500mm new mounts](https://www.optyczne.pl/19691-news-TTartisan_500_mm_f_6.3_z_nowymi_mocowaniami.html)
- [R18: PetaPixel 2022 AF27 X announcement](https://petapixel.com/2022/10/27/ttartisan-unveils-new-autofocus-27mm-f-2-8-xf-lens-for-fuji-x/)
- [R19: December 2024 X launch discussion](https://www.reddit.com/r/fujifilm/comments/1hb0q6b) — secondary lead, requires stronger launch evidence before changing year.
- [R20: DPReview January 2025 AF35 II announcement](https://www.dpreview.com/news/5487510263/ttartisan-af-35mm-f1p8-ii-aps-c-sony-fujifilm-nikon/)
- [W1: X-specific AF27 specification PDF](https://www.cliftoncameras.co.uk/uploads/specifications/TTArtisan%20AF%2027mm%20f2.8%20APS-C%20-%20Fujifilm%20X%20Mount%20Specifications.pdf)
- [W2: 500mm X SKU](https://www.rubbermonkey.com.au/TTArtisan-500mm-f-6-3-Lens-Fujifilm-X)

All links retrieved or indexed by web search on the audit date. Some manufacturer's PDFs were only available as indexed labels/text; no claim is made that all illustrations or linked videos were visually inspected. The AF35 II mount comparison image was inspected directly. A missing ring is based on explicit review statements, not absence from marketing text.
