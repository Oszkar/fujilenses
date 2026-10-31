<script lang="ts">
	let { inKit, model, onToggle }: { inKit: boolean; model: string; onToggle: () => void } = $props();
</script>
<button
	type="button"
	class:owned={inKit}
	onclick={onToggle}
	aria-label={inKit ? `Remove ${model} from kit` : `Add ${model} to kit`}
	title={inKit ? 'Remove from kit' : 'Add to kit'}>
	{#if inKit}
		<span class="status" aria-hidden="true">✓ In kit</span>
		<span class="remove" aria-hidden="true">Remove from kit</span>
	{:else}
		<span aria-hidden="true">+ Add to kit</span>
	{/if}
</button>

<style>
	button {
		display: inline-grid;
		place-items: center;
		width: 10.5em;
		min-height: 30px;
		padding: 4px 8px;
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		white-space: nowrap;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		background: var(--bg-surface);
		color: var(--text-secondary);
		cursor: pointer;
	}

	button:hover {
		background: var(--bg-elevated);
	}

	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.owned {
		color: var(--kit);
		border-color: currentColor;
	}

	.owned span {
		grid-area: 1 / 1;
	}

	.remove {
		visibility: hidden;
	}

	.owned:hover .status, .owned:focus-visible .status {
		visibility: hidden;
	}

	.owned:hover .remove, .owned:focus-visible .remove {
		visibility: visible;
	}

	.owned:hover, .owned:focus-visible {
		color: var(--danger);
	}

</style>
