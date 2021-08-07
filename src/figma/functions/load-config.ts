import { emptyPluginConfig, PluginConfig } from '../data/config';
import { convertLegacyConfig, LegacyPluginConfig } from '../data/legacy-config';

/**
 * Load config
 */
export async function loadConfig(): Promise<PluginConfig> {
	// Load config
	try {
		const retrievedConfig:
			| PluginConfig
			| LegacyPluginConfig
			| undefined = await figma.clientStorage.getAsync('config');
		if (
			typeof retrievedConfig === 'object' &&
			typeof retrievedConfig.version === 'number'
		) {
			console.log(
				'Retrieved config:',
				JSON.stringify(retrievedConfig, null, 4)
			);
			switch (retrievedConfig.version) {
				case 1:
					return convertLegacyConfig(retrievedConfig);

				case 2:
					return retrievedConfig;
			}
		}
	} catch (err) {
		//
	}

	// Nothing
	return emptyPluginConfig;
}

/**
 * Clean up loaded config
 */
export function cleanupLoadedConfig(config: PluginConfig) {
	// Do
}
