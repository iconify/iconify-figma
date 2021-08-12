/**
 * Convert RGB to string
 */
function colorToString(color: RGB): string {
	function convert(value: number): string {
		const str = Math.min(
			Math.max(Math.round(value * 255), 0),
			255
		).toString(16);
		return str.length === 1 ? '0' + str : str;
	}
	return '#' + convert(color.r) + convert(color.g) + convert(color.b);
}

/**
 * Get document colors
 */
export function getDocumentColors(): string[] {
	try {
		const colors: Set<string> = new Set();
		figma.getLocalPaintStyles().forEach((item) => {
			const paints = item.paints;
			if (paints.length !== 1) {
				return;
			}
			const paint = paints[0]!;
			if (paint.type === 'SOLID' && paint.blendMode === 'NORMAL') {
				colors.add(colorToString(paint.color));
			}
		});

		return Array.from(colors);
	} catch (err) {
		return [];
	}
}
