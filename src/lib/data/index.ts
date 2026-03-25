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
