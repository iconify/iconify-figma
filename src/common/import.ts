import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { WindowAfterImport } from './options';

/**
 * Import modes
 */
export type ImportMode = 'frame' | 'component';

// Target for import
interface ImportTarget {
	// Layer
	layerId?: string;
}

/**
 * Import icon from Iconify
 */
// Common data for multiple icons
export interface ImportIconCommon extends ImportTarget {
	// Customisations
	props: Partial<IconCustomisations>;

	// Window action
	windowAction?: WindowAfterImport;

	// Import mode
	mode?: ImportMode;
}

// Data for each imported icon
export interface ImportIconItem {
	// Full name with prefix
	name?: string;

	// SVG
	svg: string;

	// Layer to replace
	replace?: string;
}

/**
 * Import custom SVG
 */
export interface ImportCustomSVG extends ImportTarget {
	svg: string;
}

/**
 * Drop icon data
 */
export interface DropIconData {
	// Customisations, if present
	props?: Partial<IconCustomisations>;

	// Icon name
	name?: string;

	// SVG
	svg: string;
}

export interface DropIconCoordinates {
	// Target coordinates
	coords: {
		x: number;
		y: number;
	};
	// Window size
	window: {
		width: number;
		height: number;
	};
}
