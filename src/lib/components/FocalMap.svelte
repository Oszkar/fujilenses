<script lang="ts">
	import { scaleLog, scaleLinear } from 'd3-scale';
	import { fade } from 'svelte/transition';
	import type { Lens, ScaleType } from '$lib/types';
	import { manufacturerColors } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';
	import { getFontScale } from '$lib/preferences.svelte';
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

	// Component-scoped unique ID prefix
	const uid = Math.random().toString(36).slice(2, 8);

	// Layout constants
	const BAR_HEIGHT = 8;
	const DOT_RADIUS = 5;
	const HEATMAP_HEIGHT = 24;
	const GAP_MIN_PX = 40;

	let containerWidth = $state(800);
	let scrollWidth = $state(0);
	let clientWidth = $state(0);
	let hasOverflow = $derived(scrollWidth > clientWidth);

	let ROW_HEIGHT = $derived(containerWidth < 600 ? 26 : 28);
	let ROW_GAP = $derived(containerWidth < 600 ? 3 : 4);
	let MARGIN = $derived({
		top: showHeatmap && lenses.length >= 2 ? 40 + HEATMAP_HEIGHT + 14 : 40,
		right: containerWidth < 600 ? 16 : 40,
		bottom: 20,
		left: 0
	});
	let LABEL_WIDTH = $derived(Math.round((containerWidth < 600 ? 180 : 240) * getFontScale()));
	let containerEl: HTMLDivElement | undefined = $state();

	// Tooltip state
	let tooltip = $state<{
		lens: Lens;
		x: number;
		y: number;
	} | null>(null);

	const MIN_CHART_WIDTH = 500;
	let chartWidth = $derived(Math.max(containerWidth - LABEL_WIDTH - MARGIN.right, MIN_CHART_WIDTH));
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

	// Heatmap coverage data (sweep line)
	let coverageSegments = $derived(showHeatmap ? computeCoverageSegments(lenses, ffe) : []);
	let heatmapStops = $derived.by(() => {
		if (coverageSegments.length === 0) return [];
		return segmentsToGradientStops(coverageSegments, xScale, chartWidth);
	});
	let heatmapGaps = $derived.by(() => {
		if (coverageSegments.length === 0) return [];
		return detectGaps(coverageSegments, xScale, GAP_MIN_PX);
	});
	let showHeatmapStrip = $derived(showHeatmap && lenses.length >= 2 && heatmapStops.length > 0);

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
		let x = event.clientX;
		let y = event.clientY;
		// Boundary detection: flip tooltip if it would clip viewport
		if (typeof window !== 'undefined') {
			if (x + 296 > window.innerWidth) x = Math.max(0, x - 296);
			if (y - 20 < 0) y = Math.min(y + 40, window.innerHeight - 200);
		}
		tooltip = { lens, x, y };
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

	function handleToggle(lens: Lens) {
		onToggleKit(lens.slug);
	}

	$effect(() => {
		if (!containerEl) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
				scrollWidth = containerEl?.scrollWidth ?? 0;
				clientWidth = containerEl?.clientWidth ?? 0;
			}
		});
		observer.observe(containerEl);
		return () => observer.disconnect();
	});
</script>

