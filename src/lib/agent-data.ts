import { apertureDisplay } from './aperture';
import { focalDisplay } from './format';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './seo';
import type { Lens } from './types';

/**
 * Machine-readable dataset served at /lenses.json. Spec fields only: price, retailer and
 * review fields are omitted (prices are unpopulated and would mislead).
 */
export function lensesDataset(lenses: Lens[]) {
	return {
		name: `${SITE_NAME} — Fujifilm X-mount lens dataset`,
		source: SITE_URL,
		count: lenses.length,
		lenses: lenses.map((lens) => ({
			slug: lens.slug,
			url: `${SITE_URL}/lens/${lens.slug}`,
			manufacturer: lens.manufacturer,
			model: lens.model,
			mount: lens.mountType,
			lensType: lens.lensType,
			minFocalLengthMm: lens.minFocalLength,
			maxFocalLengthMm: lens.maxFocalLength,
			maxAperture: lens.maxAperture,
			apertureDisplay: apertureDisplay(lens),
			imageStabilization: lens.imageStabilization,
			weatherResistant: lens.weatherResistant,
			apertureRing: lens.apertureRing,
			autofocus: lens.autofocus,
			linearMotor: lens.linearMotor,
			releaseYear: lens.releaseYear,
			weightGrams: lens.weightGrams,
			filterDiameterMm: lens.filterDiameterMm
		}))
	};
}

/** Plain-text/markdown index for LLM agents, served at /llms.txt (see llmstxt.org). */
export function llmsTxt(lenses: Lens[]): string {
	const byMfr = new Map<string, Lens[]>();
	for (const lens of lenses) {
		byMfr.set(lens.manufacturer, [...(byMfr.get(lens.manufacturer) ?? []), lens]);
	}

	const sections = [...byMfr.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([mfr, list]) => {
			const lines = [...list]
				.sort((a, b) => a.minFocalLength - b.minFocalLength || a.model.localeCompare(b.model))
				.map(
					(l) =>
						`- [${l.model}](${SITE_URL}/lens/${l.slug}): ${focalDisplay(l)} ${apertureDisplay(l)} ${l.lensType.toLowerCase()}, ${l.releaseYear}`
				);
			return `## ${mfr}\n\n${lines.join('\n')}`;
		});

	return `# ${SITE_NAME}

> ${SITE_DESCRIPTION} A static catalogue of ${lenses.length} lenses with specs (focal length, aperture, weight, weather resistance, stabilization, release year) for comparing lenses and planning a kit. No prices or reviews are included.

## Data

- [Full dataset (JSON)](${SITE_URL}/lenses.json): every lens with all spec fields, one object per lens
- [Sitemap](${SITE_URL}/sitemap.xml): all pages

${sections.join('\n\n')}
`;
}
