import { pluginEnv } from '../data/env';
import { sendMessageToUI } from '../send-message';

const maxRecentColors = 8;

/**
 * Set recent color
 */
export function setRecentColor(value: string) {
	if (!value.length) {
		return;
	}
	value = value.toLowerCase();

	// Set most recent color
	let colors: string[];
	if (pluginEnv.config.recentColors) {
		colors = pluginEnv.config.recentColors;
		if (colors[0] === value) {
			// Nothing to change
			return;
		}
		colors = colors.filter((item) => item !== value);
		colors.unshift(value);
		while (colors.length > maxRecentColors) {
			colors.pop();
		}
	} else {
		colors = [value];
	}

	// Update data
	pluginEnv.config.recentColors = colors;
	sendMessageToUI({
		type: 'update-recent-colors',
		colors,
	});
}
