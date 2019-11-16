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
 * Check if frame is imported Iconify icon
 *
 * @param {BaseNode} node
 * @return {boolean}
 */
function isIconifyFrame(node) {
	if (node.type !== 'FRAME') {
		return false;
	}

	if (node.getSharedPluginData('iconify', 'source').length) {
		// Imported icon
		return true;
	}

	// Check for imported icon from old Iconify plugin
	// Frame without parent frame
	if (
		node.parent && node.parent.type === 'PAGE' &&
		(node.name.indexOf('-') !== -1 || node.name.indexOf(':') !== -1) &&
		node.name.match(/^[a-z0-9]+[a-z0-9:-]+[a-z0-9]+$/) &&
		node.name.split(':').length < 3
	) {
		return true;
	}

	return false;
}

/**
 * Find parent node
 *
 * @param {object} env
 * @param {BaseNode} node
 * @return {BaseNode}
 */
function findLastUsableParent(env, node) {
	let lastValidNode = node;

	while (true) {
		if (isRootNode(node) || !node.parent) {
			return lastValidNode;
		}

		// Check group and frame nodes
		switch (node.type) {
			case 'GROUP':
				if (!node.visible || node.locked) {
					lastValidNode = node.parent;
				}
				break;

			case 'FRAME':
				if (isIconifyFrame(node) || !node.visible || node.locked) {
					lastValidNode = node.parent;
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
		return findLastUsableParent(env, node);
	}

	if (figma.currentPage.selection.length) {
		// Use first available selected node
		return findLastUsableParent(env, figma.currentPage.selection[0]);
	}

	// Use current page
	return figma.currentPage;
}

/**
 * Find all viable parent nodes
 *
 * @param env
 * @param {function} callback Callback to add or test each node
 * @private
 */
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

		// Check if node has already been added
		if (nodes[id]) {
			return false;
		}

		// Return item
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

/**
 * Select node
 *
 * @param env
 * @param node
 */
function replaceSelection(env, node) {
	env.ignoreNextSelection = true;

	figma.currentPage.selection = [node];
}

// Export functions
export { isRootNode, findParentNode, findParentNodes, findParentNodeById, addToSelection, replaceSelection };
