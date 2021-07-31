import type {
	PluginIconFinderConfig,
	PluginStorageType,
} from '../../common/misc';
import type { PluginUINavigation } from '../../common/navigation';
import { convertLegacyConfig, LegacyPluginConfig } from './legacy-config';

/**
 * Options
 */
export interface PluginOptions {
	// Enable compact width
	compactWidth?: boolean;

	// Storage limit
	storageLimit?: number;
}

export const defaultPluginOptions: Required<PluginOptions> = {
	compactWidth: false,
	storageLimit: 200,
};

/**
 * Storage
 */
export type PluginStorage = Partial<Record<PluginStorageType, string[]>>;

/**
 * Config
 */
export interface PluginConfig {
	version: 2;
	options: PluginOptions;
	page?: PluginUINavigation;
	storage?: PluginStorage;
	iconFinder: PluginIconFinderConfig;
}

export const emptyPluginConfig: PluginConfig = {
	version: 2,
	options: {},
	iconFinder: {},
};

/**
 * Remove default values from config
 */
export function compactPluginConfig(config: PluginConfig): PluginConfig {
	const result: PluginConfig = {
		version: 2,
		options: {},
		iconFinder: config.iconFinder,
	};

	// Options
	if (config.options) {
		const customOptions = config.options as Record<string, unknown>;
		const defaultValues = defaultPluginOptions as Record<string, unknown>;
		const options = result.options;

		for (const key in defaultPluginOptions) {
			if (
				customOptions[key] !== void 0 &&
				customOptions[key] !== defaultValues[key]
			) {
				(options as Record<string, unknown>)[key] = customOptions[key];
			}
		}
	}

	// Delete empty route
	const iconFinderConfig = config.iconFinder;
	if (iconFinderConfig.route) {
		const route = iconFinderConfig.route;
		if (
			route.type !== 'collection' &&
			route.type !== 'search' &&
			// Do not store empty index
			(route.type !== 'collections' || (!route.params && !route.parent))
			// Custom page should not be in route
		) {
			delete result.iconFinder.route;
		}
	}

	// Current page
	if (config.page) {
		const page = config.page;
		if (page.section !== 'import' || page.submenu !== 'iconify') {
			result.page = config.page;
		}
	}

	// Storage
	if (config.storage) {
		result.storage = config.storage;
	}

	return result;
}

/**
 * Load config
 */
export async function loadConfig(): Promise<PluginConfig> {
	// Load config
	try {
		const retrievedConfig:
			| PluginConfig
			| LegacyPluginConfig
			| undefined = await figma.clientStorage.getAsync('config');
		if (
			typeof retrievedConfig === 'object' &&
			typeof retrievedConfig.version === 'number'
		) {
			console.log(
				'Retrieved config:',
				JSON.stringify(retrievedConfig, null, 4)
			);
			switch (retrievedConfig.version) {
				case 1:
					return convertLegacyConfig(retrievedConfig);

				case 2:
					return retrievedConfig;
			}
		}
	} catch (err) {
		//
	}

	// Nothing
	return emptyPluginConfig;
}
