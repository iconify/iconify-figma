import type { IconFinderConfig, PartialRoute } from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';

/**
 * Plugin type
 */
export type PluginApp = 'figma' | 'figjam';

/**
 * Commands
 */
export type FigmaCommand = '' | 'replace' | 'code';

/**
 * Icon Finder state
 */
export interface PluginIconFinderState {
	config?: IconFinderConfig;
	customisations?: PartialIconCustomisations;
	route?: PartialRoute;
	icons?: string[];
}

/**
 * Storage
 */
export type PluginStorageType = 'recent' | 'bookmarks';
