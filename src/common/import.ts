import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';

interface ImportSVG {
	svg: string;
	layerId?: string;
}

/**
 * Import icon from Iconify
 */
export interface ImportIcon extends ImportSVG {
	// Icon information
	data: {
		// Full name with prefix
		name: string;

		// Customisations
		props: Partial<IconCustomisations>;
	};
}

/**
 * Import custom SVG
 */
export interface ImportCustomSVG extends ImportSVG {}
