"use strict";

import { findParentNode, findParentNodeById } from './node-functions';

/**
 * Find frame at coordinates
 *
 * @param env
 * @param {number} x
 * @param {number} y
 * @param {Array} ignoreNodes Array of node ids to ignore
 * @return {object}
 */
function findFrameAt(env, x, y, ignoreNodes) {
	/**
	 * Check coordinates
	 *
	 * @param {BaseNode} node
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @return {boolean}
	 */
	function testCoordinates(node, offsetX, offsetY) {
		let left = node.x + offsetX,
			top = node.y + offsetY,
			right = left + node.width,
			bottom = top + node.height;

		return x > left && y > top && x < right && y < bottom;
	}

	/**
	 * Test if node is within coordinates, scan child nodes
	 *
	 * @param {BaseNode} node
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @return {object}
	 */
	function testNode(node, offsetX, offsetY) {
		let result;

		// Exclude ignored ids
		if (ignoreNodes.indexOf(node.id) !== -1) {
			return null;
		}

		switch (node.type) {
			case 'FRAME':
				if (!node.visible || node.locked) {
					return null;
				}
				if (testCoordinates(node, offsetX, offsetY)) {
					result = scanChildren(node, offsetX + node.x, offsetY + node.y);
					return result === null ? {
						node: node,
						offsetX: offsetX + node.x,
						offsetY: offsetY + node.y,
					} : result;
				}
				break;

			case 'GROUP':
				if (!node.visible || node.locked) {
					return null;
				}
				if (testCoordinates(node, offsetX, offsetY)) {
					result = scanChildren(node, offsetX, offsetY);
					return result === null ? {
						node: node,
						offsetX: offsetX,
						offsetY: offsetY,
					} : result;
				}
				break;
		}

		return null;
	}

	/**
	 * Scan node's children
	 *
	 * @param {BaseNode} node
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @return {object}
	 */
	function scanChildren(node, offsetX, offsetY) {
		for (let i = node.children.length - 1; i >= 0; i--) {
			let result = testNode(node.children[i], offsetX, offsetY);
			if (result !== null) {
				return result;
			}
		}

		return null;
	}

	return scanChildren(figma.currentPage, 0, 0);
}

/**
 * Drop node
 *
 * @param {object} env
 * @param {FrameNode} node
 * @param {object} props
 */
function dropNode(env, node, props) {
	let parent = figma.currentPage;

	node.x = Math.round(figma.viewport.center.x - node.width / 2);
	if (typeof props.x === 'number') {
		node.x += Math.round(props.x / figma.viewport.zoom);
	}

	node.y = Math.round(figma.viewport.center.y - node.height / 2);
	if (typeof props.y === 'number') {
		// account for toolbar
		node.y += Math.round((props.y - 40) / figma.viewport.zoom);
	}

	// Look for frame
	if (props.dropToFrame) {
		let frame = findFrameAt(env, node.x + node.width / 2, node.y + node.height / 2, [node.id]);
		if (frame !== null) {
			node.x -= frame.offsetX;
			node.y -= frame.offsetY;
			parent = frame.node;
		}
	}

	// Change parent node
	if (parent !== node.parent) {
		parent.insertChild(parent.children.length, node);
	}
}

/**
 * Move node
 *
 * @param {object} env
 * @param {FrameNode} node
 * @param {object} props
 */
function moveNode(env, node, props) {
	let parent = null;

	if (props && props.node === 'drag') {
		dropNode(env, node, props);
		return;
	}

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
