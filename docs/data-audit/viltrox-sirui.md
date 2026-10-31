# Viltrox and Sirui source audit

Audited 2026-10-31 against `src/lib/data/third-party-lenses.json`. All 21 existing entries are covered below. Focus: physical aperture rings and Fujifilm X weights. Five corrections are applied: three rings and two weights. Other fields are **unverified** unless explicitly mentioned. A matching weight is a published nominal specification, not a measurement. No inference of a missing ring is made from a specification table's silence.

## Applied corrections and qualifications

- Changed `apertureRing` from false to true for Viltrox 23mm, 33mm and 56mm F1.4. All have physical rings; clickless is still a ring.
- Sirui Aurora 85mm: changed 540 g to **550 g**. Manufacturer's mount table explicitly gives E=540 g and X=550 g, excluding cap [S1].
- Viltrox 85mm F1.8 II: **492 g** is the Fuji-specific figure, now stored instead of the previous 484 g [V14]. The 484 g number appears in generic/multi-mount databases; do not average. Global manufacturer confirmation is still desirable because the primary evidence here is its Taiwan storefront.
- All five Sniper weights already match the manufacturer's explicit X column; they are not averages [S2]. Viltrox 27mm's 560 g and 56mm F1.7's 171 g are also explicitly mount-specific, despite different E/Z weights [V6, V12].
- Viltrox 28mm is named “Air” in the dataset; official XF product name omits Air, and its XF release was February 6, 2025 [V7]. Audit the existing model/releaseYear against whether the project means first global release or X-mount release.

## Per-entry evidence

Current JSON values below are `apertureRing / weightGrams`. “Confirmed” applies only to the explicitly discussed fields.

| Slug | Current | Aperture ring finding | X weight finding / uncertainty |
|---|---|---|---|
| `viltrox-af-9mm-f28-air` | false / 175 | **Confirmed false**, explicit XF hands-on review [V1b]. | **175 g confirmed**, bare lens, official X product [V1]. |
| `viltrox-af-13mm-f14` | true / 420 | **Confirmed true**, clicked ring explicitly described in XF hands-on review [V2]. | **420 g confirmed** by same XF review. It also explicitly reports no weather sealing and 67 mm filter. |
| `viltrox-af-15mm-f17-air` | false / 180 | **Confirmed false**, explicit X-mount review [V3b]. | **180 g confirmed**, bare lens, official X page [V3]. |
| `viltrox-af-23mm-f14` | true / 260 | **Corrected to true**. Reviewer tested on X-T4 and describes the clickless aperture ring [V4b]. | **260 g supported** by official XF listing's 0.57 lb nominal value [V4]; exact grams independently listed in multi-mount DPR, so do not treat pound conversion as a precise measurement. |
| `viltrox-af-25mm-f17-air` | false / 170 | **Confirmed false** in hands-on review [V5b]. | **170 g confirmed**, official X specification [V5]. |
| `viltrox-af-27mm-f12-pro` | true / 560 | **True supported** by XF-specific specification [V6b]; not independently inspected in this pass. | **560 g confirmed** official X table; E=565 g, Z=605 g [V6]. |
| `viltrox-af-28mm-f45-air` | false / 60 | Fixed F4.5, so no adjustable aperture control; official specification confirms fixed aperture [V7]. | **60 g confirmed**, bare lens, official X page [V7]. XF release 2025; see finding above. |
| `viltrox-af-33mm-f14` | true / 270 | **Corrected to true**, Fuji hands-on review explicitly describes silent/clickless ring [V8]. | **270 g confirmed**, same X-mount review; manufacturer manual mirror also gives 270 g [V8b]. |
| `viltrox-af-35mm-f17-air` | false / 170 | **Confirmed false**, reviewer used X-T5 [V9]. | **170 g confirmed** by same X hands-on review. Also explicitly no weather sealing or OIS. Generic DPR lists 180 g, illustrating why generic records are unsafe here. |
| `viltrox-af-56mm-f12-pro` | true / 575 | **Confirmed true**; review explicitly distinguishes Fuji aperture ring from extra E/Z switches [V10b]. | **575 g confirmed**, bare lens, official X specification [V10]. Official focus motor is **VCM**; evaluate `linearMotor` definition before treating this as an STM or LM flag. |
| `viltrox-af-56mm-f14` | true / 290 | **Corrected to true**, manufacturer/distributor Fuji listing explicitly describes manual aperture ring [V11b]; Fuji physical teardown independently documents it [V11c]. | **290 g confirmed** official table groups X/E/EF-M=290 g and Z=320 g [V11]. |
| `viltrox-af-56mm-f17-air` | false / 171 | **False supported**, reviewer explicitly contrasts ringless Air with older F1.4 [V10b]. Fuji-specific control inspection remains desirable. | **171 g confirmed**, official table explicitly X=171 g, Z=187 g [V12]. |
| `viltrox-af-75mm-f12-pro` | true / 670 | **Confirmed true**, X hands-on review describes clicked ring [V13]. | **670 g confirmed** by same review and manufacturer XF manual specification [V13b]. |
| `viltrox-af-85mm-f18-ii` | false / 492 | **False supported**, hands-on review explicitly says no dedicated ring, but tested Nikon Z; X-specific primary control evidence remains open [V14b]. | **Corrected to 492 g for Fuji X**, Taiwan Viltrox storefront and X-specific distributor [V14, V14c]. 492 g applied; global manufacturer/manual corroboration still desirable. |
| `sirui-sniper-16mm-f12` | false / 386 | **Confirmed false**, explicitly X-mount hands-on review [S3]. | **386 g confirmed**, manufacturer X table; E=384 g [S2]. |
| `sirui-sniper-23mm-f12` | false / 380 | **Confirmed false**, hands-on series review explicitly describes no ring [S4]. | **380 g confirmed**, manufacturer X table; E=381 g [S2]. |
| `sirui-sniper-33mm-f12` | false / 398 | **Confirmed false**, same series review [S4]. | **398 g confirmed**, manufacturer X table; E=400 g [S2]. |
| `sirui-sniper-56mm-f12` | false / 419 | **Confirmed false**, same series review [S4]. | **419 g confirmed**, manufacturer X table; E=422 g [S2]. |
| `sirui-sniper-75mm-f12` | false / 466 | **Confirmed false**, Fuji X-H2 hands-on review [S5]. | **466 g confirmed**, manufacturer X table; E also 466 g [S2]. |
| `sirui-aurora-35mm-f14` | true / 490 | Ring supported by hands-on review [S6] and official click/iris controls [S1]; review tests another mount, so X-specific ring inspection remains open. | **490 g confirmed**, official table X=490 g, E=490 g, L=495 g, excluding cap [S1]. |
| `sirui-aurora-85mm-f14` | true / 550 | Ring supported by hands-on review [S7] and manufacturer click controls [S1]; review tests another mount, so X-specific ring inspection remains open. | **Corrected: X=550 g**, E=540 g, L=550 g, excluding cap [S1]. |

