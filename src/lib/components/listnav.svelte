<script>
	import callApi from '$lib/callApi';
	import { onMount } from 'svelte';

	let posts = [];
	let error_msg = null;

	onMount(async () => {
		try {
			const response = await callApi('notes/ls');
			posts = response.files || [];
		} catch (error) {
			console.error('Failed to fetch posts:', error);
			error_msg = 'Failed to load posts. Please try again later.';
		}
	});

	function sanitizeTitle(title) {
		return title.replace(/[-_]/g, ' ');
	}
</script>

{#if error_msg}
	<p class="error">{error_msg}</p>
{:else if posts.length === 0}
	<p>Loading posts...</p>
{:else}
	<div class="posts">
		{#each posts as post}
			<div class="post">
				<a href="/{post}">{sanitizeTitle(post)}</a>
			</div>
		{/each}
	</div>
{/if}

<style>
	.posts {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-03);
	}
	.post {
		font-size: var(--text-03);
	}
	.post a {
		text-decoration: none;
		color: var(--text-secondary);
		color: var(--link-primary);
	}
	.post a:hover {
		color: var(--link-primary-hover);
	}
	.error {
		color: red;
		font-weight: bold;
	}
</style>
