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
	linearMotor: boolean;
	releaseYear: number;
	weightGrams: number;
	approxPriceUSD: number;
	priceUpdatedYear: number;
	retailerUrl: string;
}

export type ViewMode = 'table' | 'map' | 'kit';

export type SortField = 'minFocalLength' | 'maxAperture' | 'weightGrams' | 'releaseYear';

export type SortDirection = 'asc' | 'desc';

export interface FilterState {
	view: ViewMode;
	type: 'prime' | 'zoom' | null;
	mount: 'xf' | 'xc' | 'gf' | null;
	mfr: string[];
	ap: number | null;
	wr: boolean;
	ois: boolean;
	ar: boolean;
	ffe: boolean;
	sort: SortField;
	sortDir: SortDirection;
}
