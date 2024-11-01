<script lang="ts">
	let {
		postcode = $bindable(),
		onEnter,
		onLocationPress
	}: { postcode: string; onEnter: () => void; onLocationPress: () => void } = $props();

	function onkeypress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			onEnter();
		}
	}
</script>

<div class="flex flex-row items-center justify-between">
	<div class="w-10">
		<!-- Empty div to push the input to the left -->
  </div>
	<input
		class="w-64 rounded border border-gray-300 py-1 text-center"
		type="text"
		placeholder="enter your postcode"
		bind:value={postcode}
		{onkeypress}
	/>
	<div class="w-10">
		<button onclick={onLocationPress} class="h-fit px-2">
			<span class="text-xl">📍</span>
		</button>
	</div>
</div>
