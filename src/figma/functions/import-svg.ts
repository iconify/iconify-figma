import type { ImportMode } from '../../common/import';
import type { FilteredFrameNode } from './layers';

// Interface for imported icon node
export type ImportedNode = FilteredFrameNode;

/**
 * Import SVG
 */
export function importSVG(
	svg: string,
	mode: ImportMode = 'frame',
	replace?: FilteredFrameNode | null
): ImportedNode {
	const frame = figma.createNodeFromSvg(svg);
	let newParent: FilteredFrameNode | undefined;

	if (replace) {
		newParent = replace;
	} else {
		switch (mode) {
			case 'component': {
				// Convert to component
				newParent = figma.createComponent();
			}
		}
	}

	if (newParent) {
		// Remove existing children
		while (newParent.children.length > 0) {
			newParent.children[0].remove();
		}

		// Resize and move children
		newParent.resizeWithoutConstraints(frame.width, frame.height);
		for (const child of frame.children) {
			newParent.appendChild(child);
		}

		// Remove old parent
		frame.remove();

		return newParent;
	}
	return frame;
}
