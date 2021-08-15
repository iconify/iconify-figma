<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { recentColors } from '../../../../../figma/lists';
	import { getPalette } from '../../../../../figma/palette';
	import type { ColorPickerPalette } from '../../../../../figma/palette';

	export let onInput: (newValue: string) => void;

	let palette: ColorPickerPalette;
	const unsubscribe = recentColors.subscribe((value) => {
		palette = getPalette(value);
	});
	onDestroy(unsubscribe);
</script>

<div class="iif-color-picker">
	{#each palette as section, i (section)}
		<section>
			<h1>{section.title}</h1>
			<div class="iif-color-picker-list">
				{#each section.colors as item, i (item)}
					<button
						title={item.title}
						style={item.style}
						on:click|preventDefault={() => onInput(item.color)} />
				{/each}
			</div>
		</section>
	{/each}
</div>
