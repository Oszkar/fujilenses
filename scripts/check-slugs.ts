/**
 * Build-time check: ensures no two lenses share the same slug.
 * Run via: npx tsx scripts/check-slugs.ts
 * Also runs automatically as a Vite plugin during `pnpm build`.
 */
import xfLenses from '../src/lib/data/xf-lenses.json';
import thirdPartyLenses from '../src/lib/data/third-party-lenses.json';

interface LensSlug {
	slug: string;
	model: string;
}

const allLenses: LensSlug[] = [
	...(xfLenses as LensSlug[]),
	...(thirdPartyLenses as LensSlug[])
];

const seen = new Map<string, string>();
const duplicates: string[] = [];

for (const lens of allLenses) {
	if (seen.has(lens.slug)) {
		duplicates.push(`Duplicate slug "${lens.slug}": "${seen.get(lens.slug)}" and "${lens.model}"`);
	}
	seen.set(lens.slug, lens.model);
}

if (duplicates.length > 0) {
	console.error('Slug uniqueness check FAILED:');
	for (const d of duplicates) console.error(`  - ${d}`);
	process.exit(1);
} else {
	console.log(`Slug check passed: ${allLenses.length} lenses, all slugs unique.`);
}
