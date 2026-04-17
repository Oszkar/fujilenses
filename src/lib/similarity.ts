import type { Lens } from '$lib/types';

/**
 * Compute a similarity score between two lenses.
 * Lower = more similar. Uses mid-focal-length distance (mm)
 * plus aperture distance in stops, weighted so 1 stop ≈ 20mm.
 */
function similarityScore(a: Lens, b: Lens): number {
	const midA = (a.minFocalLength + a.maxFocalLength) / 2;
	const midB = (b.minFocalLength + b.maxFocalLength) / 2;
	const focalDiff = Math.abs(midA - midB);

	// log2 gives distance in stops (f/1.4→f/2 = 0.5 stops, f/2→f/2.8 = 0.5 stops)
	const stopsDiff = Math.abs(Math.log2(a.maxAperture) - Math.log2(b.maxAperture));

	return focalDiff + 20 * stopsDiff;
}

/**
 * Return the top `count` most similar lenses, excluding the lens itself.
 * Deterministic: sorted by score ascending, then by slug for stability.
 */
export function getSimilarLenses(lens: Lens, allLenses: Lens[], count: number = 3): Lens[] {
	return allLenses
		.filter((l) => l.slug !== lens.slug)
		.map((l) => ({ lens: l, score: similarityScore(lens, l) }))
		.sort((a, b) => a.score - b.score || a.lens.slug.localeCompare(b.lens.slug))
		.slice(0, count)
		.map((entry) => entry.lens);
}
