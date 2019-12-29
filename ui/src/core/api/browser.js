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

let baseAPI = require('./base');

/**
 * Generate number for string
 *
 * @param {string} str
 * @return {number}
 */
function hash(str) {
	let total = 0,
		i;

	for (i = str.length - 1; i >= 0; i--) {
		total += str.charCodeAt(i);
	}

	return total % 999;
}

module.exports = instance => {
	let api = baseAPI(instance);

	/**
	 * Send request
	 *
	 * @param {string} uri
	 * @param {function} callback
	 * @private
	 */
	api._get = (uri, callback) => {
		if (window.IconifySearch === void 0) {
			window.IconifySearch = {};
		}

		let obj = window.IconifySearch,
			counter = hash(uri),
			func;

		while (true) {
			func = 'cb' + counter;
			if (obj[func] === void 0) {
				break;
			}
			counter++;
		}

		uri = api._appendToURI(uri, 'callback', 'IconifySearch.' + func);

		obj[func] = function(data) {
			delete obj[func];
			callback(data);
		};

		// Create script
		let script = document.createElement('script');
		script.setAttribute('async', true);
		script.setAttribute('src', uri);
		document.head.appendChild(script);
	};

	return api;
};
