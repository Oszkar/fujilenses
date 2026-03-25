<script lang="ts">
	import { scaleLog, scaleLinear } from 'd3-scale';
	import type { Lens, ScaleType } from '$lib/types';
	import { manufacturerColors } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';

	interface Props {
		lenses: Lens[];
		scale: ScaleType;
		ffe: boolean;
		kitSlugs: Set<string>;
		onToggleKit: (slug: string) => void;
	}

	let { lenses, scale, ffe, kitSlugs, onToggleKit }: Props = $props();

	// Layout constants
	const MARGIN = { top: 40, right: 40, bottom: 20, left: 0 };
	const ROW_HEIGHT = 28;
	const ROW_GAP = 4;
	const BAR_HEIGHT = 8;
	const DOT_RADIUS = 5;
	const LABEL_WIDTH = 220;

	let containerWidth = $state(800);
	let containerEl: HTMLDivElement | undefined = $state();

	// Tooltip state
	let tooltip = $state<{
		lens: Lens;
		x: number;
		y: number;
	} | null>(null);

	let chartWidth = $derived(Math.max(containerWidth - LABEL_WIDTH - MARGIN.right, 200));
	let svgHeight = $derived(MARGIN.top + lenses.length * (ROW_HEIGHT + ROW_GAP) + MARGIN.bottom);

	// Compute focal bounds with FF equivalent
	function getFocal(lens: Lens): { min: number; max: number } {
		const mult = ffe ? getFFMultiplier(lens.mountType) : 1;
		return {
			min: Math.round(lens.minFocalLength * mult),
			max: Math.round(lens.maxFocalLength * mult)
		};
	}

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
				.range([0, chartWidth])
				.clamp(true);
		}
		return scaleLinear().domain([0, domainMax]).range([0, chartWidth]).clamp(true);
	});

	let ticks = $derived.by(() => {
		return xScale.ticks(8).filter((t: number) => t > 0);
	});

	function rowY(index: number): number {
		return MARGIN.top + index * (ROW_HEIGHT + ROW_GAP);
	}

	function focalLabel(lens: Lens): string {
		const f = getFocal(lens);
		const name = lens.model.replace(/^(XF|XC|GF)\s*/, '');
		if (f.min === f.max) return name;
		return name;
	}

	function mfrColor(lens: Lens): string {
		return manufacturerColors[lens.manufacturer] ?? 'var(--text-muted)';
	}

	function showTooltip(lens: Lens, event: MouseEvent) {
		tooltip = {
			lens,
			x: event.clientX,
			y: event.clientY
		};
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

	$effect(() => {
		if (!containerEl) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
			}
		});
		observer.observe(containerEl);
		return () => observer.disconnect();
	});
</script>

<div class="focal-map" bind:this={containerEl}>
	<svg
		width={LABEL_WIDTH + chartWidth + MARGIN.right}
		height={svgHeight}
		role="img"
		aria-label="Focal length range map"
	>
		<!-- Axis ticks -->
		{#each ticks as tick (tick)}
			{@const x = LABEL_WIDTH + xScale(tick)}
			<line
				x1={x}
				y1={MARGIN.top - 8}
				x2={x}
				y2={svgHeight - MARGIN.bottom}
				stroke="var(--border-subtle)"
				stroke-width="1"
			/>
			<text
				x={x}
				y={MARGIN.top - 16}
				text-anchor="middle"
				class="tick-label"
			>
				{tick}mm
			</text>
		{/each}

		<!-- Lens rows -->
		{#each lenses as lens, i (lens.slug)}
			{@const focal = getFocal(lens)}
			{@const inKit = kitSlugs.has(lens.slug)}
			{@const y = rowY(i)}
			{@const color = mfrColor(lens)}

			<!-- Kit highlight background -->
			{#if inKit}
				<rect
					x="0"
					y={y}
					width={LABEL_WIDTH + chartWidth + MARGIN.right}
					height={ROW_HEIGHT}
					fill="var(--kit-bg)"
					rx="2"
				/>
				<rect
					x="0"
					y={y}
					width="3"
					height={ROW_HEIGHT}
					fill="var(--kit)"
					rx="1"
				/>
			{/if}

			<!-- Row label -->
			<text
				x={LABEL_WIDTH - 12}
				y={y + ROW_HEIGHT / 2}
				text-anchor="end"
				dominant-baseline="central"
				class="row-label"
				class:kit-label={inKit}
			>
				{focalLabel(lens)}
			</text>

			<!-- Focal range visualization -->
			{#if lens.lensType === 'Prime'}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<circle
					cx={LABEL_WIDTH + xScale(focal.min)}
					cy={y + ROW_HEIGHT / 2}
					r={DOT_RADIUS}
					fill={color}
					class="lens-shape"
					tabindex="0"
					role="button"
					aria-label="{lens.manufacturer} {lens.model}"
					onmouseenter={(e) => showTooltip(lens, e)}
					onmouseleave={hideTooltip}
					onfocus={(e) =>
						showTooltip(lens, {
							clientX: e.currentTarget.getBoundingClientRect().x,
							clientY: e.currentTarget.getBoundingClientRect().y
						} as MouseEvent)}
					onblur={hideTooltip}
					onkeydown={(e) => handleKeydown(lens, e)}
				/>
			{:else}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<rect
					x={LABEL_WIDTH + xScale(focal.min)}
					y={y + ROW_HEIGHT / 2 - BAR_HEIGHT / 2}
					width={Math.max(xScale(focal.max) - xScale(focal.min), 2)}
					height={BAR_HEIGHT}
					rx={BAR_HEIGHT / 2}
					fill={color}
					class="lens-shape"
					tabindex="0"
					role="button"
					aria-label="{lens.manufacturer} {lens.model}"
					onmouseenter={(e) => showTooltip(lens, e)}
					onmouseleave={hideTooltip}
					onfocus={(e) =>
						showTooltip(lens, {
							clientX: e.currentTarget.getBoundingClientRect().x,
							clientY: e.currentTarget.getBoundingClientRect().y
						} as MouseEvent)}
					onblur={hideTooltip}
					onkeydown={(e) => handleKeydown(lens, e)}
				/>
			{/if}
		{/each}
	</svg>

	<!-- Tooltip -->
	{#if tooltip}
		{@const focal = getFocal(tooltip.lens)}
		{@const inKit = kitSlugs.has(tooltip.lens.slug)}
		<div
			class="tooltip"
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
		overflow-x: auto;
	}

	svg {
		display: block;
	}

	.tick-label {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: var(--text-faint);
	}

	.row-label {
		font-family: var(--font-sans);
		font-size: 12px;
		fill: var(--text-secondary);
	}

	.row-label.kit-label {
		fill: var(--kit);
	}

	.lens-shape {
		cursor: pointer;
		transition: opacity 150ms ease;
	}

	.lens-shape:hover,
	.lens-shape:focus-visible {
		opacity: 0.8;
	}

	.lens-shape:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Tooltip */
	.tooltip {
		position: fixed;
		z-index: 50;
		background: var(--bg-elevated);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: 12px 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		pointer-events: none;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		max-width: 280px;
	}

	.tooltip-kit {
		display: inline-block;
		align-self: flex-start;
		padding: 1px 8px;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 10px;
		color: var(--kit);
		background: color-mix(in srgb, var(--kit) 15%, transparent);
		margin-bottom: 2px;
	}

	.tooltip-mfr {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-muted);
	}

	.tooltip-model {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 14px;
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
		font-size: 10px;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.tooltip-spec-value {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 13px;
		color: var(--text-primary);
	}
</style>
