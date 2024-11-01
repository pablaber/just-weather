<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import HomePostcodeInput from '$lib/components/HomePostcodeInput.svelte';

	const LOADING_EMOJIS = ['☂️', '🕶️', '🌪️', '🌋', '🌈', '⚡'];
	const randomLoadingEmoji = $derived(
		LOADING_EMOJIS[Math.floor(Math.random() * LOADING_EMOJIS.length)]
	);

	let postcode = $state('');
	let latitude = $state(0);
	let longitude = $state(0);
	let submitting = $state(false);
	let error = $state('');

	function useCurrentLocation() {
		submitting = true;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				submit({ useCoordinates: true });
			},
			(e) => {
				error = e.message.toString();
				submitting = false;
			}
		);
	}

	function submit(options?: { useCoordinates?: boolean }) {
		const useCoordinates = options?.useCoordinates ?? false;
		submitting = true;
		if (useCoordinates) {
			goto(`/weather?lat=${latitude}&lon=${longitude}`);
		} else {
			goto(`/weather?postcode=${postcode}`);
		}
	}
</script>

{#if !submitting}
<div
out:fade={{ duration: 100 }}
class="flex h-screen flex-col items-center justify-center"
>
<div class="mb-4 h-4"></div>
		<h1>it's just weather</h1>
		<HomePostcodeInput bind:postcode onEnter={submit} onLocationPress={useCurrentLocation} />
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
		in:fade={{ duration: 400, delay: 100 }}
		out:fade
		class="flex h-screen flex-col items-center justify-center"
	>
		<span class="animate-spin text-5xl opacity-30">{randomLoadingEmoji}</span>
	</div>
{/if}
