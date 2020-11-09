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
