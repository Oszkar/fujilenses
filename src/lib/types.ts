export interface Lens {
	slug: string;
	manufacturer: string;
	model: string;
	mountType: 'XF' | 'XC' | 'GF';
	lensType: 'Prime' | 'Zoom';
	minFocalLength: number;
	maxFocalLength: number;
	maxAperture: number;
	imageStabilization: boolean;
	weatherResistant: boolean;
	apertureRing: boolean;
	autofocus: boolean;
	linearMotor: boolean;
	releaseYear: number;
	weightGrams: number;
	filterDiameterMm: number;
	filterViaAdapter?: boolean;
	reviews?: { videoId: string; title: string; channel: string }[];
	approxPriceUSD: number;
	priceUpdatedYear: number;
	retailerUrl: string;
}

export type ViewMode = 'table' | 'map' | 'kit';

export type SortField = 'minFocalLength' | 'maxAperture' | 'weightGrams' | 'releaseYear';

export type SortDirection = 'asc' | 'desc';

export type ScaleType = 'log' | 'linear';

export interface FilterState {
	view: ViewMode;
	type: 'prime' | 'zoom' | null;
	mount: 'xf' | 'xc' | 'gf' | null;
	mfr: string[];
	ap: number | null;
	wr: boolean;
	ois: boolean;
	ar: boolean;
	af: boolean;
	ffe: boolean;
	fmin: number | null;
	fmax: number | null;
	sort: SortField;
	sortDir: SortDirection;
	scale: ScaleType;
}
