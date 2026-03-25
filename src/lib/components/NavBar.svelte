<script lang="ts">
	type View = 'table' | 'map' | 'kit';

	interface Props {
		activeView: View;
		kitCount: number;
		onViewChange: (view: View) => void;
	}

	let { activeView, kitCount, onViewChange }: Props = $props();

	const tabs: { id: View; label: string }[] = [
		{ id: 'table', label: 'Table' },
		{ id: 'map', label: 'Map' },
		{ id: 'kit', label: 'My Kit' }
	];
</script>

<nav class="nav-bar">
	<div class="flex items-center gap-5">
		<span class="logo">FujiLenses</span>
		<div class="divider"></div>
		<div class="flex items-center gap-1">
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
			<span>{kitCount} in kit</span>
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

	.kit-count {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-secondary);
	}

	.kit-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--kit);
	}
</style>
