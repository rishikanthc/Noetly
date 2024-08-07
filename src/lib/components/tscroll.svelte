<script>
	export let width = '200px';
	export let height = '40px';
	export let color = '#000000';
</script>

<a href="/">
	<div
		style="width: {width}; height: {height};  display: flex; justify-content: center; align-items: center;"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 0 120 40" width="100%" height="100%">
			<g transform="translate(10, 0)">
				<!-- Stylized 'N' -->
				<path
					d="M0 5 L0 35 L15 5 L15 35"
					fill="none"
					stroke={color}
					stroke-width="3"
					stroke-linecap="round"
				/>
				<!-- Dot representing knowledge/data point -->
				<circle cx="22" cy="5" r="3" fill="#0e61fe" />
				<!-- App name -->
				<text x="25" y="25" font-family="Arial, sans-serif" font-size="22" fill={color}>oetly</text>
			</g>
		</svg>
	</div>
</a>