<div class="focal-map" class:has-overflow={hasOverflow} bind:this={containerEl}>
	<svg
		width={LABEL_WIDTH + chartWidth + MARGIN.right}
		height={svgHeight}
		role="img"
		aria-label="Focal length range map"
	>
		<defs>
			<clipPath id="{uid}-label-clip">
				<rect x="0" y="0" width={LABEL_WIDTH - 8} height={svgHeight} />
			</clipPath>
			<pattern
				id="{uid}-gap-stripes"
				width="6"
				height="6"
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(45)"
			>
				<line x1="0" y1="0" x2="0" y2="6" stroke="var(--text-faint)" stroke-width="1" stroke-opacity="0.3" />
			</pattern>
			{#if showHeatmapStrip}
				<linearGradient id="{uid}-coverage-gradient">
					{#each heatmapStops as stop, i (i)}
						<stop offset={stop.offset} stop-color="var(--accent)" stop-opacity={stop.opacity} />
					{/each}
				</linearGradient>
			{/if}
		</defs>

		<!-- Wide / Tele axis labels -->
		<text
			x={LABEL_WIDTH + 4}
			y={MARGIN.top - 28}
			class="axis-context-label"
		>
			WIDE
		</text>
		<text
			x={LABEL_WIDTH + chartWidth - 4}
			y={MARGIN.top - 28}
			text-anchor="end"
			class="axis-context-label"
		>
			TELE
		</text>

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

		<!-- Coverage heatmap strip -->
		{#if showHeatmapStrip}
			<g aria-label="Kit focal coverage density">
				<desc>Coverage density visualization showing where kit lenses overlap</desc>
				<rect
					x={LABEL_WIDTH}
					y={MARGIN.top - HEATMAP_HEIGHT - 4}
					width={chartWidth}
					height={HEATMAP_HEIGHT}
					rx="4"
					fill="url(#{uid}-coverage-gradient)"
				/>
				<!-- Gap markers -->
				{#each heatmapGaps as gap, gi (gi)}
					{@const gapMin = Math.round(gap.focalStart)}
					{@const gapMax = Math.round(gap.focalEnd)}
					{@const gapCenterX = LABEL_WIDTH + gap.x + gap.width / 2}
					{@const gapTopY = MARGIN.top - HEATMAP_HEIGHT - 4}
					{#if onGapClick}
						<g
							class="gap-marker interactive"
							role="button"
							tabindex="0"
							aria-label="Fill {gapMin}–{gapMax}mm gap: show lenses covering this range"
							onclick={() =>
								onGapClick?.({ focalStart: gap.focalStart, focalEnd: gap.focalEnd })}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onGapClick?.({ focalStart: gap.focalStart, focalEnd: gap.focalEnd });
								}
							}}
						>
							<!-- Striped background fill -->
							<rect
								x={LABEL_WIDTH + gap.x}
								y={gapTopY}
								width={gap.width}
								height={HEATMAP_HEIGHT}
								rx="4"
								fill="url(#{uid}-gap-stripes)"
								class="gap-fill"
							/>
							<!-- Hover/focus highlight overlay -->
							<rect
								x={LABEL_WIDTH + gap.x}
								y={gapTopY}
								width={gap.width}
								height={HEATMAP_HEIGHT}
								rx="4"
								fill="transparent"
								class="gap-hit"
							/>
							<!-- Border -->
							<rect
								x={LABEL_WIDTH + gap.x + 0.5}
								y={gapTopY + 0.5}
								width={gap.width - 1}
								height={HEATMAP_HEIGHT - 1}
								rx="3.5"
								fill="none"
								stroke="var(--text-faint)"
								stroke-width="1"
								stroke-dasharray="4 2"
								class="gap-border"
							/>
						</g>
					{:else}
						<rect
							x={LABEL_WIDTH + gap.x}
							y={gapTopY}
							width={gap.width}
							height={HEATMAP_HEIGHT}
							rx="4"
							fill="url(#{uid}-gap-stripes)"
						/>
						<rect
							x={LABEL_WIDTH + gap.x + 0.5}
							y={gapTopY + 0.5}
							width={gap.width - 1}
							height={HEATMAP_HEIGHT - 1}
							rx="3.5"
							fill="none"
							stroke="var(--text-faint)"
							stroke-width="1"
							stroke-dasharray="4 2"
						/>
					{/if}
				{/each}
			</g>
		{/if}

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
				clip-path="url(#{uid}-label-clip)"
				fill={inKit ? 'var(--kit)' : color}
			>
				{focalLabel(lens)}
			</text>

			<!-- Focal range visualization -->
			{#if lens.lensType === 'Prime'}
				<circle
					cx={LABEL_WIDTH + xScale(focal.min)}
					cy={y + ROW_HEIGHT / 2}
					r={DOT_RADIUS}
					fill={color}
					class="lens-shape prime-shape"
					tabindex="0"
					role="button"
					aria-label="{lens.manufacturer} {lens.model}"
					aria-pressed={inKit}
					onclick={() => handleToggle(lens)}
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
					aria-pressed={inKit}
					onclick={() => handleToggle(lens)}
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
			transition:fade={{ duration: 100 }}
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

	.focal-map.has-overflow {
		mask-image: linear-gradient(to right, black 90%, transparent 100%);
		-webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
	}

	svg {
		display: block;
	}

	.tick-label {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: var(--text-faint);
	}

	.axis-context-label {
		font-family: var(--font-sans);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		fill: var(--text-faint);
	}

	.row-label {
		font-family: var(--font-sans);
		font-size: calc(12px * var(--font-scale, 1));
	}

	.lens-shape {
		cursor: pointer;
		opacity: 0.85;
		transform-box: fill-box;
		transform-origin: center;
	}

	@media (prefers-reduced-motion: no-preference) {
		.lens-shape {
			transition: opacity 150ms ease, transform 150ms ease;
		}
	}

	.lens-shape:hover,
	.lens-shape:focus-visible {
		opacity: 1;
	}

	.lens-shape.prime-shape:hover {
		transform: scale(1.15);
	}

	.lens-shape:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Gap marker */
	.gap-marker.interactive {
		cursor: pointer;
	}

	.gap-marker .gap-border {
		stroke: var(--text-faint);
	}

	@media (prefers-reduced-motion: no-preference) {
		.gap-marker .gap-border {
			transition: stroke 150ms ease;
		}
		.gap-marker .gap-hit {
			transition: fill 150ms ease;
		}
	}

	.gap-marker.interactive:hover .gap-hit,
	.gap-marker.interactive:focus-visible .gap-hit {
		fill: color-mix(in srgb, var(--accent) 15%, transparent);
	}

	.gap-marker.interactive:hover .gap-border,
	.gap-marker.interactive:focus-visible .gap-border {
		stroke: var(--accent);
		stroke-dasharray: none;
	}

	.gap-marker.interactive:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: 4px;
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
