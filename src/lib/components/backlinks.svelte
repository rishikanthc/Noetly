<script>
	export let backlinks;

	$: hasError = 'error' in backlinks;
	$: validBacklinks = hasError ? [] : backlinks.backlinks || [];
</script>

{#if hasError}
	<div class="error">
		<p>Error: {backlinks.error}</p>
	</div>
{:else if validBacklinks.length > 0}
	<div class="backlinks">
		<h4>BACKLINKS</h4>
		{#each validBacklinks as backlink}
			<a href="/{backlink.link}">{backlink.title}</a>
		{/each}
	</div>
{/if}

<style>
	.backlinks {
		margin: var(--spacing-09) 16px;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-02);
	}
	h4 {
		font-weight: 700;
		margin-bottom: var(--spacing-05);
	}
	a {
		text-decoration: none;
		font-size: 18px;
	}
	.error {
		margin: var(--spacing-09) 16px;
		color: red;
		font-weight: bold;
	}
</style>
