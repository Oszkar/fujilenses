<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { fly, fade } from 'svelte/transition';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	import NavBar from '$lib/components/NavBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { allLenses } from '$lib/data';
	import { getKitCount } from '$lib/kit.svelte';
	import { parseFiltersFromURL, filtersToSearchParams, defaultFilters } from '$lib/filters';
	import { browser } from '$app/environment';
	import type { FilterState, ViewMode } from '$lib/types';

	injectSpeedInsights();

	let { children } = $props();

	let kitCount = $derived(getKitCount());
	let drawerOpen = $state(false);
	let drawerEl: HTMLDivElement | undefined = $state();
	let previousActiveElement: HTMLElement | null = null;

	let filters = $derived(browser ? parseFiltersFromURL(page.url.searchParams) : defaultFilters);

	function updateFilters(updates: Partial<FilterState>) {
		const next = { ...filters, ...updates };
		const params = filtersToSearchParams(next);
		const query = params.toString();
		goto(query ? `?${query}` : '/', { replaceState: true, noScroll: true, keepFocus: true });
	}

	function handleViewChange(view: ViewMode) {
		updateFilters({ view });
	}

	function toggleDrawer() {
		drawerOpen = !drawerOpen;
	}

	function closeDrawer() {
		drawerOpen = false;
	}

	function getDrawerFocusableElements(): HTMLElement[] {
		if (!drawerEl) return [];
		return Array.from(
			drawerEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
			)
		).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
	}

	function handleDrawerKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			closeDrawer();
			return;
		}

		if (event.key !== 'Tab') return;

		const focusable = getDrawerFocusableElements();
		if (focusable.length === 0) {
			event.preventDefault();
			drawerEl?.focus();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement;

		if (event.shiftKey) {
			if (active === first || active === drawerEl) {
				event.preventDefault();
				last.focus();
			}
		} else if (active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		if (!drawerOpen) return;

		previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

		queueMicrotask(() => {
			const focusable = getDrawerFocusableElements();
			(focusable[0] ?? drawerEl)?.focus();
		});

		return () => {
			previousActiveElement?.focus();
			previousActiveElement = null;
		};
	});
</script>

<div class="app-shell">
	<NavBar
		activeView={filters.view}
		{kitCount}
		onViewChange={handleViewChange}
		onToggleDrawer={toggleDrawer}
	/>
	<div class="app-body">
		<!-- Desktop sidebar -->
		<div class="sidebar-desktop">
			<Sidebar {filters} onFilterChange={updateFilters} />
		</div>

		<!-- Mobile drawer overlay -->
		{#if drawerOpen}
			<button type="button" class="drawer-overlay" onclick={closeDrawer} aria-label="Close filters" transition:fade={{ duration: 250 }}></button>
			<div
				class="drawer"
				transition:fly={{ x: -280, duration: 250 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby="drawer-title"
				tabindex="-1"
				bind:this={drawerEl}
				onkeydown={handleDrawerKeydown}
			>
				<div class="drawer-header">
					<h2 class="drawer-title" id="drawer-title">Filters</h2>
					<button class="drawer-close" onclick={closeDrawer} aria-label="Close filters">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
						</svg>
					</button>
				</div>
				<Sidebar {filters} onFilterChange={updateFilters} />
			</div>
		{/if}

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
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	.app-body {
		display: flex;
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.sidebar-desktop {
		display: contents;
	}

	.content {
		flex: 1;
		padding: 24px 36px;
		overflow-y: auto;
	}

	/* Drawer (mobile only) */
	.drawer-overlay {
		display: none;
	}

	.drawer {
		display: none;
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.drawer-title {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 15px;
		color: var(--text-primary);
	}

	.drawer-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.drawer-close:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
	}

	.drawer-close:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	@media (max-width: 1023px) {
		.sidebar-desktop {
			display: none;
		}

		.content {
			padding: 16px;
		}

		.drawer-overlay {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 40;
		}

		.drawer {
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			width: 280px;
			max-width: 85vw;
			background: var(--bg-surface);
			border-right: 1px solid var(--border-subtle);
			z-index: 50;
			overflow-y: auto;
		}

		/* Override sidebar width inside drawer */
		.drawer :global(.sidebar) {
			width: 100%;
			min-width: 0;
			border-right: none;
		}
	}
</style>
