import { describe, it, expect } from 'vitest';
import { computeCoverageSegments, segmentsToGradientStops, detectGaps } from './coverage';
import type { Lens } from './types';

function makeLens(overrides: Partial<Lens> = {}): Lens {
	return {
		slug: 'test',
		manufacturer: 'Fujinon',
		model: 'Test',
		mountType: 'XF',
		lensType: 'Prime',
		minFocalLength: 35,
		maxFocalLength: 35,
		maxAperture: 1.4,
		imageStabilization: false,
		weatherResistant: false,
		apertureRing: false,
		autofocus: true,
		linearMotor: false,
		releaseYear: 2024,
		weightGrams: 200,
		filterDiameterMm: 52,
		approxPriceUSD: 0,
		priceUpdatedYear: 0,
		retailerUrl: '',
		...overrides
	};
}

describe('computeCoverageSegments', () => {
	it('returns empty for fewer than 2 lenses', () => {
		expect(computeCoverageSegments([makeLens()], false)).toEqual([]);
	});

	it('returns empty for 0 lenses', () => {
		expect(computeCoverageSegments([], false)).toEqual([]);
	});

	it('produces segments for primes via artificial range expansion', () => {
		const lenses = [
			makeLens({ minFocalLength: 23, maxFocalLength: 23 }),
			makeLens({ minFocalLength: 50, maxFocalLength: 50 })
		];
		const segments = computeCoverageSegments(lenses, false);

		// Primes get ±0.5mm range, so: 22.5-23.5 (count 1), 23.5-49.5 (count 0), 49.5-50.5 (count 1)
		const covered = segments.filter((s) => s.count > 0);
		const gaps = segments.filter((s) => s.count === 0);
		expect(covered.length).toBeGreaterThanOrEqual(2);
		expect(gaps.length).toBeGreaterThanOrEqual(1);
	});

	it('computes overlapping zooms with varying counts', () => {
		const lenses = [
			makeLens({ lensType: 'Zoom', minFocalLength: 18, maxFocalLength: 55 }),
			makeLens({ lensType: 'Zoom', minFocalLength: 35, maxFocalLength: 100 })
		];
		const segments = computeCoverageSegments(lenses, false);

		const overlap = segments.find((s) => s.count === 2);
		expect(overlap).toBeDefined();
		expect(overlap!.focalStart).toBe(35);
		expect(overlap!.focalEnd).toBe(55);

		const single = segments.filter((s) => s.count === 1);
		expect(single.length).toBe(2); // 18-35 and 55-100
	});

	it('counts 3+ overlapping lenses', () => {
		const lenses = [
			makeLens({ lensType: 'Zoom', minFocalLength: 20, maxFocalLength: 50 }),
			makeLens({ lensType: 'Zoom', minFocalLength: 20, maxFocalLength: 50 }),
			makeLens({ lensType: 'Zoom', minFocalLength: 20, maxFocalLength: 50 })
		];
		const segments = computeCoverageSegments(lenses, false);

		const dense = segments.find((s) => s.count >= 3);
		expect(dense).toBeDefined();
	});

	it('applies FF equivalent multiplier', () => {
		const lenses = [
			makeLens({ minFocalLength: 23, maxFocalLength: 23 }),
			makeLens({ minFocalLength: 35, maxFocalLength: 35 })
		];
		const segments = computeCoverageSegments(lenses, true);

		// XF mount: 1.5x → round(23*1.5)=35, round(35*1.5)=53
		// Primes get ±0.5: 34.5-35.5 and 52.5-53.5, gap is 35.5-52.5
		const gap = segments.find((s) => s.count === 0);
		expect(gap).toBeDefined();
		expect(gap!.focalStart).toBeCloseTo(35.5, 1);
		expect(gap!.focalEnd).toBeCloseTo(52.5, 1);
	});
});

describe('segmentsToGradientStops', () => {
	it('returns empty for no segments', () => {
		expect(segmentsToGradientStops([], (x) => x, 100)).toEqual([]);
	});

	it('produces 0-1 fractional offsets', () => {
		const segments = [{ focalStart: 10, focalEnd: 50, count: 1 }];
		// scale returns 0-100 range, chartWidth is 100
		const scale = (x: number) => x;
		const stops = segmentsToGradientStops(segments, scale, 100);

		expect(stops[0].offset).toBe(0.1); // 10/100
		expect(stops[1].offset).toBe(0.5); // 50/100
	});

	it('clamps offsets to 0-1', () => {
		const segments = [{ focalStart: -10, focalEnd: 200, count: 1 }];
		const scale = (x: number) => x;
		const stops = segmentsToGradientStops(segments, scale, 100);

		expect(stops[0].offset).toBe(0);
		expect(stops[1].offset).toBe(1);
	});

	it('assigns correct opacity with hard stops at boundaries', () => {
		const segments = [
			{ focalStart: 10, focalEnd: 30, count: 1 },
			{ focalStart: 30, focalEnd: 50, count: 2 }
		];
		const stops = segmentsToGradientStops(segments, (x) => x, 100);

		// Segment 1: start=0.15, end=0.15
		expect(stops[0].opacity).toBe(0.15);
		expect(stops[1].opacity).toBe(0.15);
		// Hard stop pair at boundary: close prev (0.15), open next (0.30)
		expect(stops[2].opacity).toBe(0.15); // closing prev segment
		expect(stops[3].opacity).toBe(0.30); // opening next segment
		expect(stops[4].opacity).toBe(0.30); // end of segment 2
	});
});

describe('detectGaps', () => {
	it('returns gaps wider than threshold', () => {
		const segments = [
			{ focalStart: 23, focalEnd: 50, count: 0 },
			{ focalStart: 50, focalEnd: 100, count: 1 }
		];
		const scale = (x: number) => x * 5;
		const gaps = detectGaps(segments, scale, 40);

		expect(gaps).toHaveLength(1);
		expect(gaps[0].x).toBe(115); // 23*5
		expect(gaps[0].width).toBe(135); // (50-23)*5
	});

	it('skips narrow gaps', () => {
		const segments = [{ focalStart: 23, focalEnd: 25, count: 0 }];
		const scale = (x: number) => x * 2;
		const gaps = detectGaps(segments, scale, 40);

		expect(gaps).toHaveLength(0);
	});
});
