import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';

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
}

// Data for each imported icon
export interface ImportIconItem {
	// Full name with prefix
	name: string;

	// SVG
	svg: string;
}

/**
 * Import custom SVG
 */
export interface ImportCustomSVG extends ImportTarget {
	svg: string;
}
