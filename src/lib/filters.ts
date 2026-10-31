import { telephotoAperture } from './aperture';
import type { Lens, FilterState, SortField, SortDirection, ScaleType } from '$lib/types';

export const defaultFilters: FilterState = {
	view: 'table',
	type: null,
	mount: null,
	mfr: [],
	ap: null,
	wr: false,
	ois: false,
	ar: false,
	af: false,
	ffe: false,
	fmin: null,
	fmax: null,
	sort: 'minFocalLength',
	sortDir: 'asc',
	scale: 'log'
};

const FF_MULTIPLIER_XF = 1.5;
const FF_MULTIPLIER_GF = 0.79;

export function getFFMultiplier(mountType: Lens['mountType']): number {
	return mountType === 'GF' ? FF_MULTIPLIER_GF : FF_MULTIPLIER_XF;
}

export function applyFilters(lenses: Lens[], filters: FilterState): Lens[] {
	return lenses.filter((lens) => {
		if (filters.type && lens.lensType.toLowerCase() !== filters.type) return false;
		if (filters.mount && lens.mountType.toLowerCase() !== filters.mount) return false;
		if (filters.mfr.length > 0 && !filters.mfr.includes(lens.manufacturer.toLowerCase()))
			return false;
		if (filters.ap !== null && lens.maxAperture > filters.ap) return false;
		if (filters.wr && !lens.weatherResistant) return false;
		if (filters.ois && !lens.imageStabilization) return false;
		if (filters.ar && !lens.apertureRing) return false;
		if (filters.af && !lens.autofocus) return false;
		if (filters.fmin !== null && lens.maxFocalLength < filters.fmin) return false;
		if (filters.fmax !== null && lens.minFocalLength > filters.fmax) return false;
		return true;
	});
}

/**
 * Score how well a lens fills a focal-range window. Used as the primary
 * sort key when fmin/fmax is active, so "best-fit" results appear first.
 * Primes inside the range score gapWidth (tied with zooms that fully cover).
 */
export function overlapScore(lens: Lens, fmin: number, fmax: number): number {
	const gapWidth = Math.max(0, fmax - fmin);
	if (lens.minFocalLength === lens.maxFocalLength) {
		return lens.minFocalLength >= fmin && lens.minFocalLength <= fmax ? gapWidth : 0;
	}
	const overlapStart = Math.max(lens.minFocalLength, fmin);
	const overlapEnd = Math.min(lens.maxFocalLength, fmax);
	return Math.max(0, overlapEnd - overlapStart);
}

export function sortLenses(
	lenses: Lens[],
	field: SortField,
	dir: SortDirection,
	focalRange?: { fmin: number; fmax: number } | null
): Lens[] {
	const directional = (a: number, b: number) => (dir === 'asc' ? a - b : b - a);
	return [...lenses].sort((a, b) => {
		if (focalRange) {
			const delta = overlapScore(b, focalRange.fmin, focalRange.fmax) - overlapScore(a, focalRange.fmin, focalRange.fmax);
			if (delta !== 0) return delta;
		}
		const delta = directional(a[field], b[field]);
		if (delta !== 0 || field !== 'maxAperture') return delta;
		return directional(telephotoAperture(a), telephotoAperture(b));
	});
}

export function hasActiveFilters(filters: FilterState): boolean {
	return (
		filters.type !== null ||
		filters.mount !== null ||
		filters.mfr.length > 0 ||
		filters.ap !== null ||
		filters.wr ||
		filters.ois ||
		filters.ar ||
		filters.af ||
		filters.fmin !== null ||
		filters.fmax !== null
	);
}

const validSortFields: SortField[] = [
	'minFocalLength',
	'maxAperture',
	'weightGrams',
	'releaseYear'
];

export function parseFiltersFromURL(params: URLSearchParams): FilterState {
	const positiveNumber = (key: string): number | null => {
		const value = Number(params.get(key));
		return Number.isFinite(value) && value > 0 ? value : null;
	};
	const view = params.get('view');
	const type = params.get('type');
	const mount = params.get('mount');
	let fmin = positiveNumber('fmin');
	let fmax = positiveNumber('fmax');
	if (fmin !== null && fmax !== null && fmin > fmax) [fmin, fmax] = [fmax, fmin];
	const sortRaw = params.get('sort');
	const sort = validSortFields.includes(sortRaw as SortField)
		? (sortRaw as SortField)
		: 'minFocalLength';
	const sortDirRaw = params.get('sortDir');
	const sortDir: SortDirection = sortDirRaw === 'desc' ? 'desc' : 'asc';
	const scaleRaw = params.get('scale');
	const scale: ScaleType = scaleRaw === 'linear' ? 'linear' : 'log';

	return {
		view: view === 'map' || view === 'kit' ? view : 'table',
		type: type === 'prime' || type === 'zoom' ? type : null,
		mount: mount === 'xf' || mount === 'xc' || mount === 'gf' ? mount : null,
		mfr: params.get('mfr')?.split(',').filter(Boolean) || [],
		ap: positiveNumber('ap'),
		wr: params.get('wr') === 'true',
		ois: params.get('ois') === 'true',
		ar: params.get('ar') === 'true',
		af: params.get('af') === 'true',
		ffe: params.get('ffe') === 'true',
		fmin,
		fmax,
		sort,
		sortDir,
		scale
	};
}

/** Catalog navigation always targets home; sorting can retain a shared kit. */
export function catalogHref(filters: FilterState, sharedKit: string | null = null): string {
	const params = filtersToSearchParams(filters);
	if (sharedKit) params.set('skit', sharedKit);
	const query = params.toString();
	return query ? `/?${query}` : '/';
}

export function parseSharedKit(value: string | null, lenses: Lens[]): Lens[] {
	const slugs = new Set(value?.split(',').filter(Boolean));
	return lenses.filter((lens) => slugs.has(lens.slug));
}

export function filtersToSearchParams(filters: FilterState): URLSearchParams {
	const params = new URLSearchParams();
	if (filters.view !== 'table') params.set('view', filters.view);
	if (filters.type) params.set('type', filters.type);
	if (filters.mount) params.set('mount', filters.mount);
	if (filters.mfr.length > 0) params.set('mfr', filters.mfr.join(','));
	if (filters.ap !== null) params.set('ap', String(filters.ap));
	if (filters.wr) params.set('wr', 'true');
	if (filters.ois) params.set('ois', 'true');
	if (filters.ar) params.set('ar', 'true');
	if (filters.af) params.set('af', 'true');
	if (filters.ffe) params.set('ffe', 'true');
	if (filters.fmin !== null) params.set('fmin', String(filters.fmin));
	if (filters.fmax !== null) params.set('fmax', String(filters.fmax));
	if (filters.sort !== 'minFocalLength') params.set('sort', filters.sort);
	if (filters.sortDir !== 'asc') params.set('sortDir', filters.sortDir);
	if (filters.scale !== 'log') params.set('scale', filters.scale);
	return params;
}
