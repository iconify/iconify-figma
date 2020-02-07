'use strict';

import moveSvg from './move-node';
import {
	addToSelection,
	replaceSelection,
	convertColor,
} from './node-functions';

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
	node.setSharedPluginData(
		'iconify',
		'props',
		JSON.stringify({
			name: props.name,
			color: props.colorless ? props.color : void 0,
			props: props.props,
		})
	);
	node.setRelaunchData({ code: 'How to use icon with Iconify' });

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

	// Find node with matching color
	if (
		props.colorless &&
		typeof props.color === 'string' &&
		props.color.length === 7
	) {
		function scanColor(node) {
			if (node.type === 'FRAME' || node.type === 'GROUP') {
				node.children.forEach(scanColor);
			} else {
				let match = '';

				if (node.fills.length === 1 && node.strokes.length === 0) {
					let fill = node.fills[0];
					if (
						fill.visible &&
						fill.type === 'SOLID' &&
						fill.blendMode === 'NORMAL' &&
						convertColor(fill.color) === props.color
					) {
						match = 'fills'; // "fills", not "fill"
					}
				}

				if (node.strokes.length === 1 && node.fills.length === 0) {
					let stroke = node.strokes[0];
					if (
						stroke.visible &&
						stroke.type === 'SOLID' &&
						stroke.blendMode === 'NORMAL' &&
						convertColor(stroke.color) === props.color
					) {
						match = 'stroke';
					}
				}

				// Found matching node
				if (match !== '') {
					node.setSharedPluginData('iconify', 'color', match);
				}
			}
		}
		scanColor(node);
	}

	// Send notice
	figma.ui.postMessage({
		event: 'success',
		message: `Icon "${
			props.name
		}" was imported to ${node.parent.type.toLowerCase()} "${node.parent.name}"`,
	});
}

export default importIconify;
