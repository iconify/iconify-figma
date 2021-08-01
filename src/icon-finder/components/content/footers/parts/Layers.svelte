<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { pluginUIEnv } from '../../../../figma/env';
	import { phrases } from '../../../../config/phrases';
	import type { SelectedLayer } from '../../../../../common/layers';
	import Block from './FooterBlock.svelte';
	import UIIcon from '../../../ui/UIIcon.svelte';

	const text = phrases.figma.layers;
	const baseClass = 'plugin-layer';

	type ExtendedSelectedLayer = SelectedLayer & {
		onclick: () => void;
		icon: string;
		className: string;
	};

	// Target layer
	let usingDefault = pluginUIEnv.targetLayer === '';
	let targetLayer = pluginUIEnv.targetLayer;

	function selectLayer(id: string) {
		targetLayer = pluginUIEnv.targetLayer = id;
		usingDefault = false;
	}

	// Layers list
	let layers: ExtendedSelectedLayer[];
	const unsubscribe = pluginUIEnv.layers.subscribe((value) => {
		let found = false;

		layers = value.layers
			? value.layers.map((item) => {
					// Check
					if (!usingDefault && item.id === targetLayer) {
						found = true;
					}

					// Class name
					const className =
						baseClass + ' ' + baseClass + '--' + item.depth;

					// Icon
					let icon = 'layer.' + item.type.toLowerCase();
					switch (item.type) {
						case 'FRAME':
							switch (item.layoutMode) {
								case 'HORIZONTAL':
									icon = 'layer.h';
									break;
								case 'VERTICAL':
									icon = 'layer.v';
									break;
							}
					}

					// Return item
					return {
						...item,
						icon,
						className,
						onclick: selectLayer.bind(null, item.id),
					};
			  })
			: [];

		if (!found) {
			// Layer is not found - use default layer
			usingDefault = true;
			pluginUIEnv.targetLayer = '';
			targetLayer = value.defaultLayer ? value.defaultLayer : '';
		}
	});
	onDestroy(unsubscribe);
</script>

{#if layers.length > 0}
	<Block name="layers" title={text.title}>
		{#each layers as layer, i (layer.id)}
			<a
				href="# "
				class={layer.className + (targetLayer === layer.id ? ' ' + baseClass + '--selected' : '')}
				on:click|preventDefault={layer.onclick}><UIIcon
					icon={layer.icon} />
				{layer.name}</a>
		{/each}
	</Block>
{/if}
