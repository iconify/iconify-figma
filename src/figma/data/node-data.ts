import type { PartialRoute } from '@iconify/search-core';
import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';

/**
 * Data stored in icon
 */
export interface ImportedIconSharedData {
	version: 2;
	name: string;
	props?: Partial<IconCustomisations>;
	route?: PartialRoute;
}

// From version 2 of plugin
export interface LegacyImportedIconSharedData {
	name: string;
	props?: Partial<IconCustomisations>;
	color?: string;
}
