<script lang="ts">
	import {
		SITE_URL,
		SITE_NAME,
		SITE_OG_IMAGE,
		SITE_OG_IMAGE_ALT,
		jsonLdScript
	} from '$lib/seo';

	let {
		title,
		description,
		path = '',
		jsonLd
	}: {
		title: string;
		description: string;
		/** Path from the site root, e.g. "/lens/xf-35mm-f14-r". Empty for the home page. */
		path?: string;
		jsonLd?: Record<string, unknown>;
	} = $props();

	let url = $derived(`${SITE_URL}${path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={SITE_OG_IMAGE} />
	<meta property="og:image:alt" content={SITE_OG_IMAGE_ALT} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={SITE_OG_IMAGE} />
	<meta name="twitter:image:alt" content={SITE_OG_IMAGE_ALT} />
	{#if jsonLd}
		{@html jsonLdScript(jsonLd)}
	{/if}
</svelte:head>
