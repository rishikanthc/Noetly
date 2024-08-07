<script>
	import Katex from 'svelte-katex';

	export let parts = [];
</script>

{#each parts as part}
	{#if part.type === 'text'}
		{@html part.content}
	{:else if part.type === 'math'}
		<Katex math={part.content} displayMode={part.displayMode} />
	{/if}
{/each}
