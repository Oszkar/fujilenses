import { allLenses } from '$lib/data';

const SITE_URL = 'https://fujilenses.vercel.app';

export const prerender = true;

export function GET() {
	const pages = [
		'',
		...allLenses.map((lens) => `/lens/${lens.slug}`)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
