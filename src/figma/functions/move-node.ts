import type { ImportedNode } from './import-svg';
import {
	FilteredFrameNode,
	isAutoLayoutNode,
	isFrameNode,
	ViableParentFigmaNode,
} from './layers';

/**
 * Move node to parent
 */
export function moveNode(node: ImportedNode, parent: ViableParentFigmaNode) {
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
