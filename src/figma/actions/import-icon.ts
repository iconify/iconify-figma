import type { PartialRoute } from '@iconify/search-core';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';
import type { UINotice } from '../../common/messages';
import { pluginEnv } from '../data/env';
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

		added.push(icon.name);
	});

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
