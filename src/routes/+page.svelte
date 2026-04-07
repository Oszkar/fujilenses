<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { allLenses } from '$lib/data';
	import {
		parseFiltersFromURL,
		applyFilters,
		sortLenses,
		filtersToSearchParams,
		defaultFilters
	} from '$lib/filters';
	import { getKitSlugs, toggleKitLens } from '$lib/kit.svelte';
	import LensTable from '$lib/components/LensTable.svelte';
	import FocalMap from '$lib/components/FocalMap.svelte';
	import type { SortField, FilterState } from '$lib/types';

	let filters = $derived(browser ? parseFiltersFromURL(page.url.searchParams) : defaultFilters);
	let filteredLenses = $derived(applyFilters(allLenses, filters));
	let sortedLenses = $derived(sortLenses(filteredLenses, filters.sort, filters.sortDir));
	let kitSlugs = $derived(getKitSlugs());

	// Kit view: filter all lenses to kit only, then apply sort
	let kitLenses = $derived(
		sortLenses(
			allLenses.filter((l) => kitSlugs.has(l.slug)),
			filters.sort,
			filters.sortDir
		)
	);

	// Filter sizes for kit view — distinct sizes sorted, with lens count per size
	let kitFilterSizes = $derived.by(() => {
		const sizeMap = new Map<number, string[]>();
		for (const lens of kitLenses) {
			if (lens.filterDiameterMm > 0) {
				const list = sizeMap.get(lens.filterDiameterMm) ?? [];
				list.push(lens.model);
				sizeMap.set(lens.filterDiameterMm, list);
			}
		}
		return [...sizeMap.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([size, lenses]) => ({ size, count: lenses.length, lenses }));
	});

	function updateFilters(updates: Partial<FilterState>) {
		const next = { ...filters, ...updates };
		const params = filtersToSearchParams(next);
		const query = params.toString();
		goto(query ? `?${query}` : '/', { replaceState: true, noScroll: true, keepFocus: true });
	}

	function handleSort(field: SortField) {
		if (filters.sort === field) {
			updateFilters({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
		} else {
			updateFilters({ sort: field, sortDir: 'asc' });
		}
	}

	function handleToggleKit(slug: string) {
		toggleKitLens(slug);
	}

	let pageTitle = $derived.by(() => {
		if (filters.view === 'kit') return 'My Kit';
		if (filters.view === 'map') return 'Focal Range Map';
		return 'Lens Inventory';
	});

	let pageSubtitle = $derived.by(() => {
		if (filters.view === 'kit') {
			if (kitLenses.length === 0) return '';
			return `${kitLenses.length} ${kitLenses.length === 1 ? 'lens' : 'lenses'} in your kit`;
		}
		const scaleLabel =
			filters.view === 'map'
				? `${filters.scale === 'log' ? 'Logarithmic' : 'Linear'} scale`
				: '';
		const countLabel =
			filteredLenses.length === allLenses.length
				? `${allLenses.length} lenses`
				: `${filteredLenses.length} of ${allLenses.length} lenses matching current filters`;
		return filters.view === 'map' ? `${scaleLabel} · ${countLabel}` : countLabel;
	});
</script>

<svelte:head>
	<title>FujiLenses — Fujifilm X-Mount Lens Explorer</title>
	<meta
		name="description"
		content="Browse and compare Fujifilm X-mount lenses — Fujinon, Sigma, Viltrox, Tamron and more."
	/>
	<link rel="canonical" href="https://fujilenses.com" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://fujilenses.com" />
	<meta property="og:title" content="FujiLenses — Fujifilm X-Mount Lens Explorer" />
	<meta
		property="og:description"
		content="Browse and compare Fujifilm X-mount lenses — Fujinon, Sigma, Viltrox, Tamron and more."
	/>
	<meta property="og:image" content="https://fujilenses.com/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<h1 class="page-heading">{pageTitle}</h1>
{#if pageSubtitle}
	<p class="page-subtitle">{pageSubtitle}</p>
{/if}

{#if filters.view === 'kit'}
	<!-- My Kit view -->
	{#if kitLenses.length === 0}
		<div class="empty-state">
			<div class="empty-content">
				<svg width="40" height="40" viewBox="0 0 40 40" fill="none" class="empty-icon">
					<rect x="6" y="10" width="28" height="22" rx="3" stroke="currentColor" stroke-width="1.5" />
					<path d="M14 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.5" />
					<line x1="20" y1="18" x2="20" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
					<line x1="16" y1="22" x2="24" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
				<p class="empty-title">Your kit is empty</p>
				<p class="empty-hint">Add lenses from the Table or Map view to track your gear and see focal coverage.</p>
			</div>
		</div>
	{:else}
		<!-- Focal coverage map -->
		<section class="kit-section">
			<h2 class="section-heading">Focal Coverage</h2>
			<FocalMap
				lenses={kitLenses}
				scale={filters.scale}
				ffe={filters.ffe}
				{kitSlugs}
				onToggleKit={handleToggleKit}
				showHeatmap={true}
			/>
		</section>

		<!-- Filter sizes -->
		{#if kitFilterSizes.length > 0}
			<section class="kit-section">
				<h2 class="section-heading">Filter Sizes</h2>
				<div class="filter-sizes">
					{#each kitFilterSizes as { size, count, lenses: sizeLenses } (size)}
						<div class="filter-size-chip" title={sizeLenses.join(', ')}>
							<span class="filter-size-value">&oslash;{size}mm</span>
							<span class="filter-size-count">{count} {count === 1 ? 'lens' : 'lenses'}</span>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Kit lens list -->
		<section class="kit-section">
			<h2 class="section-heading">Lenses</h2>
			<LensTable
				lenses={kitLenses}
				sort={filters.sort}
				sortDir={filters.sortDir}
				ffe={filters.ffe}
				{kitSlugs}
				onSort={handleSort}
				onToggleKit={handleToggleKit}
			/>
		</section>
	{/if}
{:else if filteredLenses.length === 0}
	<div class="empty-state">
		<p>No lenses match your filters</p>
	</div>
{:else if filters.view === 'map'}
	<FocalMap
		lenses={sortedLenses}
		scale={filters.scale}
		ffe={filters.ffe}
		{kitSlugs}
		onToggleKit={handleToggleKit}
	/>
{:else}
	<LensTable
		lenses={sortedLenses}
		sort={filters.sort}
		sortDir={filters.sortDir}
		ffe={filters.ffe}
		{kitSlugs}
		onSort={handleSort}
		onToggleKit={handleToggleKit}
	/>
	<div class="table-legend">
		<span class="legend-badge mf">MF</span> Manual Focus
		<span class="legend-sep">&middot;</span>
		<span class="legend-badge wr">WR</span> Weather Resistant
		<span class="legend-sep">&middot;</span>
		<span class="legend-badge feature">OIS</span> Optical Image Stabilization
		<span class="legend-sep">&middot;</span>
		<span class="legend-badge feature">LM</span> Linear Motor
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

	@media (max-width: 1023px) {
		.page-subtitle {
			padding-bottom: 16px;
			border-bottom: 1px solid var(--border-subtle);
		}
	}

	/* Table legend */
	.table-legend {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		padding: 12px 0;
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-muted);
	}

	.legend-badge {
		display: inline-block;
		padding: 1px 6px;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 10px;
		text-transform: uppercase;
	}

	.legend-badge.mf {
		color: var(--text-muted);
		background: color-mix(in srgb, var(--text-muted) 15%, transparent);
	}

	.legend-badge.wr {
		color: var(--spec-wr);
		background: color-mix(in srgb, var(--spec-wr) 15%, transparent);
	}

	.legend-badge.feature {
		color: var(--spec-feature);
		background: color-mix(in srgb, var(--spec-feature) 15%, transparent);
	}

	.legend-sep {
		opacity: 0.4;
	}

	/* Filter sizes */
	.filter-sizes {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.filter-size-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 16px;
		border-radius: 8px;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		cursor: default;
	}

	.filter-size-value {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 14px;
		color: var(--text-primary);
	}

	.filter-size-count {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-muted);
	}

	/* Kit sections */
	.kit-section {
		margin-bottom: 36px;
	}

	.section-heading {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 15px;
		color: var(--text-secondary);
		margin: 0 0 16px 0;
	}

	/* Empty states */
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 0;
	}

	.empty-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		max-width: 320px;
		text-align: center;
	}

	.empty-icon {
		color: var(--text-faint);
		margin-bottom: 4px;
	}

	.empty-title {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		color: var(--text-primary);
		margin: 0;
	}

	.empty-hint {
		font-family: var(--font-sans);
		font-size: 13px;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
	}
</style>
