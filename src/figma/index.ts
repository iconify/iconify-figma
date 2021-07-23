import type { UIToFigmaMessage } from '../common/messages';
import { loadConfig } from './data/config';
import { pluginEnv } from './data/env';
import { getUISize } from './data/layout';
import { sendMessageToUI } from './send-message';

(async () => {
	// Startup
	pluginEnv.config = await loadConfig();

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
					ifConfig: pluginEnv.config.iconFinder,
				});
				return;
		}
	};
})();
