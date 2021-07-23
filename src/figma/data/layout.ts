import { pluginEnv } from './env';

/**
 * UI dimensions
 */
const dimensions = {
	width: {
		full: 690,
		compact: 514,
	},
	height: {
		min: 500,
		default: 720, // same as max
		diff: 90, // difference with window.innerHeight
		max: 720,
	},
};

interface UISize {
	width: number;
	height: number;
}

/**
 * Get UI size
 */
export function getUISize(): UISize {
	const compact = pluginEnv.config.options.compactWidth;
	const width = dimensions.width[compact ? 'compact' : 'full'];

	// Get height
	let height: number;
	if (pluginEnv.windowHeight) {
		height = Math.max(
			Math.min(
				pluginEnv.windowHeight - dimensions.height.diff,
				dimensions.height.max
			),
			dimensions.height.min
		);
	} else {
		height = dimensions.height.default;
	}

	return {
		width,
		height,
	};
}
