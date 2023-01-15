<script lang="typescript">
	import { getContext, onDestroy } from 'svelte';
	import type { Icon, FullRoute } from '@iconify/search-core';
	import { iconToString } from '@iconify/search-core';
	import { getIcon } from '@iconify/svelte/dist/Icon.svelte';
	import type { WrappedRegistry } from '../../../../wrapper/registry';
	import type {
		FooterButton,
		FooterButtonCallbackParams,
	} from '../../../../footer/types';
	import { phrases } from '../../../../config/phrases';
	import { footerButtons } from '../../../../config/components';
	import UIIcon from '../../../ui/UIIcon.svelte';
	import { pluginUIEnv } from '../../../../figma/env';

	// Selected icons
	export let icons: Icon[];

	// Current route
	export let route: FullRoute;

	// Registry
	const registry = getContext('registry') as WrappedRegistry;

	// Check if replace is available
	let replace: string;
	const unsubscribe = pluginUIEnv.layers.subscribe((value) => {
		replace = value.icon ? value.icon.name : '';
	});
	onDestroy(unsubscribe);

	// Custom properties for buttons
	interface ListItem extends FooterButton {
		key: string;
		className: string;
	}
	const baseClassName = 'iif-form-button';
	const buttonPhrases = phrases.footerButtons;

	// Selected icon state
	interface SelectedIconData {
		name: string;
		animated: boolean;
	}
	let selectedIconData: SelectedIconData | null = null;
	$: {
		if (icons.length !== 1) {
			selectedIconData = null;
		} else {
			const name = iconToString(icons[0]);
			const data = getIcon(name);
			if (data) {
				// Check if icon has animations
				const body = data.body;
				const animated =
					body.indexOf('<animate') !== -1 ||
					body.indexOf('<set') !== -1 ||
					body.indexOf('<discard') !== -1;

				selectedIconData = {
					name,
					animated,
				};
			} else {
				selectedIconData = null;
			}
		}
	}

	/**
	 * Parameters for callback
	 */
	function params(
		key: string,
		button: FooterButton
	): FooterButtonCallbackParams {
		return {
			key,
			button,
			registry,
			icons,
			route,
			replace,
		};
	}

	/**
	 * Get button text
	 */
	function text(item: ListItem): string {
		if (typeof item.text === 'function') {
			return item.text(params(item.key, item));
		}

		// Text as string
		if (typeof item.text === 'string') {
			return item.text;
		}

		// Use key: test phrases, then capitalize key
		const key = item.key;
		if (typeof buttonPhrases[key] === 'string') {
			return buttonPhrases[key];
		}

		return key
			.split('-')
			.map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
			.join(' ');
	}

	// Change buttons to array, add unique key and generate class name
	const items: ListItem[] = Object.keys(footerButtons).map((key) => {
		const button = footerButtons[key];

		const result: ListItem = {
			...button,
			key,
			className:
				baseClassName +
				(button.type ? ' ' + baseClassName + '--' + button.type : '') +
				(button.icon ? ' ' + baseClassName + '--with-icon' : ''),
		};
		return result;
	});

	// TypeScript guard
	function assertNever(v: never): void {
		//
	}

	let buttons: ListItem[];
	let iconName: string;
	let href: string | null;
	$: {
		const total = icons.length;

		// Filter buttons
		buttons = items.filter((item) => {
			const display = item.display;
			switch (display) {
				case void 0:
				case 'always':
					return true;

				case 'empty':
					return total === 0;

				case 'icons':
					return total > 0;

				case 'one-icon':
					return total === 1;

				case 'many-icons':
					return total > 1;

				case 'replace':
					return total === 1 && replace !== '';

				default:
					if (typeof display === 'function') {
						return display(params(item.key, item));
					}
					assertNever(display);
			}
		});

		// Get icon name for first icon
		const firstIcon = icons[0];
		iconName = total > 0 ? iconToString(firstIcon) : 'icon';
		href = total === 1 ? 'https://icon-sets.iconify.design/' + firstIcon.prefix + '/' + firstIcon.name + '/' : null;
	}

	function onClick(button: string) {
		// UIFooterButtonEvent
		registry.callback({
			type: 'button',
			button,
		});
	}
</script>

{#if selectedIconData && selectedIconData.animated}
	<p class="iif-footer-notice">{phrases.svg.animated}</p>
{/if}

<div class="iif-footer-buttons">
	{#each buttons as item, i (item.key)}
		<button
			class={item.className}
			on:click|preventDefault={() => onClick(item.key)}>
			{#if item.icon}
				<UIIcon icon={item.icon} />
			{/if}
			{text(item)
				.replace('{icon}', iconName)
				.replace('{count}', icons.length + '')}
		</button>
	{/each}
	{#if href}
		<a class={baseClassName + ' ' + baseClassName + '--secondary'} href={href} target="_blank">Icon Code</a>
	{/if}
</div>