All 21 have X-mount availability supported by the X product/specification/review sources above. This does not establish present stock or full camera/firmware compatibility. No evidence of deliberate weight averaging was established in this research; git history is a separate provenance question.

## Sources

Sources were accessed 2026-10-31. Manufacturer pages are preferred for weight; firsthand reviews/teardown provide direct physical-control evidence. Database-only evidence is explicitly qualified above.

- **V1** [Viltrox 9mm X product](https://viltrox.com/products/af-9mm-f2-8-xf).
- **V1b** [Kevin Mullins: 9mm XF hands-on review](https://www.kevinmullinsphotography.co.uk/blog/viltrox-af-9mm-f28-air-xf-review).
- **V2** [PetaPixel: 13mm XF review](https://petapixel.com/2022/06/20/viltrox-af-13mm-f-1-4-stm-xf-lens-review-great-lens-better-price/). Use its 13mm findings only: its incidental 56mm weight is inconsistent with that lens's manufacturer specification.
- **V3** [Viltrox 15mm XF product](https://viltrox.com/products/af-15mm-f1-7-xf).
- **V3b** [SemiPro Tech+Gear: 15mm Fuji review](https://semiprotechgear.com/viltrox-air-15mm-f-1-7-fuji-x-mount-an-overdue-addition/).
- **V4** [Viltrox 23mm XF product](https://viltrox.com/products/viltrox-23mm-f14-xf-mount?variant=39285978890306).
- **V4b** [Fenchel & Janisch: 23mm tested on X-T4](https://www.fenchel-janisch.com/viltrox-23mm-f-1-4-review-for-video-tested-on-the-fujifilm-x-t4/).
- **V5** [Viltrox 25mm X product](https://viltrox.com/products/af-25mm-f1-7-x).
- **V5b** [Kevin Mullins: 25mm review](https://www.kevinmullinsphotography.co.uk/blog/viltrox-25mm-f17-review).
- **V6** [Viltrox 27mm mount comparison](https://viltrox.com/pages/viltrox-af-27mm-f1-2-pro-series).
- **V6b** [PetaPixel: 27mm XF specification](https://petapixel.com/pixelmeter/viltrox-af-27mm-f1-2-xf/).
- **V7** [Viltrox 28mm X product](https://viltrox.com/products/af-28mm-f4-5-x); [manufacturer XF launch release](https://globalpr.agency/fileadmin/Press/Viltrox/AF_28mm_F4.5_XF/Viltrox_AF_28mm_F4.5_XF_Lens_EN.html).
- **V8** [Keith Wee: 33mm Fuji review](https://keithwee.com/portfolio/the-contender-ii-review-of-the-viltrox-33mm-f1-4-for-fujifilm-x-mount/).
- **V8b** [Viltrox XF manual, mirrored by Trovaprezzi](https://www.trovaprezzi.it/manuali/viltrox_af_33_1_4_fujifilm_x_rosso.pdf).
- **V9** [Amateur Photographer: 35mm XF review](https://amateurphotographer.com/review/viltrox-af-35mm-f1-7-xf-review-cheap-and-very-cheerful/).
- **V10** [Viltrox 56mm F1.2 XF product](https://viltrox.com/products/af-56mm-f1-2-xf).
- **V10b** [Digital Camera World: 56mm Pro review and mount differences](https://www.digitalcameraworld.com/cameras/lenses/viltrox-af-56mm-f-1-2-pro-review).
- **V11** [Viltrox 56mm F1.4 official multi-mount table](https://viltrox.com/products/viltrox-56mm-f1_4-ef-m-lens-for-canon-eos-m).
- **V11b** [Viltrox Indonesia: 56mm Fuji product](https://www.viltroxindonesia.co.id/product/viltrox-56mm-f1-4-stm-af-lens-for-fujifilm-x-mount-garansi-resmi/).
- **V11c** [Yukosteel: Fuji 56mm teardown](https://www.yukosteel.com/2020/10/disassembly-viltrox-56mm-f14-af-lens.html).
- **V12** [Viltrox 56mm F1.7 X/Z product table](https://viltrox.com/products/viltrox-af-56mm-f1-7-xf-z).
- **V13** [Dustin Abbott: 75mm XF review](https://dustinabbott.net/2022/12/viltrox-af-75mm-f1-2-review/).
- **V13b** [Viltrox 75mm XF datasheet distributed by Foto Koch](https://www.fotokoch.de/nl/bilddaten/produktdatenblaetter/de/64855-datenblatt-viltrox-xf-af-75mm-f12.pdf).
- **V14** [Viltrox Taiwan: 85mm II Fuji product, 492 g](https://www.viltrox.com.tw/product/viltrox-%E5%94%AF%E5%8D%93%E4%BB%95-lnvt8518sfx2/).
- **V14b** [Cameralabs: 85mm II review](https://www.cameralabs.com/viltrox-af-85mm-f1-8-ii-review/).
- **V14c** [Teltec: 85mm II XF, 492 g](https://teltec.de/viltrox-af-85-1-8-ii-xf-x-mount.html).
- **S1** [Sirui Aurora official product and 35/85mm mount comparison table](https://store.sirui.com/products/sirui-aurora-series-85mm-full-frame-autofocus-lens). The table has separate 35mm and 85mm columns; weight row appears immediately after the lengths. This is not the generic headline weight.
- **S2** [Sirui Sniper official five-lens comparison table](https://store.sirui.com/products/sirui-sniper-series-16-75mm-f1-2-aps-c-frame-autofocus-lens-set).
- **S3** [Dustin Abbott: Sniper 16mm X review](https://dustinabbott.net/2024/06/sirui-sniper-16mm-f1-2-x-mount-review/).
- **S4** [Dustin Abbott: Sniper 23/33/56 review](https://dustinabbott.net/2023/11/sirui-sniper-series-review-23mm-33mm-and-56mm-f1-2/).
- **S5** [Dustin Abbott: Sniper 75mm review](https://dustinabbott.net/2024/07/sirui-sniper-75mm-f1-2-review/).
- **S6** [Phillip Reeve: Aurora 35mm hands-on review](https://phillipreeve.net/blog/review-sirui-aurora-35mm-f1-4/).
- **S7** [Sony Alpha Blog: Aurora 85mm hands-on review](https://sonyalpha.blog/2024/12/11/sirui-85mm-f1-4-aurora/).

## Remaining verification

The most important unresolved physical-control evidence is X-specific confirmation for Viltrox 56mm F1.7, 85mm II and both Aurora lenses, plus stronger firsthand/manufacturer ring evidence for the 27mm. Existing values are supported at family/model level but should not be represented as independently inspected X hardware. No photos were manually inspected in this pass. Release years, weather sealing, OIS, motor classification, filter diameters, prices and other fields are unverified except for the limited observations explicitly stated above.
