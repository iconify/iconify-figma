/**
 * Page
 */
export interface SelectedPageLayer {
	type: 'page';
	name: string;
	children: PossibleTargetChildLayer[];
}

/**
 * Common data
 */
interface CommonLayerData {
	id: string;
	name: string;
}

/**
 * Base
 */
interface BaseLayer extends CommonLayerData {
	children: PossibleTargetChildLayer[];
}

/**
 * Group
 */
interface PossibleTargetGroupLayer extends BaseLayer {
	type: 'group';
}

/**
 * Frame and components
 */
interface PossibleTargetFrameBaseLayer extends BaseLayer {
	layoutMode?: 'HORIZONTAL' | 'VERTICAL';
	isIcon?: boolean;
}
interface PossibleTargetFrameLayer extends PossibleTargetFrameBaseLayer {
	type: 'frame';
}
interface PossibleTargetComponentLayer extends PossibleTargetFrameBaseLayer {
	type: 'component';
}
interface PossibleTargetComponentInstanceLayer
	extends PossibleTargetFrameBaseLayer {
	type: 'instance';
}

/**
 * Combinations
 */
export type PossibleTargetChildLayer =
	| PossibleTargetGroupLayer
	| PossibleTargetFrameLayer
	| PossibleTargetComponentLayer
	| PossibleTargetComponentInstanceLayer;

/**
 * Layer with icon
 */
export interface ImportedIconLayer extends CommonLayerData {
	type: 'frame' | 'component' | 'instance';
}
