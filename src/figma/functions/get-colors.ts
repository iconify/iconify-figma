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
		const colors: (string | null)[] = figma
			.getLocalPaintStyles()
			.map((item) => {
				const paints = item.paints;
				if (paints.length !== 1) {
					return null;
				}
				const paint = paints[0]!;
				return paint.type === 'SOLID' && paint.blendMode === 'NORMAL'
					? colorToString(paint.color)
					: null;
			});

		return colors.filter((item) => item !== null) as string[];
	} catch (err) {
		return [];
	}
}
