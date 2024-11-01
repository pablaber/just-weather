<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<!-- Settings Icon -->
<div class="absolute bottom-4 right-4">
	<a href="/settings">
		<span class="text-2xl">⚙️</span>
	</a>
</div>