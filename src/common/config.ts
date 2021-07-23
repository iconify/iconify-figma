import type { IconFinderConfig, PartialRoute } from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';

/**
 * Icon Finder config
 */
export interface PluginIconFinderConfig {
	config?: IconFinderConfig;
	customisations?: PartialIconCustomisations;
	route?: PartialRoute;
}
