<script lang="ts">
	interface Props {
		lensCount: number;
	}

	let { lensCount }: Props = $props();
</script>

<footer class="footer">
	<div class="footer-left">
		<span>{lensCount} lenses</span>
		<span class="sep">&middot;</span>
		<a
			href="https://github.com/Oszkar/fujilenses/issues/new?labels=data&template=blank&title=Data+issue"
			target="_blank"
			rel="noopener noreferrer"
			class="feedback-link"
		>
			Report an issue
		</a>
	</div>
	<div class="footer-right">
		<span>FujiLenses v1.0</span>
		<span class="sep">&middot;</span>
		<span>Independent project, not affiliated with Fujifilm</span>
	</div>
</footer>

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
		color: var(--text-faint);
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

	.feedback-link {
		color: var(--text-muted);
		text-decoration: none;
		transition: color 150ms ease;
	}

	.feedback-link:hover {
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
	}
</style>
