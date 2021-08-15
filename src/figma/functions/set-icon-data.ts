import type { PartialRoute } from '@iconify/search-core/lib';
import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { ImportedIconSharedData } from '../data/node-data';
import { figmaPhrases } from '../data/phrases';
import type { ImportedNode } from './import-svg';

/**
 * Set shared data for imported icon
 */
export function setIconData(
	node: ImportedNode,
	name: string,
	props?: Partial<IconCustomisations>,
	route?: PartialRoute
) {
	node.setSharedPluginData('iconify', 'source', 'iconify');
	const propsData: ImportedIconSharedData = {
		version: 2,
		name,
		props,
		route,
	};
	node.setSharedPluginData('iconify', 'props', JSON.stringify(propsData));
	node.setRelaunchData(figmaPhrases.relaunch);
}

/**
 * Fix imported SVG
 */
export function fixImportedSVG(node: ImportedNode, svg: string) {
	// SVG paste: fix 1px imports when height is set to "1em"
	if (node.height === 1) {
		// Get viewBox
		const search = 'viewBox="';
		const index = svg.indexOf(search);
		if (index !== -1) {
			const viewBox = svg
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
	}
}
