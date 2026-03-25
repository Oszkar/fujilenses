<script lang="ts">
	import { getManufacturers, manufacturerColors, allLenses, getLensCountByManufacturer } from '$lib/data';
	import { hasActiveFilters } from '$lib/filters';
	import {
		getTheme,
		setTheme,
		getFontSize,
		setFontSize,
		type Theme,
		type FontSize
	} from '$lib/preferences.svelte';
	import type { FilterState } from '$lib/types';

	interface Props {
		filters: FilterState;
		onFilterChange: (updates: Partial<FilterState>) => void;
	}

	let { filters, onFilterChange }: Props = $props();

	const manufacturers = getManufacturers();
	const mfrCounts = getLensCountByManufacturer(allLenses);

	let isKitView = $derived(filters.view === 'kit');
	let filtersActive = $derived(hasActiveFilters(filters));

	function toggleManufacturer(mfr: string) {
		const key = mfr.toLowerCase();
		const current = filters.mfr;
		const next = current.includes(key) ? current.filter((m) => m !== key) : [...current, key];
		onFilterChange({ mfr: next });
	}

	function isManufacturerActive(mfr: string): boolean {
		return filters.mfr.length === 0 || filters.mfr.includes(mfr.toLowerCase());
	}

	function clearFilters() {
		onFilterChange({
			type: null,
			mount: null,
			mfr: [],
			ap: null,
			wr: false,
			ois: false,
			ar: false
		});
	}
</script>

