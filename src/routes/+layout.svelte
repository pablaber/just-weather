<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	{@render children()}

	<div class="absolute bottom-4 right-4">
		<a href="/settings">
			<span class="text-2xl">⚙️</span>
		</a>
	</div>
</div>
