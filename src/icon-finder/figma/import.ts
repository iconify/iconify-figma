import type { IconFinderButtonEvent } from '../wrapper/events';
import type { UIToFigmaImportIconMessage } from '../../common/messages';
import { iconToString } from '@iconify/search-core';
import { renderHTML } from '@iconify/search-core/lib/code-samples/html';
import { defaultCustomisations } from '@iconify/search-core/lib/misc/customisations';
import { getIcon } from '@iconify/svelte';
import type { ImportIcon } from '../../common/import';

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
			const result: ImportIcon = {
				svg,
				data: {
					name,
					props,
				},
			};
			return result;
		})
		.filter((item) => item !== null) as ImportIcon[];

	// Return message if there is something to import
	return icons.length > 0
		? {
				type: 'import-icon',
				icons,
		  }
		: void 0;
}
