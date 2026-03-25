<script lang="ts">
	import { allLenses } from '$lib/data';
</script>

<svelte:head>
	<title>FujiLenses — Fujifilm X-Mount Lens Explorer</title>
	<meta
		name="description"
		content="Browse and compare Fujifilm X-mount lenses — Fujinon, Sigma, Viltrox, Tamron and more."
	/>
</svelte:head>

<h1 class="page-heading">Lens Inventory</h1>
<p class="page-subtitle">{allLenses.length} lenses matching current filters</p>

<style>
	.page-heading {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 22px;
		color: var(--text-primary);
		margin: 0 0 4px 0;
	}

	.page-subtitle {
		font-family: var(--font-sans);
		font-size: 13px;
		color: var(--text-muted);
		margin: 0 0 24px 0;
	}
</style>
