<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { notices, removeNotices } from '../../figma/notices';

	onDestroy(removeNotices);
</script>

<div class="plugin-notices" on:click={removeNotices}>
	{#each $notices as notice (notice.counter)}
		<p class="plugin-notice plugin-notice--{notice.layout}">
			Notice:
			{notice.message}
		</p>
	{/each}
</div>
