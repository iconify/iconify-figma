import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { PluginUINavigation } from '../../common/navigation';

/**
 * Create store, set default value
 */
const defaultValue: PluginUINavigation = {
	section: 'import',
	submenu: 'iconify',
};

export const navigation: Writable<PluginUINavigation> = writable(defaultValue);

/**
 * External links
 */
export const externalLinks: Record<string, string> = {
	repo: 'https://github.com/iconify/iconify-figma',
	support: 'https://github.com/iconify/iconify-figma/issues',
};

/**
 * Type for "navigate" parameter for navigation
 */
export type NavigateCallback = (target: PluginUINavigation) => void;
