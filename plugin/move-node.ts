"use strict";

/**
 * Find parent node for import
 *
 * @param {object} env
 * @return {BaseNodeMixin|null}
 */
function findParentNode(env) {
	let parent = null;

	if (figma.currentPage.selection.length) {
		parent = figma.currentPage.selection[0];
		switch (parent.type) {
			case 'GROUP':
			case 'PAGE':
				break;

			case 'FRAME':
				if (parent.getSharedPluginData('iconify', 'source') !== void 0) {
					// Imported icon
					parent = parent.parent;
					break;
				}

				if (parent.parent.type === 'PAGE') {
					// Check for imported icon from old Iconify plugin
					if (parent.name.indexOf('-') !== -1 || parent.name.indexOf(':') !== -1) {
						parent = parent.parent;
					}
					break;
				}

				parent = parent.parent;
				break;

			default:
				parent = parent.parent;
		}
	}

	return parent;
}

/**
 * Move node
 *
 * @param {object} env
 * @param {FrameNode} node
 */
function moveNode(env, node) {
	let parent = findParentNode(env);

	let x = 0,
		y = 0;

	// Move icon to middle of selected group
	if (parent && parent.type !== 'PAGE' && parent !== node.parent) {
		if (!env.lastParent || env.lastParent.node !== parent) {
			env.lastParent = {
				node: parent,
				offset: 0
			};
		}

		// Move to top left corner
		switch (parent.type) {
			case 'FRAME':
				break;

			default:
				x = parent.x;
				y = parent.y;
		}
		node.x = x;
		node.y = y;

		if (parent.width > node.width) {
			x = Math.floor(parent.width / 2 - node.width);
			x += env.lastParent.offset;
			node.x += x;
			env.lastParent.offset += node.width;
		}

		// Change parent node
		parent.insertChild(parent.children.length, node);
	} else {
		// Move icon to middle of viewport
		node.x = Math.round(figma.viewport.center.x - node.width);
		node.y = Math.round(figma.viewport.center.y - node.height);
	}
}

export default moveNode;
