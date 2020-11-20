<script lang="typescript">
	import type { CollectionInfoBlock, Icon } from '@iconify/search-core';
	import { getCollectionInfo } from '@iconify/search-core';
	import type { WrappedRegistry } from '../../../wrapper/registry';
	import { phrases } from '../../../config/phrases';
	import FooterBlock from '../misc/Block.svelte';
	import InfoBlock from '../../blocks/CollectionInfo.svelte';

	// Registry
	export let registry: WrappedRegistry;

	// Selected icon
	export let icon: Icon;

	// Get info
	const collectionsStorage = registry.collections;
	let block: CollectionInfoBlock | null;
	$: {
		const info = getCollectionInfo(
			collectionsStorage,
			icon.provider,
			icon.prefix
		);
		block = info
			? {
					type: 'collection-info',
					prefix: icon.prefix,
					info,
			  }
			: null;
	}

	// Get title
	let title: string;
	$: {
		title = block
			? phrases.footer.about.replace('{title}', block.info!.name)
			: '';
	}
</script>

{#if block}
	<FooterBlock name="info" {registry} {title}>
		<InfoBlock name="info" {registry} {block} title={false} />
	</FooterBlock>
{/if}
