import type { FigmaToUIMessage } from '../common/messages';
import { sendMessageToFigma } from './figma/messages';
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
				// Create wrapper
				wrapper = new Wrapper({
					container,

					// Handle callbacks
					callback: (event) => {
						console.log('Icon Finder event:', event);
						switch (event.type) {
							case 'config':
								sendMessageToFigma({
									type: 'icon-finder-config',
									config: event.config,
								});
								break;

							case 'customisations':
								sendMessageToFigma({
									type: 'icon-finder-customisations',
									customisations: event.customisations,
								});
								break;

							case 'route':
								sendMessageToFigma({
									type: 'icon-finder-route',
									route: event.route,
								});
								break;
						}
					},
				});
				break;
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
