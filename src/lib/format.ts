import type { Lens } from './types';

/** "35mm" for primes, "16–55mm" for zooms. */
export function focalDisplay(lens: Pick<Lens, 'minFocalLength' | 'maxFocalLength'>): string {
	return lens.minFocalLength === lens.maxFocalLength
		? `${lens.minFocalLength}mm`
		: `${lens.minFocalLength}–${lens.maxFocalLength}mm`;
}
