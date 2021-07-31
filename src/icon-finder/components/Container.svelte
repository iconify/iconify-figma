<script lang="typescript">
	import { setContext } from 'svelte';
	import type { FullRoute, ViewBlocks } from '@iconify/search-core';
	import type { PluginUINavigation } from '../../common/navigation';
	import type { SelectedIcons } from '../wrapper/icons';
	import type { WrappedRegistry } from '../wrapper/registry';
	import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
	import { externalLinks } from '../figma/navigation';
	import type { NavigateCallback } from '../figma/navigation';
	import Wrapper from './Wrapper.svelte';
	import Navigation from './figma/Navigation.svelte';
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

	/**
	 * Change current page
	 */
	const navigate: NavigateCallback = (target: PluginUINavigation) => {
		if (externalLinks[target.submenu] !== void 0) {
			// Cannot navigate to external link
			return;
		}
		registry.navigate(target);
	};

	// Check if Icon Finder should be shown
	let showIconFinder: boolean | 'hidden' = false;
	$: {
		const page = currentPage.section + '.' + currentPage.submenu;
		showIconFinder =
			page === 'import.iconify' || page === 'import.recent'
				? true
				: showIconFinder
				? 'hidden'
				: false;
	}
</script>

{#if hidden !== true}
	<Wrapper>
		<Navigation {route} {currentPage} {navigate} />
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
