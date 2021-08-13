import type { PluginUINavigation } from '../../common/navigation';
import type { IconFinderRouteType } from '../wrapper/state';

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
	donate: 'https://github.com/sponsors/cyberalien',
};

/**
 * Check if navigation item is Icon Finder
 */
export function isIconFinderNavigation(
	item: PluginUINavigation
): IconFinderRouteType | false {
	if (item.section !== 'import') {
		return false;
	}

	const submenu = item.submenu;
	switch (submenu) {
		case 'iconify':
		case 'bookmarks':
		case 'recent':
			return submenu;

		default:
			return false;
	}
}
