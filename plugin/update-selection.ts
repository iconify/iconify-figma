"use strict";

import { isRootNode, findParentNode, findParentNodes } from './node-functions';

let pendingEvent = false;
let lastList = null;


/**
 * Check layers, send list of new possible parent layers to UI
 *
 * @param {object} env
 */
function checkLayers(env) {
	let selection = findParentNodes(env);

	// Check for changes
	let value = JSON.stringify(selection);
	if (lastList === value) {
		return;
	}
	lastList = value;

	// Send new selection to UI
	figma.ui.postMessage({
		event: 'selected-nodes',
		nodes: selection
	});
}

/**
 * Selection was changed
 *
 * @param {object} env
 * @param {string} event
 */
function updateSelection(env, event) {
	// Ignore event if ignoreNextSelection > 0 (used when new layers are added by plugin)
	if (event === 'selectionchanged' && env.ignoreNextSelection) {
		env.ignoreNextSelection --;
		return;
	}

	// Timer to avoid too many checks per second
	if (!pendingEvent) {
		pendingEvent = true;
		setTimeout(() => {
			pendingEvent = false;
			checkLayers(env);
		}, 200);
	}
}

export default updateSelection;
