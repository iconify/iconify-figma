<script lang="typescript">
	import type { Icon } from '@iconify/search-core';
	import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
	import { phrases } from '../../../../config/phrases';
	import FooterBlock from './FooterBlock.svelte';
	import {
		showFooterBlockTitles,
		customiseColor,
		customiseWidth,
		customiseHeight,
	} from '../../../../config/components';
	import ColorBlock from './props/Color.svelte';
	import SizeBlock from './props/Size.svelte';

	// Selected icons
	export let icons: Icon[];

	// Customisations
	export let customisations: IconCustomisations;

	// Callback
	export let customise: (
		key: keyof IconCustomisations,
		value: unknown
	) => void;

	// Title
	let title: string;
	$: {
		title = showFooterBlockTitles
			? phrases.footerBlocks[icons.length > 1 ? 'title2' : 'title']
			: '';
	}
</script>

<FooterBlock name="props" {title}>
	<div>
		{#if customiseColor}
			<ColorBlock
				{icons}
				value={typeof customisations.color === 'string' ? customisations.color : ''}
				{customise} />
		{/if}
		{#if customiseWidth || customiseHeight}
			<SizeBlock {icons} {customisations} {customise} />
		{/if}
	</div>
</FooterBlock>
