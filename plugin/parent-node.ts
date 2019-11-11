"use strict";

/**
 * Find parent node
 *
 * @param {object} env
 * @param {BaseNodeMixin} node
 * @return {BaseNodeMixin}
 */
function skipIconifyFrames(env, node) {
	let lastValidNode = node;

	while (true) {
		if (!node.parent) {
			return lastValidNode;
		}

		switch (node.type) {
			case 'PAGE':
				return lastValidNode;

			case 'GROUP':
				break;

			case 'FRAME':
				if (node.getSharedPluginData('iconify', 'source').length) {
					// Imported icon
					lastValidNode = node.parent;
					break;
				}

				// Check for imported icon from old Iconify plugin
				if (node.parent.type === 'PAGE' && (node.name.indexOf('-') !== -1 || node.name.indexOf(':') !== -1)) {
					return node.parent;
				}
				break;

			default:
				// Shape
				lastValidNode = node.parent;
		}

		node = node.parent;
	}
}

/**
 * Find parent node for import
 *
 * @param {object} env
 * @return {BaseNodeMixin}
 */
function findParentNode(env) {
	if (figma.currentPage.selection.length) {
		return skipIconifyFrames(env, figma.currentPage.selection[0]);
	}
	return figma.currentPage;
}


export default findParentNode;
