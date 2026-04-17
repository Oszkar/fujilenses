import type { Lens } from '$lib/types';
import { getFFMultiplier } from '$lib/filters';

export interface CoverageSegment {
	focalStart: number;
	focalEnd: number;
	count: number;
}

export interface GradientStop {
	offset: number; // fraction 0-1 along the gradient vector
	opacity: number;
}

export interface GapMarker {
	x: number; // pixel position
	width: number; // pixel width
	focalStart: number;
	focalEnd: number;
}

// Bumped up from 0.08/0.20/0.35 — the original values were too subtle
const OPACITY_MAP: Record<number, number> = {
	0: 0,
	1: 0.15,
	2: 0.30
};
const MAX_OPACITY = 0.45;

// Primes have min === max, so give them a small artificial range
// so the sweep line produces a visible segment
const PRIME_HALF_WIDTH = 0.5; // ±0.5mm in focal-length space

function opacityForCount(count: number): number {
	if (count >= 3) return MAX_OPACITY;
	return OPACITY_MAP[count] ?? 0;
}

/**
 * Sweep line algorithm: compute coverage segments from lens intervals.
 * Returns sorted, non-overlapping segments with overlap count.
 */
export function computeCoverageSegments(
	lenses: Lens[],
	ffe: boolean
): CoverageSegment[] {
	if (lenses.length < 2) return [];

	const events: { focal: number; delta: number }[] = [];
	for (const lens of lenses) {
		const mult = ffe ? getFFMultiplier(lens.mountType) : 1;
		// Round to match getFocal() in FocalMap.svelte — without this,
		// heatmap boundaries are at slightly different positions than lens bars
		let min = Math.round(lens.minFocalLength * mult);
		let max = Math.round(lens.maxFocalLength * mult);

		// Primes: expand to a small range so sweep line produces a segment
		if (min === max) {
			min -= PRIME_HALF_WIDTH;
			max += PRIME_HALF_WIDTH;
		}

		events.push({ focal: min, delta: 1 });
		events.push({ focal: max, delta: -1 });
	}

	// Sort by focal length, starts before ends at same position
	events.sort((a, b) => a.focal - b.focal || b.delta - a.delta);

	const segments: CoverageSegment[] = [];
	let count = 0;
	let prevFocal = events[0].focal;

	for (const event of events) {
		if (event.focal > prevFocal) {
			segments.push({
				focalStart: prevFocal,
				focalEnd: event.focal,
				count
			});
		}
		count += event.delta;
		prevFocal = event.focal;
	}

	return segments;
}

/**
 * Convert coverage segments to SVG gradient stops.
 * chartWidth is the total pixel width of the chart area — stop offsets
 * are normalized to 0-1 fractions since SVG <stop offset> is always 0-1
 * regardless of gradientUnits.
 */
export function segmentsToGradientStops(
	segments: CoverageSegment[],
	scaleFunc: (focal: number) => number,
	chartWidth: number
): GradientStop[] {
	if (segments.length === 0 || chartWidth <= 0) return [];

	const stops: GradientStop[] = [];
	const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		const startFrac = clamp01(scaleFunc(seg.focalStart) / chartWidth);
		const endFrac = clamp01(scaleFunc(seg.focalEnd) / chartWidth);
		const opacity = opacityForCount(seg.count);

		// Hard stop pairs: close previous opacity, open this opacity at same offset
		// This prevents gradient interpolation between segments with different counts
		const prevOpacity = i > 0 ? opacityForCount(segments[i - 1].count) : 0;
		if (i > 0 && prevOpacity !== opacity) {
			stops.push({ offset: startFrac, opacity: prevOpacity });
		}
		stops.push({ offset: startFrac, opacity });
		stops.push({ offset: endFrac, opacity });
	}

	return stops;
}

/**
 * Detect gaps (count === 0 regions) wider than minGapPx.
 * Returns x and width in chart-local pixel space (0 to chartWidth).
 */
export function detectGaps(
	segments: CoverageSegment[],
	scaleFunc: (focal: number) => number,
	minGapPx: number
): GapMarker[] {
	const gaps: GapMarker[] = [];

	for (const seg of segments) {
		if (seg.count === 0) {
			const x = scaleFunc(seg.focalStart);
			const width = scaleFunc(seg.focalEnd) - x;
			if (width >= minGapPx) {
				gaps.push({ x, width, focalStart: seg.focalStart, focalEnd: seg.focalEnd });
			}
		}
	}

	return gaps;
}
