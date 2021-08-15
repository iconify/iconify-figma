import { defaultPluginOptions } from '../../common/options';
import {
	emptyPluginConfig,
	PartialPluginConfig,
	PluginConfig,
} from '../data/config';
import { convertLegacyConfig, LegacyPluginConfig } from '../data/legacy-config';

function assertNever(v: never) {
	//
}

/**
 * Load config
 */
export async function loadConfig(): Promise<PluginConfig> {
	// Load config
	try {
		const retrievedConfig:
			| PartialPluginConfig
			| LegacyPluginConfig
			| undefined = await figma.clientStorage.getAsync('config');
		if (
			typeof retrievedConfig === 'object' &&
			typeof retrievedConfig.version === 'number'
		) {
			// console.log(
			// 	'Retrieved config:',
			// 	JSON.stringify(retrievedConfig, null, 4)
			// );
			switch (retrievedConfig.version) {
				case 1:
					return expandConfig(convertLegacyConfig(retrievedConfig));

				case 2:
					return expandConfig(retrievedConfig);
			}
		}
	} catch (err) {
		//
	}

	// Nothing
	return expandConfig(emptyPluginConfig);
}

/**
 * Add missing stuff to config
 */
export function expandConfig(config: PartialPluginConfig): PluginConfig {
	const newConfig: PluginConfig = {
		version: 2,
		options: {
			...defaultPluginOptions,
		},
		state: config.state ? JSON.parse(JSON.stringify(config.state)) : {},
	};

	// Copy other stuff
	for (const configKey in config) {
		const value = config[configKey as keyof typeof config];

		// Rename 'storage' to 'iconsStorage' (from first version 3 config)
		const attr = (configKey === 'storage'
			? 'iconsStorage'
			: configKey) as keyof typeof config;

		switch (attr) {
			case 'version':
			case 'state':
				// Already added above
				break;

			case 'options': {
				// Expand options
				if (config.options) {
					const customOptions = config.options;
					const options = newConfig.options;
					for (const optionKey in options) {
						const option = optionKey as keyof typeof options;
						if (customOptions[option] !== void 0) {
							((options as unknown) as Record<string, unknown>)[
								option
							] = customOptions[option];
						}
					}
				}
				break;
			}

			case 'page':
			case 'iconsStorage':
			case 'recentColors':
				// Copy
				if (value !== void 0) {
					((newConfig as unknown) as Record<string, unknown>)[
						attr
					] = JSON.parse(JSON.stringify(value));
				}
				break;

			default:
				assertNever(attr);
		}
	}

	return newConfig;
}
