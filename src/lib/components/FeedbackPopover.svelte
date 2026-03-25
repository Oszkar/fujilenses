<script lang="ts">
	type Category = 'data' | 'feature' | 'feedback';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	let category = $state<Category | null>(null);
	let message = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	const categories: { value: Category; label: string; description: string }[] = [
		{ value: 'data', label: 'Incorrect data', description: 'Wrong specs, missing lens, typo' },
		{ value: 'feature', label: 'Feature request', description: 'Suggest a new feature or improvement' },
		{ value: 'feedback', label: 'General feedback', description: 'Anything else' }
	];

	async function handleSubmit() {
		if (!category || !message.trim()) return;

		submitting = true;
		error = '';

		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					access_key: 'a817917c-36af-40a8-a9c8-fc25987d1ffb',
					subject: `[FujiLenses] ${categories.find((c) => c.value === category)?.label}`,
					category,
					message: message.trim(),
					from_name: 'FujiLenses Feedback'
				})
			});
			const data = await res.json();
			if (data.success) {
				submitted = true;
			} else {
				error = 'Something went wrong. Please try again.';
			}
		} catch {
			error = 'Could not send feedback. Please try again.';
		} finally {
			submitting = false;
		}
	}

	function reset() {
		category = null;
		message = '';
		submitted = false;
		error = '';
	}

	function handleClose() {
		onClose();
		// Reset after close animation
		setTimeout(reset, 200);
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="overlay" onclick={handleClose} onkeydown={() => {}}></div>
	<div class="popover" role="dialog" aria-label="Send feedback">
		<div class="popover-header">
			<span class="popover-title">
				{submitted ? 'Thanks!' : 'Send Feedback'}
			</span>
			<button class="close-btn" onclick={handleClose} aria-label="Close">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M4 4l8 8M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</button>
		</div>

		{#if submitted}
			<div class="popover-body">
				<p class="success-msg">Your feedback has been sent. We appreciate it!</p>
			</div>
		{:else}
			<div class="popover-body">
				<!-- Category select -->
				<div class="field">
					<span class="field-label">Category</span>
					<div class="category-list">
						{#each categories as cat (cat.value)}
							<button
								class="category-btn"
								class:active={category === cat.value}
								onclick={() => (category = cat.value)}
							>
								<span class="cat-label">{cat.label}</span>
								<span class="cat-desc">{cat.description}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Message -->
				<div class="field">
					<span class="field-label">Message</span>
					<textarea
						class="message-input"
						rows="4"
						placeholder="Describe the issue or suggestion..."
						bind:value={message}
					></textarea>
				</div>

				{#if error}
					<p class="error-msg">{error}</p>
				{/if}

				<button
					class="submit-btn"
					disabled={!category || !message.trim() || submitting}
					onclick={handleSubmit}
				>
					{submitting ? 'Sending...' : 'Send'}
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 60;
	}

	.popover {
		position: fixed;
		bottom: 56px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 70;
		width: 380px;
		max-width: calc(100vw - 32px);
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 12px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	.popover-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 16px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.popover-title {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 14px;
		color: var(--text-primary);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		transition: background 150ms ease, color 150ms ease;
	}

	.close-btn:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
	}

	.popover-body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	.category-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.category-btn {
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: 8px 10px;
		border-radius: 6px;
		border: 1px solid var(--border-default);
		background: transparent;
		cursor: pointer;
		text-align: left;
		transition: background 150ms ease, border-color 150ms ease;
	}

	.category-btn:hover {
		background: var(--bg-elevated);
	}

	.category-btn.active {
		background: var(--bg-accent);
		border-color: var(--accent);
	}

	.cat-label {
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 13px;
		color: var(--text-primary);
	}

	.cat-desc {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-muted);
	}

	.message-input {
		width: 100%;
		padding: 8px 10px;
		border-radius: 6px;
		border: 1px solid var(--border-default);
		background: var(--bg-base);
		color: var(--text-primary);
		font-family: var(--font-sans);
		font-size: 13px;
		resize: vertical;
		min-height: 80px;
		transition: border-color 150ms ease;
	}

	.message-input::placeholder {
		color: var(--text-faint);
	}

	.message-input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.submit-btn {
		width: 100%;
		padding: 10px;
		border-radius: 6px;
		border: none;
		background: var(--accent);
		color: var(--bg-base);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		transition: opacity 150ms ease;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.submit-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.error-msg {
		font-family: var(--font-sans);
		font-size: 12px;
		color: var(--danger);
		margin: 0;
	}

	.success-msg {
		font-family: var(--font-sans);
		font-size: 13px;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
	}
</style>
