<script lang="typescript">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import type { PluginUINavigation } from '../../../common/navigation';
	import type { NavigateCallback } from '../../figma/navigation';
	import { externalLinks } from '../../figma/navigation';
	import { phrases } from '../../phrases/en';
	import { iconLists } from '../../figma/icon-lists';
	import Section from './NavigationSection.svelte';
	import UIIcon from '../ui/UIIcon.svelte';
	import { icons } from '../../config/theme';

	// Current section
	export let currentPage: PluginUINavigation;

	// Callback to change page
	export let navigate: NavigateCallback;

	// Recent icons and bookmarks
	let hasRecent: boolean = checkCustomIcons('recent', get(iconLists.recent));
	const unsubscribeRecent = iconLists.recent.subscribe((value) => {
		hasRecent = checkCustomIcons('recent', value);
	});

	let hasBookmarks: boolean = checkCustomIcons(
		'bookmarks',
		get(iconLists.bookmarks)
	);
	const unsubscribeBookmarks = iconLists.bookmarks.subscribe((value) => {
		hasBookmarks = checkCustomIcons('bookmarks', value);
	});

	function checkCustomIcons(type: string, value: string[]): boolean {
		const hasIcons = value.length > 0;
		if (!hasIcons && currentPage.submenu === type) {
			// Switch from recent page
			navigate({
				section: 'import',
				submenu: 'iconify',
			});
		}
		return hasIcons;
	}

	// Unsubscribe from stores
	onDestroy(() => {
		unsubscribeRecent();
		unsubscribeBookmarks();
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
		icon: string | null | undefined;
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

			const iconKey = item.section + '.' + item.submenu;
			const icon = icons[iconKey];

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
					(icon
						? ' ' + baseClass + '--icon'
						: external
						? ' ' + baseClass + '--external'
						: ''),
				href,
				icon,
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
				if (hasBookmarks) {
					rightItems.push(
						item({
							section,
							submenu: 'bookmarks',
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
					title={item.title}
					on:click={item.onClick}>{#if item.icon}
						<UIIcon icon={item.icon} />
					{:else}{item.title}{/if}</a>
			{/each}
		</div>
		<div class="plugin-header-center" />
		<div class="plugin-header-right">
			{#each rightItems as item, i (item.menu.submenu)}
				<a
					href={item.href}
					class={item.className}
					title={item.title}
					target={item.external ? '_blank' : void 0}
					on:click={item.onClick}>{#if item.icon}
						<UIIcon icon={item.icon} />
					{:else}
						{item.title}{#if item.external}
							<UIIcon icon="ext-link" />
						{/if}
					{/if}
				</a>
			{/each}
		</div>
	</div>
</div>
