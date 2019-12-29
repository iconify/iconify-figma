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
	full: {
		width: 690,
		height: 700,
	},
	compact: {
		width: 514,
		height: 500,
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
	if (config && config.options) {
		if (config.options.compactLayout && config.options.forceCompactLayout) {
			// compactLayout was enabled by force, not by choice.
			// Disable it, plug-in will re-enable it if needed
			delete config.options.compactLayout;
		}
		if (config.options.compactLayout) {
			env.compact = true;
		}
	}

	// Show UI
	figma.showUI(__html__, dimensions[env.compact ? 'compact' : 'full']);

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

				// Check for compactLayout changes
				if (msg.data.options) {
					let compactLayout = !!msg.data.options.compactLayout;
					if (compactLayout !== env.compact) {
						// Toggle compact layout
						env.compact = compactLayout;
						let size = dimensions[compactLayout ? 'compact' : 'full'];
						figma.ui.resize(size.width, size.height);
					}
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
