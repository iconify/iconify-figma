import type { PartialRoute } from '@iconify/search-core';
import type {
	ImportIconCommon,
	ImportIconItem,
	ImportMode,
} from '../../common/import';
import type { UINotice } from '../../common/messages';
import { pluginEnv } from '../data/env';
import {
	filterViableParentNode,
	ViableParentFigmaNode,
} from '../functions/layers';
import type { ImportedIconSharedData } from '../data/node-data';
import { figmaPhrases } from '../data/phrases';
import { sendMessageToUI } from '../send-message';
import { moveNode } from '../functions/move-node';
import { updateSelection } from '../functions/update-selection';
import { ImportedNode, importSVG } from '../functions/import-svg';
import { fixImportedSVG, setIconData } from '../functions/set-icon-data';

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
	const addedNodes: ImportedNode[] = [];

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
		let node: ImportedNode;
		try {
			node = importSVG(icon.svg, data.mode);
		} catch (err) {
			errors.push(icon.name);
			console.error('Error importing SVG', err);
			return;
		}

		// Stuff for Iconify icon imports
		if (icon.name !== void 0) {
			// Set data
			setIconData(node, icon.name, data.props, route);

			// Rename node
			node.name = icon.name;
		} else {
			// SVG paste: fix 1px imports when height is set to "1em"
			fixImportedSVG(node, icon.svg);
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
