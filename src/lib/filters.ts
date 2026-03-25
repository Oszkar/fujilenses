import type { Lens, FilterState } from '$lib/types';

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
		return true;
	});
}

export function parseFiltersFromURL(params: URLSearchParams): FilterState {
	return {
		view: (params.get('view') as FilterState['view']) || 'table',
		type: (params.get('type') as FilterState['type']) || null,
		mount: (params.get('mount') as FilterState['mount']) || null,
		mfr: params.get('mfr')?.split(',').filter(Boolean) || [],
		ap: params.has('ap') ? Number(params.get('ap')) : null,
		wr: params.get('wr') === 'true',
		ois: params.get('ois') === 'true',
		ar: params.get('ar') === 'true',
		ffe: params.get('ffe') === 'true'
	};
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
	if (filters.ffe) params.set('ffe', 'true');
	return params;
}
