<script lang="typescript">
	import { getContext, onDestroy } from 'svelte';
	import type {
		Icon,
		FullRoute,
		CollectionInfoBlock,
	} from '@iconify/search-core';
	import { getCollectionInfo } from '@iconify/search-core';
	import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
	import type { WrappedRegistry } from '../../../wrapper/registry';
	import { phrases } from '../../../config/phrases';
	import {
		showCollectionInfoBlock,
		showButtons,
		showInfoInFooter,
	} from '../../../config/components';
	import Block from '../Block.svelte';
	import ButtonsContainer from './parts/Buttons.svelte';
	import PropertiesContainer from './parts/Properties.svelte';
	import Sample from './parts/samples/Full.svelte';
	import IconsList from './parts/Icons.svelte';
	import FooterBlock from './parts/FooterBlock.svelte';
	import InfoBlock from '../blocks/CollectionInfo.svelte';
	import LayersBlock from './parts/Layers.svelte';
	import WindowAction from './parts/WindowAction.svelte';
	import { watchedOptions } from '../../../figma/options';

	/* Various components for icon name. Uncomment one you want to use */
	// import IconName from './parts/name/Simple.svelte';
	// import IconName from './parts/name/SimpleEditable.svelte';
	import IconName from './parts/name/Block.svelte';

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

	// Get registry instance
	const registry = getContext('registry') as WrappedRegistry;

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

	// Check if info block should be shown
	let infoBlock: CollectionInfoBlock | null;
	let infoBlockTitle: string;
	$: {
		let showInfo = true;

		// Get provider and prefix for info
		let provider = '';
		let prefix = '';
		if (!showInfoInFooter || !icons.length) {
			// Disabled
			showInfo = false;
		} else if (icon) {
			// One icon is selected: show info for that icon
			provider = icon.provider;
			prefix = icon.prefix;
		} else {
			// Multiple icons are selected: show info if all of them have the same prefix
			for (let i = 0; i < icons.length; i++) {
				const icon = icons[i];
				if (!i) {
					prefix = icon.prefix;
					provider = icon.provider;
					continue;
				}
				if (icon.provider !== provider || icon.prefix !== prefix) {
					showInfo = false;
					break;
				}
			}
		}

		// Check route
		if (
			showCollectionInfoBlock &&
			showInfo &&
			route.type === 'collection' &&
			provider === route.params.provider &&
			prefix === route.params.prefix
		) {
			// Already showing info for the same icon set above icons list
			showInfo = false;
		}

		// Get data
		if (showInfo) {
			const info = getCollectionInfo(
				registry.collections,
				provider,
				prefix
			);
			if (!info) {
				infoBlock = null;
				infoBlockTitle = '';
			} else {
				infoBlock = {
					type: 'collection-info',
					prefix,
					info,
				};
				infoBlockTitle = phrases.footer.about.replace(
					'{title}',
					info.name
				);
			}
		} else {
			infoBlock = null;
			infoBlockTitle = '';
		}
	}

	// Show full button
	let buttonContainerClass: string;
	const unsubscribe = watchedOptions.subscribe((value) => {
		buttonContainerClass = value.stickyFooter
			? 'iif-footer-buttons-sticky-container'
			: 'iif-footer-buttons-container';
	});
	onDestroy(unsubscribe);
</script>

{#if showFooter}
	{#if hasIcons}
		<Block type="footer">
			{#if icon}
				<IconName {icon} {route} />
			{:else}
				<IconsList {route} {icons} {customisations} />
			{/if}
			<div class={icon ? 'iif-footer-full' : ''}>
				{#if icon}
					<Sample {icon} {customisations} />
				{/if}
				<div class={icon ? 'iif-footer-full-content' : ''}>
					{#if infoBlock}
						<FooterBlock name="info" title={infoBlockTitle}>
							<InfoBlock
								name="info"
								block={infoBlock}
								short={true}
								showTitle={false} />
						</FooterBlock>
					{/if}
					<PropertiesContainer {icons} {customise} {customisations} />
					<LayersBlock />
					<WindowAction count={icons.length} />
				</div>
			</div>
		</Block>
	{/if}
	{#if showButtons}
		<div class={buttonContainerClass}>
			<ButtonsContainer {icons} {route} />
		</div>
	{/if}
{/if}
