import { phrases } from '../config/phrases';
import { pluginUIEnv } from './env';
const titles = phrases.figma.colorPicker;

// Color
interface ColorPickerColor {
	title: string;
	color: string;
	style: string;
}

// Section
interface ColorPickerSection {
	title: string;
	colors: ColorPickerColor[];
}

/**
 * Return color as object
 */
function color(color: string): ColorPickerColor {
	return {
		title: color,
		color,
		style:
			'background-color: ' +
			color +
			'; box-shadow: 0 0 0 2px currentColor, 0 0 0 4px ' +
			color +
			';',
	};
}

export type ColorPickerPalette = ColorPickerSection[];

/**
 * Gray palette
 */
const grayPalette: ColorPickerSection = {
	title: titles.gray,
	colors: [],
};
for (let i = 0; i < 16; i++) {
	let hex = i.toString(16);
	grayPalette.colors.push(color('#' + hex + hex + hex));
}

/**
 * FigJam colors
 */
const figJamPalette: ColorPickerPalette = [
	{
		title: titles.figjam,
		colors: [
			// Backgrounds
			color('#ff9a62'),
			color('#ffd233'),
			color('#4ecb71'),
			color('#85b6ff'),
			color('#d99bff'),
			color('#e4a951'),
			color('#ccc'),
			color('#f8f8f8'),
			// Text
			color('#f24e1e'),
			color('#ffc700'),
			color('#0fa958'),
			color('#699bf7'),
			color('#9747ff'),
			color('#d27c2c'),
			color('#545454'),
			color('#fff'),
		],
	},
];

let figmaDocumentColors: ColorPickerColor[] = [];

/**
 * Set Figma document colors
 */
export function setFigmaDocumentColors(values: string[]) {
	figmaDocumentColors = values.map(color);
}

/**
 * Get palette
 */
export function getPalette(recent?: string[]): ColorPickerPalette {
	let result: ColorPickerPalette = [];

	// Recent colors
	if (recent && recent.length) {
		result.push({
			title: titles.recent,
			colors: recent.map(color),
		});
	}

	// Document colors
	if (figmaDocumentColors.length) {
		result.push({
			title: titles.document,
			colors: figmaDocumentColors,
		});
	}

	// FigJam colors
	if (pluginUIEnv.app === 'figjam' || figmaDocumentColors.length < 9) {
		result = result.concat(figJamPalette);
	}

	// Gray
	result.push(grayPalette);

	return result;
}
