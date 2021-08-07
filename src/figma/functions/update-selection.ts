import type { SelectAfterImport } from '../../common/options';
import type { ImportedNode } from './import-svg';

function assertNever(v: never) {
	//
}

/**
 * Update selected nodes after import
 */
export function updateSelection(
	addedNodes: ImportedNode[],
	option: SelectAfterImport
) {
	const page = figma.currentPage;

	let keepSelection: boolean = false;
	switch (option) {
		case 'ignore':
			return;

		case 'auto':
			if (page.selection.length > 1) {
				keepSelection = true;
			}
			break;

		case 'add':
			keepSelection = true;
			break;

		case 'replace':
			break;

		default:
			assertNever(option);
	}

	const selection: SceneNode[] = keepSelection ? page.selection.slice(0) : [];
	page.selection = selection.concat(addedNodes);
}
