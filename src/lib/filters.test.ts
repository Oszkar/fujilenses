import { describe, expect, it } from 'vitest';
import { allLenses } from '$lib/data';
import { applyFilters, catalogHref, defaultFilters, parseFiltersFromURL, parseSharedKit } from './filters';

describe('catalog URLs', () => {
	it('navigates home from a detail page for every tab and filter', () => {
		for (const view of ['table', 'map', 'kit'] as const) {
			const url = new URL(catalogHref({ ...defaultFilters, view, wr: true }), 'https://example.com/lens/example');
			expect(url.pathname).toBe('/');
			expect(parseFiltersFromURL(url.searchParams)).toMatchObject({ view, wr: true });
		}
	});
	it('retains a shared kit while changing sort order', () => {
		const slug = allLenses[0].slug;
		const url = new URL(catalogHref({ ...defaultFilters, sort: 'weightGrams' }, slug), 'https://example.com');
		expect(url.searchParams.get('skit')).toBe(slug);
		expect(url.searchParams.get('sort')).toBe('weightGrams');
	});
	it('ignores invalid enums and nonpositive or nonfinite numbers', () => {
		for (const value of ['', 'nope', 'Infinity', '-1', '0']) {
			const filters = parseFiltersFromURL(new URLSearchParams(`view=nope&type=nope&mount=nope&ap=${value}&fmin=${value}&fmax=${value}`));
			expect(filters).toEqual(defaultFilters);
			expect(applyFilters(allLenses, filters)).toHaveLength(allLenses.length);
		}
	});
	it('normalizes reversed focal bounds and preserves valid ranges', () => {
		expect(parseFiltersFromURL(new URLSearchParams('fmin=55&fmax=18&ap=2.8'))).toMatchObject({ fmin: 18, fmax: 55, ap: 2.8 });
	});
	it('deduplicates shared lenses and discards unknown slugs', () => {
		const lens = allLenses[0];
		expect(parseSharedKit(`${lens.slug},unknown,${lens.slug},`, allLenses)).toEqual([lens]);
		expect(parseSharedKit(null, allLenses)).toEqual([]);
	});
});
