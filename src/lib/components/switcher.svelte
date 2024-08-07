<!-- ThemeSwitcher.svelte -->
<script>
	import { onMount } from 'svelte';

	let theme = 'light';

	// Function to toggle theme
	const toggleTheme = () => {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	};

	// Set theme on initial load
	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		theme = savedTheme;
		document.documentElement.setAttribute('data-theme', theme);
	});
</script>

<button on:click={toggleTheme}>
	{theme === 'light' ? 'Dark' : 'Light'} Mode
</button>

<style>
	button {
		background-color: var(--background-color);
		color: var(--text-color);
		border: 1px solid var(--text-color);
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
</style>
