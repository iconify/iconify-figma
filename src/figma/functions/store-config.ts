import { defaultPluginOptions, PluginOptions } from '../../common/options';
import type { PartialPluginConfig, PluginConfig } from '../data/config';
import { pluginEnv } from '../data/env';

function assertNever(v: never) {
	//
}

/**
 * Minify config for storage
 *
 * Undo this action in cleanupLoadedConfig()
 */
function minifyConfig(config: PluginConfig): PartialPluginConfig {
	let newConfig: PartialPluginConfig = {
		version: 2,
	};

	for (const key in config) {
		const attr = key as keyof typeof config;
		switch (attr) {
			case 'version':
				break;

			case 'options': {
				// Remove options where value matches default
				const currentOptions = config.options;
				const minifiedOptions: Partial<PluginOptions> = {};
				let notEmpty = false;

				for (const key2 in defaultPluginOptions) {
					const option = key2 as keyof typeof defaultPluginOptions;
					const value = currentOptions[option];
					if (value !== defaultPluginOptions[option]) {
						(minifiedOptions as Record<string, unknown>)[
							option
						] = value;
						notEmpty = true;
					}
				}

				if (notEmpty) {
					newConfig.options = minifiedOptions;
				}
				break;
			}

			case 'state':
			case 'storage':
			case 'page': {
				// Copy as is
				((newConfig as unknown) as Record<string, unknown>)[attr] =
					config[attr];
				break;
			}

			default:
				assertNever(attr);
		}
	}

	return newConfig;
}

/**
 * Store config
 */
let timer: number | null = null;
export function storeConfig() {
	if (timer) {
		return;
	}
	timer = setTimeout(finishStoringConfig, 2000);
}

/**
 * Store config without throttle
 */
export async function finishStoringConfig() {
	// Clear timer
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}

	// Store config
	const minified = minifyConfig(pluginEnv.config);
	try {
		await figma.clientStorage.setAsync('config', minified);
	} catch (err) {
		//
	}
}
