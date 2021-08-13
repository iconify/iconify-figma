import { isIconNode } from './layers';

export interface NearestFrame {
	node: FrameNode | GroupNode;
	x: number;
	y: number;
}

function testNode(node: FrameNode | GroupNode, x: number, y: number): boolean {
	if (
		x < node.x ||
		y < node.y ||
		x > node.x + node.width ||
		y > node.y + node.height
	) {
		return false;
	}
	return true;
}

function testChildren(
	node: PageNode | FrameNode | GroupNode,
	x: number,
	y: number
): NearestFrame | null {
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		if (!child.locked && child.visible) {
			switch (child.type) {
				case 'GROUP': {
					if (testNode(child, x, y)) {
						const result = testChildren(child, x, y);
						return result
							? result
							: {
									node: child,
									x,
									y,
							  };
					}
					break;
				}

				case 'FRAME': {
					if (testNode(child, x, y) && !isIconNode(child)) {
						const result = testChildren(
							child,
							x - child.x,
							y - child.y
						);
						return result
							? result
							: {
									node: child,
									x: x - child.x,
									y: y - child.y,
							  };
					}
					break;
				}
			}
		}
	}

	return null;
}

export function findNearestFrame(x: number, y: number): NearestFrame | null {
	return testChildren(figma.currentPage, x, y);
}
