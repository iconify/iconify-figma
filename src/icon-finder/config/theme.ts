import Iconify from '@iconify/iconify';

/**
 * Maximum color index (number of colors in rotation - 1)
 *
 * See _rotation.scss in style directory
 */
export const maxIndex = 9;

/**
 * Collections list options
 */
// Show author link. Disable if whole block should be clickable
export const showCollectionAuthorLink = true;

// True if entire collection block should be clickable
export const collectionClickable = false;

/**
 * Import custom icons
 */
const customIconsPrefix = 'icon-finder-theme';
Iconify.addCollection({
	prefix: customIconsPrefix,
	icons: {
		'reset': {
			body:
				'<path d="M6 5.293l4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294v-.001z" fill="currentColor"/>',
		},
		'search': {
			body:
				'<path fill-rule="evenodd" clip-rule="evenodd" d="M7.453 8.16a4 4 0 11.707-.707l3.194 3.193-.707.707L7.452 8.16zM8 5a3 3 0 11-6 0 3 3 0 016 0z" fill="currentColor"/>',
		},
		'down': {
			body:
				'<path fill-rule="evenodd" clip-rule="evenodd" d="M5.646 7.354l-3-3 .708-.708L6 6.293l2.646-2.647.708.708-3 3L6 7.707l-.354-.353z" fill="currentColor"/>',
		},
		'grid': {
			body:
				'<path d="M1 1h2v2H1V1zm4 0h2v2H5V1zm4 0h2v2H9V1zM1 5h2v2H1V5zm4 0h2v2H5V5zm4 0h2v2H9V5zM1 9h2v2H1V9zm4 0h2v2H5V9zm4 0h2v2H9V9z" fill="currentColor"/>',
		},
		'list': {
			body:
				'<path d="M1 1h10v2H1V1zm0 4h10v2H1V5zm0 4h10v2H1V9z" fill="currentColor"/>',
		},
		'error-loading': {
			body:
				'<g clip-path="url(#clip0)"><path d="M9.9.2l-.2 1C12.7 2 15 4.7 15 8c0 3.9-3.1 7-7 7s-7-3.1-7-7c0-3.3 2.3-6 5.3-6.8l-.2-1C2.6 1.1 0 4.3 0 8c0 4.4 3.6 8 8 8s8-3.6 8-8c0-3.7-2.6-6.9-6.1-7.8z" fill="currentColor"/></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs>',
			width: 16,
			height: 16,
		},
		'icon-height': {
			body:
				'<path d="M5.5 0L8.5 3L7.5 4L6 2.5V9.5L7.5 8L8.5 9L5.5 12L2.5 9L3.5 8L5 9.5V2.5L3.5 4L2.5 3L5.5 0Z" fill="currentColor"/>',
		},
		'color': {
			body:
				'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.002 1.002l.693.718C8.898 4.012 10 5.294 10 6.852a4.199 4.199 0 01-1.172 2.936 3.906 3.906 0 01-5.656 0A4.199 4.199 0 012 6.852c0-1.558 1.102-2.84 3.305-5.132L6 1.002V1l.003.002zm-2.197 3.91C4.307 4.23 5.024 3.456 6 2.44c.976 1.017 1.693 1.79 2.195 2.471.6.814.805 1.38.805 1.94v.003c0 .049 0 .098-.003.146H3.003A3.37 3.37 0 013 6.854v-.002c0-.56.205-1.128.805-1.94z" fill="currentColor"/>',
		},
		'color-filled': {
			body: '<rect width="12" height="12" rx="2" fill="currentColor"/>',
		},
		'rotate1': {
			body:
				'<g fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 6a3 3 0 00-3-3V2a4 4 0 014 4v1H9V6z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 6.793L7.854 5.146l-.708.708L9.5 8.207l2.354-2.353-.708-.708L9.5 6.793z"/></g>',
		},
		'rotate2': {
			body:
				'<g fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 6a3 3 0 00-3-3V2a4 4 0 110 8H5V9h1a3 3 0 003-3z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.207 9.5l1.647-1.646-.708-.708L3.793 9.5l2.353 2.354.708-.708L5.207 9.5z"/></g>',
		},
		'rotate3': {
			body:
				'<g fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 6a3 3 0 00-3-3V2a4 4 0 11-4 4V4.833h1V6a3 3 0 006 0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 3.793l2.354 2.353-.708.708L2.5 5.207.854 6.854l-.708-.708L2.5 3.793z"/></g>',
		},
		'plus': {
			body:
				'<path d="M5.5 5.5V0.5H6.5V5.5H11.5V6.5H6.5V11.5H5.5V6.5H0.5V5.5H5.5Z" fill="currentColor"/>',
		},
		'link': {
			body:
				'<g fill="currentColor"><path d="M10.293 1H6V0h6v6h-1V1.707L5.354 7.354l-.708-.708L10.293 1z"/><path d="M0 2h5v1H1v8h8V8h1v4H0V2z"/></g>',
		},
		'clipboard': {
			body:
				'<path d="M4 0h4v1h3v11H1V1h3V0zm0 2H2v9h8V2H8v1H4V2zm3-1H5v1h2V1z" fill="currentColor"/>',
		},
		'confirm': {
			body:
				'<path d="M3.176 4.824L5.06 6.706l3.764-3.765L10 4.118 5.059 9.059 2 6l1.176-1.176z" fill="currentColor"/>',
		},
		'docs': {
			body:
				'<g fill="currentColor"><path d="M2 1h5.207L10 3.793V12H2V1zm1 1v9h6V4.207L6.793 2H3z"/><path d="M8 9H4V8h4v1zM8 7H4V6h4v1z"/></g>',
		},
		'mode-block': {
			body:
				'<g fill="currentColor"><path d="M2 2h1.375v1H3v.375H2V2zm3.125 0h1.75v1h-1.75V2zm3.5 0H10v1.375H9V3h-.375V2zM2 6.875v-1.75h1v1.75H2zm8-1.75v1.75H9v-1.75h1zm-8 3.5h1V9h.375v1H2V8.625zm8 0V10H8.625V9H9v-.375h1zM6.875 10h-1.75V9h1.75v1z"/><path d="M12 10H0V9h12v1zM12 6H0V5h12v1z"/></g>',
		},
		'mode-inline': {
			body:
				'<g fill="currentColor"><path d="M2 2h1.375v1H3v.375H2V2zm3.125 0h1.75v1h-1.75V2zm3.5 0H10v1.375H9V3h-.375V2zM2 6.875v-1.75h1v1.75H2zm8-1.75v1.75H9v-1.75h1zm-8 3.5h1V9h.375v1H2V8.625zm8 0V10H8.625V9H9v-.375h1zM6.875 10h-1.75V9h1.75v1z"/><path d="M12 9H0V8h12v1zM12 4H0V3h12v1z"/></g>',
		},
		'empty': {
			body: '',
		},
	},
	aliases: {
		'left': {
			parent: 'down',
			rotate: 1,
		},
		'right': {
			parent: 'down',
			rotate: 3,
		},
		'parent': {
			parent: 'down',
			rotate: 1,
		},
		'icon-width': {
			parent: 'icon-height',
			rotate: 3,
		},
		'h-flip': {
			parent: 'icon-height',
			rotate: 3,
		},
		'v-flip': {
			parent: 'icon-height',
		},
	},
	width: 12,
	height: 12,
});

