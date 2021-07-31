<script lang="typescript">
	import { setContext, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import type { FullRoute, ViewBlocks } from '@iconify/search-core';
	import type { PluginUINavigation } from '../../common/navigation';
	import type { SelectedIcons } from '../wrapper/icons';
	import type { WrappedRegistry } from '../wrapper/registry';
	import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
	import { navigation, externalLinks } from '../figma/navigation';
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

	// Set context
	setContext('registry', registry);

	// Manage navigation
	let currentPage: PluginUINavigation = get(navigation);
	const unsubscribeNavigation = navigation.subscribe((value) => {
		currentPage = value;
	});

	// Unsubscribe from stores
	onDestroy(() => {
		unsubscribeNavigation();
	});

	/**
	 * Change current page
	 */
	function navigate(target: PluginUINavigation) {
		if (externalLinks[target.submenu] !== void 0) {
			// Cannot navigate to external link
			return;
		}
		navigation.set(target);
	}

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
