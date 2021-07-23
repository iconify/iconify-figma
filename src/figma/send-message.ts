import type { FigmaToUIMessage } from '../common/messages';

/**
 * Send message to UI
 */
export function sendMessageToUI(message: FigmaToUIMessage) {
	figma.ui.postMessage(message);
}
