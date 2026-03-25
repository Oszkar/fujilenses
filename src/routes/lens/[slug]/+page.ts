import { error } from '@sveltejs/kit';
import { allLenses, getLensBySlug } from '$lib/data';
import type { PageLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return allLenses.map((lens) => ({ slug: lens.slug }));
};

export const load: PageLoad = ({ params }) => {
	const lens = getLensBySlug(params.slug);
	if (!lens) error(404, 'Lens not found');
	return { lens };
};
