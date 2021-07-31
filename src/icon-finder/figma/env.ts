import { writable } from 'svelte/store';
import type { PluginApp } from '../../common/misc';

/**
 * Interface for pluginUIEnv
 */
interface PluginUIEnv {
	app: PluginApp;
}

/**
 * Plugin stuff
 */
export const pluginUIEnv: PluginUIEnv = {
	// Application type, set before any content is rendered after receiving message from plugin
	app: 'figma',
};
