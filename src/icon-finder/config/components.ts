import type { FooterButton, FooterButtonCallbackParams } from '../footer/types';

/**
 * Can show and add API providers?
 */
export const showProviders = false;
export const canAddProviders = false;

/**
 * Automatically focus search
 */
export const canFocusSearch = true;

/**
 * Show collection information block (author, license, etc...) when browsing collection
 *
 * Also see showInfoInFooter below (need to set both to false to disable icon set info block)
 */
export const showCollectionInfoBlock = true;

/**
 * Can shorten icon name in footer?
 */
export const canShortenIconName = false;

/**
 * Show title for footer blocks?
 */
export const showFooterBlockTitles = true;

/**
 * Toggle footer blocks?
 */
export const canToggleFooterBlocks = true;

/**
 * Show info block in footer?
 *
 * Block will show information about icon set for selected icon.
 *
 * When multiple icons are selected, block will be shown only when all icons have the same prefix.
 *
 * When browsing icon set, block will be shown only if block above icons
 * list is not shown or when prefix is different or showCollectionInfoBlock is disabled.
 */
export const showInfoInFooter = true;

/**
 * List of properties to customise
 */
// Global toggle: disables all properties
export const showCustomisatons = true;

// Color
export const customiseColor = true;

// Size
export const customiseWidth = false;
export const customiseHeight = true;

// Rotation
export const customiseRotate = true;

// Flip
export const customiseFlip = true;

// Inline / block
export const customiseInline = false;

/**
 * Default values for color, width and height
 */
export const defaultColor = '#000';
export const defaultWidth = '';
export const defaultHeight = '';

/**
 * Limits for sample icon in footer
 */
export const iconSampleSize = {
	width: 200,
	height: 300,
};

/**
 * Footer buttons
 */
export const showButtons = true;

export const footerButtons: Record<string, FooterButton> = {
	// Import
	import: {
		type: 'primary',
		display: 'icons', // Show only when icon(s) have been selected
		text: (params) =>
			params.icons.length > 1 ? 'Import Icons' : 'Import Icon',
	},
	// Import as component(s)
	component: {
		type: 'secondary',
		display: 'icons',
		text: (params) =>
			params.icons.length > 1
				? 'Import as Components'
				: 'Import as Component',
	},
	// Import as variants (import as components, then combine them)
	variants: {
		type: 'secondary',
		display: 'many-icons',
		text: 'Import as Variants',
	},
};

/**
 * Sample code
 */
// To disable code block, also change link for CodeBlock to Empty.svelte in ../components/footer/*.svelte (it will remove component from bundle)
export const showCode = true;
