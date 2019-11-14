"use strict";

import { findParentNode, findParentNodeById } from './node-functions';

/**
 * Move node
 *
 * @param {object} env
 * @param {FrameNode} node
 * @param {object} props
 */
function moveNode(env, node, props) {
	let parent = null;
	if (props && typeof props.node === 'string') {
		parent = findParentNodeById(env, props.node);
	}
	if (parent === null) {
		parent = findParentNode(env, void 0);
	}

	// Move icon to selected group
	if (parent && parent.type !== 'PAGE') {
		// Icon alignment
		let align = {
				x: typeof props.x === 'string' ? props.x : 'center',
				y: typeof props.y === 'string' ? props.y : 'middle',
			},
			// Icon coordinates within parent
			coords = {
				x: 0,
				y: 0,
			},
			// Offset of parent (to add to coordinates)
			offset = {
				x: 0,
				y: 0,
			},
			// Parent dimensions
			box = {
				width: parent ? parent.width : 0,
				height: parent ? parent.height : 0
			};

		// Coordinates are relative to frame
		if (parent.type !== 'FRAME') {
			offset.x = parent.x;
			offset.y = parent.y;
		}

		// Horizontal alignment
		switch (align.x) {
			case 'left':
				node.x = Math.ceil(offset.x);
				break;

			case 'right':
				node.x = Math.floor(offset.x + box.width - node.width);
				break;

			default:
				node.x = Math.round(offset.x + (box.width - node.width) / 2);
				break;
		}

		// Vertical alignment
		switch (align.y) {
			case 'top':
				node.y = Math.ceil(offset.y);
				break;

			case 'bottom':
				node.y = Math.floor(offset.y + box.height - node.height);
				break;

			default:
				node.y = Math.round(offset.y + (box.height - node.height) / 2);
				break;
		}
	} else {
		// Cannot align in viewport yet
		node.x = Math.round(figma.viewport.center.x - node.width / 2);
		node.y = Math.round(figma.viewport.center.y - node.height / 2);
	}

	// Change parent node
	if (parent !== node.parent) {
		parent.insertChild(parent.children.length, node);
	}
}

export default moveNode;
