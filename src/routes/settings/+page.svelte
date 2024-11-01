<script lang="ts">
	import { goto } from '$app/navigation';

  let { data } = $props();

  let temperatureUnit = $state(data.temperatureUnit);

  function toggleTemperatureUnit() {
    temperatureUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
  }

  $effect(() => {
    fetch('/settings', {
      method: 'POST',
      body: JSON.stringify({ temperatureUnit }),
    });
  });
</script>

<div class="flex flex-col items-center p-4">
	<h1>Settings</h1>
	<div class="flex items-center gap-2">
		<span class="text-xl">Temperature unit:</span>
		<button
			class="py-1 bg-blue-500 text-white rounded hover:bg-blue-600 w-28"
    onclick={toggleTemperatureUnit}
		>
			{temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
		</button>
	</div>

<!-- Button to go back -->
<button
	class="mt-4 rounded bg-blue-500 px-10 py-2 text-white hover:bg-blue-700"
	onclick={() => goto('/')}
>
		Back
	</button>
</div>
