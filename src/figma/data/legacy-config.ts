import { defaultPluginOptions } from '../../common/options';
import type { PluginConfig } from './config';

/**
 * Storage options in version 1
 */
export interface LegacyPluginStorage {
	recent?: string[];
	bookmarks?: string[];
}

/**
 * Plugin config from version 1
 *
 * Stored as 'config' in figma.clientStorage
 */
export interface LegacyPluginConfig {
	version: 1;
	options?: {
		// Layout
		compactWidth?: boolean;
		showCodePage?: boolean;

		// Icon customisations
		color?: string;
		height?: string;
		rotate?: number;
		hFlip?: boolean;
		vFlip?: boolean;

		// Selected icon
		icon?: string;

		// Import and drag/drop options
		customizeDrop?: boolean;
		dropToFrame?: boolean;

		// What to do with node after import: add to selection, replace selecton, do nothing
		selectNodes?: 'add' | 'replace' | 'none';

		// Node for importing icons
		node?: string;
		nodeX?: number;
		nodeY?: number;

		// Limit for recent icons / bookmarks
		storageLimit?: number;
	};

	// Current route, ignored
	route?: {
		page?: string; // 'iconify', 'paste', 'github', 'options', 'recent'
		iconify?: unknown; // Route from old version of Icon Finder Core, but it is not converted, so it can be ignored
	};

	storage?: LegacyPluginStorage;
}

/**
 * Convert old plugin config
 */
export function convertLegacyConfig(config: LegacyPluginConfig): PluginConfig {
	const result: PluginConfig = {
		version: 2,
		options: {
			...defaultPluginOptions,
		},
		state: {},
	};

	// Copy options
	if (config.options) {
		const oldOptions = config.options;
		const options = result.options!;

		if (oldOptions.compactWidth) {
			options.compactWidth = true;
		}
		if (oldOptions.storageLimit !== void 0) {
			options.storageLimit = oldOptions.storageLimit;
		}
	}

	// Copy storage
	if (config.storage) {
		result.storage = config.storage;
	}

	return result;
}
