import { pluginEnv } from '../data/env';

/**
 * UI dimensions
 */
const dimensions = {
	mini: {
		width: 200,
		height: 104,
	},
	full: {
		width: 690,
		// Height
		min: 460,
		max: 720,
	},
	compact: {
		width: 514,
		// Height
		min: 400,
		max: 600,
	},
	// Difference with window.innerHeight and window.outerHeight
	innerDiff: 90,
	outerDiff: 150,
};

interface UISize {
	width: number;
	height: number;
}

/**
 * Get UI size
 */
export function getUISize(): UISize {
	if (pluginEnv.minimized) {
		return dimensions.mini;
	}

	const compact = pluginEnv.config.options.compactWidth;
	const item = dimensions[compact ? 'compact' : 'full'];

	// Get height
	let height: number;
	if (pluginEnv.windowInnerHeight) {
		const pluginHeight = pluginEnv.windowOuterHeight ? pluginEnv.windowOuterHeight - dimensions.outerDiff : pluginEnv.windowInnerHeight - dimensions.innerDiff;
		height = Math.max(Math.min(pluginHeight, item.max), item.min);
	} else {
		height = item.max;
	}

	console.log('Setting window height to:', height);
	return {
		width: item.width,
		height,
	};
}
