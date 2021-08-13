import type { DropIconCoordinates, DropIconData } from '../../common/import';
import { pluginEnv } from '../data/env';
import { figmaPhrases } from '../data/phrases';
import { findNearestFrame } from '../functions/find-nearest-frame';
import { ImportedNode, importSVG } from '../functions/import-svg';
import { fixImportedSVG, setIconData } from '../functions/set-icon-data';
import { updateSelection } from '../functions/update-selection';
import { sendMessageToUI } from '../send-message';

/**
 * Drop icon
 */
export function dropIcon(data: DropIconData, target: DropIconCoordinates) {
	const viewport = figma.viewport;
	const zoom = viewport.zoom;
	const bounds = viewport.bounds;

	// Get boxes
	const boundsWidth = bounds.width * zoom;
	const boundsHeight = bounds.height * zoom;
	const windowWidth = target.window.width;
	const windowHeight = target.window.height;

	// Difference between window and canvas
	const leftDiff = windowWidth - boundsWidth;
	const topDiff = windowHeight - boundsHeight;

	// Corner coordinates
	const hasRightPanel = leftDiff >= 240;
	const leftCoords = bounds.x - (leftDiff - (hasRightPanel ? 240 : 0)) / zoom;
	const topCoords = bounds.y - topDiff / zoom;

	// Target coordinates
	let targetX = leftCoords + target.coords.x / zoom;
	let targetY = topCoords + target.coords.y / zoom;

	/*
	console.log('Zoom:', zoom);
	console.log('Viewport dimensions:', boundsWidth, boundsHeight);
	console.log('Window dimensions:', windowWidth, windowHeight);
	console.log('Difference:', leftDiff, topDiff);
	console.log('Corner coordinates:', leftCoords, topCoords);
	console.log('Target coordinates', targetX, targetY);
    */

	// Import icon
	const text = figmaPhrases.notices;
	const failMessage = () => {
		sendMessageToUI({
			type: 'notice',
			notice: {
				layout: 'error',
				message:
					data.name === void 0
						? text.failed_unnamed
						: text.failed_icon.replace('{name}', data.name),
			},
		});
	};
	let node: ImportedNode;
	try {
		node = importSVG(data.svg);
	} catch (err) {
		failMessage();
		return;
	}

	// Stuff for Iconify icon imports
	const name = data.name;
	if (name !== void 0) {
		// Set data
		setIconData(node, name, data.props);

		// Rename node
		node.name = name;
	} else {
		// SVG paste: fix 1px imports when height is set to "1em"
		fixImportedSVG(node, data.svg);
	}

	// Attempt to find nearest frame
	let parent: PageNode | FrameNode | GroupNode = figma.currentPage;
	if (pluginEnv.config.options.dropToFrame) {
		const frame = findNearestFrame(targetX, targetY);
		if (frame) {
			parent = frame.node;
			targetX = frame.x;
			targetY = frame.y;
			/*
			console.log(
				`Nearest frame: ${frame.node.name} at ${targetX}, ${targetY}`
			);
			*/
		}
	}

	// Move node
	parent.appendChild(node);
	node.x = Math.round(targetX - node.width / 2);
	node.y = Math.round(targetY - node.height / 2);

	// Select node
	updateSelection([node], pluginEnv.config.options.selectAfterImport);

	// Success
	const importedIcons: string[] = name === void 0 ? [] : [name];
	sendMessageToUI({
		type: 'notice',
		notice: {
			layout: 'success',
			message:
				name === void 0
					? text.added_unnamed
					: text.added_icon.replace('{name}', name),
		},
		importedIcons,
	});
}
