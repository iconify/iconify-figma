import type { PluginUINavigation } from '../../common/navigation';

/**
 * Callback for navigation
 */
export type NavigateCallback = (target: PluginUINavigation) => void;

/**
 * Create store, set default value
 */
export const defaultNavigation: PluginUINavigation = {
	section: 'import',
	submenu: 'iconify',
};

/**
 * External links
 */
export const externalLinks: Record<string, string> = {
	repo: 'https://github.com/iconify/iconify-figma',
	support: 'https://github.com/iconify/iconify-figma/issues',
};
