import type { ImportMode } from '../../common/import';

// Interface for imported icon node
export type ImportedNode = FrameNode | ComponentNode;

/**
 * Import SVG
 */
export function importSVG(
	svg: string,
	mode: ImportMode = 'frame'
): ImportedNode {
	const frame = figma.createNodeFromSvg(svg);

	switch (mode) {
		case 'component': {
			// Convert to component
			const component = figma.createComponent();
			component.resizeWithoutConstraints(frame.width, frame.height);
			for (const child of frame.children) {
				component.appendChild(child);
			}
			return component;
		}
	}

	return frame;
}
