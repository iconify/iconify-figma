import type { IconFinderConfig, PartialRoute } from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { PluginApp, PluginIconFinderConfig } from './misc';
import type { ImportIconCommon, ImportIconItem } from './import';
import type { SelectedLayers } from './layers';
import type { PluginStorage } from '../figma/data/config';
import type { IconListType } from './icon-lists';
import type { PluginUIWindowControls } from './navigation';

/**
 * Notice
 */
export type UINoticeLayout = 'error' | 'success' | 'warning';
export interface UINotice {
	layout: UINoticeLayout;
	message: string;
}

/**
 * Messages sent from Figma to UI
 */

// Send message when plugin starts
interface FigmaToUILayersMessage {
	type: 'target-layers';
	selection: SelectedLayers;
}

interface FigmaToUIStartMessage
	extends Partial<Omit<FigmaToUILayersMessage, 'type'>> {
	type: 'start-plugin';
	app: PluginApp;
	command: string;
	ifConfig: PluginIconFinderConfig;
	storage?: PluginStorage;
}

interface FigmaToUINotice {
	type: 'notice';
	notice: UINotice | UINotice[];
}

// Combined type
export type FigmaToUIMessage =
	| FigmaToUIStartMessage
	| FigmaToUILayersMessage
	| FigmaToUINotice;

/**
 * Messages sent from UI to Figma
 */

// Parent window has been resized
interface UIToFigmaResizeMessage {
	type: 'resize';
	height: number;
}

// Send message when UI has been loaded
interface UIToFigmaLoadedMessage
	extends Partial<Omit<UIToFigmaResizeMessage, 'type'>> {
	type: 'ui-loaded';
}

// Events from Icon Finder, applied to config
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

export interface UIToFigmaImportIconMessage {
	type: 'import-icon';
	data: ImportIconCommon;
	route?: PartialRoute; // Route to restore Icon Finder when replacing icon
	icons: ImportIconItem[];
}

interface UIToFigmaCustomStorageMessage {
	type: 'custom-icons';
	storage: IconListType;
	icons: string[];
}

interface UIToFigmaCloseMessage {
	type: 'close-plugin';
}

interface UIToFigmaWindowMessage {
	type: 'window';
	control: PluginUIWindowControls;
}

// Combined type
export type UIToFigmaMessage =
	| UIToFigmaLoadedMessage
	| UIToFigmaResizeMessage
	| UIToFigmaConfigMessage
	| UIToFigmaCustomisationsMessage
	| UIToFigmaRouteMessage
	| UIToFigmaImportIconMessage
	| UIToFigmaCustomStorageMessage
	| UIToFigmaWindowMessage
	| UIToFigmaCloseMessage;
