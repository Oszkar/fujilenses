<script lang="ts">
	type View = 'table' | 'map' | 'kit';

	interface Props {
		activeView: View;
		kitCount: number;
		onViewChange: (view: View) => void;
		onToggleDrawer?: () => void;
	}

	let { activeView, kitCount, onViewChange, onToggleDrawer }: Props = $props();

	const tabs: { id: View; label: string }[] = [
		{ id: 'table', label: 'Table' },
		{ id: 'map', label: 'Map' },
		{ id: 'kit', label: 'My Kit' }
	];
</script>

<nav class="nav-bar">
	<div class="nav-left">
		{#if onToggleDrawer}
			<button class="drawer-toggle" onclick={onToggleDrawer} aria-label="Toggle filters">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</button>
		{/if}
		<span class="logo">FujiLenses</span>
		<div class="divider"></div>
		<div class="tabs">
			{#each tabs as tab (tab.id)}
				<button
					class="tab"
					class:active={activeView === tab.id}
					onclick={() => onViewChange(tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	{#if kitCount > 0}
		<div class="kit-count">
			<span class="kit-dot"></span>
			<span class="kit-label"><span class="kit-num">{kitCount}</span> in kit</span>
		</div>
	{/if}
</nav>

<style>
	.nav-bar {
		position: sticky;
		top: 0;
		z-index: var(--z-nav);
		display: flex;
		width: 100%;
		height: var(--nav-height);
		align-items: center;
		justify-content: space-between;
		background: color-mix(in srgb, var(--bg-surface) 82%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: inset 0 -1px 0 0 var(--border-subtle);
		padding: 0 var(--space-10);
		font-family: var(--font-sans);
		gap: var(--space-3);
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		min-width: 0;
	}

	.logo {
		font-family: var(--font-sans);
		font-weight: var(--weight-bold);
		font-size: 17px;
		color: var(--text-primary);
		white-space: nowrap;
		user-select: none;
	}

	.divider {
		width: 1px;
		height: var(--space-6);
		background: var(--border-default);
		flex-shrink: 0;
	}

	.tabs {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.tab {
		padding: 6px 14px;
		border-radius: var(--radius-md);
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
		transition:
			color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out);
	}

	.tab:hover {
		color: var(--text-primary);
		background: var(--bg-elevated);
	}

	.tab:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.tab.active {
		background: var(--bg-accent);
		color: var(--accent-bright);
	}

	.tab.active:hover {
		background: var(--bg-accent);
		color: var(--accent-bright);
	}

	.drawer-toggle {
		display: none;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-default);
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}

	.drawer-toggle:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
	}

	.drawer-toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.kit-count {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.kit-num {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.kit-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		background: var(--kit);
	}

	/* Mobile */
	@media (max-width: 1023px) {
		.nav-bar {
			padding: 0 var(--space-4);
		}

		.drawer-toggle {
			display: flex;
		}

		.divider {
			display: none;
		}

		.nav-left {
			gap: var(--space-3);
		}

		.tab {
			padding: 6px 10px;
			font-size: calc(var(--text-sm) * var(--font-scale, 1));
		}

		.kit-label {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.logo {
			display: none;
		}
	}
</style>
