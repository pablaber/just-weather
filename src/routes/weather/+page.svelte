<script lang="ts">
	let { data } = $props();
	import { fade } from 'svelte/transition';
	import { weatherCodeInformation } from '$lib/utils';
	import { goto } from '$app/navigation';

	let currentTemperature = $derived(data.forecast?.current?.temperature_2m || 'ERROR');
	let temperatureUnit = $derived(data.forecast?.current_units?.temperature_2m || 'ERROR');
	let weatherCodeInfo = $derived(weatherCodeInformation(data.forecast?.current?.weather_code || 0));
	let weatherCodeIcon = $derived(
		data.forecast?.current?.is_day ? weatherCodeInfo.emoji.day : weatherCodeInfo.emoji.night
	);

	let currentTemperatureRounded = $derived(Math.round(Number(currentTemperature)));
</script>

<div in:fade={{ duration: 400 }} class="flex flex-col">
	<!-- Back Button Top Left -->
	<div class="p-4">
		<button onclick={() => goto('/')}>
			<span class="text-2xl">🔙</span>
		</button>
	</div>

	<div class="flex flex-col items-center p-4">
		<h5>{data.location.name}</h5>
		<h1 class="text-9xl">{weatherCodeIcon}</h1>
		<h1>{currentTemperatureRounded} {temperatureUnit}</h1>
		<h4>{weatherCodeInfo.description}</h4>
	</div>
</div>
