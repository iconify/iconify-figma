"use strict";

import moveSvg from './insert-svg';

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
	moveSvg(env, node);

	// Select node
	figma.currentPage.selection = [node];
}

export default importSVG;
