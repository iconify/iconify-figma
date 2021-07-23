import type { IconFinderConfig, PartialRoute } from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { PluginIconFinderConfig } from './config';

/**
 * Send message when plugin starts
 */
interface FigmaToUIStartMessage {
	type: 'start-plugin';
	ifConfig: PluginIconFinderConfig;
}

/**
 * Parent window has been resized
 */
interface UIToFigmaResizeMessage {
	type: 'resize';
	height: number;
}

/**
 * Send message when UI has been loaded
 */
interface UIToFigmaLoadedMessage
	extends Partial<Omit<UIToFigmaResizeMessage, 'type'>> {
	type: 'ui-loaded';
}

/**
 * Events from Icon Finder, applied to config
 */
interface UIToFigmaConfigMessage {
	type: 'icon-finder-config';
	config: IconFinderConfig;
}

interface UIToFigmaCustomisationsMessage {
	type: 'icon-finder-customisations';
	customisations: PartialIconCustomisations;
}

interface UIToFigmaRouteMessage {
	type: 'icon-finder-route';
	route: PartialRoute;
}

/**
 * Combined types
 */
export type FigmaToUIMessage = FigmaToUIStartMessage;

export type UIToFigmaMessage =
	| UIToFigmaLoadedMessage
	| UIToFigmaResizeMessage
	| UIToFigmaConfigMessage
	| UIToFigmaCustomisationsMessage
	| UIToFigmaRouteMessage;
