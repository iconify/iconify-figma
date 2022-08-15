import type { UITranslation } from './types';

const animatedNotice =
	'Selected icon has SVG animations that Figma does not support. Icon might be imported incorrectly.';

/**
 * Phrases.
 *
 * Do not import phrases from this file, use ../config/phrases.ts instead
 */
export const phrases: UITranslation = {
	lang: 'English',
	search: {
		placeholder: {
			collection: 'Search {name}',
			collections: 'Filter collections',
			recent: 'Search recent icons',
			bookmarks: 'Search bookmarks',
		},
		defaultPlaceholder: 'Search all icons',
		button: 'Search Icons',
	},
	errors: {
		noCollections: 'No matching icon sets found.',
		noIconsFound: 'No icons found.',
		defaultError: 'Error loading Iconify Icon Finder.',
		custom: {
			loading: 'Loading...',
			timeout: 'Could not connect to Iconify API.',
			invalid_data: 'Invalid response from Iconify API.',
			empty: 'Nothing to show.',
			not_found: 'Collection {prefix} does not exist.',
			bad_route: 'Invalid route.',
			home: 'Click here to return to main page.',
		},
	},
	icons: {
		header: {
			full: 'Displaying {count} icons:',
			more:
				'Displaying {count} icons (click second page to load more results):',
			modes: {
				list: 'Display icons as list',
				grid: 'Display icons as grid',
			},
			select: 'Select multiple icons',
			swap: 'Select/Unselect icons on current page (inverts current selection)'
		},
		headerWithCount: {
			0: 'No icons to display.',
			1: 'Displaying 1 icon:',
		},
		tooltip: {
			size: '\nSize: {size}',
			colorless: '',
			colorful: '\nHas palette',
			char: '\nIcon font character: {char}',
			length: '', //'\nContent: {length} bytes',
		},
		more: 'Find more icons', // '3 ...',
		moreAsNumber: false, // True if text above refers to third page, false if text above shows "Find more icons" or similar text
	},
	pagination: {
		prev: 'Previous page',
		next: 'Next page',
	},
	filters: {
		'uncategorised': 'Uncategorised',
		'collections': 'Filter search results by icon set:',
		'collections-collections': '',
		'tags': 'Filter by category:',
		'themePrefixes': 'Icon type:',
		'themeSuffixes': 'Icon type:',
	},
	collectionInfo: {
		total: 'Number of icons:',
		height: 'Height of icons:',
		author: 'Author:',
		license: 'License:',
		palette: 'Palette:',
		colorless: 'Colorless',
		colorful: 'Has colors',
		link: 'Show all icons',
	},
	parent: {
		default: 'Return to previous page',
		collections: 'Return to collections list',
		collection: 'Return to {name}',
		search: 'Return to search results',
	},
	collection: {
		by: 'by ',
	},
	footer: {
		iconName: 'Selected icon:',
		iconNamePlaceholder: 'Enter icon by name...',
		remove: 'Remove {name}',
		select: 'Select {name}',
		about: 'About {title}',
	},
	footerButtons: {
		submit: 'Submit',
		change: 'Change',
		select: 'Select',
		cancel: 'Cancel',
		close: 'Close',
	},
	footerBlocks: {
		title: 'Customize icon',
		title2: 'Customize icons',
		color: 'Color',
		width: 'Width',
		height: 'Height',
		size: 'Size', // Width + height in one block
		mode: 'Mode',
		icons: 'Selected icons',
	},
	figma: {
		menu: {
			menu: 'Menu',
			import: 'Import',
			about: 'About',
		},
		submenu: {
			svg: 'Paste SVG',
			repo: 'GitHub',
		},
		window: {
			compact: 'Toggle compact layout',
			minimize: 'Minimize plugin',
			close: 'Close plugin'
		},
		minimized: {
			maximize: 'Show plugin',
			close: 'Close plugin',
		},
		layers: {
			title: 'Parent layer',
		},
		notices: {
			failed_icon: 'Error importing icon "{name}"',
			failed_icons: 'Error importing {count} icons',
		},
		windowActionTitle: {
			icon: 'After importing icon:',
			icons: 'After importing icons:',
		},
		windowAction: {
			none: 'Keep plugin window open',
			minimize: 'Minimize plugin window',
			close: 'Close plugin window',
		},
		selectAction: {
			auto: 'Automatic, depending on current selection',
			add: 'Add imported icon to current selection',
			replace: 'Select imported icon, deselect previously selected nodes',
			ignore: 'Do not select imported icons',
		},
		optionSections: {
			layout: 'Layout options',
			import: 'Import options',
			drop: 'Drag and drop options',
			dropIntro:
				'You can drag icons from plug-in to Figma instead of clicking Import button. Change options below to change drag and drop behavior.',
		},
		options: {
			compact: 'Enable compact width.',
			compactHint: 'Smaller plugin window for small laptops.',
			scroll: 'Scroll to icon when selecting new icon.',
			select: 'Select imported icon:',
			customizeDrop:
				'Apply icon customizations to drag and dropped icons.',
			dropToFrame: 'Drop to nearest frame instead of current page.',
			stickyFooter: 'Always show footer buttons.',
		},
		colorPicker: {
			document: 'Document Colors',
			recent: 'Recent Colors',
			gray: 'Gray',
			figjam: 'FigJam Colors',
		},
	},
	svg: {
		text: 'Paste SVG to import it to Figma document:',
		subtext:
			'You can also paste "data:image/svg+xml" URI and plugin will try to decode it.',
		sample: 'Sample:',
		sampleAlt: 'Sample image. You can import it or drag it to document',
		import: 'Import SVG',
		clear: 'Clear',
		invalid: 'Invalid SVG code',
		foreignObject: 'SVG contains dangerous HTML code.',
		font:
			'Looks like you are trying to import SVG font. Currently plugin does not support importing fonts.',
		animated: animatedNotice,
	},
};
