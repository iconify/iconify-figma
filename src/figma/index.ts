import type { UIToFigmaMessage } from '../common/messages';
import { importIcons } from './actions/import-icon';
import { loadConfig } from './data/config';
import { pluginEnv } from './data/env';
import { getTargetLayers, selectionChanged } from './data/layers';
import { getUISize } from './data/layout';
import { sendMessageToUI } from './send-message';

(async () => {
	// Startup
	pluginEnv.config = await loadConfig();
	pluginEnv.layersTree = getTargetLayers();

	// Track selection
	figma.on('selectionchange', selectionChanged);

	// Show UI
	figma.showUI(__html__, getUISize());

	// Event handler
	figma.ui.onmessage = (msg) => {
		try {
			if (typeof msg.type !== 'string') {
				return;
			}
		} catch (err) {
			//
		}

		const event = msg as UIToFigmaMessage;
		console.log('Got event from UI:', event);
		switch (event.type) {
			case 'ui-loaded':
				// UI has loaded - send message to start Icon Finder
				sendMessageToUI({
					type: 'start-plugin',
					app: pluginEnv.app,
					command: figma.command,
					ifConfig: pluginEnv.config.iconFinder,
					pageLayer: pluginEnv.layersTree,
					storage: pluginEnv.config.storage,
				});
				return;

			case 'import-icon':
				// Import icon(s)
				importIcons(event.data, event.icons);
				return;

			case 'custom-icons':
				if (!pluginEnv.config.storage) {
					pluginEnv.config.storage = {};
				}
				pluginEnv.config.storage[event.storage] = event.icons;
				return;

			case 'close-plugin':
				// Close plugin
				figma.closePlugin();
				return;
		}
	};
})();
