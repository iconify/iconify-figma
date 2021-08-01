<script lang="typescript">
	import { setContext } from 'svelte';
	import type { FullRoute, ViewBlocks } from '@iconify/search-core';
	import type { PluginUINavigation } from '../../common/navigation';
	import type { SelectedIcons } from '../wrapper/icons';
	import type { WrappedRegistry } from '../wrapper/registry';
	import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
	import { isIconFinderNavigation } from '../figma/navigation';
	import Wrapper from './Wrapper.svelte';
	import Navigation from './figma/Navigation.svelte';
	import Minimized from './figma/Minimized.svelte';
	import Content from './content/Content.svelte';
	import Footer from './content/Footer.svelte';
	import Notices from './figma/Notice.svelte';

	/**
	 * Global exports
	 */
	export let registry: WrappedRegistry;
	export let selection: SelectedIcons;
	export let selectionLength: number;
	export let customisations: IconCustomisations;
	export let hidden: boolean;

	// RouterEvent with full route
	export let viewChanged: boolean;
	export let error: string;
	export let route: FullRoute;
	export let blocks: ViewBlocks | null;
	export let currentPage: PluginUINavigation;

	// Set context
	setContext('registry', registry);

	// Check if Icon Finder should be shown
	let showIconFinder: boolean | 'hidden' = false;
	$: {
		showIconFinder = isIconFinderNavigation(currentPage)
			? true
			: showIconFinder
			? 'hidden'
			: false;
	}
</script>

{#if hidden !== true}
	<Minimized />
	<Wrapper>
		<Navigation {currentPage} />
		{#if showIconFinder}
			<div
				class="plugin-content plugin-content--icon-finder{showIconFinder === true ? '' : ' plugin-content--hidden'}">
				<Content {selection} {viewChanged} {error} {route} {blocks} />
				<Footer
					{selection}
					{selectionLength}
					{route}
					{customisations} />
			</div>
		{/if}
		<Notices />
	</Wrapper>
{/if}
