import type { Lens } from '$lib/types';
import xfLenses from './xf-lenses.json';
import thirdPartyLenses from './third-party-lenses.json';

export const allLenses: Lens[] = [...(xfLenses as Lens[]), ...(thirdPartyLenses as Lens[])];

export function getLensBySlug(slug: string): Lens | undefined {
	return allLenses.find((l) => l.slug === slug);
}

export function getManufacturers(): string[] {
	return [...new Set(allLenses.map((l) => l.manufacturer))].sort();
}

export function isNewLens(lens: Lens): boolean {
	const now = new Date();
	const cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
	return lens.releaseYear >= cutoff.getFullYear();
}

export function getLensCountByManufacturer(lenses: Lens[]): Map<string, number> {
	const counts = new Map<string, number>();
	for (const lens of lenses) {
		counts.set(lens.manufacturer, (counts.get(lens.manufacturer) ?? 0) + 1);
	}
	return counts;
}

export const manufacturerColors: Record<string, string> = {
	Fujinon: 'var(--mfr-fujinon)',
	Sigma: 'var(--mfr-sigma)',
	Viltrox: 'var(--mfr-viltrox)',
	Tamron: 'var(--mfr-tamron)',
	Sirui: 'var(--mfr-sirui)'
};
