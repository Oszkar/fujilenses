<script lang="ts">
	import FeedbackPopover from './FeedbackPopover.svelte';

	interface Props {
		lensCount: number;
	}

	let { lensCount }: Props = $props();

	let feedbackOpen = $state(false);
</script>

<footer class="footer">
	<div class="footer-left">
		<span><span class="lens-num">{lensCount}</span> lenses</span>
		<span class="sep">&middot;</span>
		<button class="feedback-btn" onclick={() => (feedbackOpen = true)}>
			Send feedback
		</button>
	</div>
	<div class="footer-right">
		<span>FujiLenses v1.0</span>
		<span class="sep">&middot;</span>
		<span>Independent project, not affiliated with Fujifilm</span>
	</div>
</footer>

<FeedbackPopover open={feedbackOpen} onClose={() => (feedbackOpen = false)} />

<style>
	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-10);
		background: var(--bg-surface);
		border-top: 1px solid var(--border-subtle);
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		color: var(--text-muted);
		position: sticky;
		bottom: 0;
		z-index: var(--z-sticky);
	}

	.footer-left,
	.footer-right {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.lens-num {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.sep {
		opacity: 0.5;
	}

	.feedback-btn {
		background: none;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 2px var(--space-2);
		color: var(--text-muted);
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		cursor: pointer;
		transition: color var(--dur-fast) var(--ease-out);
	}

	.feedback-btn:hover {
		color: var(--accent);
	}

	@media (max-width: 1023px) {
		.footer {
			padding: var(--space-3) var(--space-4);
			font-size: calc(var(--text-xs) * var(--font-scale, 1));
			flex-direction: column;
			gap: var(--space-1);
			align-items: flex-start;
		}

		.feedback-btn {
			font-size: calc(var(--text-xs) * var(--font-scale, 1));
		}
	}
</style>
