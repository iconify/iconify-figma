import { iconToString } from '@iconify/search-core/lib';
import type { FigmaToUIMessage } from '../common/messages';
import type { PluginStorageType } from '../common/misc';
import { replacePhrases } from './config/phrases';
import { pluginUIEnv } from './figma/env';
import {
	customIconsData,
	recentColors,
	updateCustomIcons,
} from './figma/lists';
import { getIconImportMessage, getSVGImportMessage } from './figma/import';
import { sendMessageToFigma } from './figma/messages';
import { addNotice } from './figma/notices';
import { getOptions, setOptions } from './figma/options';
import { setFigmaDocumentColors } from './figma/palette';
import { Wrapper } from './wrapper';
import type { InitialIconFinderState } from './wrapper/state';

function assertNever(v: never) {
	//
}

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
			case 'start-plugin': {
				// Set environment
				pluginUIEnv.app = message.app;
				switch (pluginUIEnv.app) {
					case 'figjam':
						replacePhrases('Figma', 'FigJam');
				}

				// Set palette
				if (message.colors) {
					setFigmaDocumentColors(message.colors);
				}

				// Set selected layers
				if (message.selection) {
					pluginUIEnv.layers.set(message.selection);
				}

				// Set storage
				const storage = message.iconsStorage;
				if (storage) {
					for (let key in customIconsData) {
						const attr = key as PluginStorageType;
						const item = storage[attr];
						if (item instanceof Array) {
							updateCustomIcons(attr, item);
						}
					}
				}
				if (message.recentColors) {
					recentColors.set(message.recentColors);
				}

				// Set options
				setOptions(message.options);

				// Convert state
				const state = message.state;
				const convertedState: Partial<InitialIconFinderState> = {};
				for (const key in state) {
					const attr = key as keyof typeof state;
					switch (attr) {
						case 'config':
						case 'customisations':
							convertedState[attr] = state[attr];
							break;

						case 'icons':
							convertedState.icons = state.icons;
							break;

						case 'route': {
							const route = state.route;
							if (route) {
								convertedState.routes = {
									iconify: route,
								};
							}
							break;
						}

						default:
							assertNever(attr);
					}
				}

				// Create wrapper
				wrapper = new Wrapper({
					container,
					state: convertedState,
					command: message.command,

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
								sendMessageToFigma({
									type: 'icon-finder-selection',
									icons: event.icons.map(iconToString),
								});
								break;

							case 'button': {
								switch (event.button) {
									case 'import':
									case 'component':
									case 'replace': {
										// Import icon
										const message = getIconImportMessage(
											event,
											wrapper.isIconFinderMainPage()
										);
										if (message !== void 0) {
											sendMessageToFigma(message);
										}
										return;
									}

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
			}

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

			case 'update-recent-colors':
				recentColors.set(message.colors);
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
