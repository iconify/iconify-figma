/**
 * This file is part of the @iconify/icon-finder package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */
'use strict';

/**
 * List of optional properties that could be referenced by both string or array and have multiple properties
 *
 * @type {*[]}
 */
const extraArrays = [
	{
		str: 'tag',
		arr: 'tags',
	},
	{
		str: 'alias',
		arr: 'aliases',
	},
	{
		str: 'char',
		arr: 'chars',
	},
];

/**
 * List of optional properties that are strings
 *
 * @type {string[]}
 */
const extraStrings = ['themePrefix', 'themeSuffix'];

/**
 * List of properties that are arrays and should have unique values
 *
 * @type {string[]}
 */
const uniqueArrays = ['tags', 'aliases', 'chars'];

/**
 * Split icon name
 *
 * @param {string} name
 * @return {object}
 */
function splitIconName(name) {
	let parts = name.split(':');
	if (parts.length === 2) {
		return {
			prefix: parts[0],
			name: parts[1],
		};
	}

	parts = name.split('-');
	if (parts.length > 1) {
		return {
			prefix: parts.shift(),
			name: parts.join('-'),
		};
	}

	// invalid entry?
	return {
		prefix: '',
		name: name,
	};
}

/**
 * Get icon as object
 *
 * @param {object|string} params
 * @return {null|{prefix: string, name: string, tags: Array, themePrefix: string, themeSuffix: string, aliases: Array, chars: Array}}
 */
module.exports = params => {
	let icon = {
		prefix: '',
		name: '',
	};

	if (typeof params === 'string') {
		// Icon as name
		let name = splitIconName(params);
		icon.prefix = name.prefix;
		icon.name = name.name;
		return icon;
	}

	// Not object or missing required 'name'
	if (typeof params !== 'object' || params.name === void 0) {
		return null;
	}

	if (params.prefix === void 0) {
		// Get icon name from name
		let name = splitIconName(params.name);
		icon.prefix = name.prefix;
		icon.name = name.name;
	} else {
		icon.prefix = params.prefix;
		icon.name = params.name;
	}

	// Add extra parameters that could be array or string
	extraArrays.forEach(attr => {
		if (typeof params[attr.arr] === 'string') {
			icon[attr.arr] = [params[attr.arr]];
		} else if (params[attr.arr] instanceof Array) {
			icon[attr.arr] = params[attr.arr].slice(0);
		} else if (typeof params[attr.str] === 'string') {
			icon[attr.arr] = [params[attr.str]];
		}
	});

	// Add extra string parameters
	extraStrings.forEach(attr => {
		if (typeof params[attr] === 'string') {
			icon[attr] = params[attr];
		}
	});

	// Check that array values are unique and not empty
	uniqueArrays.forEach(attr => {
		if (icon[attr] instanceof Array && icon[attr].length > 0) {
			icon[attr] = icon[attr].filter(
				(value, index, self) =>
					value.length > 0 && self.indexOf(value) === index
			);
		}
	});

	return icon;
};
