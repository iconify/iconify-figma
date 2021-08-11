import type {
	Icon,
	PartialRoute,
	IconFinderConfig,
} from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { IconListType } from '../../common/icon-lists';
import type { PluginUINavigation } from '../../common/navigation';

export type IconFinderRouteType = 'iconify' | IconListType;

/**
 * Icon finder state.
 *
 * All elements could be empty
 */
export interface InitialIconFinderState {
	// Current page
	navigation: PluginUINavigation;

	// Selected icons
	icons: (Icon | string)[];

	// Customisations
	customisations: PartialIconCustomisations;

	// Current route, per page
	currentRouteType: IconFinderRouteType;
	routes: Partial<Record<IconFinderRouteType, PartialRoute>>;

	// Config changes
	config?: IconFinderConfig;

	// Minimized?
	minimized: boolean;
}

// Override icons
export interface IconFinderState extends InitialIconFinderState {
	icons: Icon[];
}
