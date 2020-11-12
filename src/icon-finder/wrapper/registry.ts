import type { Icon, Registry } from '@iconify/search-core';
import type { FullIconFinderConfig } from '@iconify/search-core/lib/data/config';
import type { UIEvent } from '../events/types';
import type { ComponentsConfig } from '../config/wrapper';

/**
 * Add UI to config
 */
export interface WrappedFullIconFinderConfig extends FullIconFinderConfig {
	components: Required<ComponentsConfig>;
}

/**
 * onDrag events
 */
export type IconDragEvent = (
	start: boolean,
	event: MouseEvent,
	icon: Icon | string,
	customise: boolean
) => void;

/**
 * Add custom properties to registry
 */
export interface WrappedRegistry extends Registry {
	callback: (event: UIEvent) => void;
	config: WrappedFullIconFinderConfig;
	ondrag: IconDragEvent;
}
