import type {
	SelectedIconLayer,
	SelectedLayer,
	SelectedLayers,
} from '../../common/layers';
import { sendMessageToUI } from '../send-message';
import { pluginEnv } from './env';

/**
 * Type for all viable parent nodes
 */
export type ViableParentFigmaNode = BaseNode & ChildrenMixin;

/**
 * Check if node is an icon
 */
function isIconNode(node: SceneNode): boolean {
	let source = node.getSharedPluginData('iconify', 'source');
	if (source === 'iconify') {
		console.log('Debug: found icon.');
		console.log(
			'getSharedPluginData: props =',
			JSON.stringify(node.getSharedPluginData('iconify', 'props'))
		);
		console.log(
			'getSharedPluginData: color =',
			JSON.stringify(node.getSharedPluginData('iconify', 'color'))
		);
		return true;
	}
	return false;
}

/**
 * Convert and validate node to make sure it can accept child nodes
 */
export function filterViableParentNode(
	node: BaseNode
): ViableParentFigmaNode | null {
	switch (node.type) {
		case 'FRAME':
		case 'COMPONENT':
		case 'INSTANCE':
		case 'GROUP':
		case 'PAGE':
			return node;
	}

	return null;
}

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

		if (filteredNode) {
			switch (filteredNode.type) {
				case 'FRAME':
				case 'COMPONENT':
				case 'INSTANCE': {
					// Check for icon
					if (isIconNode(sceneNode)) {
						if (depth === 0) {
							// Add icon
							const icon: SelectedIconLayer = {
								id,
								name,
								type: filteredNode.type,
							};
							icons[id] = icon;
						}

						// Cannot import icon to child nodes of icon
						child = void 0;

						break;
					}

					item = {
						id,
						name,
						type: filteredNode.type,
						layoutMode:
							!filteredNode.layoutMode ||
							filteredNode.layoutMode === 'NONE'
								? void 0
								: filteredNode.layoutMode,
					};
					break;
				}

				case 'GROUP':
					item = {
						id,
						name,
						type: filteredNode.type,
					};
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
	function convertTree(item: LayerAsTree, depth: number) {
		const layer = item.layer;
		layer.depth = depth;
		layers.push(layer);

		item.children.forEach((child) => {
			convertTree(child, depth + 1);
		});
	}
	convertTree(page, 0);

	const iconKeys = Object.keys(icons);
	return {
		// Do not show less than 2 layers
		layers: layers.length > 1 ? layers : [],

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
