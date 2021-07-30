import type { IconFinderButtonEvent } from '../wrapper/events';
import type { UIToFigmaImportIconMessage } from '../../common/messages';
import { iconToString } from '@iconify/search-core';
import { renderHTML } from '@iconify/search-core/lib/code-samples/html';
import { defaultCustomisations } from '@iconify/search-core/lib/misc/customisations';
import { getIcon } from '@iconify/svelte';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';

/**
 * Convert button message from Icon Finder to message to plugin
 */
export function getIconImportMessage(
	event: IconFinderButtonEvent
): UIToFigmaImportIconMessage | undefined {
	const state = event.state;

	// Get props
	const props = state.customisations;

	// Get all icons
	const icons = state.icons
		.map((icon) => {
			const name = iconToString(icon);
			const data = getIcon(name);
			if (!data) {
				return null;
			}

			const size =
				props.width || props.height
					? {}
					: {
							height: 'auto',
					  };
			const svg = renderHTML(data, {
				...defaultCustomisations,
				...size,
				...props,
			});
			const result: ImportIconItem = {
				svg,
				name,
			};
			return result;
		})
		.filter((item) => item !== null) as ImportIconItem[];

	if (!icons.length) {
		return;
	}

	// Return data
	const route = state.route;
	const data: ImportIconCommon = {
		props,
	};

	return {
		type: 'import-icon',
		data,
		route,
		icons,
	};
}
