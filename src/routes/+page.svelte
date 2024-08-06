<script>
	import Toc from '$lib/components/toc.svelte';
	import Backlinks from '$lib/components/backlinks.svelte';
	import { onMount, afterUpdate } from 'svelte';
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ pageData, toc, backlinks } = data);
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
	onMount(() => {
		setupHeadings();
		updateActiveSection();
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
	});
</script>

<div class="page">
	<div class="left">
		<div class="content">
			{@html pageData.html}
		</div>
	</div>
	<div class="right">
		<Toc {toc} {activeSection} />
		<Backlinks {backlinks} />
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Karla:ital,wght@0,200..800;1,200..800&family=Quicksand:wght@300..700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');
	:global(h1, h2, h3, h4, h5) {
		font-family: 'IBM Plex Sans', serif;
		font-weight: 400;
	}
	:global(p, li) {
		font-family: 'Karla', sans-serif;
		line-height: 1.6;
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
		padding-right: 17px; /* Compensate for the hidden scrollbar */
		margin-right: -17px; /* Hide the scrollbar */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.content::-webkit-scrollbar {
		display: none; /* Chrome, Safari and Opera */
	}
	.right {
		width: 300px;
		/* background-color: var(--layer-01); */
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
</style>
