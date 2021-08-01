import { pluginEnv } from './env';

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
		min: 500,
		max: 720,
	},
	compact: {
		width: 514,
		// Height
		min: 400,
		max: 600,
	},
	// Difference with window.innerHeight
	diff: 90,
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
	if (pluginEnv.windowHeight) {
		height = Math.max(
			Math.min(pluginEnv.windowHeight - dimensions.diff, item.max),
			item.min
		);
	} else {
		height = item.max;
	}

	return {
		width: item.width,
		height,
	};
}
