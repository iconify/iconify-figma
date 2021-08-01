import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { SelectedLayers } from '../../common/layers';
import type { PluginApp } from '../../common/misc';

type PartialSelectedLayers = Partial<SelectedLayers>;

/**
 * Interface for pluginUIEnv
 */
interface PluginUIEnv {
	// Application type, set before any content is rendered after receiving message from plugin
	app: PluginApp;

	// Selected layers
	layers: Writable<PartialSelectedLayers>;
}

/**
 * Plugin stuff
 */
export const pluginUIEnv: PluginUIEnv = {
	app: 'figma',
	layers: writable({}),
};
