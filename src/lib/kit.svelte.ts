import { readStorage, writeStorage } from '$lib/storage';
import { allLenses } from '$lib/data';

const validSlugs = new Set(allLenses.map((lens) => lens.slug));

const STORAGE_KEY = 'fujilenses-kit';

function loadKit(): Set<string> {
	try {
		const raw = readStorage(STORAGE_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		return new Set(Array.isArray(parsed) ? parsed.filter((slug): slug is string => typeof slug === 'string' && validSlugs.has(slug)) : []);
	} catch {
		return new Set();
	}
}

function saveKit(kit: Set<string>): void {
	writeStorage(STORAGE_KEY, JSON.stringify([...kit]));
}

let kitSlugs = $state(loadKit());

export function getKitSlugs(): Set<string> {
	return kitSlugs;
}

export function getKitCount(): number {
	return kitSlugs.size;
}

export function toggleKitLens(slug: string): void {
	if (!validSlugs.has(slug)) return;
	const next = new Set(kitSlugs);
	if (next.has(slug)) {
		next.delete(slug);
	} else {
		next.add(slug);
	}
	saveKit(next);
	kitSlugs = next;
}

export function isInKit(slug: string): boolean {
	return kitSlugs.has(slug);
}

/** Merge an array of slugs into the kit. Returns the number of newly added lenses. */
export function mergeIntoKit(slugs: string[]): number {
	const next = new Set(kitSlugs);
	let added = 0;
	for (const slug of slugs) {
		if (validSlugs.has(slug) && !next.has(slug)) {
			next.add(slug);
			added++;
		}
	}
	saveKit(next);
	kitSlugs = next;
	return added;
}
