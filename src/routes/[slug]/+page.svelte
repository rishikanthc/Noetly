<script>
	import Toc from '$lib/components/toc.svelte';
	import Backlinks from '$lib/components/backlinks.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ pageData, pageMeta, toc, backlinks } = data);

	$: hasPageMetaError = 'error' in pageMeta;
	$: validPageMeta = hasPageMetaError ? null : pageMeta;

	function slugify(text) {
		return text
			.toString()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');
	}

	let activeSection = '';
	let headings = [];
	let contentElement;

	function setupHeadings() {
		const contentElement = document.querySelector('.content');
		if (contentElement) {
			headings = Array.from(contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6'));
			headings.forEach((heading) => {
				const slug = slugify(heading.textContent);
				heading.id = slug;
			});
		}
	}

	function updateActiveSection() {
		let currentSection = '';
		const contentElement = document.querySelector('.content');
		if (contentElement) {
			const scrollTop = contentElement.scrollTop;
			for (const heading of headings) {
				if (heading.offsetTop <= scrollTop + 50) {
					currentSection = heading.id;
				} else {
					break;
				}
			}
		}
		activeSection = currentSection;
	}

	function renderLaTeX() {
		if (contentElement) {
			const mathElements = contentElement.querySelectorAll('script[type^="math/tex"]');
			mathElements.forEach((el) => {
				const texContent = el.textContent.trim();
				const isDisplayMode = el.type.includes('mode=display');

				try {
					const katexElement = document.createElement('span');
					katex.render(texContent, katexElement, {
						throwOnError: false,
						displayMode: isDisplayMode
					});
					el.parentNode.insertBefore(katexElement, el);
					el.parentNode.removeChild(el);
				} catch (error) {
					console.error('KaTeX rendering error:', error);
					const textNode = document.createTextNode(texContent);
					el.parentNode.insertBefore(textNode, el);
					el.parentNode.removeChild(el);
				}
			});
		}
	}

	onMount(() => {
		setupHeadings();
		updateActiveSection();
		renderLaTeX();
		const contentElement = document.querySelector('.content');
		if (contentElement) {
			contentElement.addEventListener('scroll', updateActiveSection);
		}
		return () => {
			if (contentElement) {
				contentElement.removeEventListener('scroll', updateActiveSection);
			}
		};
	});

	afterUpdate(() => {
		setupHeadings();
		updateActiveSection();
		renderLaTeX();
	});
</script>

<div class="page">
	<div class="left">
		{#if hasPageMetaError}
			<div class="error">
				<h2>Error loading page metadata</h2>
				<p>{pageMeta.error}</p>
			</div>
		{:else if validPageMeta}
			<h1>{validPageMeta.title}</h1>
			<div class="meta">
				<div class="tags">
					{#each validPageMeta.tags || [] as tag}
						<div class="tag">{tag}</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="warning">
				<h2>No page metadata available</h2>
			</div>
		{/if}
		<div class="content" bind:this={contentElement}>
			{@html pageData.html}
		</div>
	</div>
	<div class="right">
		<Toc {toc} {activeSection} />
		<Backlinks {backlinks} />
	</div>
</div>

<style>
	.tags {
		display: flex;
		gap: var(--spacing-04);
		font-size: 16px;
	}
	.tag {
		background: var(--tag);
		padding: var(--spacing-02);
	}
	.meta {
		margin-bottom: var(--spacing-06);
	}
	.error,
	.warning {
		padding: var(--spacing-04);
		margin-bottom: var(--spacing-06);
		border-radius: 4px;
	}
	.error {
		background-color: #ffebee;
		color: #c62828;
	}
	.warning {
		background-color: #fff3e0;
		color: #ef6c00;
	}
	:global(h1, h2, h3, h4, h5) {
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 400;
	}
	:global(p, li) {
		font-family: 'IBM Plex Serif', sans-serif;
		line-height: 1.7;
		font-size: 18px;
	}
	.page {
		display: flex;
		justify-content: space-between;
		height: 100vh;
		overflow: hidden;
	}
	.left {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 16px;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.content {
		flex-grow: 1;
		overflow-y: scroll;
		padding-right: 17px;
		margin-right: -17px;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.content::-webkit-scrollbar {
		display: none;
	}
	.right {
		width: max-content;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
</style>
