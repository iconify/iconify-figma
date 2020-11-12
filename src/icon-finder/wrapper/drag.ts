import type { Icon } from '@iconify/search-core';

/**
 * onDrag events
 */
export type IconDragEvent = (
	start: boolean,
	event: MouseEvent,
	icon: Icon | string,
	customise: boolean
) => void;

/**
 * Drag data
 */

export interface WrapperDragStartData {
	icon: string;
	customise: boolean;
	rect: {
		x: number;
		y: number;
	};
	min: {
		x: number;
		y: number;
	};
	max: {
		x: number;
		y: number;
	};
}
