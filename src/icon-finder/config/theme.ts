import { addCollection } from '@iconify/svelte';

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
const prefix = 'icon-finder-theme';
export function importThemeIcons() {
	addCollection({
		prefix,
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
				body:
					'<rect width="12" height="12" rx="2" fill="currentColor"/>',
			},
			'angle': {
				body:
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M2 2v8h8V9H7c0-2.21-1.79-4-4-4V2H2zm1 4v3h3a3 3 0 00-3-3z" fill="currentColor"/>',
			},
			/*
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
			*/
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
			'confirm2': {
				body:
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M3.176 7.824L5.06 9.706l3.764-3.765L10 7.118l-4.941 4.941L2 9l1.176-1.176zM3.176 1.824L5.06 3.706 8.824-.059 10 1.118 5.059 6.059 2 3l1.176-1.176z" fill="currentColor"/>',
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
			'ext-link': {
				body:
					'<g fill="none" stroke="currentColor"><path d="M8.5 7v3.5h-7v-7H5" /><path stroke-linecap="square" d="M10 2L5 7M6.5 1.5h4V5" /></g>',
			},
		},
		aliases: {
			'up': {
				parent: 'down',
				vFlip: true,
			},
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

	// Bigger icons, used mostly for navigation
	addCollection({
		prefix,
		icons: {
			menu: {
				body:
					'<path d="M16 13H2v1h14v-1zm0-5H2v1h14V8zm0-5H2v1h14V3z" fill-rule="nonzero" fill="currentColor" stroke="none" />',
			},
			heart: {
				body:
					'<path d="M17 6c0 5-6 10-8 11-2-1-8-6-8-11C1 2 6.5.5 9 3.5 11.5.5 17 2 17 6z" fill="currentColor"/>',
			},
			trash: {
				body:
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M8 2a1 1 0 00-1 1h4a1 1 0 00-1-1H8zm4 1a2 2 0 00-2-2H8a2 2 0 00-2 2H3v1h1v10a2 2 0 002 2h6a2 2 0 002-2V4h1V3h-3zm1 1H5v10a1 1 0 001 1h6a1 1 0 001-1V4zm-6 7V7h1v4H7zm3 0V7h1v4h-1z" fill="currentColor"/>',
			},
			minimize: {
				body:
					'<path stroke="currentColor" d="M2.5 3.5h13v3h-13z"/><path fill="currentColor" d="M15 9h1v2h-1zM2 9h1v2H2zM6 14h2v1H6zM10 14h2v1h-2zM2 13h1v1h1v1H2v-2zM15 13h1v2h-2v-1h1v-1z"/>',
			},
			compact: {
				body:
					'<path d="M3 2h8v2h-1V3H4v12h6v-1h1v2H3V2zM14 6h1v2h-1zM15 4V2h-2v1h1v1h1zM14 10h1v2h-1zM14 14h1v2h-2v-1h1v-1z" fill="currentColor"/><path fill="currentColor" d="M10 6h1v2h-1zM10 10h1v2h-1z"/>',
			},
			check: {
				body:
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M14.207 6.207l-5.5 5.5-.707.707-.707-.707-3-3 1.414-1.414L8 9.586l4.793-4.793 1.414 1.414z" fill="currentColor"/>',
			},
		},
		width: 18,
		height: 18,
	});

	// Layers list
	addCollection({
		prefix,
		icons: {
			'page': {
				body:
					'<path d="M3.5 10.5h5l4 4v7h-9v-11z" stroke="currentColor" fill="none"/>',
			},
			'frame': {
				body:
					'<path d="M2.5 13.5h11m-11 5h11m-8-8v11m5-11v11" fill="none" stroke-linecap="square" stroke="currentColor"/>',
			},
			'group': {
				body:
					'<g fill="none" stroke="currentColor"><path d="M4.5 20.5h-1v-1m0-7v-1h1l-1 1zm8-1h1v1l-1-1zm1 8v1h-1l1-1z"/><path d="M12.5 15v2M7 11.5h2-2zm0 9h2-2zM3.5 15v2-2z" stroke-linecap="square"/></g>',
			},
			'component': {
				body:
					'<path d="M8 9l7 7-7 7-7-7 7-7z" stroke="currentColor" fill="none"/>',
			},
			'frame-h': {
				body:
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M6 12.5H3v7h3v-7zm7 0h-3v7h3v-7zm-11-1v9h5v-9H2zm7 0v9h5v-9H9z" fill="currentColor"/>',
			},
			'frame-v': {
				body:
					'<path fill-rule="evenodd" clip-rule="evenodd" d="M4 18v3h8v-3H4zm0-7v3h8v-3H4zm-1 4h10v-5H3v5zm0 7h10v-5H3v5z" fill="currentColor"/>',
			},
		},
		width: 16,
		height: 32,
	});
}

/**
 * Icons used by UI
 */
export const icons: Record<string, string | null> = {
	'reset': prefix + ':reset',
	'search': prefix + ':search',
	'up': prefix + ':up',
	'down': prefix + ':down',
	'left': prefix + ':left',
	'right': prefix + ':right',
	'parent': prefix + ':parent',
	'expand': prefix + ':right',
	'grid': prefix + ':grid',
	'list': prefix + ':list',
	'check-list': prefix + ':confirm2',
	'check-list-checked': prefix + ':reset',
	'error-loading': prefix + ':error-loading',
	'icon-width': prefix + ':icon-width',
	'icon-height': prefix + ':icon-height',
	'color': prefix + ':color',
	'color-filled': prefix + ':color-filled',
	'angle': prefix + ':angle',
	// 'rotate0': prefix + ':reset',
	// 'rotate1': prefix + ':rotate1',
	// 'rotate2': prefix + ':rotate2',
	// 'rotate3': prefix + ':rotate3',
	'h-flip': prefix + ':h-flip',
	'v-flip': prefix + ':v-flip',
	'plus': prefix + ':plus',
	'link': prefix + ':link',
	'clipboard': prefix + ':clipboard',
	'confirm': prefix + ':confirm',
	'docs': prefix + ':docs',
	'mode-block': prefix + ':mode-block',
	'mode-inline': prefix + ':mode-inline',
	'selecting-selected': prefix + ':confirm',
	'selecting-unselected': prefix + ':empty',
	'trash': prefix + ':trash',
	'check': prefix + ':check',

	// Layers list
	'layer.page': prefix + ':page',
	'layer.frame': prefix + ':frame',
	'layer.group': prefix + ':group',
	'layer.component': prefix + ':component',
	'layer.instance': prefix + ':component',
	'layer.h': prefix + ':frame-h',
	'layer.v': prefix + ':frame-v',

	// Navigation
	'menu': prefix + ':menu',
	'ext-link': prefix + ':ext-link',
	'minimize': prefix + ':minimize',
	'compact': prefix + ':compact',
	'import.bookmarks': prefix + ':heart',
};

/**
 * Class to add to icons
 */
export const iconsClass: string = 'iconify--line-md';
