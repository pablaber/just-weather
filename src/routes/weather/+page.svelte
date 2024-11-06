<script lang="ts">
	let { data } = $props();
	import { fade } from 'svelte/transition';
	import { weatherUtils } from '$lib/utils';
	import { goto } from '$app/navigation';
	import WeatherHourly from '$lib/components/WeatherHourly.svelte';

	let currentTemperature = $derived(
		data.forecast?.current?.temperature_2m || 'ERROR'
	);
	let temperatureUnit = $derived(
		data.forecast?.current_units?.temperature_2m || 'ERROR'
	);
	let weatherCodeInfo = $derived(
		weatherUtils.weatherCodeInformation(
			data.forecast?.current?.weather_code || 0
		)
	);
	const isDay = $derived(data.forecast?.current?.is_day || false);
	let weatherCodeClass = $derived(
		isDay ? weatherCodeInfo.icon.day : weatherCodeInfo.icon.night
	);

	let currentTemperatureRounded = $derived(
		Math.round(Number(currentTemperature))
	);
</script>

<svelte:head>
	<title>{data.location.short} Weather</title>
</svelte:head>

<div in:fade={{ duration: 400 }} class="flex flex-col">
	<!-- Back Button Top Left -->
	<div class="p-2 sm:p-4">
		<button onclick={() => goto('/')}>
			<span class="text-2xl">🔙</span>
		</button>
	</div>

	<div class="flex flex-col items-center p-4">
		<span class="mb-1 sm:mb-2">{data.location.name}</span>
		<i class={`wi wi-xl sm:wi-2xl ${weatherCodeClass}`}></i>
		<h1>{currentTemperatureRounded} {temperatureUnit}</h1>
		<h4>{weatherCodeInfo.description.toLowerCase()}</h4>
	</div>

	<WeatherHourly
		hourlyData={data.forecast?.hourly}
		hourlyUnits={data.forecast?.hourly_units}
	/>
</div>
