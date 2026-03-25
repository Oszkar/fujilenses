<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { allLenses } from '$lib/data';
	import { parseFiltersFromURL, applyFilters, defaultFilters } from '$lib/filters';

	let filters = $derived(browser ? parseFiltersFromURL(page.url.searchParams) : defaultFilters);
	let filteredLenses = $derived(applyFilters(allLenses, filters));
</script>

<svelte:head>
	<title>FujiLenses — Fujifilm X-Mount Lens Explorer</title>
	<meta
		name="description"
		content="Browse and compare Fujifilm X-mount lenses — Fujinon, Sigma, Viltrox, Tamron and more."
	/>
</svelte:head>

<h1 class="page-heading">Lens Inventory</h1>
<p class="page-subtitle">
	{#if filteredLenses.length === allLenses.length}
		{allLenses.length} lenses
	{:else}
		{filteredLenses.length} of {allLenses.length} lenses matching current filters
	{/if}
</p>

{#if filteredLenses.length === 0}
	<div class="empty-state">
		<p>No lenses match your filters</p>
	</div>
{/if}

<style>
	.page-heading {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 22px;
		color: var(--text-primary);
		margin: 0 0 4px 0;
	}

	.page-subtitle {
		font-family: var(--font-sans);
		font-size: 13px;
		color: var(--text-muted);
		margin: 0 0 24px 0;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48px 0;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--text-muted);
	}
</style>
