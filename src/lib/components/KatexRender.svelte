<script>
	import katex from 'katex';
	import { onMount } from 'svelte';

	export let equation = '';
	export let displayMode = false;

	let element;

	onMount(() => {
		katex.render(equation, element, {
			throwOnError: false,
			displayMode: displayMode
		});
	});
</script>

<span bind:this={element}></span>
