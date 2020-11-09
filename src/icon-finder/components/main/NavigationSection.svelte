<script lang="typescript">
	import type {
		PluginUINavigation,
		PluginUINavigationSection,
	} from '../../../common/navigation';
	import { phrases } from '../../config/phrases';
	import type { NavigateCallback } from '../../figma/navigation';
	import UIIcon from '../misc/Icon.svelte';

	// Item to render
	export let section: PluginUINavigationSection;

	// Currently active item
	export let currentPage: PluginUINavigation;

	// onChange event
	export let navigate: NavigateCallback;

	// TypeScript check
	function assertNever(v: never) {
		//
	}

	// Get icon and text
	let icon: string;
	let text: string;
	$: {
		icon = section === 'menu' ? section : '';
		text = phrases.figma.menu[section];
	}

	// Get class name
	const baseClass = 'plugin-nav';
	let className: string;
	$: {
		className =
			baseClass +
			(currentPage.section === section
				? ' ' + baseClass + '--selected'
				: '') +
			(icon === '' ? '' : ' ' + baseClass + '--icon');
	}

	// Handle click
	function onClick() {
		switch (section) {
			case 'menu':
				navigate({
					section,
					submenu: 'options',
				});
				break;

			case 'import':
				navigate({
					section,
					submenu: 'iconify',
				});
				break;

			case 'about':
				navigate({
					section,
					submenu: 'about',
				});
				break;

			default:
				assertNever(section);
		}
	}
</script>

<a class={className} href="# " on:click|preventDefault={onClick} title={text}>
	{#if icon === ''}
		{text}
	{:else}
		<UIIcon {icon} />
	{/if}
</a>
