<script lang="typescript">
	import { getContext } from 'svelte';
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
		showCustomisatons,
	} from '../../../config/components';
	import Block from '../Block.svelte';
	import ButtonsContainer from './parts/Buttons.svelte';
	import PropertiesContainer from './parts/Properties.svelte';
	import IconsList from './parts/Icons.svelte';
	import FooterBlock from './parts/FooterBlock.svelte';
	import InfoBlock from '../blocks/CollectionInfo.svelte';

	/* Various components for icon name. Uncomment one you want to use */
	import IconName from './parts/name/Simple.svelte';
	// import IconName from './parts/name/SimpleEditable.svelte';
	// import IconName from './parts/name/Block.svelte';

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

	// Registry
	const registry = getContext('registry') as WrappedRegistry;

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
</script>

{#if showButtons || hasIcons}
	<Block type="footer">
		{#if icon}
			<IconName {icon} {route} />
		{:else if hasIcons}
			<IconsList {route} {icons} {customisations} />
		{/if}
		{#if infoBlock}
			<FooterBlock name="info" title={infoBlockTitle}>
				<InfoBlock
					name="info"
					block={infoBlock}
					short={true}
					showTitle={false} />
			</FooterBlock>
		{/if}
		{#if showCustomisatons && hasIcons}
			<PropertiesContainer {icons} {customise} {customisations} />
		{/if}
		{#if showButtons}
			<ButtonsContainer {icons} {route} />
		{/if}
	</Block>
{/if}
