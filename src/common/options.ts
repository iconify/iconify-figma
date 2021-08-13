/**
 * Window state after importing icon
 */
export type WindowAfterImport = 'none' | 'minimize' | 'close';

/**
 * Select after import
 */
export type SelectAfterImport = 'auto' | 'add' | 'replace' | 'ignore';

/**
 * Plugin options that are not part of Icon Finder state
 */
export interface PluginOptions {
	// Enable compact width
	compactWidth: boolean;

	// Storage limit
	storageLimit: number;

	// What to do after importing icon
	windowAction: WindowAfterImport;

	// Layer selection after import
	selectAfterImport: SelectAfterImport;

	// Automatically scroll to footer when icon is selected
	scrollToIcon: boolean;

	// Sticky footer
	stickyFooter: boolean;

	// Apply customisations to dropped icons
	customizeDrop: boolean;

	// Drop icon to nearest frame
	dropToFrame: boolean;
}

/**
 * Options
 */
export const defaultPluginOptions: PluginOptions = {
	compactWidth: false,
	storageLimit: 200,
	windowAction: 'none',
	selectAfterImport: 'auto',
	scrollToIcon: true,
	customizeDrop: false,
	dropToFrame: true,
	stickyFooter: false,
};
