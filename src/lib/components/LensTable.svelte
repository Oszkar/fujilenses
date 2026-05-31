<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly, fade } from 'svelte/transition';
	import type { Lens, SortField, SortDirection } from '$lib/types';
	import { manufacturerColors, isNewLens } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';

	let hasEntered = $state(false);
	$effect(() => {
		// After first render, disable stagger for subsequent updates
		hasEntered = true;
	});

	interface Props {
		lenses: Lens[];
		sort: SortField;
		sortDir: SortDirection;
		ffe: boolean;
		kitSlugs: Set<string>;
		onSort: (field: SortField) => void;
		onToggleKit: (slug: string) => void;
	}

	let { lenses, sort, sortDir, ffe, kitSlugs, onSort, onToggleKit }: Props = $props();

	type Column = {
		key: SortField | null;
		label: string;
		sortable: boolean;
	};

	const columns: Column[] = [
		{ key: null, label: 'Maker', sortable: false },
		{ key: null, label: 'Model', sortable: false },
		{ key: 'minFocalLength', label: 'Focal Length', sortable: true },
		{ key: 'maxAperture', label: 'Aperture', sortable: true },
		{ key: 'weightGrams', label: 'Weight', sortable: true },
		{ key: 'releaseYear', label: 'Year', sortable: true },
		{ key: null, label: 'Specs', sortable: false },
		{ key: null, label: '', sortable: false }
	];

	function focalDisplay(lens: Lens): string {
		const mult = ffe ? getFFMultiplier(lens.mountType) : 1;
		const min = Math.round(lens.minFocalLength * mult);
		const max = Math.round(lens.maxFocalLength * mult);
		return min === max ? `${min}mm` : `${min}-${max}mm`;
	}
</script>

