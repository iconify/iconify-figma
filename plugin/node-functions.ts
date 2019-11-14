"use strict";

/**
 * Check if node is root node
 *
 * @param node
 * @return {boolean}
 */
function isRootNode(node) {
	return !node || !node.type || node.type === 'PAGE' || node.type === 'DOCUMENT';
}

/**
 * Find parent node
 *
 * @param {object} env
 * @param {BaseNode} node
 * @return {BaseNode}
 */
function skipIconifyFrames(env, node) {
	let lastValidNode = node;

	while (true) {
		if (isRootNode(node) || !node.parent) {
			return lastValidNode;
		}

		switch (node.type) {
			case 'GROUP':
				break;

			case 'FRAME':
				if (node.getSharedPluginData('iconify', 'source').length) {
					// Imported icon
					lastValidNode = node.parent;
					break;
				}

				// Check for imported icon from old Iconify plugin
				// Frame without parent frame
				if (isRootNode(node.parent) && (node.name.indexOf('-') !== -1 || node.name.indexOf(':') !== -1)) {
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
 * @param {BaseNode} [node] Base node
 * @return {BaseNode}
 */
function findParentNode(env, node) {
	if (node) {
		// Use node passed as argument
		return skipIconifyFrames(env, node);
	}

	if (figma.currentPage.selection.length) {
		// Use first available selected node
		return skipIconifyFrames(env, figma.currentPage.selection[0]);
	}

	// Use current page
	return figma.currentPage;
}

function _findParentNodes(env, callback) {
	// Find usable parent nodes for all selected nodes, as well as their parent nodes
	if (figma.currentPage) {
		figma.currentPage.selection.forEach(node => {
			// Find first usable parent node
			let parent = findParentNode(env, node);
			if (!parent) {
				return;
			}
			if (!callback(parent)) {
				return;
			}

			// Find parent nodes of parent node
			while (parent && parent.parent && !isRootNode(parent.parent)) {
				parent = findParentNode(env, parent.parent);

				// Add to list of possible parent nodes
				if (!parent || isRootNode(parent) || !callback(parent)) {
					return;
				}
			}
		});

		// Add current page as last node
		callback(figma.currentPage);
	}
}

/**
 * Check nodes, send list of new possible parent nodes to UI
 *
 * @param {object} env
 */
function findParentNodes(env) {
	let nodes = {};

	_findParentNodes(env, node => {
		let id = node.id;
		if (nodes[id]) {
			return false;
		}

		let item = {
			id: id,
			type: node.type,
			name: node.name,
			parents: [],
			level: 0
		};

		// Count depth
		let test = node;

		while (!isRootNode(test)) {
			test = test.parent;
			item.level ++;
			item.parents.push(test.id);
		}

		nodes[id] = item;
		return true;
	});

	// Check for default node
	let keys = Object.keys(nodes);

	if (keys.length === 1) {
		nodes[keys[0]].default = true;
	} else if (keys.length > 1) {
		let defaultNode = findParentNode(env, void 0);
		if (defaultNode && nodes[defaultNode.id]) {
			nodes[defaultNode.id].default = true;
		}
	}

	// Convert to array
	return Object.values(nodes);
}

/**
 * Find parent node by id
 *
 * @param {object} env
 * @param {string} id
 * @return {null|BaseNode}
 */
function findParentNodeById(env, id) {
	let nodes = {},
		found = null;

	try {
		_findParentNodes(env, node => {
			let nodeId = node.id;
			if (nodes[nodeId]) {
				return false;
			}

			if (nodeId === id) {
				found = node;
				throw 'Stop _findParentNodes';
			}

			nodes[nodeId] = true;
			return true;
		});
	} catch (err) {
	}

	return found;
}

/**
 * Add node to selection
 *
 * @param env
 * @param node
 */
function addToSelection(env, node) {
	env.ignoreNextSelection = true;

	let selection = figma.currentPage.selection.slice(0);
	selection.push(node);
	figma.currentPage.selection = selection;
}

// Export functions
export { isRootNode, findParentNode, findParentNodes, findParentNodeById, addToSelection };