import { apertureDisplay } from './aperture';
import { focalDisplay } from './format';
import type { Lens } from './types';

export const SITE_URL = 'https://fujilenses.com';
export const SITE_NAME = 'FujiLenses';
export const SITE_DESCRIPTION =
	'Browse and compare Fujifilm X-mount lenses — Fujinon, Sigma, Viltrox, Tamron and more.';

function mountPhrase(mount: Lens['mountType']): string {
	return mount === 'GF' ? 'Fujifilm GF-mount (medium format)' : 'Fujifilm X-mount';
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Single-sentence summary used for <meta description>, og and twitter descriptions. */
export function lensDescription(lens: Lens): string {
	const kind = lens.lensType === 'Zoom' ? 'zoom' : 'prime';
	const features = [
		lens.weatherResistant && 'weather-resistant',
		lens.imageStabilization && 'OIS',
		lens.apertureRing && 'aperture ring',
		!lens.autofocus && 'manual focus'
	].filter(Boolean) as string[];
	const featureText = features.length ? ` ${capitalize(features.join(', '))}.` : '';
	return (
		`${lens.manufacturer} ${lens.model} — ${focalDisplay(lens)} ${apertureDisplay(lens)} ` +
		`${kind} lens for ${mountPhrase(lens.mountType)}.${featureText} ` +
		`${lens.weightGrams}g, released ${lens.releaseYear}.`
	);
}

type JsonLd = Record<string, unknown>;

function property(name: string, value: string | number | boolean, unitText?: string): JsonLd {
	return {
		'@type': 'PropertyValue',
		name,
		value,
		...(unitText ? { unitText } : {})
	};
}

/**
 * schema.org Product for a lens. Deliberately no `offers`/`aggregateRating`: we have no
 * reliable price data or reviews, and fabricating them violates structured-data guidelines.
 */
export function lensJsonLd(lens: Lens): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		'@id': `${SITE_URL}/lens/${lens.slug}#product`,
		url: `${SITE_URL}/lens/${lens.slug}`,
		name: `${lens.manufacturer} ${lens.model}`,
		description: lensDescription(lens),
		brand: { '@type': 'Brand', name: lens.manufacturer },
		category: 'Camera Lenses',
		releaseDate: String(lens.releaseYear),
		weight: { '@type': 'QuantitativeValue', value: lens.weightGrams, unitCode: 'GRM' },
		additionalProperty: [
			property('Mount', lens.mountType === 'GF' ? 'Fujifilm GF' : 'Fujifilm X'),
			property('Lens type', lens.lensType),
			property('Focal length', focalDisplay(lens)),
			property('Maximum aperture', apertureDisplay(lens)),
			property('Weather resistant', lens.weatherResistant),
			property('Optical image stabilization', lens.imageStabilization),
			property('Aperture ring', lens.apertureRing),
			property('Autofocus', lens.autofocus),
			property('Filter diameter', lens.filterDiameterMm, 'mm')
		]
	};
}

export function homeJsonLd(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				url: SITE_URL,
				name: SITE_NAME,
				description: SITE_DESCRIPTION,
				inLanguage: 'en'
			}
		]
	};
}

/**
 * Serialize for inlining in a <script type="application/ld+json"> tag. Escapes `<` so that
 * data containing `</script>` or `<!--` cannot break out of the script element.
 */
export function serializeJsonLd(data: JsonLd): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Full <script> tag markup, for use with {@html} inside <svelte:head>. */
export function jsonLdScript(data: JsonLd): string {
	return `<script type="application/ld+json">${serializeJsonLd(data)}</script>`;
}