<aside class="sidebar">
	<!-- Manufacturer -->
	<div class="section" class:disabled={isKitView}>
		<h3 class="section-header">Manufacturer</h3>
		<div class="mfr-list">
			{#each manufacturers as mfr (mfr)}
				<button
					class="mfr-item"
					class:active={filters.mfr.includes(mfr.toLowerCase())}
					class:dimmed={filters.mfr.length > 0 && !filters.mfr.includes(mfr.toLowerCase())}
					onclick={() => toggleManufacturer(mfr)}
				>
					<span
						class="mfr-dot"
						style="background: {manufacturerColors[mfr] ?? 'var(--text-muted)'};"
					></span>
					<span
						class="mfr-label"
						style="color: {isManufacturerActive(mfr)
							? manufacturerColors[mfr] ?? 'var(--text-primary)'
							: 'var(--text-faint)'};"
					>
						{mfr} <span class="mfr-count">({mfrCounts.get(mfr) ?? 0})</span>
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Lens Type -->
	<div class="section" class:disabled={isKitView}>
		<h3 class="section-header">Lens Type</h3>
		<div class="segmented">
			{#each [{ value: null, label: 'All' }, { value: 'prime', label: 'Prime' }, { value: 'zoom', label: 'Zoom' }] as opt (opt.label)}
				<button
					class="seg-btn"
					class:active={filters.type === opt.value}
					onclick={() => onFilterChange({ type: opt.value as FilterState['type'] })}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Features -->
	<div class="section" class:disabled={isKitView}>
		<h3 class="section-header">Features</h3>
		<div class="toggle-list">
			<label class="toggle-row">
				<span class="toggle-label">Weather Resistant</span>
				<input
					type="checkbox"
					class="toggle"
					checked={filters.wr}
					onchange={() => onFilterChange({ wr: !filters.wr })}
				/>
			</label>
			<label class="toggle-row">
				<span class="toggle-label">OIS</span>
				<input
					type="checkbox"
					class="toggle"
					checked={filters.ois}
					onchange={() => onFilterChange({ ois: !filters.ois })}
				/>
			</label>
			<label class="toggle-row">
				<span class="toggle-label">Aperture Ring</span>
				<input
					type="checkbox"
					class="toggle"
					checked={filters.ar}
					onchange={() => onFilterChange({ ar: !filters.ar })}
				/>
			</label>
		</div>
	</div>

	<!-- Display -->
	<div class="section" class:disabled={isKitView}>
		<h3 class="section-header">Display</h3>
		<div class="toggle-list">
			<label class="toggle-row">
				<span class="toggle-label">FF Equivalent</span>
				<input
					type="checkbox"
					class="toggle"
					checked={filters.ffe}
					onchange={() => onFilterChange({ ffe: !filters.ffe })}
				/>
			</label>
		</div>
	</div>

	{#if filters.view === 'map'}
		<!-- Scale (map only) -->
		<div class="section">
			<h3 class="section-header">Scale</h3>
			<div class="segmented">
				<button
					class="seg-btn"
					class:active={filters.scale === 'log'}
					onclick={() => onFilterChange({ scale: 'log' })}
				>
					Log
				</button>
				<button
					class="seg-btn"
					class:active={filters.scale === 'linear'}
					onclick={() => onFilterChange({ scale: 'linear' })}
				>
					Linear
				</button>
			</div>
		</div>

		<!-- Legend (map only) -->
		<div class="section">
			<h3 class="section-header">Legend</h3>
			<div class="legend">
				<div class="legend-item">
					<span class="legend-dot"></span>
					<span>Prime lens</span>
				</div>
				<div class="legend-item">
					<span class="legend-bar"></span>
					<span>Zoom range</span>
				</div>
				<div class="legend-item">
					<span class="legend-kit"></span>
					<span>In your kit</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Font Size -->
	<div class="section">
		<h3 class="section-header">Font Size</h3>
		<div class="segmented">
			{#each [{ value: 's', label: 'S' }, { value: 'm', label: 'M' }, { value: 'l', label: 'L' }] as opt (opt.value)}
				<button
					class="seg-btn"
					class:active={getFontSize() === opt.value}
					onclick={() => setFontSize(opt.value as FontSize)}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Theme -->
	<div class="section">
		<h3 class="section-header">Theme</h3>
		<div class="segmented">
			<button
				class="seg-btn"
				class:active={getTheme() === 'dark'}
				onclick={() => setTheme('dark')}
			>
				Dark
			</button>
			<button
				class="seg-btn"
				class:active={getTheme() === 'light'}
				onclick={() => setTheme('light')}
			>
				Light
			</button>
		</div>
	</div>

	{#if filtersActive && !isKitView}
		<button class="clear-btn" onclick={clearFilters}>Clear filters</button>
	{/if}

	<a
		href="https://ko-fi.com/L3L31WMKE0"
		target="_blank"
		rel="noopener noreferrer"
		class="kofi-btn"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M5 12h2a4 4 0 0 0 4-4V6H5v6z" fill="currentColor" opacity="0.3" />
			<path d="M3 5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a6 6 0 0 1-6 6H7a6 6 0 0 1-6-6V5z" stroke="currentColor" stroke-width="1.5" />
			<path d="M17 7h1a3 3 0 0 1 0 6h-1" stroke="currentColor" stroke-width="1.5" />
			<path d="M6 18h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		Support on Ko-fi
	</a>
</aside>

<style>
	.sidebar {
		width: 220px;
		min-width: 220px;
		background: var(--bg-surface);
		border-right: 1px solid var(--border-subtle);
		padding: 24px 20px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.clear-btn {
		width: 100%;
		padding: 8px;
		border-radius: 6px;
		border: 1px solid var(--border-default);
		background: transparent;
		margin-top: auto;
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 12px;
		color: var(--text-secondary);
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease,
			border-color 150ms ease;
	}

	.clear-btn:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
		border-color: var(--text-muted);
	}

	.clear-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.kofi-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		padding: 8px;
		border-radius: 6px;
		border: 1px solid color-mix(in srgb, #72a4f2 30%, transparent);
		background: color-mix(in srgb, #72a4f2 8%, transparent);
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 12px;
		color: #72a4f2;
		text-decoration: none;
		cursor: pointer;
		transition:
			background 150ms ease,
			border-color 150ms ease;
	}

	.kofi-btn:hover {
		background: color-mix(in srgb, #72a4f2 15%, transparent);
		border-color: color-mix(in srgb, #72a4f2 50%, transparent);
	}

	.kofi-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.section.disabled {
		opacity: 0.35;
		pointer-events: none;
		user-select: none;
	}

	.section-header {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0 0 12px 0;
	}

	/* Manufacturer filter */
	.mfr-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.mfr-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 10px;
		border-radius: 6px;
		border: none;
		background: transparent;
		cursor: pointer;
		transition:
			background 150ms ease,
			opacity 150ms ease;
	}

	.mfr-item:hover {
		background: var(--bg-elevated);
	}

	.mfr-item.active {
		background: var(--bg-elevated);
	}

	.mfr-item.dimmed {
		opacity: 0.5;
	}

	.mfr-item:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.mfr-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.mfr-label {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 13px;
		transition: color 150ms ease;
	}

	.mfr-count {
		font-weight: 400;
		font-size: 11px;
		opacity: 0.6;
	}

	/* Segmented control */
	.segmented {
		display: flex;
		gap: 4px;
	}

	.seg-btn {
		flex: 1;
		padding: 6px 0;
		border-radius: 6px;
		border: 1px solid var(--border-default);
		background: transparent;
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 12px;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			background 200ms ease,
			color 200ms ease,
			border-color 200ms ease;
	}

	.seg-btn:hover {
		color: var(--text-secondary);
		border-color: var(--text-muted);
	}

	.seg-btn.active {
		background: var(--bg-accent);
		color: var(--accent-bright);
		border-color: transparent;
	}

	.seg-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Toggle switches */
	.toggle-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
	}

	.toggle-label {
		font-family: var(--font-sans);
		font-size: 13px;
		color: var(--text-secondary);
	}

	.toggle {
		appearance: none;
		width: 36px;
		height: 20px;
		border-radius: 10px;
		background: var(--border-default);
		position: relative;
		cursor: pointer;
		transition: background 200ms ease;
		flex-shrink: 0;
	}

	.toggle::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--text-muted);
		transition:
			transform 200ms ease,
			background 200ms ease;
	}

	.toggle:checked {
		background: var(--accent);
	}

	.toggle:checked::after {
		transform: translateX(16px);
		background: var(--bg-base);
	}

	.toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Legend */
	.legend {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--text-secondary);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--mfr-fujinon);
		flex-shrink: 0;
	}

	.legend-bar {
		width: 24px;
		height: 8px;
		border-radius: 4px;
		background: var(--mfr-fujinon);
		flex-shrink: 0;
	}

	.legend-kit {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		background: var(--kit);
		flex-shrink: 0;
	}
</style>