/**
 * Icons used by UI
 */
export const icons: Record<string, string | null> = {
	'reset': customIconsPrefix + ':reset',
	'search': customIconsPrefix + ':search',
	'down': customIconsPrefix + ':down',
	'left': customIconsPrefix + ':left',
	'right': customIconsPrefix + ':right',
	'parent': customIconsPrefix + ':parent',
	'grid': customIconsPrefix + ':grid',
	'list': customIconsPrefix + ':list',
	'check-list': 'line-md:check-list-3-solid',
	'check-list-checked': 'line-md:check-list-3-twotone',
	'error-loading': customIconsPrefix + ':error-loading',
	'icon-width': customIconsPrefix + ':icon-width',
	'icon-height': customIconsPrefix + ':icon-height',
	'color': customIconsPrefix + ':color',
	'color-filled': customIconsPrefix + ':color-filled',
	'rotate0': customIconsPrefix + ':reset',
	'rotate1': customIconsPrefix + ':rotate1',
	'rotate2': customIconsPrefix + ':rotate2',
	'rotate3': customIconsPrefix + ':rotate3',
	'h-flip': customIconsPrefix + ':h-flip',
	'v-flip': customIconsPrefix + ':v-flip',
	'plus': customIconsPrefix + ':plus',
	'link': customIconsPrefix + ':link',
	'clipboard': customIconsPrefix + ':clipboard',
	'confirm': customIconsPrefix + ':confirm',
	'docs': customIconsPrefix + ':focs',
	'mode-block': customIconsPrefix + ':mode-block',
	'mode-inline': customIconsPrefix + ':mode-inline',
	'selecting-selected': 'line-md:confirm',
	'selecting-unselected': customIconsPrefix + ':empty',
};

/**
 * Class to add to icons
 */
export const iconsClass: string = '';
