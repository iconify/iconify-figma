import type { UIToFigmaMessage } from '../common/messages';
import { importIcons } from './actions/import-icon';
import { loadConfig } from './functions/load-config';
import { finishStoringConfig, storeConfig } from './functions/store-config';
import { pluginEnv } from './data/env';
import {
	selectionChanged,
	getTargetLayers,
} from './functions/get-target-layers';
import { getUISize } from './functions/ui-size';
import { sendMessageToUI } from './send-message';
import { dropIcon } from './actions/drop-icon';
import type { FigmaCommand } from '../common/misc';
import { getDocumentColors } from './functions/get-colors';

/**
 * Close plugin
 */
async function closePluginAsync() {
	return finishStoringConfig()
		.then(() => {
			figma.closePlugin();
		})
		.catch((err) => {
			//
		});
}

/**
 * Do stuff
 */
(async () => {
	// Startup
	pluginEnv.config = await loadConfig();
	pluginEnv.selection = getTargetLayers();

	// Track selection
	figma.on('selectionchange', selectionChanged);
	figma.on('currentpagechange', selectionChanged);

	// Close stuff
	figma.on('close', closePluginAsync);

	// Show UI
	figma.showUI(__html__, {
		...getUISize(),
		themeColors: false
	});

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
					command: figma.command as FigmaCommand,
					selection: pluginEnv.selection,
					iconsStorage: pluginEnv.config.iconsStorage,
					recentColors: pluginEnv.config.recentColors,
					// Plugin options
					options: pluginEnv.config.options,
					// Icon Finder state
					state: pluginEnv.config.state,
					// Document colors
					colors: getDocumentColors(),
				});
				return;

			case 'import-icon':
				// Import icon(s)
				if (importIcons(event.data, event.icons, event.route)) {
					// Action
					switch (event.data.windowAction) {
						case 'minimize':
							pluginEnv.minimized = true;
							const size = getUISize();
							figma.ui.resize(size.width, size.height);
							sendMessageToUI({
								type: 'toggle-minimize',
								minimized: true,
							});
							break;

						case 'close':
							closePluginAsync();
							return;
					}

					// Reload layers list
					selectionChanged();
				}
				return;

			case 'drop-icon':
				// Drop icon(s)
				dropIcon(event.data, event.target);
				return;

			case 'custom-icons':
				if (!pluginEnv.config.iconsStorage) {
					pluginEnv.config.iconsStorage = {};
				}
				pluginEnv.config.iconsStorage[event.storage] = event.icons;
				storeConfig();
				return;

			case 'close-plugin':
				// Close plugin
				closePluginAsync();
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
				storeConfig();
				return;
			}

			// Update state
			case 'icon-finder-config':
				pluginEnv.config.state.config = event.config;
				storeConfig();
				break;

			case 'icon-finder-customisations':
				pluginEnv.config.state.customisations = event.customisations;
				storeConfig();
				break;

			case 'icon-finder-route':
				pluginEnv.config.state.route = event.route;
				storeConfig();
				break;

			case 'icon-finder-selection':
				pluginEnv.config.state.icons = event.icons;
				storeConfig();
				break;

			default:
				console.log('Unhandled event from UI:', event);
		}
	};
})();
