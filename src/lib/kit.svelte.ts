import { browser } from '$app/environment';

const STORAGE_KEY = 'fujilenses-kit';

function loadKit(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

function saveKit(kit: Set<string>): void {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...kit]));
}

let kitSlugs = $state(loadKit());

export function getKitSlugs(): Set<string> {
	return kitSlugs;
}

export function getKitCount(): number {
	return kitSlugs.size;
}

export function toggleKitLens(slug: string): void {
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
		if (!next.has(slug)) {
			next.add(slug);
			added++;
		}
	}
	saveKit(next);
	kitSlugs = next;
	return added;
}
