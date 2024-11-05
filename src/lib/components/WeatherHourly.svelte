<script lang="ts">
	import type { HourlyDataPoint } from '$lib/types';
	import { weatherUtils } from '$lib/utils';
	import { format } from 'date-fns';

	const {
		hourlyData = [],
		hourlyUnits = {}
	}: {
		hourlyData?: HourlyDataPoint[];
		hourlyUnits?: Record<string, string>;
	} = $props();
	const hoursToShow = $state(10);

	const futureHourlyData = $derived(
		hourlyData
			.filter((dataPoint) => {
				const now = new Date();
				const dataPointTime = new Date(dataPoint.time);
				return dataPointTime > now;
			})
			.map((dataPoint) => {
				const isDay = dataPoint.is_day === 1;
				const weatherCodeInfo = weatherUtils.weatherCodeInformation(
					dataPoint.weather_code
				);
				const iconClass = isDay
					? weatherCodeInfo.icon.day
					: weatherCodeInfo.icon.night;
				return {
					...dataPoint,
					temperature_2m: Math.round(dataPoint.temperature_2m),
					iconClasses: `wi wi-md ${iconClass}`
				};
			})
	);

	const minTemperature = $derived(
		Math.min(...hourlyData.map((dataPoint) => dataPoint.temperature_2m))
	);
	const maxTemperature = $derived(
		Math.max(...hourlyData.map((dataPoint) => dataPoint.temperature_2m))
	);

	const MIN_COLD_TEMP = 0;
	const MAX_HOT_TEMP = 100;

	function getTemperatureColor(temp: number): string {
		const percentage = (temp - MIN_COLD_TEMP) / (MAX_HOT_TEMP - MIN_COLD_TEMP);
		// Interpolate between blue (200, 220, 255) and red (255, 100, 100)
		const r = Math.round(0 + (255 - 0) * percentage);
    const g = Math.round(127 - 127 * percentage);
		const b = Math.round(255 - 255 * percentage);
		return `rgb(${r}, ${g}, ${b})`;
	}

	function getTemperatureLeftValue(temp: number): string {
    const percentage = Math.round(
        ((temp - minTemperature) / (maxTemperature - minTemperature)) * 100
    );
    // Clamp percentage between 10% and 90% to prevent overlap with edges
    const clampedPercentage = Math.max(10, Math.min(90, percentage));
    return `calc(${clampedPercentage}% - 1.5rem);`;
	}
</script>

{#if futureHourlyData.length > 0}
	<div class="flex flex-col items-center">
		<h4>hourly</h4>
		{#each futureHourlyData.slice(0, hoursToShow) as dataPoint (dataPoint.time)}
			<div class="flex flex-row justify-between my-1 w-[90%] max-w-sm">
				<span class="mr-4 w-12 text-center"
					>{format(new Date(dataPoint.time), 'h a')}</span
				>
				<div class="relative flex-grow flex-row">
					<span
						class="absolute whitespace-nowrap rounded-md px-1 py-1 text-white text-sm font-bold"
						style="left: {getTemperatureLeftValue(dataPoint.temperature_2m)} background-color: {getTemperatureColor(dataPoint.temperature_2m)}"
					>
						{dataPoint.temperature_2m}°
					</span>
				</div>
				<div class="ml-4 flex w-8 justify-center">
					<i class={dataPoint.iconClasses}></i>
				</div>
			</div>
		{/each}
	</div>
{/if}
