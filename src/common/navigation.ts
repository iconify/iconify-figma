import type { IconListType } from './lists';

/**
 * Window controls
 */
export type PluginUIWindowControls = 'compact' | 'minimize' | 'close';

/**
 * Main navigation sections
 */
export type PluginUINavigationSection = 'menu' | 'import' | 'about';

/**
 * Navigation sections for each menu
 */
interface PluginUINavigationBase {
	section: PluginUINavigationSection;
	submenu: string;
}

interface PluginUIMenuNavigation extends PluginUINavigationBase {
	section: 'menu';
	submenu: 'options' | 'reset';
}

interface PluginUIImportNavigation extends PluginUINavigationBase {
	section: 'import';
	submenu: 'iconify' | 'replace' | 'svg' | IconListType;
}

interface PluginUIAboutNavigation extends PluginUINavigationBase {
	section: 'about';
	submenu: 'about' | 'repo' | 'support' | 'donate';
}

/**
 * Combination
 */
export type PluginUINavigation =
	| PluginUIMenuNavigation
	| PluginUIImportNavigation
	| PluginUIAboutNavigation;
