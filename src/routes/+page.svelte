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
	import { getKitSlugs, toggleKitLens, mergeIntoKit } from '$lib/kit.svelte';
	import { getLensBySlug } from '$lib/data';
	import LensTable from '$lib/components/LensTable.svelte';
	import FocalMap from '$lib/components/FocalMap.svelte';
	import type { SortField, FilterState, Lens } from '$lib/types';

	let filters = $derived(browser ? parseFiltersFromURL(page.url.searchParams) : defaultFilters);
	let filteredLenses = $derived(applyFilters(allLenses, filters));
	let focalRange = $derived(
		filters.fmin !== null && filters.fmax !== null
			? { fmin: filters.fmin, fmax: filters.fmax }
			: null
	);
	let sortedLenses = $derived(
		sortLenses(filteredLenses, filters.sort, filters.sortDir, focalRange)
	);
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
		const sizeMap = new Map<number, { models: string[]; hasAdapter: boolean }>();
		for (const lens of kitLenses) {
			if (lens.filterDiameterMm > 0) {
				const entry = sizeMap.get(lens.filterDiameterMm) ?? { models: [], hasAdapter: false };
				entry.models.push(lens.model);
				if (lens.filterViaAdapter) entry.hasAdapter = true;
				sizeMap.set(lens.filterDiameterMm, entry);
			}
		}
		return [...sizeMap.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([size, { models, hasAdapter }]) => ({
				size,
				count: models.length,
				lenses: models,
				hasAdapter
			}));
	});

	// --- Shared kit ---
	let sharedKitParam = $derived(browser ? page.url.searchParams.get('skit') : null);
	let sharedKitLenses = $derived.by((): Lens[] => {
		if (!sharedKitParam) return [];
		const slugs = sharedKitParam.split(',').filter(Boolean);
		const lenses: Lens[] = [];
		for (const slug of slugs) {
			const lens = getLensBySlug(slug);
			if (lens) lenses.push(lens);
		}
		return lenses;
	});
	let isSharedView = $derived(sharedKitLenses.length > 0);
	let sharedKitSorted = $derived(
		sortLenses(sharedKitLenses, filters.sort, filters.sortDir)
	);

	// Filter sizes for shared kit — same logic as own kit
	let sharedFilterSizes = $derived.by(() => {
		if (!isSharedView) return [];
		const sizeMap = new Map<number, { models: string[]; hasAdapter: boolean }>();
		for (const lens of sharedKitLenses) {
			if (lens.filterDiameterMm > 0) {
				const entry = sizeMap.get(lens.filterDiameterMm) ?? { models: [], hasAdapter: false };
				entry.models.push(lens.model);
				if (lens.filterViaAdapter) entry.hasAdapter = true;
				sizeMap.set(lens.filterDiameterMm, entry);
			}
		}
		return [...sizeMap.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([size, { models, hasAdapter }]) => ({
				size,
				count: models.length,
				lenses: models,
				hasAdapter
			}));
	});

	// Share button state
	let shareCopied = $state(false);
	let shareCopiedTimer: ReturnType<typeof setTimeout> | null = null;

	function handleShareKit() {
		if (!browser || kitLenses.length === 0) return;
		const slugs = kitLenses.map((l) => l.slug).join(',');
		const url = `${window.location.origin}?skit=${slugs}`;
		navigator.clipboard.writeText(url).then(() => {
			shareCopied = true;
			if (shareCopiedTimer) clearTimeout(shareCopiedTimer);
			shareCopiedTimer = setTimeout(() => {
				shareCopied = false;
			}, 2000);
		});
	}

	let importFeedback = $state('');
	let importFeedbackTimer: ReturnType<typeof setTimeout> | null = null;

	function handleImportSharedKit() {
		if (sharedKitLenses.length === 0) return;
		const slugs = sharedKitLenses.map((l) => l.slug);
		const added = mergeIntoKit(slugs);
		const already = slugs.length - added;
		if (added > 0 && already > 0) {
			importFeedback = `${added} ${added === 1 ? 'lens' : 'lenses'} added (${already} already in kit)`;
		} else if (added > 0) {
			importFeedback = `${added} ${added === 1 ? 'lens' : 'lenses'} added to your kit`;
		} else {
			importFeedback = 'All lenses already in your kit';
		}
		if (importFeedbackTimer) clearTimeout(importFeedbackTimer);
		importFeedbackTimer = setTimeout(() => {
			goto('?view=kit', { replaceState: true });
		}, 1500);
	}

	function dismissSharedKit() {
		goto('/', { replaceState: true });
	}

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

	// XF only for now — heatmap gaps are computed in XF space (FFE mult 1.5× when FFE on).
	// When FFE is on, gap focals are equiv mm; convert back to native before storing.
	function handleGapClick(gap: { focalStart: number; focalEnd: number }) {
		const mult = filters.ffe ? 1.5 : 1;
		const fmin = Math.round(gap.focalStart / mult);
		const fmax = Math.round(gap.focalEnd / mult);
		updateFilters({ fmin, fmax, view: 'table' });
	}

	function clearFocalRange() {
		updateFilters({ fmin: null, fmax: null });
	}

	let focalRangeLabel = $derived.by(() => {
		if (filters.fmin === null || filters.fmax === null) return '';
		if (filters.ffe) {
			return `${Math.round(filters.fmin * 1.5)}–${Math.round(filters.fmax * 1.5)}mm equiv`;
		}
		return `${filters.fmin}–${filters.fmax}mm`;
	});

	let pageTitle = $derived.by(() => {
		if (isSharedView) return 'Shared Kit';
		if (filters.view === 'kit') return 'My Kit';
		if (filters.view === 'map') return 'Focal Range Map';
		return 'Lens Inventory';
	});

	let pageSubtitle = $derived.by(() => {
		if (isSharedView) {
			return `${sharedKitLenses.length} ${sharedKitLenses.length === 1 ? 'lens' : 'lenses'}`;
		}
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

	// Split the subtitle so numeric runs render in mono + tabular-nums (result-count treatment).
	let subtitleSegments = $derived.by((): { text: string; mono: boolean }[] => {
		if (!pageSubtitle) return [];
		return pageSubtitle
			.split(/(\d+)/)
			.filter((part) => part !== '')
			.map((part) => ({ text: part, mono: /^\d+$/.test(part) }));
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

{#if !isSharedView && filters.view === 'kit' && kitLenses.length > 0}
	<div class="page-heading-row">
		<div>
			<h1 class="page-heading">{pageTitle}</h1>
			{#if pageSubtitle}
				<p class="page-subtitle">
					{#each subtitleSegments as seg}{#if seg.mono}<span class="result-num">{seg.text}</span>{:else}{seg.text}{/if}{/each}
				</p>
			{/if}
		</div>
		<button class="share-btn" onclick={handleShareKit}>
			{#if shareCopied}
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				Link copied!
			{:else}
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M5 9.5a2.5 2.5 0 0 1 0-5h1M9 4.5a2.5 2.5 0 0 1 0 5H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
					<path d="M4.5 7h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
				</svg>
				Share kit
			{/if}
		</button>
	</div>
{:else}
	<h1 class="page-heading">{pageTitle}</h1>
	{#if pageSubtitle}
		<p class="page-subtitle">
			{#each subtitleSegments as seg}{#if seg.mono}<span class="result-num">{seg.text}</span>{:else}{seg.text}{/if}{/each}
		</p>
	{/if}
{/if}

{#if isSharedView}
	<!-- Shared kit view -->
	<div class="shared-banner">
		<div class="shared-banner-text">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="shared-banner-icon">
				<path d="M4 8h8M8 4v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				<rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5" />
			</svg>
			<span>Someone shared this kit with you</span>
		</div>
		<div class="shared-banner-actions">
			{#if importFeedback}
				<span class="shared-feedback">{importFeedback}</span>
			{:else}
				<button class="shared-btn primary" onclick={handleImportSharedKit}>
					Add all to my kit
				</button>
			{/if}
			<button class="shared-btn dismiss" onclick={dismissSharedKit} aria-label="Dismiss shared kit">
				Dismiss
			</button>
		</div>
	</div>

	{#if sharedKitLenses.length >= 2}
		<section class="kit-section">
			<h2 class="section-heading">Focal Coverage</h2>
			<FocalMap
				lenses={sharedKitSorted}
				scale={filters.scale}
				ffe={filters.ffe}
				{kitSlugs}
				onToggleKit={handleToggleKit}
				showHeatmap={true}
			/>
		</section>
	{/if}

	{#if sharedFilterSizes.length > 0}
		<section class="kit-section">
			<h2 class="section-heading">Filter Sizes</h2>
			<div class="filter-sizes">
				{#each sharedFilterSizes as { size, count, lenses: sizeLenses, hasAdapter } (size)}
					<div class="filter-size-chip" title={sizeLenses.join(', ')}>
						<span class="filter-size-value"
							>&oslash;{size}mm{#if hasAdapter}<span class="filter-size-asterisk">*</span>{/if}</span
						>
						<span class="filter-size-count">{count} {count === 1 ? 'lens' : 'lenses'}</span>
					</div>
				{/each}
			</div>
			{#if sharedFilterSizes.some((s) => s.hasAdapter)}
				<p class="filter-size-footnote">
					*Includes a lens that accepts this size only via an adapter, not a native front thread.
				</p>
			{/if}
		</section>
	{/if}

	<section class="kit-section">
		<h2 class="section-heading">Lenses</h2>
		<LensTable
			lenses={sharedKitSorted}
			sort={filters.sort}
			sortDir={filters.sortDir}
			ffe={filters.ffe}
			{kitSlugs}
			onSort={handleSort}
			onToggleKit={handleToggleKit}
		/>
	</section>
{:else}
	<!-- Normal views -->
	{#if filters.view !== 'kit' && focalRange}
		<div class="active-chips">
			<button class="active-chip" onclick={clearFocalRange} aria-label="Clear focal range filter">
				<span class="active-chip-label">Focal {focalRangeLabel}</span>
				<span class="active-chip-x" aria-hidden="true">×</span>
			</button>
		</div>
	{/if}

	{#if filters.view === 'kit'}
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
					<p class="empty-hint">Add lenses from the Table or Map to map your focal coverage and spot the gaps.</p>
				</div>
			</div>
		{:else}
			<section class="kit-section">
				<h2 class="section-heading">Focal Coverage</h2>
				<FocalMap
					lenses={kitLenses}
					scale={filters.scale}
					ffe={filters.ffe}
					{kitSlugs}
					onToggleKit={handleToggleKit}
					showHeatmap={true}
					onGapClick={handleGapClick}
				/>
				{#if kitLenses.length >= 2}
					<p class="gap-hint">Click a hatched region to browse lenses that cover the gap.</p>
				{/if}
			</section>

			{#if kitFilterSizes.length > 0}
				<section class="kit-section">
					<h2 class="section-heading">Filter Sizes</h2>
					<div class="filter-sizes">
						{#each kitFilterSizes as { size, count, lenses: sizeLenses, hasAdapter } (size)}
							<div class="filter-size-chip" title={sizeLenses.join(', ')}>
								<span class="filter-size-value"
									>&oslash;{size}mm{#if hasAdapter}<span class="filter-size-asterisk"
											>*</span
										>{/if}</span
								>
								<span class="filter-size-count">{count} {count === 1 ? 'lens' : 'lenses'}</span>
							</div>
						{/each}
					</div>
					{#if kitFilterSizes.some((s) => s.hasAdapter)}
						<p class="filter-size-footnote">
							*Includes a lens that accepts this size only via an adapter, not a native front thread.
						</p>
					{/if}
				</section>
			{/if}

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
{/if}

<style>
	.page-heading-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.page-heading-row .page-heading {
		margin-bottom: var(--space-1);
	}

	.page-heading-row .page-subtitle {
		margin-bottom: 0;
	}

	.page-heading {
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-2xl) * var(--font-scale, 1));
		color: var(--text-primary);
		margin: 0 0 var(--space-1) 0;
	}

	.page-subtitle {
		font-family: var(--font-sans);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-muted);
		margin: 0 0 var(--space-6) 0;
	}

	.page-subtitle .result-num {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.active-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: 0 0 var(--space-4) 0;
		position: relative;
		z-index: 6;
	}

	.active-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: 6px var(--space-2) 6px 14px;
		border-radius: var(--radius-full);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
		color: var(--accent);
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		font-weight: var(--weight-medium);
		cursor: pointer;
		min-height: 34px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.active-chip {
			transition:
				background var(--dur-fast) var(--ease-out),
				border-color var(--dur-fast) var(--ease-out);
		}
	}

	.active-chip:hover,
	.active-chip:focus-visible {
		background: color-mix(in srgb, var(--accent) 20%, transparent);
		border-color: color-mix(in srgb, var(--accent) 50%, transparent);
	}

	.active-chip:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.active-chip-x {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		line-height: 1;
		background: color-mix(in srgb, var(--accent) 25%, transparent);
	}


	@media (max-width: 1023px) {
		.page-subtitle {
			padding-bottom: var(--space-4);
			border-bottom: 1px solid var(--border-subtle);
		}
	}

	/* Table legend */
	.table-legend {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		padding: var(--space-3) 0;
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	.legend-badge {
		display: inline-block;
		padding: 1px 6px;
		border-radius: var(--radius-xs);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-2xs) * var(--font-scale, 1));
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

	/* Filter sizes — My Kit coverage cards */
	.filter-sizes {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.filter-size-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		cursor: default;
	}

	@media (prefers-reduced-motion: no-preference) {
		.filter-size-chip {
			transition:
				border-color var(--dur-fast) var(--ease-out),
				background var(--dur-fast) var(--ease-out);
		}
	}

	.filter-size-chip:hover {
		border-color: var(--accent);
		background: var(--bg-elevated);
	}

	.filter-size-value {
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		color: var(--text-primary);
	}

	.filter-size-count {
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	.gap-hint {
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
		margin: var(--space-2) 0 0 0;
	}

	.filter-size-asterisk {
		color: var(--text-muted);
		margin-left: 1px;
	}

	.filter-size-footnote {
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
		margin-top: 10px;
		line-height: 1.5;
	}

	/* Shared kit banner */
	.shared-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
		margin-bottom: var(--space-6);
	}

	.shared-banner-text {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-sans);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		font-weight: var(--weight-medium);
		color: var(--text-primary);
	}

	.shared-banner-icon {
		color: var(--accent);
		flex-shrink: 0;
	}

	.shared-banner-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.shared-btn {
		padding: 6px 14px;
		border-radius: var(--radius-md);
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		font-weight: var(--weight-medium);
		cursor: pointer;
		border: none;
		white-space: nowrap;
	}

	.shared-btn.primary {
		background: var(--accent);
		color: var(--bg-base);
	}

	@media (prefers-reduced-motion: no-preference) {
		.shared-btn {
			transition:
				opacity var(--dur-fast) var(--ease-out),
				background var(--dur-fast) var(--ease-out);
		}
	}

	.shared-btn.primary:hover {
		opacity: 0.9;
	}

	.shared-btn.primary:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.shared-btn.dismiss {
		background: transparent;
		color: var(--text-muted);
	}

	.shared-btn.dismiss:hover {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--text-muted) 10%, transparent);
	}

	.shared-btn.dismiss:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.shared-feedback {
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		font-weight: var(--weight-medium);
		color: var(--kit);
	}

	@media (max-width: 1023px) {
		.shared-banner {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* Share button (Kit view header) */
	.share-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-default);
		background: transparent;
		color: var(--text-secondary);
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		font-weight: var(--weight-medium);
		cursor: pointer;
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: no-preference) {
		.share-btn {
			transition:
				color var(--dur-fast) var(--ease-out),
				border-color var(--dur-fast) var(--ease-out),
				background var(--dur-fast) var(--ease-out);
		}
	}

	.share-btn:hover {
		color: var(--text-primary);
		border-color: var(--text-muted);
		background: var(--bg-elevated);
	}

	.share-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Kit sections */
	.kit-section {
		margin-bottom: 36px;
	}

	.section-heading {
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-lg) * var(--font-scale, 1));
		color: var(--text-secondary);
		margin: 0 0 var(--space-4) 0;
	}

	/* Empty states */
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-16) 0;
	}

	.empty-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		max-width: 320px;
		text-align: center;
	}

	.empty-icon {
		color: var(--text-faint);
		margin-bottom: var(--space-1);
	}

	.empty-title {
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-lg) * var(--font-scale, 1));
		color: var(--text-primary);
		margin: 0;
	}

	.empty-hint {
		font-family: var(--font-sans);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
	}
</style>
