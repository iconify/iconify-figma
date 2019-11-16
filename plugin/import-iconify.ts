"use strict";

import moveSvg from './move-node';
import { addToSelection, replaceSelection } from './node-functions';

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
	switch (props.select) {
		case 'add':
			addToSelection(env, node);
			break;

		case 'replace':
			replaceSelection(env, node);
	}

	// Send notice
	figma.ui.postMessage({
		event: 'success',
		message: 'Icon "' + props.name + '" was imported to ' + node.parent.type.toLowerCase() + ' "' + node.parent.name + '"',
	});
}

export default importIconify;
