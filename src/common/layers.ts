import type { ImportedIconSharedData } from '../figma/data/node-data';

/**
 * Common data
 */
interface CommonLayerData {
	id: string;
	name: string;
	depth?: number;
}

/**
 * Page
 */
export interface SelectedPageLayer extends CommonLayerData {
	type: 'PAGE';
}

/**
 * Group
 */
interface SelectedGroupLayer extends CommonLayerData {
	type: 'GROUP';
}

/**
 * Frame and components
 */
interface SelectedFrameBaseLayer extends CommonLayerData {
	layoutMode?: 'HORIZONTAL' | 'VERTICAL';
}
interface SelectedFrameLayer extends SelectedFrameBaseLayer {
	type: 'FRAME';
}
interface SelectedComponentLayer extends SelectedFrameBaseLayer {
	type: 'COMPONENT';
}
interface SelectedComponentInstanceLayer extends SelectedFrameBaseLayer {
	type: 'INSTANCE';
}

/**
 * Combinations
 */
export type SelectedLayer =
	| SelectedPageLayer
	| SelectedGroupLayer
	| SelectedFrameLayer
	| SelectedComponentLayer
	| SelectedComponentInstanceLayer;

/**
 * Layer with icon
 */
export interface SelectedIconLayer extends CommonLayerData {
	type: 'FRAME' | 'COMPONENT' | 'INSTANCE';
	data: ImportedIconSharedData;
}

/**
 * Selected layers and icon
 */
export interface SelectedLayers {
	layers: SelectedLayer[];

	// Default layer id
	defaultLayer: string;

	// Only one icon. If more than one icon is selected, option to replace icon is not shown to avoid messy UI
	icon?: SelectedIconLayer;
}
