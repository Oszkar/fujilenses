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
	let popoverEl: HTMLDivElement | undefined = $state();
	let previousActiveElement: HTMLElement | null = null;

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

	function getFocusableElements(): HTMLElement[] {
		if (!popoverEl) return [];
		return Array.from(
			popoverEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
			)
		).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			handleClose();
			return;
		}

		if (event.key !== 'Tab') return;

		const focusable = getFocusableElements();
		if (focusable.length === 0) {
			event.preventDefault();
			popoverEl?.focus();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement;

		if (event.shiftKey) {
			if (active === first || active === popoverEl) {
				event.preventDefault();
				last.focus();
			}
		} else if (active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		if (!open) return;

		previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

		queueMicrotask(() => {
			const focusable = getFocusableElements();
			(focusable[0] ?? popoverEl)?.focus();
		});

		return () => {
			previousActiveElement?.focus();
			previousActiveElement = null;
		};
	});
</script>

{#if open}
	<button type="button" class="overlay" onclick={handleClose} aria-label="Close feedback dialog"></button>
	<div
		class="popover"
		role="dialog"
		aria-modal="true"
		aria-labelledby="feedback-popover-title"
		tabindex="-1"
		bind:this={popoverEl}
		onkeydown={handleKeydown}
	>
		<div class="popover-header">
			<h2 class="popover-title" id="feedback-popover-title">
				{submitted ? 'Thanks!' : 'Send Feedback'}
			</h2>
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
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
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
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-md) * var(--font-scale, 1));
		color: var(--text-primary);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-md);
		border: none;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			background var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
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
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		font-weight: var(--weight-medium);
		text-transform: uppercase;
		letter-spacing: var(--tracking-label);
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
		border-radius: var(--radius-md);
		border: 1px solid var(--border-default);
		background: transparent;
		cursor: pointer;
		text-align: left;
		transition:
			background var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out);
	}

	.category-btn:hover {
		background: var(--bg-elevated);
	}

	.category-btn.active {
		background: var(--bg-accent);
		border-color: var(--accent);
	}

	.category-btn.active .cat-label {
		color: var(--accent-bright);
	}

	.cat-label {
		font-family: var(--font-sans);
		font-weight: var(--weight-medium);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-primary);
	}

	.cat-desc {
		font-family: var(--font-sans);
		font-size: calc(var(--text-xs) * var(--font-scale, 1));
		color: var(--text-muted);
	}

	.message-input {
		width: 100%;
		padding: 8px 10px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-default);
		background: var(--bg-base);
		color: var(--text-primary);
		font-family: var(--font-sans);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		resize: vertical;
		min-height: 80px;
		transition: border-color var(--dur-fast) var(--ease-out);
	}

	.message-input::placeholder {
		color: var(--text-faint);
	}

	.submit-btn {
		width: 100%;
		padding: 10px;
		border-radius: var(--radius-md);
		border: none;
		background: var(--accent);
		color: var(--text-on-accent);
		font-family: var(--font-sans);
		font-weight: var(--weight-semibold);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		cursor: pointer;
		transition: background var(--dur-fast) var(--ease-out);
	}

	.submit-btn:hover:not(:disabled) {
		background: var(--accent-hover);
	}

	.submit-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.error-msg {
		font-family: var(--font-sans);
		font-size: calc(var(--text-sm) * var(--font-scale, 1));
		color: var(--danger);
		margin: 0;
	}

	.success-msg {
		font-family: var(--font-sans);
		font-size: calc(var(--text-base) * var(--font-scale, 1));
		color: var(--text-secondary);
		margin: 0;
		line-height: var(--leading-normal);
	}
</style>
