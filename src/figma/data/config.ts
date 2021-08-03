import type {
	PluginIconFinderState,
	PluginStorageType,
} from '../../common/misc';
import type { PluginUINavigation } from '../../common/navigation';
import { defaultPluginOptions, PluginOptions } from '../../common/options';

/**
 * Storage
 */
export type PluginStorage = Partial<Record<PluginStorageType, string[]>>;

/**
 * Config
 */
export interface PluginConfig {
	version: 2;
	page?: PluginUINavigation;
	storage?: PluginStorage;

	// Configurable options
	options: PluginOptions;

	// Icon Finder state (including config)
	state: PluginIconFinderState;
}

export const emptyPluginConfig: PluginConfig = {
	version: 2,
	options: { ...defaultPluginOptions },
	state: {},
};
