import type { FigmaToUIMessage } from '../common/messages';
import type { PluginStorageType } from '../common/misc';
import { replacePhrases } from './config/phrases';
import { pluginUIEnv } from './figma/env';
import { customIconsData, updateCustomIcons } from './figma/icon-lists';
import { getIconImportMessage, getSVGImportMessage } from './figma/import';
import { sendMessageToFigma } from './figma/messages';
import { addNotice } from './figma/notices';
import { getOptions, setOptions } from './figma/options';
import { Wrapper } from './wrapper';

function runIconFinder() {
	const container = document.getElementById('container');
	if (!container) {
		console.log('Cannot find container!');
		return;
	}

	// Scroll to icon
	let justScrolled = false;
	const scrollToIcon = () => {
		if (justScrolled || !getOptions().scrollToIcon) {
			return;
		}
		justScrolled = true;

		// Scroll to icon
		setTimeout(() => {
			try {
				const iconsNav = container.querySelector(
					'div.iif-icons-navigation'
				);
				const footer = container.querySelector('div.iif-footer-full');
				const node = iconsNav ? iconsNav.parentElement : footer;
				if (node) {
					node.scrollIntoView({
						behavior: 'smooth',
					});
				}
			} catch (err) {
				//
			}
		});
	};

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
				switch (pluginUIEnv.app) {
					case 'figjam':
						replacePhrases('Figma', 'FigJam');
				}

				if (message.selection) {
					pluginUIEnv.layers.set(message.selection);
				}

				// Set storage
				const storage = message.storage;
				if (storage) {
					for (let key in customIconsData) {
						const attr = key as PluginStorageType;
						const item = storage[attr];
						if (item instanceof Array) {
							updateCustomIcons(attr, item);
						}
					}
				}

				// Set options
				setOptions(message.options);

				// Create wrapper
				wrapper = new Wrapper({
					container,
					state: message.state,

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
								justScrolled = false; // Re-enable scroll if route has changed
								if (wrapper.isIconFinderMainPage()) {
									sendMessageToFigma({
										type: 'icon-finder-route',
										route: event.route,
									});
								}
								break;

							case 'selection':
								if (event.icons.length === 1) {
									// Scroll to icon
									scrollToIcon();
								}
								break;

							case 'button': {
								switch (event.button) {
									case 'import':
									case 'component':
										// Import icon
										const message = getIconImportMessage(
											event,
											wrapper.isIconFinderMainPage()
										);
										if (message !== void 0) {
											sendMessageToFigma(message);
										}
										return;

									case 'close':
										sendMessageToFigma({
											type: 'close-plugin',
										});
										return;
								}
								break;
							}

							case 'import-svg': {
								const message = getSVGImportMessage(event.svg);
								if (message) {
									sendMessageToFigma(message);
								}
								return;
							}

							case 'navigation':
								// Re-enable scroll if route has changed
								justScrolled = false;
								return;
						}
					},
				});
				return;

			case 'notice': {
				addNotice(message.notice);

				if (message.importedIcons && message.importedIcons.length) {
					// Update recent icons list
					let icons = customIconsData.recent;
					message.importedIcons.forEach((name) => {
						icons = icons.filter((item) => item !== name);
						icons.unshift(name);
					});

					// Check limit
					const limit = getOptions().storageLimit;
					if (limit && icons.length > limit) {
						icons = icons.slice(0, limit - 1);
					}

					// Update
					updateCustomIcons('recent', icons);
					sendMessageToFigma({
						type: 'custom-icons',
						storage: 'recent',
						icons,
					});
				}
				return;
			}

			case 'target-layers':
				pluginUIEnv.layers.set(message.selection);
				return;

			case 'toggle-minimize':
				wrapper.minimizeFromPlugin(message.minimized);
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
