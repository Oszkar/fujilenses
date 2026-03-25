<script lang="ts">
	interface Props {
		activeView: 'table' | 'map' | 'kit';
	}

	let { activeView }: Props = $props();
</script>

<aside class="sidebar">
	<div class="section">
		<h3 class="section-header">Manufacturer</h3>
		<div class="placeholder"><!-- TODO: manufacturer filter --></div>
	</div>

	<div class="section">
		<h3 class="section-header">Lens Type</h3>
		<div class="placeholder"><!-- TODO: lens type segmented control --></div>
	</div>

	<div class="section">
		<h3 class="section-header">Features</h3>
		<div class="placeholder"><!-- TODO: WR, OIS, AR toggles --></div>
	</div>

	<div class="section">
		<h3 class="section-header">Display</h3>
		<div class="placeholder"><!-- TODO: FF Equivalent toggle --></div>
	</div>

	{#if activeView === 'map'}
		<div class="section">
			<h3 class="section-header">Legend</h3>
			<div class="placeholder"><!-- TODO: map legend --></div>
		</div>

		<div class="section">
			<h3 class="section-header">Scale</h3>
			<div class="placeholder"><!-- TODO: Log/Linear toggle --></div>
		</div>
	{/if}

	<div class="section">
		<h3 class="section-header">Font Size</h3>
		<div class="placeholder"><!-- TODO: S/M/L selector --></div>
	</div>

	<div class="section">
		<h3 class="section-header">Theme</h3>
		<div class="placeholder"><!-- TODO: Dark/Light toggle --></div>
	</div>
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

	.section-header {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0 0 12px 0;
	}

	.placeholder {
		min-height: 20px;
	}
</style>
