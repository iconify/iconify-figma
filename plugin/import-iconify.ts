"use strict";

import insertSVG from './insert-svg';

function importIconify(env, props) {
	// Create node from SVG
	let node = figma.createNodeFromSvg(props.svg);
	if (!node) {
		if (env.debug) {
			console.log('Import failed: invalid SVG');
		}
		return;
	}

	// Rename node
	node.name = props.name;

	// Move it to currently selected item
	if (!figma.currentPage) {
		return;
	}
	insertSVG(env, node);

	// Select node
	figma.currentPage.selection = [node];
}

export default importIconify;
