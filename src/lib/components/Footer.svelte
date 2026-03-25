<script lang="ts">
	interface Props {
		lensCount: number;
	}

	let { lensCount }: Props = $props();
</script>

<footer class="footer">
	<span>{lensCount} lenses</span>
	<span>FujiLenses v1.0 &nbsp;|&nbsp; Independent lens database</span>
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
	}
</style>
