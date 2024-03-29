import { writable, Writable } from 'svelte/store';
import { compareObjects } from '@iconify/search-core/lib';
import { defaultPluginOptions, PluginOptions } from '../../common/options';
import { sendMessageToFigma } from './messages';

/**
 * Options
 */
let options: PluginOptions = defaultPluginOptions;

export const watchedOptions: Writable<PluginOptions> = writable(options);

/**
 * Get options
 */
export function getOptions(): PluginOptions {
	return options;
}

/**
 * Update options
 */
export function setOptions(
	values: Partial<PluginOptions>,
	sendToPlugin = true
) {
	const newOptions = Object.assign({}, options, values);
	if (!compareObjects(options, newOptions)) {
		watchedOptions.set((options = newOptions));
		if (sendToPlugin) {
			sendMessageToFigma({
				type: 'update-options',
				options,
			});
		}
	}
}
