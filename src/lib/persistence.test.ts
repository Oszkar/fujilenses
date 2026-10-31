import { beforeEach, describe, expect, it, vi } from 'vitest';
import { allLenses } from '$lib/data';

vi.mock('$app/environment', () => ({ browser: true }));

beforeEach(() => {
	vi.resetModules();
	vi.stubGlobal('document', { documentElement: {
		removeAttribute: vi.fn(), setAttribute: vi.fn(), style: { setProperty: vi.fn() }
	} });
});

describe('browser persistence', () => {
	it('keeps kit and preferences usable when storage access throws', async () => {
		vi.stubGlobal('localStorage', {
			getItem: () => { throw new Error('blocked'); },
			setItem: () => { throw new Error('quota'); }
		});
		const kit = await import('./kit.svelte');
		const prefs = await import('./preferences.svelte');
		expect(prefs.getTheme()).toBe('auto');
		expect(prefs.getFontSize()).toBe('m');
		kit.toggleKitLens(allLenses[0].slug);
		expect(kit.isInKit(allLenses[0].slug)).toBe(true);
		expect(kit.mergeIntoKit([allLenses[0].slug, allLenses[1].slug])).toBe(1);
		expect(kit.getKitCount()).toBe(2);
		prefs.setTheme('dark');
		prefs.setFontSize('l');
		expect(prefs.getTheme()).toBe('dark');
		expect(prefs.getFontScale()).toBe(1.125);
	});
	it('rejects invalid persisted preferences and kit shapes', async () => {
		vi.stubGlobal('localStorage', { getItem: () => '"invalid"', setItem: vi.fn() });
		const kit = await import('./kit.svelte');
		const prefs = await import('./preferences.svelte');
		expect(kit.getKitCount()).toBe(0);
		expect(prefs.getTheme()).toBe('auto');
		expect(prefs.getFontSize()).toBe('m');
	});
	it('loads only valid unique slugs and saves changes for the next session', async () => {
		const values = new Map([['fujilenses-kit', JSON.stringify([allLenses[0].slug, allLenses[0].slug, 'unknown', 42])]]);
		vi.stubGlobal('localStorage', {
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value)
		});
		const kit = await import('./kit.svelte');
		expect(kit.getKitCount()).toBe(1);
		kit.toggleKitLens(allLenses[1].slug);
		vi.resetModules();
		const reloaded = await import('./kit.svelte');
		expect([...reloaded.getKitSlugs()]).toEqual([allLenses[0].slug, allLenses[1].slug]);
	});
});
