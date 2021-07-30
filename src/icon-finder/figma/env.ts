import type { PluginApp } from '../../common/misc';

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
