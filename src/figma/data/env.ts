import type { SelectedLayers } from '../../common/layers';
import type { PluginApp } from '../../common/misc';
import { expandConfig } from '../functions/load-config';
import { emptyPluginConfig, PluginConfig } from './config';

interface PluginEnv {
	// App
	app: PluginApp;

	// Status
	loaded: boolean;

	// Config
	config: PluginConfig;

	// Window height
	windowInnerHeight?: number;
	windowOuterHeight?: number;

	// True if window is currently minimized
	minimized: boolean;

	// Selected layers
	selection?: SelectedLayers;
}

/**
 * Detect application running plugin
 */
function detectApp(): PluginApp {
	const f = (figma as unknown) as Record<string, string>;
	try {
		const env = f.editorType;
		switch (env) {
			case 'figma':
			case 'figjam':
				return env;
		}
	} catch (err) {
		//
	}

	try {
		if (typeof f.createSticky === 'function') {
			return 'figjam';
		}
	} catch (err) {
		//
	}

	return 'figma';
}

export const pluginEnv: PluginEnv = {
	app: detectApp(),
	loaded: false,
	config: expandConfig(emptyPluginConfig),
	minimized: false,
};
