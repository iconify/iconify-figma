<script lang="typescript">
	import type { CollectionInfoBlock, Icon } from '@iconify/search-core';
	import { getCollectionInfo } from '@iconify/search-core';
	import type { WrappedRegistry } from '../../../wrapper/registry';
	import { phrases } from '../../../config/phrases';
	import UIIcon from '../../misc/Icon.svelte';
	import InfoBlock from '../../blocks/CollectionInfo.svelte';

	// Registry
	export let registry: WrappedRegistry;

	// Selected icon
	export let icon: Icon;

	// Check if info block is visible
	let expanded: boolean = registry.config.components.info;

	function toggle() {
		expanded = registry.config.components.info = !expanded;
		registry.callback({
			type: 'config',
		});
	}

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
			? phrases.footer.about.replace('{title}', block.info!.name) +
			  (expanded ? ':' : '')
			: '';
	}
</script>

{#if block}
	<div class="iif-footer-about">
		<p class="iif-footer-options-block-title">
			{#if !expanded}
				<UIIcon icon="right" />
			{/if}
			<a href="# " on:click|preventDefault={toggle}>{title}</a>
		</p>
		{#if expanded}
			<InfoBlock name="info" {block} title={false} />
		{/if}
	</div>
{/if}
