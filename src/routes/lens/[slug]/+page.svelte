<script lang="ts">
	import type { PageData } from './$types';
	import { manufacturerColors, isNewLens } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';
	import { getKitSlugs, toggleKitLens } from '$lib/kit.svelte';

	let { data }: { data: PageData } = $props();
	let lens = $derived(data.lens);
	let kitSlugs = $derived(getKitSlugs());
	let inKit = $derived(kitSlugs.has(lens.slug));

	let focalDisplay = $derived(
		lens.minFocalLength === lens.maxFocalLength
			? `${lens.minFocalLength}mm`
			: `${lens.minFocalLength}–${lens.maxFocalLength}mm`
	);

	let ffEquiv = $derived(
		Math.round(lens.minFocalLength * getFFMultiplier(lens.mountType))
	);

	let ffEquivDisplay = $derived(
		lens.minFocalLength === lens.maxFocalLength
			? `${ffEquiv}mm`
			: `${ffEquiv}–${Math.round(lens.maxFocalLength * getFFMultiplier(lens.mountType))}mm`
	);

	let mfrColor = $derived(manufacturerColors[lens.manufacturer] ?? 'var(--text-muted)');

	let mountLabel = $derived(
		lens.manufacturer === 'Fujinon'
			? `FUJINON ${lens.mountType}-MOUNT`
			: `${lens.manufacturer.toUpperCase()} · ${lens.mountType}-MOUNT`
	);
</script>

<svelte:head>
	<title>{lens.model} — FujiLenses</title>
	<meta
		name="description"
		content="{lens.manufacturer} {lens.model} — {focalDisplay} f/{lens.maxAperture} {lens.mountType} mount lens."
	/>
	<meta property="og:title" content="{lens.model} — FujiLenses" />
	<meta
		property="og:description"
		content="{lens.manufacturer} {lens.model} — {focalDisplay} f/{lens.maxAperture}. {lens.weightGrams}g, {lens.releaseYear}."
	/>
</svelte:head>

<a href="/" class="back-link">&larr; Back to browse</a>

<div class="detail-layout">
	<!-- Left column -->
	<div class="detail-hero">
		<span class="mount-label" style="color: {mfrColor};">{mountLabel}</span>
		<h1 class="model-name">
			{lens.model}
			{#if isNewLens(lens)}
				<span class="new-badge">NEW</span>
			{/if}
		</h1>

		<div class="key-stats">
			<div class="stat">
				<span class="stat-label">Focal Length</span>
				<span class="stat-value">{focalDisplay}</span>
			</div>
			<div class="stat">
				<span class="stat-label">Max Aperture</span>
				<span class="stat-value">f/{lens.maxAperture}</span>
			</div>
			<div class="stat">
				<span class="stat-label">Weight</span>
				<span class="stat-value">{lens.weightGrams}g</span>
			</div>
		</div>

		<!-- Photo placeholder -->
		<div class="photo-placeholder">
			<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
				<rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
				<circle cx="16" cy="17" r="5" stroke="currentColor" stroke-width="1.5" />
				<rect x="11" y="6" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5" />
			</svg>
			<span>No photo available</span>
		</div>
	</div>

	<!-- Right column -->
	<div class="detail-specs">
		<h2 class="specs-heading">Technical Specifications</h2>

		<div class="spec-grid">
			<div class="spec-item">
				<span class="spec-label">Aperture Ring</span>
				<span class="spec-val">
					<span class="spec-indicator" class:yes={lens.apertureRing}></span>
					{lens.apertureRing ? 'Yes' : 'No'}
				</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">Linear Motor</span>
				<span class="spec-val">
					<span class="spec-indicator" class:yes={lens.linearMotor}></span>
					{lens.linearMotor ? 'Yes' : 'No'}
				</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">Weather Resistant</span>
				<span class="spec-val">
					<span class="spec-indicator" class:yes={lens.weatherResistant}></span>
					{lens.weatherResistant ? 'Yes' : 'No'}
				</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">Stabilization</span>
				<span class="spec-val">
					<span class="spec-indicator" class:yes={lens.imageStabilization}></span>
					{lens.imageStabilization ? 'OIS' : 'None'}
				</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">FF Equivalent</span>
				<span class="spec-val">{ffEquivDisplay}</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">Release Year</span>
				<span class="spec-val">{lens.releaseYear}</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">Mount Type</span>
				<span class="spec-val">{lens.mountType}</span>
			</div>
			<div class="spec-item">
				<span class="spec-label">Lens Type</span>
				<span class="spec-val">{lens.lensType}</span>
			</div>
		</div>

		<button
			class="kit-btn"
			class:in-kit={inKit}
			onclick={() => toggleKitLens(lens.slug)}
		>
			{#if inKit}
				In My Kit — Remove
			{:else}
				+ Add to My Kit
			{/if}
		</button>
	</div>
</div>

<style>
	.back-link {
		display: inline-block;
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 13px;
		color: var(--accent);
		text-decoration: none;
		margin-bottom: 24px;
		transition: color 150ms ease;
	}

	.back-link:hover {
		color: var(--accent-bright);
	}

	.detail-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		align-items: start;
	}

	/* Hero (left) */
	.mount-label {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.model-name {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 36px;
		color: var(--text-primary);
		margin: 8px 0 24px 0;
		line-height: 1.1;
	}

	.new-badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 12px;
		text-transform: uppercase;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 15%, transparent);
		vertical-align: middle;
	}

	.key-stats {
		display: flex;
		gap: 32px;
		margin-bottom: 32px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-label {
		font-family: var(--font-sans);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.stat-value {
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 22px;
		color: var(--text-primary);
	}

	.photo-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		height: 280px;
		border-radius: 8px;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		color: var(--text-faint);
		font-family: var(--font-sans);
		font-size: 12px;
	}

	/* Specs (right) */
	.specs-heading {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		color: var(--text-primary);
		margin: 0 0 20px 0;
	}

	.spec-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
	}

	.spec-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 0;
		border-bottom: 1px solid var(--border-subtle);
	}

	.spec-label {
		font-family: var(--font-sans);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.spec-val {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 14px;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.spec-indicator {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--text-faint);
		flex-shrink: 0;
	}

	.spec-indicator.yes {
		background: var(--kit);
	}

	.kit-btn {
		width: 100%;
		margin-top: 24px;
		padding: 12px;
		border-radius: 8px;
		border: none;
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease;
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.kit-btn:hover {
		background: var(--bg-accent);
		color: var(--text-primary);
	}

	.kit-btn.in-kit {
		background: color-mix(in srgb, var(--kit) 15%, transparent);
		color: var(--kit);
	}

	.kit-btn.in-kit:hover {
		background: var(--danger-bg);
		color: var(--danger);
	}

	.kit-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Mobile */
	@media (max-width: 1023px) {
		.detail-layout {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.model-name {
			font-size: 28px;
		}

		.key-stats {
			gap: 24px;
		}

		.stat-value {
			font-size: 18px;
		}

		.photo-placeholder {
			height: 200px;
		}
	}
</style>
