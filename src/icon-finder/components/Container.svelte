<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import type { FullRoute, ViewBlocks } from '@iconify/search-core';
	import type { PluginUINavigation } from '../../common/navigation';
	import type { SelectedIcons } from '../wrapper/icons';
	import type { WrappedRegistry } from '../wrapper/registry';
	import type { IconCustomisations } from '../customisations/types';
	import { navigation, externalLinks } from '../figma/navigation';
	import Wrapper from './main/Wrapper.svelte';
	import Navigation from './main/Navigation.svelte';
	import Content from './main/Content.svelte';
	import Footer from './main/Footer.svelte';

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
	let showIconFinder: boolean;
	$: {
		const page = currentPage.section + '.' + currentPage.submenu;
		showIconFinder = page === 'import.iconify' || page === 'import.recent';
	}
</script>

{#if hidden !== true}
	<Wrapper>
		<Navigation {route} {currentPage} {navigate} />
		{#if showIconFinder}
			<Content
				{registry}
				{selection}
				{selectionLength}
				{viewChanged}
				{error}
				{route}
				{blocks} />
			<Footer
				{registry}
				{selection}
				{selectionLength}
				{route}
				{customisations} />
		{/if}
	</Wrapper>
{/if}
