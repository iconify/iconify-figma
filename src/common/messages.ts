import type { IconFinderConfig, PartialRoute } from '@iconify/search-core';
import type { PartialIconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { FigmaCommand, PluginApp, PluginIconFinderState } from './misc';
import type {
	DropIconCoordinates,
	DropIconData,
	ImportIconCommon,
	ImportIconItem,
} from './import';
import type { SelectedLayers } from './layers';
import type { PluginIconsStorage } from '../figma/data/config';
import type { IconListType, RecentColorsList } from './lists';
import type { PluginOptions } from './options';

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
	command: FigmaCommand;
	options: PluginOptions;
	state: PluginIconFinderState;
	iconsStorage?: PluginIconsStorage;
	recentColors?: RecentColorsList;
	colors?: string[];
}

interface FigmaToUINotice {
	type: 'notice';
	notice: UINotice | UINotice[];
	// Combine with imported icons list
	importedIcons?: string[];
}

interface FigmaToUIMinimizeMessage {
	type: 'toggle-minimize';
	minimized: boolean;
}

interface FigmaToUIRecentColorsMessage {
	type: 'update-recent-colors';
	colors: RecentColorsList;
}

// Combined type
export type FigmaToUIMessage =
	| FigmaToUIStartMessage
	| FigmaToUILayersMessage
	| FigmaToUIMinimizeMessage
	| FigmaToUIRecentColorsMessage
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

interface UIToFigmaSelectionMessage {
	type: 'icon-finder-selection';
	icons: string[];
}

export interface UIToFigmaImportIconMessage {
	type: 'import-icon';
	data: ImportIconCommon;
	route?: PartialRoute; // Route to restore Icon Finder when replacing icon
	icons: ImportIconItem[];
}

export interface UIToFigmaDragMessage {
	type: 'drop-icon';
	data: DropIconData;
	target: DropIconCoordinates;
}

interface UIToFigmaCustomStorageMessage {
	type: 'custom-icons';
	storage: IconListType;
	icons: string[];
}

interface UIToFigmaCloseMessage {
	type: 'close-plugin';
}

interface UIToFigmaMinimizeMessage {
	type: 'minimize';
	minimized: boolean;
}

interface UIToFigmaOptionsMessage {
	type: 'update-options';
	options: PluginOptions;
}

// Combined type
export type UIToFigmaMessage =
	| UIToFigmaLoadedMessage
	| UIToFigmaResizeMessage
	| UIToFigmaConfigMessage
	| UIToFigmaCustomisationsMessage
	| UIToFigmaRouteMessage
	| UIToFigmaSelectionMessage
	| UIToFigmaImportIconMessage
	| UIToFigmaDragMessage
	| UIToFigmaCustomStorageMessage
	| UIToFigmaMinimizeMessage
	| UIToFigmaOptionsMessage
	| UIToFigmaCloseMessage;
