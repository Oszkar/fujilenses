import { allLenses } from '$lib/data';
import { llmsTxt } from '$lib/agent-data';

export const prerender = true;

export function GET() {
	return new Response(llmsTxt(allLenses), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
