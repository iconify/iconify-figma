import type { SelectedPageLayer } from '../../common/layers';
import { emptyPluginConfig, PluginConfig } from './config';

interface PluginEnv {
	// Status
	loaded: boolean;

	// Config
	config: PluginConfig;

	// Window height
	windowHeight?: number;

	// Selected layers, starting with page
	layersTree?: SelectedPageLayer;
}

export const pluginEnv: PluginEnv = {
	loaded: false,
	config: emptyPluginConfig,
};
