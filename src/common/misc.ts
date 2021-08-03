import type { IconFinderConfig, PartialRoute } from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';

/**
 * Plugin type
 */
export type PluginApp = 'figma' | 'figjam';

/**
 * Icon Finder state
 */
export interface PluginIconFinderState {
	config?: IconFinderConfig;
	customisations?: PartialIconCustomisations;
	route?: PartialRoute;
}

/**
 * Storage
 */
export type PluginStorageType = 'recent' | 'bookmarks';
