import type { IconFinderButtonEvent } from '../wrapper/events';
import type { UIToFigmaImportIconMessage } from '../../common/messages';
import { iconToString } from '@iconify/search-core';
import { renderHTML } from '@iconify/search-core/lib/code-samples/html';
import { defaultCustomisations } from '@iconify/search-core/lib/misc/customisations';
import { getIcon } from '@iconify/svelte';
import type { ImportIconCommon, ImportIconItem } from '../../common/import';
import { addNotice } from './notices';
import { phrases } from '../config/phrases';

/**
 * Convert button message from Icon Finder to message to plugin
 */
export function getIconImportMessage(
	event: IconFinderButtonEvent
): UIToFigmaImportIconMessage | undefined {
	const state = event.state;
	const failed: string[] = [];

	// Get props
	const props = state.customisations;

	// Get all icons
	const icons = state.icons
		.map((icon) => {
			const name = iconToString(icon);
			const data = getIcon(name);
			if (!data) {
				failed.push(name);
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

	switch (failed.length) {
		case 0:
			break;

		case 1:
			addNotice({
				layout: 'error',
				message: phrases.figma.notices.failed_icon.replace(
					'{name}',
					failed[0]
				),
			});

		default:
			addNotice({
				layout: 'error',
				message: phrases.figma.notices.failed_icons.replace(
					'{count}',
					failed.length + ''
				),
			});
	}

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
