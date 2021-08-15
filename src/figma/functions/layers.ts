import type {
	ImportedIconSharedData,
	LegacyImportedIconSharedData,
} from '../data/node-data';

function assertNever(v: never) {
	//
}

/**
 * Frames
 */
export type FilteredFrameNode = FrameNode | ComponentNode; // | InstanceNode;

/**
 * Type for all viable parent nodes
 */
type ViableOtherParentNodes = PageNode | GroupNode;
export type ViableParentFigmaNode = FilteredFrameNode | ViableOtherParentNodes;

/**
 * Check if node is a frame or one of frame variations
 */
export function isFrameNode(node: BaseNode): boolean {
	const type = (node as FilteredFrameNode).type;
	switch (type) {
		case 'FRAME':
		case 'COMPONENT':
			// case 'INSTANCE':
			return true;

		default:
			assertNever(type);
	}
	return false;
}

/**
 * Check for auto layout
 */
export function isAutoLayoutNode(node: BaseNode): boolean {
	try {
		switch ((node as FrameNode).layoutMode) {
			case 'HORIZONTAL':
			case 'VERTICAL':
				return true;
		}
	} catch (err) {}
	return false;
}

/**
 * Check if node is an icon
 */
export function isIconNode(
	node: FilteredFrameNode
): ImportedIconSharedData | null {
	let source = node.getSharedPluginData('iconify', 'source');
	if (source === 'iconify') {
		let iconProps:
			| ImportedIconSharedData
			| LegacyImportedIconSharedData
			| undefined;
		try {
			iconProps = JSON.parse(
				node.getSharedPluginData('iconify', 'props')
			);
			// console.log('Icon layer props:', iconProps);
		} catch (err) {
			//
		}

		// Convert props
		if (typeof iconProps === 'object') {
			switch ((iconProps as ImportedIconSharedData).version) {
				case 2:
					return iconProps as ImportedIconSharedData;

				case void 0: {
					const legacyProps = iconProps as LegacyImportedIconSharedData;
					if (typeof legacyProps.name === 'string') {
						return {
							version: 2,
							name: legacyProps.name,
							props: {
								color: legacyProps.color,
								...legacyProps.props,
							},
						};
					}
				}
			}
		}

		// Look like an icon, but missing props
		return {
			version: 2,
			name: node.name,
		};
	}
	return null;
}

/**
 * Convert and validate node to make sure it can accept child nodes
 */
export function filterViableParentNode(
	node: BaseNode,
	checkFrame: boolean
): ViableParentFigmaNode | null {
	if (checkFrame && isFrameNode(node)) {
		return node as ViableParentFigmaNode;
	}

	const type = (node as ViableOtherParentNodes).type;
	switch (type) {
		case 'GROUP':
		case 'PAGE':
			return node as ViableParentFigmaNode;

		default:
			assertNever(type);
	}

	return null;
}
