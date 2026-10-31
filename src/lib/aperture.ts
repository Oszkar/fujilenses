import type { Lens } from './types';


/** Model names retain the telephoto maximum aperture omitted by the numeric data field. */
export function telephotoAperture(lens: Lens): number {
	if (lens.lensType !== 'Zoom') return lens.maxAperture;
	const range = lens.model.match(/\bF\/?(\d+(?:\.\d+)?)[–-](\d+(?:\.\d+)?)/i);
	return range && Number(range[1]) === lens.maxAperture ? Number(range[2]) : lens.maxAperture;
}

export function apertureDisplay(lens: Lens): string {
	const tele = telephotoAperture(lens);
	return tele === lens.maxAperture ? `f/${lens.maxAperture}` : `f/${lens.maxAperture}–${tele}`;
}
