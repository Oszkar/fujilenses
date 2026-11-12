import { allLenses } from '$lib/data';
import { lensesDataset } from '$lib/agent-data';

export const prerender = true;

export function GET() {
	return new Response(JSON.stringify(lensesDataset(allLenses), null, 2), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' }
	});
}
