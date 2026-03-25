import { browser } from '$app/environment';

const STORAGE_KEY = 'fujilenses-kit';

export function getKit(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

export function saveKit(kit: Set<string>): void {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...kit]));
}

export function toggleKitLens(slug: string): Set<string> {
	const kit = getKit();
	if (kit.has(slug)) {
		kit.delete(slug);
	} else {
		kit.add(slug);
	}
	saveKit(kit);
	return kit;
}
