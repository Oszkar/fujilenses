<script lang="ts">
	import './layout.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { allLenses } from '$lib/data';
	import { getKit } from '$lib/kit';
	import { browser } from '$app/environment';

	let { children } = $props();

	let activeView = $state<'table' | 'map' | 'kit'>('table');
	let kitCount = $state(0);

	if (browser) {
		kitCount = getKit().size;
	}

	function handleViewChange(view: 'table' | 'map' | 'kit') {
		activeView = view;
	}
</script>

<div class="app-shell">
	<NavBar {activeView} {kitCount} onViewChange={handleViewChange} />
	<div class="app-body">
		<Sidebar {activeView} />
		<main class="content">
			{@render children()}
		</main>
	</div>
	<Footer lensCount={allLenses.length} />
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.app-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.content {
		flex: 1;
		padding: 24px 36px;
		overflow-y: auto;
	}
</style>
