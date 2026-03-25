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
		<span>{lensCount} lenses</span>
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
		padding: 12px 40px;
		background: var(--bg-surface);
		border-top: 1px solid var(--border-subtle);
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--text-muted);
		position: sticky;
		bottom: 0;
		z-index: 10;
	}

	.footer-left,
	.footer-right {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.sep {
		opacity: 0.5;
	}

	.feedback-btn {
		background: none;
		border: none;
		padding: 0;
		color: var(--text-muted);
		font-family: var(--font-sans);
		font-size: 12px;
		cursor: pointer;
		transition: color 150ms ease;
	}

	.feedback-btn:hover {
		color: var(--accent);
	}

	@media (max-width: 1023px) {
		.footer {
			padding: 12px 16px;
			font-size: 11px;
			flex-direction: column;
			gap: 4px;
			align-items: flex-start;
		}

		.feedback-btn {
			font-size: 11px;
		}
	}
</style>
