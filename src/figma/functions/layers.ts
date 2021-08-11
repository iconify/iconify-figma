function assertNever(v: never) {
	//
}

/**
 * Type for all viable parent nodes
 */
export type ViableParentFigmaNode = BaseNode & ChildrenMixin;

/**
 * Frames
 */
export type FilteredFrameNode = FrameNode | ComponentNode | InstanceNode;

/**
 * Check if node is a frame or one of frame variations
 */
export function isFrameNode(node: BaseNode): boolean {
	const type = (node as FilteredFrameNode).type;
	switch (type) {
		case 'FRAME':
		case 'COMPONENT':
		case 'INSTANCE':
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
export function isIconNode(node: SceneNode): boolean {
	let source = node.getSharedPluginData('iconify', 'source');
	if (source === 'iconify') {
		/*
		console.log('Debug: found icon.');
		console.log(
			'getSharedPluginData: props =',
			JSON.stringify(node.getSharedPluginData('iconify', 'props'))
		);
		console.log(
			'getSharedPluginData: color =',
			JSON.stringify(node.getSharedPluginData('iconify', 'color'))
		);
		*/
		return true;
	}
	return false;
}

/**
 * Convert and validate node to make sure it can accept child nodes
 */
export function filterViableParentNode(
	node: BaseNode
): ViableParentFigmaNode | null {
	if (isFrameNode(node)) {
		return node as ViableParentFigmaNode;
	}

	switch (node.type) {
		case 'GROUP':
		case 'PAGE':
			return node;
	}

	return null;
}
