"use strict";

import { convertColor } from './node-functions';

/**
 * Get color from child nodes
 *
 * @param {FrameNode} node
 * @return {string|null}
 */
function getColorFromChildren(node) {
	let result, child, attribute, item;

	for (let i = 0; i < node.children.length; i++) {
		child = node.children[i];

		// Check if node has fill or stroke
		attribute = child.getSharedPluginData('iconify', 'color');
		switch (attribute) {
			case 'fill': // account for possible typo
			case 'fills':
				item = child.fills && child.fills.length === 1 ? child.fills[0] : null;
				break;

			case 'stroke':
				item = child.stroke && child.stroke.length === 1 ? child.stroke[0] : null;
				break;

			default:
				item = null;
		}
		if (
			item !== null &&
			item.visible &&
			item.type === 'SOLID' &&
			item.blendMode === 'NORMAL'
		) {
			return convertColor(item.color);
		}

		// Check child nodes
		if (child.type === 'GROUP') {
			result = getColorFromChildren(child);
			if (result !== null) {
				return result;
			}
		}
	}

	return null;
}

/**
 * Get Iconify data for selected node
 *
 * @param env
 * @return {object|null}
 */
function getSelectedNodeData(env) {
	// Check if currently selected node is frame
	if (figma.currentPage.selection.length !== 1) {
		return null;
	}

	let node = figma.currentPage.selection[0];
	if (node.type !== 'FRAME') {
		return null;
	}

	// Make sure it was imported from Iconify
	let source = node.getSharedPluginData('iconify', 'source');
	if (source !== 'iconify') {
		return null;
	}

	// Get properties
	let props;
	try {
		props = JSON.parse(node.getSharedPluginData('iconify', 'props'));
	} catch (err) {
		return null;
	}

	// Add node properties
	props.node = {
		name: node.name,
		width: node.width,
		height: node.height,
		rotation: node.rotation
	};

	if (props.color !== void 0) {
		// Check child nodes for color
		let color = getColorFromChildren(node);
		if (color !== null) {
			props.node.color = color;
		}
	}

	return props;
}

export { getSelectedNodeData };
