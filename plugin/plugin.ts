"use strict";

import updateSelection from './update-selection';
import importSVG from './import-svg';
import importIconify from './import-iconify';
import { findParentNodes } from './node-functions';

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
 * Send message to UI to show UI
 *
 * @param config
 */
let showUI = config => {
	// Mark as loaded
	env.loaded = true;

	// Tell UI to load
	figma.ui.postMessage({
		event: 'show',
		config: config,
		parentNodes: findParentNodes(env)
	});
};

/**
 * Show UI
 */
figma.showUI(__html__, {
	width: 690,
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
				showUI(config);
			}).catch(err => {
				showUI(void 0);
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

/**
 * Selection change
 */
figma.on('selectionchange', () => updateSelection(env, 'selectionchange'));
