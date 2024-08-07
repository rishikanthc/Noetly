<script>
	import callApi from '$lib/callApi';
	import debounce from 'lodash/debounce';
	let searchQuery = '';
	let searchResults = [''];
	let ret;
	let showResults = false;
	let inputElement;
	let resultsPosition = { top: 0, left: 0, width: 0 };

	const debouncedSearch = debounce(async (query = '') => {
		if (query.length > 0) {
			ret = await callApi(`notes/search/${query}`);
			searchResults = ret.matches;
			showResults = true;
			updateResultsPosition();
		} else {
			searchResults = [];
			showResults = false;
		}
	}, 300);

	$: {
		debouncedSearch(searchQuery);
	}

	function handleFocus() {
		if (searchQuery.length > 0) {
			showResults = true;
			updateResultsPosition();
		}
	}

	function handleBlur() {
		setTimeout(() => {
			showResults = false;
		}, 200);
	}

	function updateResultsPosition() {
		if (inputElement) {
			const rect = inputElement.getBoundingClientRect();
			resultsPosition = {
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width
			};
		}
	}
</script>

<div class="search__container">
	<input
		class="search__input"
		type="text"
		placeholder="Search"
		bind:value={searchQuery}
		on:focus={handleFocus}
		on:blur={handleBlur}
		bind:this={inputElement}
	/>
	{#if showResults && searchResults.length > 0}
		<div
			class="search__results"
			style="top: {resultsPosition.top}px; left: {resultsPosition.left}px; min-width: {resultsPosition.width}px;"
		>
			{#each searchResults as result}
				<a href="/{result}"><div class="search__result-item">{result}</div></a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search__container {
		position: relative;
		display: inline-block;
		/* width: 300px; /* Adjust as needed */
		margin-bottom: var(--spacing-08);
	}

	.search__input {
		/* width: 100%; */
		padding: 10px 20px;
		background-color: transparent;
		transition: transform 250ms ease-in-out;
		font-size: 14px;
		line-height: 18px;
		/* color: #575756; */
		color: var(--text-primary);
		background-color: transparent;
		background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: 18px 18px;
		background-position: 95% center;
		border-radius: 5px;
		border: 1px solid #575756;
		transition: all 250ms ease-in-out;
		backface-visibility: hidden;
		transform-style: preserve-3d;
	}

	.search__input::placeholder {
		color: rgba(87, 87, 86, 0.8);
		text-transform: uppercase;
		letter-spacing: 1.5px;
	}

	.search__input:hover,
	.search__input:focus {
		/* padding: 12px 0; */
		outline: 0;
		border: 1px solid transparent;
		border-bottom: 1px solid #575756;
		border-radius: 0;
		background-position: 100% center;
	}

	.search__results {
		/* position: absolute; */
		position: fixed;
		/* top: 100%;
		left: 0; */
		/* right: 0; */
		/* min-width: 100%; */
		width: max-content;
		/* background-color: white; */
		/* border: 1px solid #ddd; */
		border-top: none;
		max-height: 200px;
		background: var(--layer-04);
		overflow-y: auto;
		z-index: 1000;
		white-space: nowrap;
	}

	.search__results a {
		text-decoration: none;
		color: var(--text-secondary);
	}

	.search__result-item {
		padding: 10px;
		cursor: pointer;
	}

	.search__result-item:hover {
		background-color: var(--layer-03);
	}

	.search__results::-webkit-scrollbar {
		width: 4px;
	}

	.search__results::-webkit-scrollbar-track {
		background: transparent;
	}

	.search__results::-webkit-scrollbar-thumb {
		background-color: var(--blue-05);
		border-radius: 3px;
	}
</style>
