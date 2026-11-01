import { describe, it, expect } from 'vitest';
import { lensDescription, lensJsonLd, homeJsonLd, serializeJsonLd } from './seo';
import { allLenses } from './data';
import type { Lens } from './types';

function makeLens(overrides: Partial<Lens> = {}): Lens {
	return {
		slug: 'xf-8mm-f35-wr',
		manufacturer: 'Fujinon',
		model: 'XF 8mm F3.5 R WR',
		mountType: 'XF',
		lensType: 'Prime',
		minFocalLength: 8,
		maxFocalLength: 8,
		maxAperture: 3.5,
		imageStabilization: false,
		weatherResistant: true,
		apertureRing: true,
		autofocus: true,
		linearMotor: false,
		releaseYear: 2023,
		weightGrams: 215,
		filterDiameterMm: 62,
		approxPriceUSD: 0,
		priceUpdatedYear: 0,
		retailerUrl: '',
		...overrides
	};
}

describe('lensDescription', () => {
	it('describes a prime with only the true features', () => {
		expect(lensDescription(makeLens())).toBe(
			'Fujinon XF 8mm F3.5 R WR — 8mm f/3.5 prime lens for Fujifilm X-mount. Weather-resistant, aperture ring. 215g, released 2023.'
		);
	});

	it('describes a variable-aperture zoom', () => {
		const d = lensDescription(
			makeLens({
				model: 'XF 18-135mm F3.5-5.6 R LM OIS WR',
				lensType: 'Zoom',
				minFocalLength: 18,
				maxFocalLength: 135,
				maxAperture: 3.5,
				imageStabilization: true
			})
		);
		expect(d).toContain('18–135mm f/3.5–5.6 zoom lens');
		expect(d).toContain('OIS');
	});

	it('omits the feature sentence when no flags are set and notes manual focus', () => {
		const d = lensDescription(
			makeLens({ weatherResistant: false, apertureRing: false, autofocus: false })
		);
		expect(d).toContain('Manual focus.');
		expect(d).not.toMatch(/eather|OIS|aperture ring/);
	});

	it('does not call GF lenses X-mount', () => {
		const d = lensDescription(makeLens({ mountType: 'GF' }));
		expect(d).toContain('GF-mount');
		expect(d).not.toContain('X-mount');
	});

	it('stays reasonably short for every lens', () => {
		for (const lens of allLenses) {
			expect(lensDescription(lens).length, lens.slug).toBeLessThanOrEqual(220);
		}
	});
});

describe('lensJsonLd', () => {
	it('is a ProductModel with canonical url and no offers or ratings', () => {
		const ld = lensJsonLd(makeLens());
		expect(ld['@type']).toBe('ProductModel');
		expect(ld.url).toBe('https://fujilenses.com/lens/xf-8mm-f35-wr');
		expect(ld).not.toHaveProperty('offers');
		expect(ld).not.toHaveProperty('aggregateRating');
		expect(ld).not.toHaveProperty('review');
	});

	it('round-trips as valid JSON for every lens', () => {
		for (const lens of allLenses) {
			const parsed = JSON.parse(serializeJsonLd(lensJsonLd(lens)));
			expect(parsed.name, lens.slug).toBe(`${lens.manufacturer} ${lens.model}`);
		}
	});
});

describe('serializeJsonLd', () => {
	it('escapes < so data cannot close the script tag', () => {
		const out = serializeJsonLd(lensJsonLd(makeLens({ model: 'Evil </script><b>' })));
		expect(out).not.toContain('<');
		expect(JSON.parse(out).name).toContain('</script>');
	});
});

describe('homeJsonLd', () => {
	it('declares a WebSite', () => {
		expect(JSON.stringify(homeJsonLd())).toContain('"WebSite"');
	});
});
