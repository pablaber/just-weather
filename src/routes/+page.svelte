<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import HomePostcodeInput from '$lib/components/HomePostcodeInput.svelte';
	import { minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

	const LOADING_EMOJIS = ['☂️', '🕶️', '🌪️', '🌋', '🌈', '⚡'];
	const FADE_DURATION = 200;
	const randomLoadingEmoji = $derived(
		LOADING_EMOJIS[Math.floor(Math.random() * LOADING_EMOJIS.length)]
	);

	let postcode = $state('');
	let submitting = $state(false);
	let error = $state('');

	async function useCurrentLocation() {
		submitting = true;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				submit({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			(e) => {
				if (e instanceof GeolocationPositionError) {
					switch (e.code) {
						case 1:
							error = 'Location access was denied.';
							break;
						case 3:
							error = 'Location access timed out.';
							break;
						default:
							console.error('Unhandled GeolocationPositionError:', e);
							error = 'There was an error fetching your location.';
							break;
					}
				} else {
					error = 'There was an error fetching your location.';
					console.error('Unknown error fetching user location:', e);
				}
				submitting = false;
			},
			{
				timeout: secondsToMilliseconds(10),
				maximumAge: minutesToMilliseconds(5),
				enableHighAccuracy: true
			}
		);
	}

	function submit(options?: { latitude: number; longitude: number }) {
		submitting = true;

		const { latitude, longitude } = options ?? {};
		const useCoordinates = latitude !== undefined && longitude !== undefined;

		if (useCoordinates) {
			goto(`/weather?lat=${latitude}&lon=${longitude}`);
		} else {
			goto(`/weather?postcode=${postcode}`);
		}
	}
</script>

{#if !submitting}
	<div
		out:fade={{ duration: FADE_DURATION }}
		class="flex h-screen flex-col items-center justify-center"
	>
		<div class="mb-4 h-4">
		</div>
		<h1>just weather</h1>
		<HomePostcodeInput
			bind:postcode
			onEnter={submit}
			onLocationPress={useCurrentLocation}
		/>
		<button
			disabled={submitting}
			onclick={() => submit()}
			class="mt-4 rounded bg-blue-500 px-10 py-2 text-white hover:bg-blue-700 disabled:bg-blue-200"
		>
			submit
		</button>

		<!-- Error Container -->
		<div class="mt-4 h-4">
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
		</div>
	</div>
{/if}

<!-- Loading Spinner -->
{#if submitting}
	<div
		in:fade={{ duration: FADE_DURATION, delay: FADE_DURATION }}
		out:fade
		class="flex h-screen w-screen flex-col items-center justify-center absolute"
	>
		<span class="animate-spin text-5xl opacity-30">{randomLoadingEmoji}</span>
	</div>
{/if}
