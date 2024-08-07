<script>
	import Switcher from '../lib/components/switcher.svelte';
	import Listnav from '../lib/components/listnav.svelte';
	import Search from '../lib/components/search.svelte';
	import Tscroll from '$lib/components/tscroll.svelte';
</script>

<div class="main">
	<div class="left">
		<div class="bar">
			<div class="logo">
				<Tscroll width={'150px'} height={'50px'} color={'var(--text-primary)'} />
			</div>
			<Switcher />
		</div>
		<div class="listnav">
			<Search />
			<Listnav />
		</div>
	</div>
	<div class="right">
		<slot />
	</div>
</div>

<style>
	.main {
		max-width: 1400px;
		/* border: 1px solid black; */
		margin: 0 auto;
		display: grid;
		gap: var(--spacing-07);
		grid-template-areas: 'left right';
		grid-template-columns: auto 3fr;
		height: 99svh;
	}
	.left {
		grid-area: left;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-10);
	}
	.right {
		grid-area: right;
	}
	.bar {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-09);
		margin-top: var(--spacing-08);
		height: max-content;
	}
	.listnav {
		flex-grow: 1;
		overflow-y: auto;
	}
</style>
