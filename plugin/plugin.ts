'use strict';

import updateSelection from './update-selection';
import importSVG from './import-svg';
import importIconify from './import-iconify';
import { findParentNodes } from './node-functions';
import { getSelectedNodeData } from './node-data';

/**
 * UI dimensions
 *
 * @type {object}
 */
const dimensions = {
	width: {
		full: 690,
		compact: 514,
	},
	height: {
		min: 500,
		default: 720, // same as max
		diff: 90, // difference with window.outerHeight
		max: 720,
	},
};

/**
 * Environment
 *
 * @type {object}
 */
let env = {
	loaded: false,
	debug: false,
	compact: false,
	lastParent: null,
	showingCode: false,
	height: dimensions.height.default,
};

/**
 * Send message to UI to show UI
 *
 * @param config
 */
let showUI = config => {
	// Mark as loaded
	env.loaded = true;

	let params = <any>{
		event: 'show',
		config: config,
		parentNodes: findParentNodes(env),
	};

	let nodeData = getSelectedNodeData(env);
	if (nodeData) {
		env.showingCode = true;
		params.selectedNode = nodeData;
	}

	// Tell UI to load
	figma.ui.postMessage(params);
};

/**
 * Start plugin
 *
 * @param config
 */
let startPlugin = config => {
	// Check config
	if (config && config.options && config.options.compactWidth) {
		env.compact = true;
	}

	// Show UI
	figma.showUI(__html__, {
		width: dimensions.width[env.compact ? 'compact' : 'full'],
		height: env.height,
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
				showUI(config);
				break;

			case 'close':
				figma.closePlugin();
				break;

			case 'store':
				figma.clientStorage
					.setAsync('config', msg.data)
					.then(() => {})
					.catch(err => {
						console.error(err);
					});

				let resize = false;

				// Check for height changes
				if (msg.data.height) {
					const newHeight = Math.max(
						dimensions.height.min,
						Math.min(
							dimensions.height.max,
							msg.data.height - dimensions.height.diff
						)
					);
					if (env.height !== newHeight) {
						env.height = newHeight;
						resize = true;
					}
				}

				// Check for compactWidth changes
				if (msg.data.options) {
					let compactWidth = !!msg.data.options.compactWidth;
					if (compactWidth !== env.compact) {
						// Toggle compact layout
						env.compact = compactWidth;
						resize = true;
					}
				}

				// Resize UI
				if (resize) {
					figma.ui.resize(
						dimensions.width[env.compact ? 'compact' : 'full'],
						env.height
					);
				}

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
};

// Load configuration before starting plugin
figma.clientStorage
	.getAsync('config')
	.then(config => {
		startPlugin(config);
	})
	.catch(err => {
		startPlugin(void 0);
	});
