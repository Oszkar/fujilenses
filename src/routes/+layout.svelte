<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import NavBar from '$lib/components/NavBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { allLenses } from '$lib/data';
	import { getKitCount } from '$lib/kit.svelte';
	import { parseFiltersFromURL, filtersToSearchParams, defaultFilters } from '$lib/filters';
	import { browser } from '$app/environment';
	import type { FilterState, ViewMode } from '$lib/types';

	let { children } = $props();

	let kitCount = $derived(getKitCount());

	let filters = $derived(browser ? parseFiltersFromURL(page.url.searchParams) : defaultFilters);

	function updateFilters(updates: Partial<FilterState>) {
		const next = { ...filters, ...updates };
		const params = filtersToSearchParams(next);
		const query = params.toString();
		goto(query ? `?${query}` : '/', { replaceState: true, noScroll: true, keepFocus: true });
	}

	function handleViewChange(view: ViewMode) {
		updateFilters({ view });
	}
</script>

<div class="app-shell">
	<NavBar activeView={filters.view} {kitCount} onViewChange={handleViewChange} />
	<div class="app-body">
		<Sidebar {filters} onFilterChange={updateFilters} />
		<main class="content">
			{@render children()}
		</main>
	</div>
	<Footer lensCount={allLenses.length} />
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.app-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.content {
		flex: 1;
		padding: 24px 36px;
		overflow-y: auto;
	}
</style>
