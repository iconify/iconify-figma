import type {
	SelectedIconLayer,
	SelectedLayer,
	SelectedLayers,
} from '../../common/layers';
import { sendMessageToUI } from '../send-message';
import { pluginEnv } from '../data/env';
import {
	FilteredFrameNode,
	filterViableParentNode,
	isFrameNode,
	isIconNode,
} from './layers';

/**
 * Find all possible target layers
 */
export function getTargetLayers(): SelectedLayers {
	const currentPage = figma.currentPage;
	const selection = currentPage.selection;

	// Layers tree
	interface LayerAsTree {
		layer: SelectedLayer;
		children: LayerAsTree[];
	}
	const page: LayerAsTree = {
		layer: {
			type: 'PAGE',
			id: currentPage.id,
			name: currentPage.name,
		},
		children: [],
	};

	// List of icons, stored by id to avoid duplicates
	const icons: Record<string, SelectedIconLayer> = Object.create(null);

	// Map of parsed items
	const parsedLayers: Map<string, LayerAsTree> = new Map();

	// Check node
	function checkNode(node: BaseNode, depth: number, child?: LayerAsTree) {
		const existingParent =
			node.type === 'PAGE' ? page : parsedLayers.get(node.id);

		if (existingParent) {
			// Already exists: all child node if set
			if (child) {
				existingParent.children.push(child);
				existingParent.children.sort((a, b) =>
					a.layer.name.localeCompare(b.layer.name)
				);
			}
			return;
		}

		const id = node.id;

		// Check for icon
		if (icons[id] !== void 0) {
			// Already parsed
			return;
		}

		// New node, not tested before
		const sceneNode = node as SceneNode;
		if (sceneNode.locked) {
			// Cannot be used
			if (sceneNode.parent) {
				checkNode(sceneNode.parent, depth + 1);
			}
			return;
		}

		// Check node
		const name = node.name;
		let item: SelectedLayer | undefined;
		const filteredNode = filterViableParentNode(node);

		if (filteredNode && isFrameNode(filteredNode)) {
			const frameNode = filteredNode as FilteredFrameNode;
			// Check for icon
			const iconData = isIconNode(frameNode);
			if (iconData) {
				if (depth === 0) {
					// Add icon
					const icon: SelectedIconLayer = {
						id,
						name,
						type: frameNode.type,
						data: iconData,
					};
					icons[id] = icon;
				}

				// Cannot import icon to child nodes of icon
				child = void 0;
			} else {
				// Not icon: valid target
				item = {
					id,
					// Remove first part for variants
					name: name.split('=').pop()!,
					type: frameNode.type,
					layoutMode:
						!frameNode.layoutMode || frameNode.layoutMode === 'NONE'
							? void 0
							: frameNode.layoutMode,
				};
			}
		} else if (filteredNode) {
			switch (filteredNode.type) {
				case 'GROUP':
					item = {
						id,
						name,
						type: filteredNode.type,
					};
					break;

				case 'COMPONENT_SET':
					// Cannot import as child node for component set
					break;

				default:
					console.log(
						'Debug: filtered node type =',
						filteredNode.type,
						filteredNode
					);
			}
		} else {
			console.log('Debug: skipped node type =', node.type);
		}

		// Add item to tree
		let treeItem: LayerAsTree | undefined;
		if (item) {
			treeItem = {
				layer: item,
				children: child ? [child] : [],
			};
			parsedLayers.set(id, treeItem);
		}

		// Check parent
		if (node.parent) {
			checkNode(node.parent, depth + 1, treeItem ? treeItem : child);
		}
	}

	// Check all nodes
	checkNode(currentPage, 0);
	selection.forEach((node) => {
		checkNode(node, 0);
	});

	// Convert tree to list
	const layers: SelectedLayer[] = [];
	let maxDepth = -1;
	let isSimpleTree = true;
	function convertTree(item: LayerAsTree, depth: number) {
		// Check if tree is simple
		if (depth <= maxDepth) {
			isSimpleTree = false;
		}
		maxDepth = depth;

		// Add layer
		const layer = item.layer;
		layer.depth = depth;
		layers.push(layer);

		// Parse children
		item.children.forEach((child) => {
			convertTree(child, depth + 1);
		});
	}
	convertTree(page, 0);

	const iconKeys = Object.keys(icons);
	return {
		// Do not show less than 2 layers
		layers: layers.length > 1 ? layers : [],

		// Default layer
		defaultLayer:
			isSimpleTree && layers.length > 1
				? layers[layers.length - 1].id
				: '',

		// Show only 1 icon
		icon: iconKeys.length === 1 ? icons[iconKeys[0]] : void 0,
	};
}

/**
 * Selection has changed
 */
let isPendingSelectionChange = false;
export function selectionChanged() {
	if (isPendingSelectionChange) {
		return;
	}

	// Wait a bit before updating UI
	isPendingSelectionChange = true;
	setTimeout(() => {
		isPendingSelectionChange = false;

		// Get selection, check if it was changed
		const newSelection = getTargetLayers();
		const oldSelection = pluginEnv.selection;

		if (
			oldSelection &&
			JSON.stringify(oldSelection) === JSON.stringify(newSelection)
		) {
			return;
		}

		// Update UI
		pluginEnv.selection = newSelection;
		sendMessageToUI({
			type: 'target-layers',
			selection: newSelection,
		});
	}, 250);
}
