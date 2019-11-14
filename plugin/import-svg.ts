"use strict";

import moveSvg from './move-node';
import { addToSelection } from './node-functions';

function importSVG(env, props) {
	// Create node from SVG
	let node = figma.createNodeFromSvg(props.svg);
	if (!node) {
		if (env.debug) {
			console.log('Import failed: invalid SVG');
		}
		return;
	}

	// Mark node as SVG import
	node.setSharedPluginData('iconify', 'source', 'svg');

	// Move it to currently selected item
	if (!figma.currentPage) {
		return;
	}
	moveSvg(env, node, props);

	// Select node
	addToSelection(env, node);

	// Send notice
	figma.ui.postMessage({
		event: 'success',
		message: 'SVG was imported to ' + node.parent.type.toLowerCase() + ' "' + node.parent.name + '"',
	});
}

export default importSVG;
