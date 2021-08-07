import type { PartialRoute } from '@iconify/search-core';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';
import type { UINotice } from '../../common/messages';
import type { SelectAfterImport } from '../../common/options';
import { pluginEnv } from '../data/env';
import {
	FilteredFrameNode,
	filterViableParentNode,
	isAutoLayoutNode,
	isFrameNode,
	ViableParentFigmaNode,
} from '../data/layers';
import type { ImportedIconSharedData } from '../data/node-data';
import { figmaPhrases } from '../data/phrases';
import { sendMessageToUI } from '../send-message';

function assertNever(v: never) {
	//
}

/**
 * Find selected node
 */
function findParentLayer(id?: string): ViableParentFigmaNode {
	if (!id) {
		return figma.currentPage;
	}
	const match = figma.getNodeById(id);
	const node = match ? filterViableParentNode(match) : null;
	return node ? node : figma.currentPage;
}

/**
 * Move node to parent
 */
function moveNode(node: FrameNode, parent: ViableParentFigmaNode) {
	const width = node.width;
	const height = node.height;

	// Check for auto layout
	if (isAutoLayoutNode(parent)) {
		// Insert node, let Figma do its magic
		parent.insertChild(0, node);
		return;
	}

	// Get siblings
	const id = node.id;
	const siblings = parent.children.filter((item) => item.id !== id);

	// Set initial coordinates
	interface Coords {
		x: number;
		y: number;
	}
	const setCoords = (coords: Coords) => {
		parent.insertChild(0, node);
		node.x = coords.x;
		node.y = coords.y;
	};

	const checkIfFits = (
		startX: number,
		startY: number,
		maxX: number | null,
		maxY: number | null
	): Coords | null => {
		// console.log(`checkIfFits: ${startX}, ${startY}, ${maxX}, ${maxY}`);
		// Check if icon fits
		if (
			(maxX !== null && startX + width > maxX) ||
			(maxY !== null && startY + height > maxY)
		) {
			// console.log(`checkIfFits: does not fit`);
			return null;
		}

		// Set initial coordinates
		let x = startX;
		let y = startY;

		// Do loop until no intersection or nowhere to move
		while (true) {
			let changed = false;
			// console.log(`checkIfFits: starting loop, x = ${x}, y = ${y}`);

			// Check all siblings
			for (let i = 0; i < siblings.length; i++) {
				const sibling = siblings[i];
				if (
					sibling.x > x + width ||
					sibling.y > y + height ||
					sibling.x + sibling.width <= x ||
					sibling.y + sibling.height <= y
				) {
					// No intersection
					continue;
				}

				// Intersection: move item horizontally
				x = sibling.x + sibling.width;
				changed = true;
				// console.log(
				// 	`checkIfFits: intersection with "${node.name}". new x = ${x}`
				// );

				if (maxX !== null && x + width > maxX) {
					// Outside of frame: move below by icon height and break loop
					if (maxY !== null && y + height >= maxY) {
						const newY = maxY - height;
						if (newY <= y) {
							// Cannot change any further
							// console.log(
							// 	`checkIfFits: cannot change any further`
							// );
							return null;
						}
						y = newY;
					} else {
						y += height;
					}

					// Next row
					x = startX;
					// console.log(`checkIfFits: x reset to ${x}, new y = ${y}`);
					break;
				}
			}

			if (!changed) {
				// No intersection
				// console.log(`checkIfFits: success! x = ${x}, y = ${y}`);
				return {
					x,
					y,
				};
			}
		}
	};

	if (isFrameNode(parent)) {
		const frame = parent as FilteredFrameNode;

		// Check bounds against parent node
		const coords = checkIfFits(0, 0, frame.width, frame.height);
		if (coords) {
			setCoords(coords);
			return;
		}

		// Use middle of frame if fits, top left if does not
		if (frame.width < width || frame.height < height) {
			setCoords({
				x: 0,
				y: 0,
			});
			return;
		}

		setCoords({
			x: Math.floor((frame.width - width) / 2),
			y: Math.floor((frame.height - height) / 2),
		});
		return;
	}

	// Not a frame
	switch (parent.type) {
		case 'GROUP': {
			// Check if fits in group
			let coords = checkIfFits(
				parent.x,
				parent.y,
				parent.x + parent.width,
				parent.y + parent.height
			);

			if (!coords) {
				// Attempt to fit in parent frame
				const findParentFrame = (
					node: ViableParentFigmaNode
				): FilteredFrameNode | null => {
					const parent = node.parent;
					if (!parent) {
						return null;
					}

					if (isFrameNode(parent)) {
						return parent as FilteredFrameNode;
					}

					switch (parent.type) {
						case 'GROUP':
							return findParentFrame(parent);
					}

					return null;
				};

				const parentFrame = findParentFrame(parent);
				if (parentFrame) {
					coords = checkIfFits(
						parent.x,
						parent.y,
						parentFrame.width,
						parentFrame.height
					);
				}
			}

			if (!coords) {
				// Just fit it somewhere
				coords = checkIfFits(parent.x, parent.y, null, null);
			}

			if (!coords) {
				// Should not happen
				coords = {
					x: parent.x,
					y: parent.y,
				};
			}

			setCoords(coords);
			return;
		}

		case 'PAGE': {
			// Nothing to check, but set initial X and Y to center
			const x = Math.round(figma.viewport.center.x - width / 2);
			const y = Math.round(figma.viewport.center.y - height / 2);
			let coords = checkIfFits(x, y, null, null);
			if (!coords) {
				// Should not happen
				coords = {
					x,
					y,
				};
			}
			setCoords(coords);
			return;
		}

		default:
			console.log('Unknown parent node type:', parent.type);
			setCoords({
				x: 0,
				y: 0,
			});
			return;
	}
}

