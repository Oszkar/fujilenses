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

	// Roadmap: retailer/price slot. Render-only from existing fields; no fetching.
	// Only allow http(s) targets — anything else (e.g. javascript:) is treated as no link.
	function safeUrl(url: string): string | null {
		if (!url) return null;
		try {
			const parsed = new URL(url, 'https://fujilenses.com');
			return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
		} catch {
			return null;
		}
	}

	let hasPrice = $derived(lens.approxPriceUSD > 0);
	let safeRetailerUrl = $derived(safeUrl(lens.retailerUrl));
	let hasRetailer = $derived(safeRetailerUrl !== null);
	let showBuyBlock = $derived(hasPrice || hasRetailer);
	let priceDisplay = $derived(`~$${lens.approxPriceUSD.toLocaleString('en-US')}`);
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

		<!-- Photo placeholder: 4:3 hatched frame, ready to swap for a real <img> -->
		<div class="photo-placeholder">
			<div class="photo-ph">
				<svg class="photo-glyph" width="32" height="32" viewBox="0 0 32 32" fill="none">
					<rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
					<circle cx="16" cy="17" r="5" stroke="currentColor" stroke-width="1.5" />
					<rect x="11" y="6" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5" />
				</svg>
				<span>No photo available</span>
			</div>
		</div>

		<!-- Retailer / price slot — renders only when there's data to show -->
		{#if showBuyBlock}
			<div class="buy-block">
				<span class="buy-label">Where to buy</span>
				{#if hasPrice}
					<div class="buy-price">
						<span class="buy-amount">{priceDisplay}</span>
						<span class="buy-price-caption">
							Indicative{#if lens.priceUpdatedYear > 0} · updated {lens.priceUpdatedYear}{/if}
						</span>
					</div>
				{/if}
				{#if hasRetailer}
					<a
						class="buy-link"
						href={safeRetailerUrl}
						target="_blank"
						rel="noopener noreferrer nofollow sponsored"
					>
						Check price <span class="buy-arrow" aria-hidden="true">↗</span>
					</a>
					<p class="buy-disclosure">Affiliate link — we may earn a commission.</p>
				{/if}
			</div>
		{/if}
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
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--accent);
		text-decoration: none;
		margin-bottom: var(--space-6);
		transition: color var(--dur-fast) var(--ease-out);
	}

	.back-link:hover {
		color: var(--accent-bright);
	}

	.detail-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-12);
		align-items: start;
	}

	/* Hero (left) */
	.mount-label {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: var(--tracking-label);
	}

	/* Hero name — display treatment */
	.model-name {
		font-family: var(--font-sans);
		font-weight: var(--weight-bold);
		font-size: calc(var(--text-3xl) * var(--font-scale, 1));
		line-height: var(--leading-tight);
		letter-spacing: var(--tracking-tight);
		color: var(--text-primary);
		margin: var(--space-2) 0 var(--space-6) 0;
	}

	.new-badge {
		display: inline-block;
		padding: 2px var(--space-2);
		border-radius: var(--radius-sm);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: var(--tracking-badge);
		color: var(--new);
		background: color-mix(in srgb, var(--new) 15%, transparent);
		vertical-align: middle;
	}

	.key-stats {
		display: flex;
		gap: var(--space-8);
		margin-bottom: var(--space-8);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	/* Label — .t-label treatment */
	.stat-label {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: var(--tracking-label);
		color: var(--text-muted);
	}

	.stat-value {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xl) * var(--font-scale, 1));
		color: var(--text-primary);
		letter-spacing: var(--tracking-tight);
	}

	/* Photo — 4:3 hatched placeholder frame (swap for <img> later) */
	.photo-placeholder {
		position: relative;
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-xl);
		background:
			repeating-linear-gradient(
				45deg,
				transparent 0 11px,
				color-mix(in srgb, var(--text-faint) 25%, transparent) 11px 12px
			),
			var(--bg-surface);
		border: 1px solid var(--border-subtle);
	}

	.photo-ph {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	.photo-glyph {
		color: var(--text-muted);
	}

	/* Retailer / price slot — card under the photo */
	.buy-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
	}

	/* Label — .t-label treatment */
	.buy-label {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: var(--tracking-label);
		color: var(--text-muted);
	}

	.buy-price {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.buy-amount {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xl) * var(--font-scale, 1));
		color: var(--text-primary);
		letter-spacing: var(--tracking-tight);
	}

	.buy-price-caption {
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	.buy-link {
		align-self: flex-start;
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		color: var(--accent);
		text-decoration: none;
		transition: color var(--dur-fast) var(--ease-out);
	}

	.buy-link:hover {
		color: var(--accent-bright);
	}

	.buy-arrow {
		font-size: 0.9em;
	}

	.buy-disclosure {
		margin: 0;
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
		line-height: var(--leading-normal);
	}

	/* Specs (right) */
	.specs-heading {
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-lg) * var(--font-scale, 1));
		color: var(--text-primary);
		margin: 0 0 var(--space-5) 0;
	}

	.spec-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
	}

	.spec-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3) var(--space-2);
		border-bottom: 1px solid var(--border-subtle);
	}

	.spec-item:nth-child(4n+3),
	.spec-item:nth-child(4n+4) {
		background: var(--bg-surface);
		border-radius: var(--radius-sm);
	}

	/* Fix orphan: when odd number of items, last item gets full width */
	.spec-item:last-child:nth-child(odd) {
		grid-column: 1 / -1;
	}

	/* Label — .t-label treatment */
	.spec-label {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: var(--tracking-label);
		color: var(--text-muted);
	}

	.spec-val {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.spec-indicator {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
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
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
		margin-top: var(--space-3);
		line-height: var(--leading-normal);
	}

	/* Kit button — follows .btn-primary */
	.kit-btn {
		width: 100%;
		margin-top: var(--space-6);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid transparent;
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		cursor: pointer;
		transition:
			background var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
		background: var(--accent);
		color: var(--text-on-accent);
	}

	.kit-btn:hover {
		background: var(--accent-hover);
	}

	/* In-kit toggled state — kit-green secondary treatment */
	.kit-btn.in-kit {
		background: color-mix(in srgb, var(--kit) 15%, transparent);
		border-color: color-mix(in srgb, var(--kit) 40%, transparent);
		color: var(--kit);
	}

	.kit-btn.in-kit:hover {
		background: var(--danger-bg);
		border-color: color-mix(in srgb, var(--danger) 40%, transparent);
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
			gap: var(--space-8);
		}

		.model-name {
			font-size: calc(var(--text-2xl) * var(--font-scale, 1));
		}

		.key-stats {
			gap: var(--space-6);
		}

		.stat-value {
			font-size: calc(var(--text-lg) * var(--font-scale, 1));
		}

		.reviews-list {
			display: flex;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			gap: var(--space-3);
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
			gap: var(--space-3);
			padding-bottom: var(--space-1);
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
		margin-top: var(--space-12);
		padding-top: var(--space-8);
		border-top: 1px solid var(--border-subtle);
	}

	.reviews-heading {
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-lg) * var(--font-scale, 1));
		color: var(--text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.reviews-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.review-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		border-radius: var(--radius-lg);
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
		padding: 0 var(--space-3) var(--space-3);
	}

	.review-title {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-primary);
		line-height: var(--leading-snug);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.review-channel {
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	/* Also Consider */
	.also-consider {
		margin-top: var(--space-12);
		padding-top: var(--space-8);
		border-top: 1px solid var(--border-subtle);
		overflow: hidden;
	}

	.also-heading {
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-lg) * var(--font-scale, 1));
		color: var(--text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.also-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
	}

	.also-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		text-decoration: none;
		color: inherit;
	}

	@media (prefers-reduced-motion: no-preference) {
		.also-card {
			transition:
				border-color var(--dur-fast) var(--ease-out),
				background var(--dur-fast) var(--ease-out);
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
		padding: 2px var(--space-2);
		border-radius: var(--radius-xs);
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-2xs) * var(--font-scale, 1));
		text-transform: uppercase;
		letter-spacing: var(--tracking-badge);
	}

	.also-model {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		color: var(--text-primary);
	}

	.also-specs {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	.also-sep {
		opacity: 0.4;
	}
</style>
