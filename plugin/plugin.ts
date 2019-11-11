"use strict";

import importSVG from './import-svg';
import importIconify from './import-iconify';

/**
 * Environment
 *
 * @type {object}
 */
let env = {
	debug: false,
	lastParent: null,
};

/**
 * Show UI
 */
figma.showUI(__html__, {
	width: 800,
	height: 800
});

/**
 * Handle messages
 *
 * @param msg
 */
figma.ui.onmessage = msg => {
	switch (msg.event) {
		case 'loaded':
			figma.ui.postMessage({
				event: 'show'
			});
			env.debug = msg.data;
			break;

		case 'close':
			figma.closePlugin();
			break;

		case 'import-svg':
			importSVG(env, msg.data);
			break;

		case 'import-iconify':
			importIconify(env, msg.data);
			break;
	}
};