/**
 * Update selected nodes
 */
function updateSelection(addedNodes: FrameNode[], option: SelectAfterImport) {
	const page = figma.currentPage;

	let keepSelection: boolean = false;
	switch (option) {
		case 'ignore':
			return;

		case 'auto':
			if (page.selection.length > 1) {
				keepSelection = true;
			}
			break;

		case 'add':
			keepSelection = true;
			break;

		case 'replace':
			break;

		default:
			assertNever(option);
	}

	const selection: SceneNode[] = keepSelection ? page.selection.slice(0) : [];
	page.selection = selection.concat(addedNodes);
}

/**
 * Import icon(s)
 *
 * Returns true on full success
 */
export function importIcons(
	data: ImportIconCommon,
	icons: ImportIconItem[],
	route?: PartialRoute
): boolean {
	const added: (string | undefined)[] = [];
	const errors: (string | undefined)[] = [];
	const addedNodes: FrameNode[] = [];

	// Find parent layer
	let layerId = data.layerId;
	if (
		layerId &&
		// Make sure id is in currently available layers list
		!pluginEnv.selection?.layers.find((item) => item.id === layerId)
	) {
		layerId = '';
	}
	const parent = findParentLayer(
		data.layerId ? data.layerId : pluginEnv.selection?.defaultLayer
	);

	// Import all icons
	icons.forEach((icon) => {
		const node = figma.createNodeFromSvg(icon.svg);
		if (!node) {
			errors.push(icon.name);
			console.error('Error importing SVG');
			return;
		}

		// Stuff for Iconify icon imports
		if (icon.name !== void 0) {
			// Set data
			node.setSharedPluginData('iconify', 'source', 'iconify');
			const propsData: ImportedIconSharedData = {
				version: 2,
				name: icon.name,
				props: data.props,
				route,
			};
			node.setSharedPluginData(
				'iconify',
				'props',
				JSON.stringify(propsData)
			);
			node.setRelaunchData(figmaPhrases.relaunch);

			// Rename node
			node.name = icon.name;
		} else {
			// SVG paste: fix 1px imports when height is set to "1em"
			if (node.height === 1) {
				// Get viewBox
				const search = 'viewBox="';
				const index = icon.svg.indexOf(search);
				if (index !== -1) {
					const viewBox = icon.svg
						.slice(index + search.length)
						.split('"')
						.shift()!
						.split(' ');
					if (viewBox.length === 4) {
						const width = parseInt(viewBox[2]);
						const height = parseInt(viewBox[3]);
						if (width && height) {
							node.resize(width, height);
						}
					}
				}
				const parts = icon.svg.split('viewBox=');
			}
		}

		// Move it
		moveNode(node, parent);

		// Add to lists
		added.push(icon.name);
		addedNodes.push(node);
	});

	// Update selection
	if (addedNodes.length) {
		updateSelection(addedNodes, pluginEnv.config.options.selectAfterImport);
	}

	// Show notice
	const notices: UINotice[] = [];
	const text = figmaPhrases.notices;
	switch (added.length) {
		case 0:
			break;

		case 1: {
			const name = added[0];
			notices.push({
				layout: 'success',
				message:
					name === void 0
						? text.added_unnamed
						: text.added_icon.replace('{name}', name),
			});
			break;
		}

		default:
			notices.push({
				layout: 'success',
				message: text.added_icons.replace('{count}', added.length + ''),
			});
	}
	switch (errors.length) {
		case 0:
			break;

		case 1: {
			const name = errors[0];
			notices.push({
				layout: 'error',
				message:
					name === void 0
						? text.failed_unnamed
						: text.failed_icon.replace('{name}', name),
			});
			break;
		}

		default:
			notices.push({
				layout: 'error',
				message: text.failed_icons.replace(
					'{count}',
					errors.length + ''
				),
			});
	}
	sendMessageToUI({
		type: 'notice',
		notice: notices,
	});

	return errors.length === 0;
}
