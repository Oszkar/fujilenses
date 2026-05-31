<script lang="ts">
	import { scaleLog, scaleLinear } from 'd3-scale';
	import { fade } from 'svelte/transition';
	import type { Lens, ScaleType } from '$lib/types';
	import { manufacturerColors } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';
	import { computeCoverageSegments, segmentsToGradientStops, detectGaps } from '$lib/coverage';

	interface Props {
		lenses: Lens[];
		scale: ScaleType;
		ffe: boolean;
		kitSlugs: Set<string>;
		onToggleKit: (slug: string) => void;
		showHeatmap?: boolean;
		onGapClick?: (gap: { focalStart: number; focalEnd: number }) => void;
	}

	let {
		lenses,
		scale,
		ffe,
		kitSlugs,
		onToggleKit,
		showHeatmap = false,
		onGapClick
	}: Props = $props();

	// Minimum visible bar width for a zoom, in percent of the track.
	const MIN_BAR_PCT = 1.5;
	// Gap detection threshold, in percent of the track width.
	const MIN_GAP_PCT = 2;

	// Tooltip state
	let tooltip = $state<{
		lens: Lens;
		x: number;
		y: number;
	} | null>(null);

	// Compute focal bounds with FF equivalent
	function getFocal(lens: Lens): { min: number; max: number } {
		const mult = ffe ? getFFMultiplier(lens.mountType) : 1;
		return {
			min: Math.round(lens.minFocalLength * mult),
			max: Math.round(lens.maxFocalLength * mult)
		};
	}

	// d3 scale whose RANGE is [0, 100] (percent of the track), not pixels.
	let xScale = $derived.by(() => {
		const allFocals = lenses.flatMap((l) => {
			const f = getFocal(l);
			return [f.min, f.max];
		});
		const domainMin = Math.max(Math.min(...allFocals) * 0.8, 1);
		const domainMax = Math.max(...allFocals) * 1.1;

		if (scale === 'log') {
			return scaleLog()
				.domain([Math.max(domainMin, 1), domainMax])
				.range([0, 100])
				.clamp(true);
		}
		return scaleLinear().domain([0, domainMax]).range([0, 100]).clamp(true);
	});

	// pct(focal) => 0–100 position along the track.
	function pct(focal: number): number {
		return xScale(focal);
	}

	let ticks = $derived.by(() => {
		return xScale.ticks(8).filter((t: number) => t > 0);
	});

	// Heatmap coverage data (sweep line) — coverage.ts reused unchanged, with a
	// percent scaleFunc (range [0,100]) and chartWidth = 100.
	let coverageSegments = $derived(showHeatmap ? computeCoverageSegments(lenses, ffe) : []);
	let heatmapStops = $derived.by(() => {
		if (coverageSegments.length === 0) return [];
		return segmentsToGradientStops(coverageSegments, pct, 100);
	});
	let heatmapGaps = $derived.by(() => {
		if (coverageSegments.length === 0) return [];
		return detectGaps(coverageSegments, pct, MIN_GAP_PCT);
	});
	let showHeatmapStrip = $derived(showHeatmap && lenses.length >= 2 && heatmapStops.length > 0);

	// Build the coverage gradient string from the fractional stops: green
	// (=--kit) covered density. Each stop is color-mix(... opacity ...) offset%.
	let coverageGradient = $derived.by(() => {
		if (heatmapStops.length === 0) return '';
		const parts = heatmapStops.map((stop) => {
			const color = `color-mix(in srgb, var(--kit) ${Math.round(stop.opacity * 100)}%, transparent)`;
			return `${color} ${(stop.offset * 100).toFixed(2)}%`;
		});
		return `linear-gradient(to right, ${parts.join(', ')})`;
	});

	function labelText(lens: Lens): string {
		return lens.model.replace(/^(XF|XC|GF)\s*/, '');
	}

	function mfrColor(lens: Lens): string {
		return manufacturerColors[lens.manufacturer] ?? 'var(--text-muted)';
	}

	function showTooltipAt(lens: Lens, clientX: number, clientY: number) {
		let x = clientX;
		let y = clientY;
		// Boundary detection: flip tooltip if it would clip the viewport.
		if (typeof window !== 'undefined') {
			if (x + 296 > window.innerWidth) x = Math.max(0, x - 296);
			if (y - 20 < 0) y = Math.min(y + 40, window.innerHeight - 200);
		}
		tooltip = { lens, x, y };
	}

	function showTooltip(lens: Lens, event: MouseEvent) {
		showTooltipAt(lens, event.clientX, event.clientY);
	}

	function showTooltipFromFocus(lens: Lens, event: FocusEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		showTooltipAt(lens, rect.x, rect.y);
	}

	function hideTooltip() {
		tooltip = null;
	}

	function handleKeydown(lens: Lens, event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onToggleKit(lens.slug);
		}
	}

	function handleGapKeydown(gap: { focalStart: number; focalEnd: number }, event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onGapClick?.({ focalStart: gap.focalStart, focalEnd: gap.focalEnd });
		}
	}
