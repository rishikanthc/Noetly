<script>
	export let toc;
	export let activeSection = '';
	import { onMount, afterUpdate } from 'svelte';

	function slugify(text = '') {
		return text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');
	}

	$: hasError = 'error' in toc;
	$: validToc = hasError ? null : toc;
	$: tocHtml = hasError ? '' : generateTocHtml(validToc, activeSection);

	function generateTocHtml(toc, activeSection) {
		if (!toc || typeof toc !== 'object') return '';

		function generateItemHtml(item, level = 0) {
			if (typeof item !== 'object' || !item.title) return '';

			const slug = slugify(item.title);
			const isActive = activeSection === slug;
			let html = `
				<div class="toc-item level-${level}">
					<a href="#${slug}" class="toc-link ${isActive ? 'active' : ''}" data-section="${slug}">
						<span class="toc-text">${item.title}</span>
					</a>
				</div>
			`;

			if (item.children && typeof item.children === 'object') {
				html += '<div class="toc-children">';
				for (const [key, child] of Object.entries(item.children)) {
					if (typeof child === 'object' && child.title) {
						html += generateItemHtml(child, level + 1);
					}
				}
				html += '</div>';
			}

			return html;
		}

		let headings = toc.headings;
		if (headings.main) {
			return generateItemHtml(headings.main);
		} else {
			let html = '';
			for (const [key, item] of Object.entries(headings)) {
				html += generateItemHtml(item);
			}
			return html;
		}
	}

	function updateActiveSection() {
		const sections = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
		let currentSection = '';
		sections.forEach((section) => {
			const rect = section.getBoundingClientRect();
			if (rect.top <= 250) {
				currentSection = section.id;
			}
		});
		activeSection = currentSection;
	}

	let cleanup;

	function setupScrollListener() {
		window.addEventListener('scroll', updateActiveSection);
		updateActiveSection(); // Initial call
		return () => {
			window.removeEventListener('scroll', updateActiveSection);
		};
	}

	onMount(() => {
		cleanup = setupScrollListener();
	});

	afterUpdate(() => {
		// Clean up previous listener and set up a new one
		if (cleanup) cleanup();
		cleanup = setupScrollListener();
	});

	// Handle page visibility changes
	if (typeof document !== 'undefined') {
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				updateActiveSection();
			}
		});
	}
</script>

<div class="toc">
	<h4>ON THIS PAGE</h4>
	{#if hasError}
		<div class="error">
			<p>Error: {toc.error}</p>
		</div>
	{:else if tocHtml}
		{@html tocHtml}
	{:else}
		<p>No table of contents available.</p>
	{/if}
</div>

<style>
	h4 {
		font-weight: 700;
		margin-bottom: 10px;
		padding-left: 16px;
	}
	.toc {
		line-height: 1.6;
		color: var(--text-secondary);
	}
	.error {
		color: red;
		font-weight: bold;
		padding-left: 16px;
	}
	:global(.toc-item) {
		font-size: 16px;
	}
	:global(.toc-link) {
		text-decoration: none;
		color: var(--text-secondary);
		transition: color 0.3s ease;
		display: block;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		padding: var(--spacing-01) 0 var(--spacing-01) 16px;
		border-left: 3px solid transparent;
	}
	:global(.toc-text) {
		display: inline-block;
		padding-left: 8px;
	}
	:global(.toc-link:hover) {
		color: #007bff;
	}
	:global(.toc-link.active) {
		border-left-color: var(--blue-05);
		background-color: var(--layer-01);
		font-weight: bold;
	}
	:global(.level-0) {
		margin-left: 0;
	}
	:global(.level-1) {
		margin-left: 16px;
	}
	:global(.level-2) {
		margin-left: 32px;
	}
	:global(.level-3) {
		margin-left: 48px;
	}
	:global(.level-4) {
		margin-left: 64px;
	}
	:global(.level-5) {
		margin-left: 80px;
	}
</style>
