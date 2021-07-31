import type { PartialRoute } from '@iconify/search-core';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';
import type { UINotice } from '../../common/messages';
import { filterViableParentNode, ViableParentFigmaNode } from '../data/layers';
import type { ImportedIconSharedData } from '../data/node-data';
import { figmaPhrases } from '../data/phrases';
import { sendMessageToUI } from '../send-message';

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
	const added: string[] = [];
	const errors: string[] = [];

	// Find parent layer
	const parent = findParentLayer(data.layerId);

	// Import all icons
	icons.forEach((icon) => {
		const node = figma.createNodeFromSvg(icon.svg);
		if (!node) {
			errors.push(icon.name);
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

		added.push(icon.name);
	});

	// Show notice
	const notices: UINotice[] = [];
	const text = figmaPhrases.notices;
	switch (added.length) {
		case 0:
			break;

		case 1:
			notices.push({
				layout: 'success',
				message: text.added_icon.replace('{name}', added[0]),
			});
			break;

		default:
			notices.push({
				layout: 'success',
				message: text.added_icons.replace('{count}', added.length + ''),
			});
	}
	switch (errors.length) {
		case 0:
			break;

		case 1:
			notices.push({
				layout: 'error',
				message: text.failed_icon.replace('{name}', errors[0]),
			});
			break;

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
}
