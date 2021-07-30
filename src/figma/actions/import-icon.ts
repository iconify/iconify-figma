import type { ImportIcon } from '../../common/import';
import { filterViableParentNode, ViableParentFigmaNode } from '../data/layers';

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
	parent.insertChild(0, node);
}

/**
 * Import icon(s)
 */
export function importIcons(icons: ImportIcon[]) {
	// Find parent layer
	const firstIcon = icons[0];
	const parent = findParentLayer(firstIcon.layerId);

	// Import all icons
	icons.forEach((icon) => {
		const node = figma.createNodeFromSvg(icon.svg);
		if (!node) {
			console.error('Error importing SVG');
			return;
		}

		// Set data
		node.setSharedPluginData('iconify', 'source', 'iconify');
		node.setSharedPluginData('iconify', 'props', JSON.stringify(icon.data));
		node.setRelaunchData({ code: 'Icon code for developers' });

		// Rename node
		node.name = icon.data.name;

		// Move it
		moveNode(node, parent);
	});
}