<div class="table-wrap">
	<table class="lens-table">
		<thead>
			<tr>
				{#each columns as col (col.label)}
					{#if col.sortable && col.key}
						<th
							class="sortable"
							class:active={sort === col.key}
							aria-sort={sort === col.key
								? sortDir === 'asc'
									? 'ascending'
									: 'descending'
								: 'none'}
						>
							<button
								type="button"
								class="sort-button"
								onclick={() => onSort(col.key!)}
								aria-label={sort === col.key
									? `Sort by ${col.label} ${sortDir === 'asc' ? 'descending' : 'ascending'}`
									: `Sort by ${col.label} ascending`}
							>
								<span>{col.label}</span>
								{#if sort === col.key}
									<svg class="sort-chevron" class:desc={sortDir === 'desc'} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
										<path d="M3 7.5L6 4.5L9 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								{/if}
							</button>
						</th>
					{:else}
						<th>{col.label}</th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each lenses as lens, i (lens.slug)}
				{@const inKit = kitSlugs.has(lens.slug)}
				<tr
					class:kit-row={inKit}
					animate:flip={{ duration: 250 }}
					in:fly={{ y: 8, duration: 150, delay: hasEntered ? 0 : Math.min(i, 8) * 30 }}
				>
					<!-- Maker badge -->
					<td>
						<span
							class="mfr-badge"
							style="
								color: {manufacturerColors[lens.manufacturer] ?? 'var(--text-primary)'};
								background: color-mix(in srgb, {manufacturerColors[lens.manufacturer] ?? 'var(--text-muted)'} var(--mfr-badge-fill), transparent);
							"
						>
							{lens.manufacturer.toUpperCase()}
						</span>
					</td>

					<!-- Model -->
					<td>
						<a href="/lens/{lens.slug}" class="model-link" class:kit-text={inKit}>
							{lens.model}
						</a>
						{#if isNewLens(lens)}
							<span class="new-badge">NEW</span>
						{/if}
					</td>

					<!-- Focal Length -->
					<td class="mono">{focalDisplay(lens)}</td>

					<!-- Aperture -->
					<td class="mono">f/{lens.maxAperture}</td>

					<!-- Weight -->
					<td class="mono">{lens.weightGrams}g</td>

					<!-- Year -->
					<td class="mono year">{lens.releaseYear}</td>

					<!-- Specs badges -->
					<td class="specs">
						{#if !lens.autofocus}
							<span class="spec-badge mf">MF</span>
						{/if}
						{#if lens.weatherResistant}
							<span class="spec-badge wr">WR</span>
						{/if}
						{#if lens.imageStabilization}
							<span class="spec-badge feature">OIS</span>
						{/if}
						{#if lens.linearMotor}
							<span class="spec-badge feature">LM</span>
						{/if}
					</td>

					<!-- Kit toggle -->
					<td class="kit-cell">
						{#if inKit}
							<button class="kit-badge" title="Remove from kit" onclick={() => onToggleKit(lens.slug)}>IN KIT</button>
						{:else}
							<button class="kit-add" onclick={() => onToggleKit(lens.slug)}>+ kit</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-wrap {
		/* overflow-x only on mobile — on desktop it creates a scroll container
		   that traps position:sticky and prevents the header from sticking */
	}

	@media (max-width: 1023px) {
		.table-wrap {
			overflow-x: auto;
		}
	}

	.lens-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		font-family: var(--font-sans);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
	}

	/* Header — sticky must be on th, not thead (Chrome/Firefox don't support sticky thead) */
	thead th {
		position: sticky;
		top: 0;
		z-index: 5;
		background: var(--bg-base);
		padding: 8px 12px;
		text-align: left;
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		border-bottom: 1px solid var(--border-subtle);
		white-space: nowrap;
		user-select: none;
		/* Shadow masks scrolled content visible above the stuck header */
		box-shadow: 0 -24px 0 0 var(--bg-base);
	}

	.sort-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.sort-button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	th.sortable:hover {
		color: var(--text-secondary);
	}

	th.active {
		color: var(--accent);
	}

	.sort-chevron {
		margin-left: 4px;
		flex-shrink: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.sort-chevron {
			transition: transform var(--dur-base) var(--ease-out);
		}
	}

	.sort-chevron.desc {
		transform: rotate(180deg);
	}

	/* Body rows — border on td, not tr (border-collapse: separate ignores tr borders) */
	tbody tr {
	}

	@media (prefers-reduced-motion: no-preference) {
		tbody tr {
			transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
		}
	}

	tbody tr:hover {
		background: var(--bg-elevated);
	}

	tbody tr.kit-row:hover {
		transform: translateX(2px);
	}

	tbody td {
		padding: 10px 12px;
		vertical-align: middle;
		white-space: nowrap;
		border-bottom: 1px solid var(--border-subtle);
	}

	/* Kit row highlight */
	.kit-row {
		background: var(--kit-bg);
		border-left: 3px solid var(--kit);
	}

	.kit-row:hover {
		background: color-mix(in srgb, var(--kit) 12%, var(--bg-elevated));
	}

	/* Manufacturer badge */
	.mfr-badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: var(--radius-xs);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-badge);
		text-transform: uppercase;
	}

	/* Model link */
	.model-link {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		color: var(--text-primary);
		text-decoration: none;
		transition: color var(--dur-fast) var(--ease-out);
	}

	.model-link:hover {
		color: var(--accent);
	}

	.model-link.kit-text {
		color: var(--kit);
	}

	/* New badge */
	.new-badge {
		display: inline-block;
		margin-left: 8px;
		padding: 1px 6px;
		border-radius: var(--radius-xs);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: var(--tracking-badge);
		color: var(--new);
		background: color-mix(in srgb, var(--new) 15%, transparent);
		vertical-align: middle;
	}

	/* Mono data cells */
	.mono {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-secondary);
	}

	.year {
		color: var(--text-faint);
	}

	/* Spec badges — use inline display so the td participates in normal
	   table row height/border rendering (display:flex breaks border alignment
	   in border-collapse:separate mode) */
	.specs {
		white-space: nowrap;
	}

	.spec-badge {
		display: inline-block;
		padding: 1px 6px;
		border-radius: var(--radius-xs);
		margin-right: 4px;
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: var(--text-2xs);
		letter-spacing: var(--tracking-badge);
		text-transform: uppercase;
	}

	.spec-badge.mf {
		color: var(--text-muted);
		background: color-mix(in srgb, var(--text-muted) 15%, transparent);
	}

	.spec-badge.wr {
		color: var(--spec-wr);
		background: color-mix(in srgb, var(--spec-wr) 15%, transparent);
	}

	.spec-badge.feature {
		color: var(--spec-feature);
		background: color-mix(in srgb, var(--spec-feature) 15%, transparent);
	}

	/* Kit toggle */
	.kit-cell {
		text-align: right;
	}

	.kit-badge {
		display: inline-block;
		padding: 2px 10px;
		border-radius: var(--radius-sm);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-badge);
		text-transform: uppercase;
		color: var(--kit);
		background: color-mix(in srgb, var(--kit) 15%, transparent);
		cursor: pointer;
		border: none;
		transition:
			background var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}

	.kit-badge:hover {
		background: var(--danger-bg);
		color: var(--danger);
	}

	.kit-add {
		padding: 2px 10px;
		border-radius: var(--radius-sm);
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--text-faint);
		cursor: pointer;
		opacity: 0;
		transition:
			color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out),
			opacity var(--dur-fast) var(--ease-out);
	}

	tbody tr:hover .kit-add {
		opacity: 1;
	}

	.kit-add:hover {
		color: var(--text-secondary);
		background: var(--bg-elevated);
	}

	@media (max-width: 1023px) {
		.kit-add {
			opacity: 1;
		}
	}

	.kit-add:focus-visible,
	.kit-badge:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
