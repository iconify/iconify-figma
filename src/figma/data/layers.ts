import type {
	PossibleTargetChildLayer,
	SelectedPageLayer,
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
export function getTargetLayers(): SelectedPageLayer {
	const currentPage = figma.currentPage;
	const selection = currentPage.selection;
	const pageLayer: SelectedPageLayer = {
		type: 'page',
		name: currentPage.name,
		children: [],
	};
	const items: Map<string, PossibleTargetChildLayer> = new Map();

	function checkNode(node: BaseNode, child?: PossibleTargetChildLayer) {
		const existingParent =
			node.type === 'PAGE' ? pageLayer : items.get(node.id);

		if (existingParent) {
			// Already exists: all child node if set
			if (child) {
				existingParent.children.push(child);
				existingParent.children.sort((a, b) =>
					a.name.localeCompare(b.name)
				);
			}
			return;
		}

		// New node, not tested before
		const id = node.id;
		const sceneNode = node as SceneNode;
		if (sceneNode.locked) {
			// Cannot be used
			if (sceneNode.parent) {
				checkNode(sceneNode.parent);
			}
			return;
		}

		// Check node
		const name = node.name;
		let item: PossibleTargetChildLayer | undefined;
		const filteredNode = filterViableParentNode(node);

		if (filteredNode) {
			const type = filteredNode.type.toLowerCase();
			switch (filteredNode.type) {
				case 'FRAME':
				case 'COMPONENT':
				case 'INSTANCE':
					item = {
						id,
						name,
						type: type as 'frame', // All types are child types of frame, so using 'frame' to avoid TypeScript notices
						layoutMode:
							!filteredNode.layoutMode ||
							filteredNode.layoutMode === 'NONE'
								? void 0
								: filteredNode.layoutMode,
						children: [],
					};

					// Check for icon
					if (isIconNode(sceneNode)) {
						item.isIcon = true;
						child = void 0; // Cannot import icon to child nodes of another icon
					}

					break;

				case 'GROUP':
					item = {
						id,
						name,
						type: 'group',
						children: [],
					};
					break;

				default:
					console.log(
						'Debug: filtered node type =',
						type,
						filteredNode
					);
			}
		} else {
			console.log('Debug: skipped node type =', node.type);
		}

		// Add item to tree
		if (item) {
			items.set(id, item);
			if (child) {
				item.children.push(child);
			}
		}

		// Check parent
		if (node.parent) {
			checkNode(node.parent, item ? item : child);
		}
	}

	// Check all nodes
	checkNode(currentPage);
	selection.forEach((node) => {
		checkNode(node);
	});

	console.log(
		'getTargetLayers:',
		pageLayer ? JSON.stringify(pageLayer, null, 4) : 'none'
	);
	return pageLayer;
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
		const newPage = getTargetLayers();
		const oldPage = pluginEnv.layersTree;

		const hasChanged = () => {
			if (!oldPage || newPage.name !== oldPage.name) {
				return true;
			}

			// Compare child nodes, returns true if changed
			function childrenChanged(
				list1: PossibleTargetChildLayer[],
				list2: PossibleTargetChildLayer[]
			): boolean {
				if (list1.length !== list2.length) {
					return true;
				}
				for (let i = 0; i < list1.length; i++) {
					const layer1 = list1[i];
					const layer2 = list2[i];
					if (
						layer1.type !== layer2.type ||
						layer1.id !== layer2.id ||
						layer1.name !== layer2.name
					) {
						return true;
					}

					// TODO: do comparison specific to layer type
					switch (layer1.type) {
						case 'frame':
							if (
								layer1.layoutMode !==
									(layer2 as typeof layer1).layoutMode ||
								layer1.isIcon !==
									(layer2 as typeof layer1).isIcon
							) {
								return true;
							}
					}

					// Compare children
					if (childrenChanged(layer1.children, layer2.children)) {
						return true;
					}
				}

				return false;
			}

			return childrenChanged(oldPage.children, newPage.children);
		};

		if (!hasChanged()) {
			return;
		}

		// Update UI
		pluginEnv.layersTree = newPage;
		sendMessageToUI({
			type: 'target-layers',
			pageLayer: newPage,
		});
	}, 250);
}
