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
			<span class="kit-label">{kitCount} in kit</span>
		</div>
	{/if}
</nav>

<style>
	.nav-bar {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-surface);
		border-bottom: 1px solid var(--border-subtle);
		padding: 18px 40px;
		font-family: var(--font-sans);
		gap: 12px;
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: 20px;
		min-width: 0;
	}

	.logo {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 17px;
		color: var(--text-primary);
		white-space: nowrap;
		user-select: none;
	}

	.divider {
		width: 1px;
		height: 24px;
		background: var(--border-default);
		flex-shrink: 0;
	}

	.tabs {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.tab {
		padding: 6px 14px;
		border-radius: 6px;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 13px;
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
		transition:
			color 200ms ease,
			background 200ms ease;
	}

	.tab:hover {
		color: var(--text-secondary);
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
		color: var(--accent-bright);
	}

	.drawer-toggle {
		display: none;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 6px;
		border: 1px solid var(--border-default);
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background 150ms ease,
			color 150ms ease;
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
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.kit-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--kit);
	}

	/* Mobile */
	@media (max-width: 1023px) {
		.nav-bar {
			padding: 12px 16px;
		}

		.drawer-toggle {
			display: flex;
		}

		.divider {
			display: none;
		}

		.nav-left {
			gap: 12px;
		}

		.tab {
			padding: 6px 10px;
			font-size: 12px;
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
