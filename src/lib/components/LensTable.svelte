<script lang="ts">
	import type { Lens, SortField, SortDirection } from '$lib/types';
	import { manufacturerColors, isNewLens } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';

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
							onclick={() => onSort(col.key!)}
						>
							<span>{col.label}</span>
							{#if sort === col.key}
								<span class="sort-arrow">{sortDir === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</th>
					{:else}
						<th>{col.label}</th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each lenses as lens (lens.slug)}
				{@const inKit = kitSlugs.has(lens.slug)}
				<tr class:kit-row={inKit}>
					<!-- Maker badge -->
					<td>
						<span
							class="mfr-badge"
							style="
								color: {manufacturerColors[lens.manufacturer] ?? 'var(--text-primary)'};
								background: color-mix(in srgb, {manufacturerColors[lens.manufacturer] ?? 'var(--text-muted)'} 18%, transparent);
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
		overflow-x: auto;
	}

	.lens-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-sans);
		font-size: calc(14px * var(--font-scale, 1));
	}

	/* Header */
	thead th {
		padding: 8px 12px;
		text-align: left;
		font-weight: 500;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		border-bottom: 1px solid var(--border-subtle);
		white-space: nowrap;
		user-select: none;
	}

	th.sortable {
		cursor: pointer;
		transition: color 150ms ease;
	}

	th.sortable:hover {
		color: var(--text-secondary);
	}

	th.active {
		color: var(--accent);
	}

	.sort-arrow {
		font-size: 9px;
		margin-left: 4px;
	}

	/* Body rows */
	tbody tr {
		border-bottom: 1px solid var(--border-subtle);
		transition: background 150ms ease;
	}

	tbody tr:hover {
		background: var(--bg-elevated);
	}

	tbody td {
		padding: 10px 12px;
		vertical-align: middle;
		white-space: nowrap;
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
		border-radius: 4px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 11px;
		letter-spacing: 0.02em;
	}

	/* Model link */
	.model-link {
		font-weight: 500;
		font-size: calc(14px * var(--font-scale, 1));
		color: var(--text-primary);
		text-decoration: none;
		transition: color 150ms ease;
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
		border-radius: 3px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 10px;
		text-transform: uppercase;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 15%, transparent);
		vertical-align: middle;
	}

	/* Mono data cells */
	.mono {
		font-family: var(--font-mono);
		font-size: calc(13px * var(--font-scale, 1));
		color: var(--text-secondary);
	}

	.year {
		color: var(--text-faint);
	}

	/* Spec badges */
	.specs {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	.spec-badge {
		display: inline-block;
		padding: 1px 6px;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 10px;
		text-transform: uppercase;
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
		border-radius: 4px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 11px;
		color: var(--kit);
		background: color-mix(in srgb, var(--kit) 15%, transparent);
		cursor: pointer;
		border: none;
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.kit-badge:hover {
		background: var(--danger-bg);
		color: var(--danger);
	}

	.kit-add {
		padding: 2px 10px;
		border-radius: 4px;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--text-faint);
		cursor: pointer;
		transition:
			color 150ms ease,
			background 150ms ease;
	}

	.kit-add:hover {
		color: var(--text-secondary);
		background: var(--bg-elevated);
	}

	.kit-add:focus-visible,
	.kit-badge:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
