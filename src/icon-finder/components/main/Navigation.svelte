<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import type { FullRoute } from '@iconify/search-core';
	import type { PluginUINavigation } from '../../../common/navigation';
	import { navigation } from '../../figma/navigation';
	import type { WrappedRegistry } from '../../wrapper/registry';
	import { phrases } from '../../phrases/en';
	import { iconLists } from '../../figma/icon-lists';
	import Section from './NavigationSection.svelte';
	import UIIcon from '../misc/Icon.svelte';

	// Registry
	// export let registry: WrappedRegistry;

	// Route
	export let route: FullRoute;

	// Current section
	let selected: PluginUINavigation = get(navigation);
	const unsubscribeNavigation = navigation.subscribe((value) => {
		selected = value;
	});

	// Recent icons
	let hasRecent: boolean = checkRecentIcons(get(iconLists.recent));
	const unsubscribeRecent = iconLists.recent.subscribe((value) => {
		hasRecent = checkRecentIcons(value);
	});

	function checkRecentIcons(value: string[]): boolean {
		const hasRecent = value.length > 0;
		if (!hasRecent && selected.submenu === 'recent') {
			// Switch from recent page
			change({
				section: 'import',
				submenu: 'iconify',
			});
		}
		return hasRecent;
	}

	// Check route
	$: {
		if (route.type !== 'custom' && selected.submenu === 'recent') {
			// Navigate from recent icons
			change({
				section: 'import',
				submenu: 'iconify',
			});
		}
	}

	// Unsubscribe from stores
	onDestroy(() => {
		unsubscribeNavigation();
		unsubscribeRecent();
	});

	// Change current page
	function change(item: PluginUINavigation) {
		navigation.set(item);
	}

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
		const section = selected.section;
		function item(item: PluginUINavigation): ListItem {
			const key = item.submenu;
			const isSelected = key === selected.submenu;

			// Check for link
			let href = '# ';
			let external = false;
			switch (item.submenu) {
				case 'repo':
					href = 'https://github.com/iconify/iconify-figma';
					external = true;
					break;

				case 'support':
					href = 'https://github.com/iconify/iconify-figma/issues';
					external = true;
					break;
			}

			const onClick = external
				? void 0
				: (event: MouseEvent) => {
						event.preventDefault();
						change(item);
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
			<Section {selected} {change} section="menu" />
			<Section {selected} {change} section="import" />
		</div>
		<div class="plugin-header-center" />
		<div class="plugin-header-right">
			<Section {selected} {change} section="about" />
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
