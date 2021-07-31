import type { FigmaToUIMessage } from '../common/messages';
import type { PluginStorageType } from '../common/misc';
import { pluginUIEnv } from './figma/env';
import { iconLists } from './figma/icon-lists';
import { getIconImportMessage } from './figma/import';
import { sendMessageToFigma } from './figma/messages';
import { addNotice } from './figma/notices';
import { Wrapper } from './wrapper';

function runIconFinder() {
	const container = document.getElementById('container');
	if (!container) {
		console.log('Cannot find container!');
		return;
	}

	// Wrapper
	let wrapper: Wrapper;

	// Subscribe to messages from Figma
	window.onmessage = (event) => {
		try {
			if (typeof event.data.pluginMessage.type !== 'string') {
				return;
			}
		} catch (err) {
			return;
		}
		const message = event.data.pluginMessage as FigmaToUIMessage;
		console.log('Message from Figma:', message);

		switch (message.type) {
			case 'start-plugin':
				// Set environment
				pluginUIEnv.app = message.app;

				// Set storage
				const storage = message.storage;
				if (storage) {
					for (let key in iconLists) {
						const attr = key as PluginStorageType;
						const item = storage[attr];
						if (item instanceof Array) {
							iconLists[attr].set(item);
						}
					}
				}

				// Create wrapper
				wrapper = new Wrapper({
					container,

					// Handle callbacks
					callback: (event) => {
						console.log('Icon Finder event:', event);
						switch (event.type) {
							case 'config':
								if (wrapper.isIconFinderMainPage()) {
									sendMessageToFigma({
										type: 'icon-finder-config',
										config: event.config,
									});
								}
								break;

							case 'customisations':
								sendMessageToFigma({
									type: 'icon-finder-customisations',
									customisations: event.customisations,
								});
								break;

							case 'route':
								if (wrapper.isIconFinderMainPage()) {
									sendMessageToFigma({
										type: 'icon-finder-route',
										route: event.route,
									});
								}
								break;

							case 'button': {
								switch (event.button) {
									case 'import':
										// Import icon
										const message = getIconImportMessage(
											event,
											wrapper.isIconFinderMainPage()
										);
										if (message !== void 0) {
											sendMessageToFigma(message);
										}
								}
								break;
							}
						}
					},
				});
				return;

			case 'notice':
				addNotice(message.notice);
				return;
		}
	};

	// Send message to Figma
	const height = window.innerHeight ? window.innerHeight : void 0;
	sendMessageToFigma({
		type: 'ui-loaded',
		height,
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', runIconFinder);
} else {
	runIconFinder();
}
