<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import type { FullRoute } from '@iconify/search-core';
	import type { PluginUINavigation } from '../../../common/navigation';
	import type { NavigateCallback } from '../../figma/navigation';
	import { externalLinks } from '../../figma/navigation';
	import { phrases } from '../../phrases/en';
	import { iconLists } from '../../figma/icon-lists';
	import Section from './NavigationSection.svelte';
	import UIIcon from '../ui/UIIcon.svelte';

	// Route
	export let route: FullRoute;

	// Current section
	export let currentPage: PluginUINavigation;

	// Callback to change page
	export let navigate: NavigateCallback;

	// Recent icons
	let hasRecent: boolean = checkRecentIcons(get(iconLists.recent));
	const unsubscribeRecent = iconLists.recent.subscribe((value) => {
		hasRecent = checkRecentIcons(value);
	});

	function checkRecentIcons(value: string[]): boolean {
		const hasRecent = value.length > 0;
		if (!hasRecent && currentPage.submenu === 'recent') {
			// Switch from recent page
			navigate({
				section: 'import',
				submenu: 'iconify',
			});
		}
		return hasRecent;
	}

	// Check route
	$: {
		if (route.type !== 'custom' && currentPage.submenu === 'recent') {
			// Navigate from recent icons
			navigate({
				section: 'import',
				submenu: 'iconify',
			});
		}
	}

	// Unsubscribe from stores
	onDestroy(() => {
		unsubscribeRecent();
	});

	// TypeScript check
	function assertNever(v: never) {
		//
	}

	// Generate list of items to show
	interface ListItem {
		menu: PluginUINavigation;
		selected: boolean;
		title: string;
		className: string;
		external: boolean;
		href: string;
		onClick?: (event: MouseEvent) => void;
	}
	let leftItems: ListItem[];
	let rightItems: ListItem[];
	const submenuText = phrases.figma.submenu;
	const baseClass = 'plugin-nav';
	$: {
		// Menu tree
		const section = currentPage.section;
		function item(item: PluginUINavigation): ListItem {
			const key = item.submenu;
			const isSelected = key === currentPage.submenu;

			// Check for link
			let href = '# ';
			let external = false;
			if (externalLinks[item.submenu] !== void 0) {
				href = externalLinks[item.submenu];
				external = true;
			}

			const onClick = external
				? void 0
				: (event: MouseEvent) => {
						event.preventDefault();
						navigate(item);
				  };

			return {
				menu: item,
				selected: isSelected,
				title:
					submenuText[key] === void 0
						? key.slice(0, 1).toUpperCase() + key.slice(1)
						: submenuText[key],
				className:
					baseClass +
					(isSelected ? ' ' + baseClass + '--selected' : '') +
					(external ? ' ' + baseClass + '--external' : ''),
				href,
				external,
				onClick,
			};
		}
		switch (section) {
			case 'menu':
				leftItems = [
					item({
						section,
						submenu: 'options',
					}),
				];
				rightItems = [
					item({
						section,
						submenu: 'reset',
					}),
				];
				break;

			case 'import':
				leftItems = [
					item({
						section,
						submenu: 'iconify',
					}),
					item({
						section,
						submenu: 'svg',
					}),
				];
				rightItems = [];
				if (hasRecent) {
					rightItems.push(
						item({
							section,
							submenu: 'recent',
						})
					);
				}
				break;

			case 'about':
				leftItems = [
					item({
						section,
						submenu: 'about',
					}),
				];
				rightItems = [
					item({
						section,
						submenu: 'repo',
					}),
					item({
						section,
						submenu: 'support',
					}),
				];
				break;

			default:
				assertNever(section);
		}
	}
</script>

<div class="plugin-header plugin-header--with-menu">
	<div class="plugin-wrapper-header plugin-wrapper-header--primary">
		<div class="plugin-header-left">
			<Section {currentPage} {navigate} section="menu" />
			<Section {currentPage} {navigate} section="import" />
		</div>
		<div class="plugin-header-center" />
		<div class="plugin-header-right">
			<Section {currentPage} {navigate} section="about" />
		</div>
	</div>

	<div class="plugin-wrapper-header plugin-wrapper-header--secondary">
		<div class="plugin-header-left">
			{#each leftItems as item, i (item.menu.submenu)}
				<a
					href={item.href}
					class={item.className}
					on:click={item.onClick}>{item.title}</a>
			{/each}
		</div>
		<div class="plugin-header-center" />
		<div class="plugin-header-right">
			{#each rightItems as item, i (item.menu.submenu)}
				<a
					href={item.href}
					class={item.className}
					target={item.external ? '_blank' : void 0}
					on:click={item.onClick}>{item.title}
					{#if item.external}
						<UIIcon icon="ext-link" />
					{/if}
				</a>
			{/each}
		</div>
	</div>
</div>
