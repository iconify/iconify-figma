import { emptyPluginConfig, PluginConfig } from './config';

interface PluginEnv {
	// Status
	loaded: boolean;

	// Config
	config: PluginConfig;

	// Window height
	windowHeight?: number;
}

export const pluginEnv: PluginEnv = {
	loaded: false,
	config: emptyPluginConfig,
};
