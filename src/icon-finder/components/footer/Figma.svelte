<script lang="typescript">
	import type { Icon, FullRoute } from '@iconify/search-core';
	import type { WrappedRegistry } from '../../wrapper/registry';
	import type { IconCustomisations } from '../../customisations/types';
	import {
		showButtons,
		showCustomisatons,
		showCode,
	} from '../../config/components';
	import Block from '../blocks/Block.svelte';
	import ButtonsContainer from './parts/Buttons.svelte';
	import PropertiesContainer from './parts/Properties.svelte';
	import Sample from './parts/samples/Full.svelte';
	import IconsList from './parts/Icons.svelte';
	import About from './parts/About.svelte';
	import { IconName, CodeBlock } from '../../config/footer-components';

	// Registry
	export let registry: WrappedRegistry;

	// Selected icons
	export let icons: Icon[];

	// Callback
	export let customise: (
		key: keyof IconCustomisations,
		value: unknown
	) => void;

	// Customisations
	export let customisations: IconCustomisations;

	// Current route
	export let route: FullRoute;

	// Hide footer in collections list
	let showFooter: boolean;
	$: {
		showFooter = route && route.type !== 'collections';
	}

	// Check if icons are selected, get first icon
	let icon: Icon | null;
	let hasIcons: boolean;
	$: {
		hasIcons = icons.length > 0;
		icon = icons.length === 1 ? icons[0] : null;
	}
</script>

{#if showFooter && (showButtons || hasIcons)}
	<Block type="footer">
		{#if icon}
			<IconName {registry} {icon} {route} />
		{:else if hasIcons}
			<IconsList {registry} {route} {icons} {customisations} />
		{/if}
		<div class={icon ? 'iif-footer-full' : ''}>
			{#if icon}
				<Sample {registry} {icon} {customisations} />
			{/if}
			<div class={icon ? 'iif-footer-full-content' : ''}>
				{#if icon && (route.type !== 'collection' || icon.provider !== route.params.provider || icon.prefix !== route.params.prefix)}
					<About {registry} {icon} />
				{/if}
				{#if showCustomisatons && hasIcons}
					<PropertiesContainer {icons} {customise} {customisations} />
				{/if}
				{#if showCode && icon}
					<CodeBlock {registry} {icon} {customisations} />
				{/if}
				{#if showButtons}
					<ButtonsContainer {registry} {icons} {route} />
				{/if}
			</div>
		</div>
	</Block>
{/if}
