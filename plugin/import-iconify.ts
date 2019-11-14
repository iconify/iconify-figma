"use strict";

import moveSvg from './move-node';
import { addToSelection } from './node-functions';

function importIconify(env, props) {
	// Create node from SVG
	let node = figma.createNodeFromSvg(props.svg);
	if (!node) {
		if (env.debug) {
			console.log('Import failed: invalid SVG');
		}
		return;
	}

	// Mark node as SVG import and store data
	node.setSharedPluginData('iconify', 'source', 'iconify');
	node.setSharedPluginData('iconify', 'props', JSON.stringify({
		name: props.name,
		color: props.color,
		props: props.props,
	}));

	// Rename node
	node.name = props.name;

	// Move it to currently selected item
	if (!figma.currentPage) {
		return;
	}
	moveSvg(env, node, props);

	// Select node
	addToSelection(env, node);
}

export default importIconify;
