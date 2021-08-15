import { Icon, iconToString } from '@iconify/search-core';
import { renderHTML } from '@iconify/search-core/lib/code-samples/html';
import { defaultCustomisations } from '@iconify/search-core/lib/misc/customisations';
import { getIcon } from '@iconify/svelte';
import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { DropIconCoordinates, DropIconData } from '../../common/import';
import type { UIToFigmaDragMessage } from '../../common/messages';
import { getOptions } from './options';

function assertNever(v: never) {
	//
}

/**
 * onDrag events
 */
export type IconDragEvent = (
	start: boolean,
	event: MouseEvent,
	item: OnDragParams
) => void;

export type IconsListDragEvent = (
	start: boolean,
	event: MouseEvent,
	icon: Icon
) => void;

/**
 * Drag item
 */
export interface WrapperDragItem {
	itemType: 'icon' | 'svg';
	icon?: Icon;
	item: string;
	customise?: boolean;
}

/**
 * Extra params for event
 */
export interface OnDragParams extends WrapperDragItem {
	offset?: {
		x: number;
		y: number;
	};
}

/**
 * Drag data
 */
export interface WrapperDragStartData extends WrapperDragItem {
	// Amount to add to final coordinates to figure out actual center
	diff: {
		x: number;
		y: number;
	};

	// Min/max coordinates of plugin window to see if drop ends outside
	min: {
		x: number;
		y: number;
	};
	max: {
		x: number;
		y: number;
	};
}

export function getDragMessage(
	start: WrapperDragStartData,
	customisations: Partial<IconCustomisations>,
	event: MouseEvent
): UIToFigmaDragMessage | null {
	// Get icon
	let data: DropIconData;
	switch (start.itemType) {
		case 'icon': {
			const name = start.icon ? iconToString(start.icon) : start.item;
			const iconData = getIcon(name);
			if (!iconData) {
				return null;
			}

			const props =
				start.customise || getOptions().customizeDrop
					? customisations
					: {};
			const size =
				props.width || props.height
					? {}
					: {
							width: iconData.width + '',
							height: iconData.height + '',
					  };
			const svg = renderHTML(iconData, {
				...defaultCustomisations,
				...props,
				...size,
			});

			// Set data
			data = {
				name,
				svg,
			};
			if (start.customise) {
				data.props = props;
			}
			break;
		}

		case 'svg': {
			data = {
				svg: start.item,
			};
			break;
		}

		default:
			assertNever(start.itemType);
			return null;
	}

	// Get target
	/*
	console.log('window.outer*:', window.outerWidth, window.outerHeight);
	console.log('window.inner*', window.innerWidth, window.innerHeight);
	*/
	let target: DropIconCoordinates = {
		coords: {
			x: event.clientX + start.diff.x,
			// Add 40px to account for plugin window heading
			y: event.clientY + start.diff.y + 40,
		},
		window: {
			width: window.outerWidth,
			height: window.outerHeight,
		},
	};

	return {
		type: 'drop-icon',
		data,
		target,
	};
}
