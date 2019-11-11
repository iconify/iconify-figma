"use strict";

import importSVG from './import-svg';
import importIconify from './import-iconify';

/**
 * Environment
 *
 * @type {object}
 */
let env = {
	loaded: false,
	debug: false,
	lastParent: null,
};

/**
 * Show UI
 */
figma.showUI(__html__, {
	width: 800,
	height: 800,
});

/**
 * Handle messages
 *
 * @param msg
 */
figma.ui.onmessage = msg => {
	switch (msg.event) {
		case 'loaded':
			env.debug = msg.data;
			figma.clientStorage.getAsync('config').then(config => {
				env.loaded = true;
				figma.ui.postMessage({
					event: 'show',
					config: config,
				});
			}).catch(err => {
				env.loaded = true;
				figma.ui.postMessage({
					event: 'show',
				});
			});
			break;

		case 'close':
			figma.closePlugin();
			break;

		case 'store':
			figma.clientStorage.setAsync('config', msg.data).then(() => {
			}).catch(err => {
				console.error(err);
			});
			break;

		case 'import-svg':
			importSVG(env, msg.data);
			break;

		case 'import-iconify':
			importIconify(env, msg.data);
			break;
	}
};
