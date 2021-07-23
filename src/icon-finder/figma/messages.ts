import type { FigmaToUIMessage, UIToFigmaMessage } from '../../common/messages';

interface MockWindow {
	mockFigmaMessage?: (message: UIToFigmaMessage) => void;
}

/**
 * Send message from UI to Figma
 */
export function sendMessageToFigma(pluginMessage: UIToFigmaMessage) {
	console.log('Message to Figma:', pluginMessage);

	// Debug
	try {
		const w = window as MockWindow;
		if (w.mockFigmaMessage) {
			w.mockFigmaMessage(pluginMessage);
			return;
		}
	} catch (err) {}

	// Production
	try {
		parent.postMessage(
			{
				pluginMessage,
			},
			'*'
		);
	} catch (err) {}
}