</script>

<div class="focal-map">
	<!-- Axis: ticks positioned by percent. -->
	<div class="axis" aria-hidden="true">
		{#each ticks as tick (tick)}
			<span class="tick" style="--frac: {pct(tick) / 100}">
				<span class="tick-line"></span>
				<span class="tick-label">{tick}mm</span>
			</span>
		{/each}
	</div>

	<!-- Coverage heatmap strip -->
	{#if showHeatmapStrip}
		<div class="coverage" role="img" aria-label="Kit focal coverage density">
			<div class="coverage-band" style="background: {coverageGradient};"></div>
			{#each heatmapGaps as gap, gi (gi)}
				{@const gapMin = Math.round(gap.focalStart)}
				{@const gapMax = Math.round(gap.focalEnd)}
				{#if onGapClick}
					<button
						type="button"
						class="gap gap-interactive"
						style="left: {gap.x}%; width: {gap.width}%"
						aria-label="Fill {gapMin}–{gapMax}mm gap: show lenses covering this range"
						onclick={() => onGapClick?.({ focalStart: gap.focalStart, focalEnd: gap.focalEnd })}
						onkeydown={(e) => handleGapKeydown(gap, e)}
					></button>
				{:else}
					<span class="gap" style="left: {gap.x}%; width: {gap.width}%"></span>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Lens rows -->
	<div class="rows">
		{#each lenses as lens (lens.slug)}
			{@const focal = getFocal(lens)}
			{@const inKit = kitSlugs.has(lens.slug)}
			{@const color = mfrColor(lens)}
			<div class="row" class:kit={inKit}>
				<span class="label" style="color: {inKit ? 'var(--kit)' : color};">
					<span class="dot" style="background: {color};"></span>
					<span class="label-text">{labelText(lens)}</span>
				</span>
				<span class="track">
					{#if lens.lensType === 'Prime'}
						<span
							class="mark prime"
							style="left: {pct(focal.min)}%; --c: {color};"
							role="button"
							tabindex="0"
							aria-label="{lens.manufacturer} {lens.model}"
							aria-pressed={inKit}
							onclick={() => onToggleKit(lens.slug)}
							onmouseenter={(e) => showTooltip(lens, e)}
							onmouseleave={hideTooltip}
							onfocus={(e) => showTooltipFromFocus(lens, e)}
							onblur={hideTooltip}
							onkeydown={(e) => handleKeydown(lens, e)}
						></span>
					{:else}
						<span
							class="mark zoom"
							style="left: {pct(focal.min)}%; width: max({pct(focal.max) - pct(focal.min)}%, {MIN_BAR_PCT}%); --c: {color};"
							role="button"
							tabindex="0"
							aria-label="{lens.manufacturer} {lens.model}"
							aria-pressed={inKit}
							onclick={() => onToggleKit(lens.slug)}
							onmouseenter={(e) => showTooltip(lens, e)}
							onmouseleave={hideTooltip}
							onfocus={(e) => showTooltipFromFocus(lens, e)}
							onblur={hideTooltip}
							onkeydown={(e) => handleKeydown(lens, e)}
						></span>
					{/if}
				</span>
			</div>
		{/each}
	</div>

	<!-- Tooltip -->
	{#if tooltip}
		{@const inKit = kitSlugs.has(tooltip.lens.slug)}
		<div
			class="tooltip"
			transition:fade={{ duration: 120 }}
			style="left: {tooltip.x + 16}px; top: {tooltip.y - 20}px;"
		>
			{#if inKit}
				<span class="tooltip-kit">IN KIT</span>
			{/if}
			<span class="tooltip-mfr">
				{tooltip.lens.manufacturer} &middot; {tooltip.lens.mountType}-Mount
			</span>
			<span class="tooltip-model">{tooltip.lens.model}</span>
			<div class="tooltip-specs">
				<div class="tooltip-spec">
					<span class="tooltip-spec-label">Equivalent</span>
					<span class="tooltip-spec-value">
						{Math.round(tooltip.lens.minFocalLength * getFFMultiplier(tooltip.lens.mountType))}mm
					</span>
				</div>
				<div class="tooltip-spec">
					<span class="tooltip-spec-label">Weight</span>
					<span class="tooltip-spec-value">{tooltip.lens.weightGrams}g</span>
				</div>
				<div class="tooltip-spec">
					<span class="tooltip-spec-label">Aperture</span>
					<span class="tooltip-spec-value">f/{tooltip.lens.maxAperture}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.focal-map {
		position: relative;
		width: 100%;
		/* Single source of truth for the responsive label column width, shared
		   by the axis/rows grid template and the tick/coverage offset math. */
		--label-col: clamp(72px, 28%, 160px);
		--col-gap: 10px;
	}

	/* Grid column template shared by axis and every row so ticks line up
	   with the tracks. Label column flexes; track takes the rest. */
	.axis,
	.row {
		display: grid;
		grid-template-columns: var(--label-col) 1fr;
		align-items: center;
		gap: var(--col-gap);
	}

	/* ---- Axis ---- */
	.axis {
		position: relative;
		height: 22px;
		margin-bottom: 6px;
	}

	/* Ticks live in the track column; positioned by percent of that column.
	   The track region starts after the label column + the 10px grid gap, so
	   we offset into it and scale --frac across the remaining width. */
	.tick {
		position: absolute;
		bottom: 0;
		left: calc(
			var(--label-col) + var(--col-gap) +
				(100% - var(--label-col) - var(--col-gap)) * var(--frac, 0)
		);
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: none;
	}

	.tick-line {
		width: 1px;
		height: 5px;
		background: var(--border-subtle);
	}

	.tick-label {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* ---- Coverage strip ---- */
	.coverage {
		position: relative;
		height: 24px;
		margin: 0 0 12px 0;
		/* align coverage track with the lens tracks: offset by label column */
		margin-left: calc(var(--label-col) + var(--col-gap));
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		overflow: hidden;
	}

	.coverage-band {
		position: absolute;
		inset: 0;
	}

	.gap {
		position: absolute;
		top: 0;
		bottom: 0;
		background-image: repeating-linear-gradient(
			-45deg,
			transparent 0 6px,
			color-mix(in srgb, var(--danger) 16%, transparent) 6px 7px
		);
		border-left: 1px dashed color-mix(in srgb, var(--danger) 45%, transparent);
		border-right: 1px dashed color-mix(in srgb, var(--danger) 45%, transparent);
	}

	button.gap {
		padding: 0;
		appearance: none;
		background-color: transparent;
		cursor: pointer;
	}

	.gap-interactive {
		outline: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.gap-interactive {
			transition: background-color var(--dur-fast) var(--ease-out);
		}
	}

	.gap-interactive:hover,
	.gap-interactive:focus-visible {
		background-color: color-mix(in srgb, var(--danger) 12%, transparent);
	}

	.gap-interactive:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	/* ---- Rows ---- */
	.rows {
		display: flex;
		flex-direction: column;
	}

	.row {
		min-height: 28px;
		border-top: 1px solid var(--border-subtle);
		padding: 2px 0;
	}

	.row:first-child {
		border-top: none;
	}

	.row.kit {
		background: var(--kit-bg);
		box-shadow: inset 3px 0 0 var(--kit);
	}

	.label {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
		padding-left: var(--space-2);
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
	}

	.dot {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: var(--radius-full);
	}

	.label-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.track {
		position: relative;
		height: 18px;
		min-width: 0;
		background: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--border-subtle) 50%, transparent) 50%,
			transparent
		);
		border-radius: var(--radius-full);
	}

	.mark {
		position: absolute;
		top: 50%;
		cursor: pointer;
		opacity: 0.85;
	}

	.mark:hover,
	.mark:focus-visible {
		opacity: 1;
	}

	.mark.prime {
		width: 10px;
		height: 10px;
		transform: translate(-50%, -50%);
		border-radius: var(--radius-full);
		background: var(--c);
		border: 2px solid var(--bg-surface);
	}

	.mark.zoom {
		height: 7px;
		transform: translateY(-50%);
		border-radius: var(--radius-full);
		background: var(--c);
	}

	@media (prefers-reduced-motion: no-preference) {
		.mark {
			transition:
				opacity var(--dur-fast) var(--ease-out),
				transform var(--dur-fast) var(--ease-out);
		}
	}

	.mark.prime:hover,
	.mark.prime:focus-visible {
		transform: translate(-50%, -50%) scale(1.15);
	}

	.mark:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* ---- Tooltip ---- */
	.tooltip {
		position: fixed;
		z-index: 60;
		background: var(--bg-elevated);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		padding: 12px 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		pointer-events: none;
		box-shadow: var(--shadow-md);
		max-width: 280px;
	}

	.tooltip-kit {
		display: inline-block;
		align-self: flex-start;
		padding: 1px 8px;
		border-radius: var(--radius-xs);
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: var(--text-2xs);
		color: var(--kit);
		background: color-mix(in srgb, var(--kit) 15%, transparent);
		margin-bottom: 2px;
	}

	.tooltip-mfr {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--text-muted);
	}

	.tooltip-model {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: var(--text-md);
		color: var(--text-primary);
	}

	.tooltip-specs {
		display: flex;
		gap: 16px;
		margin-top: 6px;
	}

	.tooltip-spec {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tooltip-spec-label {
		font-family: var(--font-sans);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.tooltip-spec-value {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: var(--text-base);
		color: var(--text-primary);
		font-variant-numeric: tabular-nums;
	}
</style>
