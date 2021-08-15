import type { RecentColorsList } from '../../common/lists';
import type {
	PluginIconFinderState,
	PluginStorageType,
} from '../../common/misc';
import type { PluginUINavigation } from '../../common/navigation';
import type { PluginOptions } from '../../common/options';

/**
 * Storage
 */
export type PluginIconsStorage = Partial<Record<PluginStorageType, string[]>>;

/**
 * Config
 */
interface PluginConfigOptional {
	page?: PluginUINavigation;
	iconsStorage?: PluginIconsStorage;
	recentColors?: RecentColorsList;

	// Configurable options
	options: PluginOptions;

	// Icon Finder state (including config)
	state: PluginIconFinderState;
}

interface PluginConfigVersion {
	version: 2;
}

export interface PluginConfig
	extends PluginConfigVersion,
		PluginConfigOptional {}

export interface PartialPluginConfig
	extends PluginConfigVersion,
		Omit<Partial<PluginConfigOptional>, 'options'> {
	options?: Partial<PluginOptions>;
}

export const emptyPluginConfig: PartialPluginConfig = {
	version: 2,
};
