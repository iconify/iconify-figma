import { pluginUIEnv } from '../figma/env';
import type { FooterButton, FooterButtonCallbackParams } from '../footer/types';

/**
 * Can show and add API providers?
 */
export const showProviders = false;
export const canAddProviders = false;

/**
 * Automatically focus search
 *
 * Do not change value to true, comment out code below it. It checks for mobile devices
 */
// export const canFocusSearch = false;

export const canFocusSearch = (() => {
	try {
		return (
			window.matchMedia('(min-width: 600px) and (min-height: 600px)')
				.matches &&
			// Do not focus if touch device is detected
			!('ontouchstart' in window)
		);
	} catch (err) {
		return false;
	}
})();

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
export const showFooterBlockTitles = false;

/**
 * Toggle footer blocks?
 */
export const canToggleFooterBlocks = false;

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
export const customiseRotate = false;

// Flip
export const customiseFlip = false;

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
	// Replace icon
	replace: {
		type: 'secondary',
		display: 'replace',
		text: (params) => 'Replace "' + params.replace + '"',
	},

	// Import
	import: {
		type: 'primary',
		display: 'icons',
		text: (params) => 'Import Icon' + (params.icons.length > 1 ? 's' : ''),
	},

	// Import as component, not available in FigJam
	component: {
		type: 'secondary',
		display: (state) =>
			pluginUIEnv.app === 'figma' && state.icons.length > 0,
		text: (params) =>
			'Import as Component' + (params.icons.length > 1 ? 's' : ''),
	},
};

/**
 * Sample code
 */
// To disable code block, also change link for CodeBlock to Empty.svelte in ../components/footer/*.svelte (it will remove component from bundle)
export const showCode = false;
