import type { PartialRoute } from '@iconify/search-core';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';
import type { UINotice } from '../../common/messages';
import { pluginEnv } from '../data/env';
import {
	FilteredFrameNode,
	filterViableParentNode,
	isFrameNode,
	ViableParentFigmaNode,
} from '../functions/layers';
import { figmaPhrases } from '../data/phrases';
import { sendMessageToUI } from '../send-message';
import { moveNode } from '../functions/move-node';
import { updateSelection } from '../functions/update-selection';
import { ImportedNode, importSVG } from '../functions/import-svg';
import { fixImportedSVG, setIconData } from '../functions/set-icon-data';
import { setRecentColor } from '../functions/recent-color';

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
	let replaceError = false;

	// Find parent layer
	let parent: ViableParentFigmaNode | undefined;
	function getParent(): ViableParentFigmaNode {
		if (!parent) {
			let layerId = data.layerId;
			if (
				layerId &&
				// Make sure id is in currently available layers list
				!pluginEnv.selection?.layers.find((item) => item.id === layerId)
			) {
				layerId = '';
			}
			parent = findParentLayer(
				data.layerId ? data.layerId : pluginEnv.selection?.defaultLayer
			);
		}
		return parent;
	}

	// Import all icons
	icons.forEach((icon) => {
		let replacedNode: FilteredFrameNode | null = null;
		if (icon.replace) {
			replacedNode = figma.currentPage.findOne(
				(node) => node.id === icon.replace
			) as FilteredFrameNode;
			if (!replacedNode || !isFrameNode(replacedNode)) {
				replaceError = true;
				return;
			}
		}

		let node: ImportedNode;
		try {
			node = importSVG(icon.svg, data.mode, replacedNode);
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
		if (!replacedNode) {
			moveNode(node, getParent());
		}

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
	if (replaceError) {
		notices.push({
			layout: 'error',
			message: text.failed_replace,
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
		importedIcons: added.filter(
			(icon) => typeof icon === 'string'
		) as string[],
	});

	// Update recent colors
	if (typeof data.props.color === 'string') {
		setRecentColor(data.props.color);
	}

	return !replaceError && errors.length === 0;
}
