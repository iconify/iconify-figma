import { Iconify } from '@iconify/search-core/lib/iconify';

export interface IconDimensions {
	width: number | string;
	height: number | string;
}

/**
 * Calculate both dimensions
 */
export function getDimensions(
	width: number | string,
	height: number | string,
	ratio: number,
	rotated: boolean
): IconDimensions {
	if (width && height) {
		return {
			width: rotated ? height : width,
			height: rotated ? width : height,
		};
	}

	if (!Iconify.calculateSize) {
		// calculateSize is not available: assume ratio of 1
		const value = width ? width : height;
		return {
			width: value,
			height: value,
		};
	}

	if (!height) {
		height = Iconify.calculateSize(width, rotated ? ratio : 1 / ratio) as
			| number
			| string;
	} else {
		width = Iconify.calculateSize(height, rotated ? 1 / ratio : ratio) as
			| number
			| string;
	}
	return {
		width,
		height,
	};
}
