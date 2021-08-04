/**
 * Action after importing icon
 */
export type ActionAfterImport = 'none' | 'minimize' | 'close';

/**
 * Plugin options that are not part of Icon Finder state
 */
export interface PluginOptions {
	// Enable compact width
	compactWidth: boolean;

	// Storage limit
	storageLimit: number;

	// What to do after importing icon
	windowAction: ActionAfterImport;

	// Automatically scroll to footer when icon is selected
	scrollToIcon: boolean;
}

/**
 * Options
 */
export const defaultPluginOptions: PluginOptions = {
	compactWidth: false,
	storageLimit: 200,
	windowAction: 'none',
	scrollToIcon: true,
};
