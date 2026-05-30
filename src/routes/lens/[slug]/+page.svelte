<script lang="ts">
	import type { PageData } from './$types';
	import { manufacturerColors, isNewLens } from '$lib/data';
	import { getFFMultiplier } from '$lib/filters';
	import { getKitSlugs, toggleKitLens } from '$lib/kit.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	let lens = $derived(data.lens);
	let similarLenses = $derived(data.similarLenses);
	let hasReviews = $derived(lens.reviews && lens.reviews.length > 0);

	// Register lite-youtube web component (client-side only)
	onMount(async () => {
		if (!customElements.get('lite-youtube')) {
			// lite-youtube-embed ships no types; this dynamic import is for its side effect
			// (registering the <lite-youtube> custom element) only.
			// @ts-expect-error -- no type declarations for this package
			await import('lite-youtube-embed');
		}
	});
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
	{#if hasReviews}
		<link rel="stylesheet" href="/lite-yt-embed.css" />
	{/if}
	<title>{lens.model} — FujiLenses</title>
	<meta
		name="description"
		content="{lens.manufacturer} {lens.model} — {focalDisplay} f/{lens.maxAperture} {lens.mountType} mount lens."
	/>
	<link rel="canonical" href="https://fujilenses.com/lens/{lens.slug}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://fujilenses.com/lens/{lens.slug}" />
	<meta property="og:title" content="{lens.model} — FujiLenses" />
	<meta
		property="og:description"
		content="{lens.manufacturer} {lens.model} — {focalDisplay} f/{lens.maxAperture}. {lens.weightGrams}g, {lens.releaseYear}."
	/>
	<meta property="og:image" content="https://fujilenses.com/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
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
				<span class="spec-label">Focus</span>
				<span class="spec-val">
					<span class="spec-indicator" class:yes={lens.autofocus}></span>
					{lens.autofocus ? 'Autofocus' : 'Manual Focus'}
				</span>
			</div>
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
			{#if lens.filterDiameterMm > 0}
				<div class="spec-item">
					<span class="spec-label">Filter Size</span>
					<span class="spec-val">
						&oslash;{lens.filterDiameterMm}mm{#if lens.filterViaAdapter}<span class="spec-asterisk">*</span>{/if}
					</span>
				</div>
			{/if}
		</div>

		{#if lens.filterViaAdapter}
			<p class="spec-footnote">
				*Filter attaches via included adapter, not a native front thread.
			</p>
		{/if}

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

{#if hasReviews}
	<section class="reviews-section">
		<h2 class="reviews-heading">Reviews</h2>
		<div class="reviews-list">
			{#each lens.reviews as review (review.videoId)}
				<div class="review-card">
					<lite-youtube videoid={review.videoId} playlabel="Play: {review.title}"></lite-youtube>
					<div class="review-meta">
						<span class="review-title">{review.title}</span>
						<span class="review-channel">{review.channel}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if similarLenses.length > 0}
	<section class="also-consider">
		<h2 class="also-heading">Also Consider</h2>
		<div class="also-list">
			{#each similarLenses as similar (similar.slug)}
				{@const simColor = manufacturerColors[similar.manufacturer] ?? 'var(--text-muted)'}
				{@const simFocal = similar.minFocalLength === similar.maxFocalLength
					? `${similar.minFocalLength}mm`
					: `${similar.minFocalLength}–${similar.maxFocalLength}mm`}
				<a href="/lens/{similar.slug}" class="also-card">
					<span
						class="also-mfr"
						style="background: {simColor}; color: var(--bg-base);"
					>
						{similar.manufacturer}
					</span>
					<span class="also-model">{similar.model}</span>
					<span class="also-specs">
						<span>{simFocal}</span>
						<span class="also-sep">&middot;</span>
						<span>f/{similar.maxAperture}</span>
						<span class="also-sep">&middot;</span>
						<span>{similar.weightGrams}g</span>
					</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

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
		letter-spacing: -0.02em;
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
		padding: 12px 8px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.spec-item:nth-child(4n+3),
	.spec-item:nth-child(4n+4) {
		background: var(--bg-surface);
		border-radius: 4px;
	}

	/* Fix orphan: when odd number of items, last item gets full width */
	.spec-item:last-child:nth-child(odd) {
		grid-column: 1 / -1;
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

	.spec-asterisk {
		color: var(--text-muted);
		margin-left: 1px;
	}

	.spec-footnote {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 12px;
		line-height: 1.5;
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

		.reviews-list {
			display: flex;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			gap: 12px;
			grid-template-columns: none;
		}

		.review-card {
			min-width: 280px;
			max-width: 320px;
			flex-shrink: 0;
			scroll-snap-align: start;
		}

		.also-list {
			display: flex;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			gap: 12px;
			padding-bottom: 4px;
		}

		.also-card {
			min-width: 220px;
			max-width: 280px;
			flex-shrink: 0;
			scroll-snap-align: start;
		}
	}

	/* Reviews */
	.reviews-section {
		margin-top: 48px;
		padding-top: 32px;
		border-top: 1px solid var(--border-subtle);
	}

	.reviews-heading {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		color: var(--text-primary);
		margin: 0 0 16px 0;
	}

	.reviews-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 16px;
	}

	.review-card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		border-radius: 8px;
		overflow: hidden;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
	}

	.review-card :global(lite-youtube) {
		width: 100%;
		max-width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0;
	}

	.review-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 12px 12px;
	}

	.review-title {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 13px;
		color: var(--text-primary);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.review-channel {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-muted);
	}

	/* Also Consider */
	.also-consider {
		margin-top: 48px;
		padding-top: 32px;
		border-top: 1px solid var(--border-subtle);
		overflow: hidden;
	}

	.also-heading {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		color: var(--text-primary);
		margin: 0 0 16px 0;
	}

	.also-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.also-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px;
		border-radius: 8px;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		text-decoration: none;
		color: inherit;
	}

	@media (prefers-reduced-motion: no-preference) {
		.also-card {
			transition: border-color 150ms ease, background 150ms ease;
		}
	}

	.also-card:hover {
		border-color: var(--accent);
		background: var(--bg-elevated);
	}

	.also-card:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.also-mfr {
		display: inline-block;
		align-self: flex-start;
		padding: 2px 8px;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.also-model {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 14px;
		color: var(--text-primary);
	}

	.also-specs {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-muted);
	}

	.also-sep {
		opacity: 0.4;
	}
</style>
