<script lang="ts">
	import jail from '$lib/assets/you-in-jail.jpg';
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center px-4">
	<div class="flex max-w-md flex-col items-center justify-center">
		<div class="mb-4 overflow-hidden rounded-lg">
			<img src={jail} alt="Jail" class="max-h-lg h-full w-full max-w-lg" />
		</div>
		<h1>Jail</h1>
		<p class="text-center">
			Welp, you've ended up in jail. You've probably been trying to do something
			you're not supposed to. Might as well make yourself comfortable because
			you'll be here for a while.
		</p>
	</div>
</div>
