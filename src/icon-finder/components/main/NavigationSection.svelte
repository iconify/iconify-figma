<script lang="typescript">
	import type {
		PluginUINavigation,
		PluginUINavigationSection,
	} from '../../../common/navigation';
	import { phrases } from '../../config/phrases';
	import UIIcon from '../misc/Icon.svelte';

	// Item to render
	export let section: PluginUINavigationSection;

	// Currently active item
	export let selected: PluginUINavigation;

	// onChange event
	export let change: (item: PluginUINavigation) => void;

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
			(selected.section === section
				? ' ' + baseClass + '--selected'
				: '') +
			(icon === '' ? '' : ' ' + baseClass + '--icon');
	}

	// Handle click
	function onClick() {
		switch (section) {
			case 'menu':
				change({
					section,
					submenu: 'options',
				});
				break;

			case 'import':
				change({
					section,
					submenu: 'iconify',
				});
				break;

			case 'about':
				change({
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
