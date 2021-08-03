import type { UIToFigmaMessage } from '../common/messages';
import { importIcons } from './actions/import-icon';
import { loadConfig } from './actions/load-config';
import { pluginEnv } from './data/env';
import { getTargetLayers, selectionChanged } from './data/layers';
import { getUISize } from './data/layout';
import { sendMessageToUI } from './send-message';

(async () => {
	// Startup
	pluginEnv.config = await loadConfig();
	pluginEnv.selection = getTargetLayers();

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
		// console.log('Got event from UI:', event);
		switch (event.type) {
			case 'ui-loaded':
				// UI has loaded - send message to start Icon Finder
				sendMessageToUI({
					type: 'start-plugin',
					app: pluginEnv.app,
					command: figma.command,
					selection: pluginEnv.selection,
					storage: pluginEnv.config.storage,
					// Plugin options
					options: pluginEnv.config.options,
					// Icon Finder state
					state: pluginEnv.config.state,
				});
				return;

			case 'import-icon':
				// Import icon(s)
				if (importIcons(event.data, event.icons) && event.data.close) {
					// Import + close
					figma.closePlugin();
				}
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

			case 'minimize': {
				// Minimize/restore window
				pluginEnv.minimized = event.minimized;
				const size = getUISize();
				figma.ui.resize(size.width, size.height);
				return;
			}

			case 'update-options': {
				// Update options
				const config = pluginEnv.config;
				const oldCompactWidth = config.options.compactWidth;
				config.options = event.options;
				if (oldCompactWidth !== config.options.compactWidth) {
					// Resize window
					const size = getUISize();
					figma.ui.resize(size.width, size.height);
				}
				return;
			}

			default:
				console.log('Unhandled event from UI:', event);
		}
	};
})();
