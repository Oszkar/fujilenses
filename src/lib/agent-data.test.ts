import { describe, it, expect } from 'vitest';
import { lensesDataset, llmsTxt } from './agent-data';
import { allLenses } from './data';

describe('lensesDataset', () => {
	it('includes every lens with its page url and no price/retailer fields', () => {
		const ds = lensesDataset(allLenses);
		expect(ds.count).toBe(allLenses.length);
		expect(ds.lenses).toHaveLength(allLenses.length);
		const first = ds.lenses[0];
		expect(first.url).toBe(`https://fujilenses.com/lens/${allLenses[0].slug}`);
		const json = JSON.stringify(ds);
		expect(json).not.toMatch(/approxPriceUSD|priceUpdatedYear|retailerUrl|reviews/);
	});
});

describe('llmsTxt', () => {
	const txt = llmsTxt(allLenses);

	it('starts with an H1 and a blockquote summary', () => {
		expect(txt).toMatch(/^# FujiLenses\n\n> /);
	});

	it('links the dataset and sitemap', () => {
		expect(txt).toContain('https://fujilenses.com/lenses.json');
		expect(txt).toContain('https://fujilenses.com/sitemap.xml');
	});

	it('lists every lens exactly once', () => {
		for (const lens of allLenses) {
			const link = `(https://fujilenses.com/lens/${lens.slug})`;
			expect(txt.split(link).length - 1, lens.slug).toBe(1);
		}
	});
});
