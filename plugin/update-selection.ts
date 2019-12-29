'use strict';

import { findParentNodes } from './node-functions';
import { getSelectedNodeData } from './node-data';

let pendingEvent = false;
let lastList = null;

/**
 * Check layers, send list of new possible parent layers to UI
 *
 * @param {object} env
 */
function checkLayers(env) {
	// Check if selected node is Iconify node
	let data = getSelectedNodeData(env);
	if (data) {
		env.showingCode = true;
		figma.ui.postMessage({
			event: 'selected-node-data',
			selectedNode: data,
		});
	} else if (env.showingCode) {
		env.showingCode = false;
		figma.ui.postMessage({
			event: 'cancel-node-data',
		});
	}

	// Find possible parent nodes
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
		nodes: selection,
	});
}

/**
 * Selection was changed
 *
 * @param {object} env
 * @param {string} event
 */
function updateSelection(env, event) {
	// Ignore event if ignoreNextSelection is set (used when new layers are added by plugin)
	if (env.ignoreNextSelection) {
		env.ignoreNextSelection = false;
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
