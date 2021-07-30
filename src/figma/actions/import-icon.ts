import type { PartialRoute } from '@iconify/search-core';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';
import { filterViableParentNode, ViableParentFigmaNode } from '../data/layers';
import type { ImportedIconSharedData } from '../data/node-data';
import { figmaPhrases } from '../data/phrases';

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
export function importIcons(
	data: ImportIconCommon,
	icons: ImportIconItem[],
	route?: PartialRoute
) {
	// Find parent layer
	const parent = findParentLayer(data.layerId);

	// Import all icons
	icons.forEach((icon) => {
		const node = figma.createNodeFromSvg(icon.svg);
		if (!node) {
			console.error('Error importing SVG');
			return;
		}

		// Set data
		node.setSharedPluginData('iconify', 'source', 'iconify');

		const propsData: ImportedIconSharedData = {
			version: 2,
			name: icon.name,
			props: data.props,
			route,
		};
		node.setSharedPluginData('iconify', 'props', JSON.stringify(propsData));
		node.setRelaunchData(figmaPhrases.relaunch);

		// Rename node
		node.name = icon.name;

		// Move it
		moveNode(node, parent);
	});
}
