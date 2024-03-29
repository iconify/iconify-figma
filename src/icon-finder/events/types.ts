import type { Icon } from '@iconify/search-core';
import type { IconCustomisations } from '@iconify/search-core/lib/misc/customisations';
import type { PluginUIWindowControls } from '../../common/navigation';

// Icon selection
export interface UISelectionEvent {
	type: 'selection';
	// If set, multiple icons are handled and `icon` is ignored
	icons?: Icon[];
	// If Icon value is a string, empty string = null
	icon?: string | Icon | null;
	// Selection: if set, it toggles icon
	selected?: boolean;
}

// Customisaton has changed
export interface UICustomisationEvent {
	type: 'customisation';
	// Customisation that was changed
	changed: Partial<IconCustomisations>;
	// Current customised customisations
	customisations: IconCustomisations;
}

// Button was clicked in footer
export interface UIFooterButtonEvent {
	type: 'button';
	// Button key
	button: string;
}

// Config was changed
export interface UIConfigEvent {
	type: 'config';
}

// Icon in custom view was deleted
export interface UIDeleteIconEvent {
	type: 'delete';
	customType: string;
	icon: string;
}

// Toggle window layout
export interface UIWindowEvent {
	type: 'window';
	control: PluginUIWindowControls;
}

// Import SVG
export interface UIImportSVGEvent {
	type: 'import-svg';
	svg: string;
}

// Combined type
export type UIEvent =
	| UISelectionEvent
	| UICustomisationEvent
	| UIFooterButtonEvent
	| UIDeleteIconEvent
	| UIWindowEvent
	| UIImportSVGEvent
	| UIConfigEvent;
