<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.lens.model} — FujiLenses</title>
	<meta
		name="description"
		content="{data.lens.manufacturer} {data.lens.model} — {data.lens.minFocalLength === data.lens.maxFocalLength ? `${data.lens.minFocalLength}mm` : `${data.lens.minFocalLength}-${data.lens.maxFocalLength}mm`} f/{data.lens.maxAperture} {data.lens.mountType} mount lens."
	/>
	<meta property="og:title" content="{data.lens.model} — FujiLenses" />
	<meta
		property="og:description"
		content="{data.lens.manufacturer} {data.lens.model} — {data.lens.mountType} mount lens specs and details."
	/>
</svelte:head>

<main>
	<a href="/">&larr; Back to all lenses</a>
	<h1>{data.lens.manufacturer} {data.lens.model}</h1>
	<!-- TODO: Full spec card -->
	<!-- TODO: Add to My Kit button -->
</main>
