<script lang="ts">
	import type { HourlyDataPoint } from '$lib/types';
	import { weatherCodeInformation } from '$lib/utils';
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
				const weatherCodeInfo = weatherCodeInformation(dataPoint.weather_code);
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
</script>

{#if futureHourlyData.length > 0}
	<div class="flex flex-col items-center">
		<h3>Hourly</h3>
		{#each futureHourlyData.slice(0, hoursToShow) as dataPoint (dataPoint.time)}
			<div class="flex w-52 flex-row justify-between">
				<span>{format(new Date(dataPoint.time), 'h a')}</span>
				&nbsp;
				<span>{dataPoint.temperature_2m} {hourlyUnits.temperature_2m}</span>
				&nbsp;
				<div class="flex w-5 justify-center">
					<i class={dataPoint.iconClasses}></i>
				</div>
			</div>
		{/each}
	</div>
{/if}
