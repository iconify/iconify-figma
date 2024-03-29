import type { FullRoute, RouterEvent, ViewBlocks } from '@iconify/search-core';
import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { PluginUINavigation } from '../../common/navigation';
import type { SelectedIcons } from './icons';
import type { WrappedRegistry } from './registry';

/**
 * Container parameters
 */
export interface ContainerProps extends RouterEvent {
	// Registry
	registry: WrappedRegistry;

	// Full route
	route: FullRoute | null;

	// Selected icon
	selection: SelectedIcons;

	// Number of selected icons
	selectionLength: number;

	// Customisations
	customisations: IconCustomisations;

	// UI state
	hidden: boolean;

	// Current page
	currentPage: PluginUINavigation;

	viewChanged: boolean;
	error: string;
	blocks: ViewBlocks | null
}
