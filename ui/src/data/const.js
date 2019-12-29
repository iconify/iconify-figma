'use strict';

/**
 * Constants shared between different components
 *
 * @type {{pages: string[], alignX: string[], alignY: string[]}}
 */
module.exports = {
	// List of pages that use Icon Finder core
	pages: ['iconify', 'recent', 'bookmarks'],

	// Options for horizontal alignment
	alignX: ['left', 'center', 'right'],

	// Options for vertical alignment
	alignY: ['top', 'middle', 'bottom'],

	// Options for selecting nodes after import
	selectNodes: ['add', 'replace', 'none'],
};
