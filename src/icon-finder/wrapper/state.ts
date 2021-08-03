import type {
	Icon,
	PartialRoute,
	IconFinderConfig,
} from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { PluginUINavigation } from '../../common/navigation';

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

	// Current route
	route?: PartialRoute;

	// Config changes
	config?: IconFinderConfig;

	// Last Iconify route and default route
	defaultRoute?: PartialRoute;
	iconifyRoute?: PartialRoute;

	// Minimized?
	minimized: boolean;
}

// Override icons
export interface IconFinderState extends InitialIconFinderState {
	icons: Icon[];
}
