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

const Storage = require('./storage');

const itemsPerPage = 52;

/**
 * Get Storage instance for configuration
 *
 * @param {string} instance Search instance
 * @return {Storage}
 */
module.exports = instance => {
	let result = new Storage({
		// API
		API: {
			URI: 'https://api.iconify.design/',
			retry: 5000,
		},

		// Views
		viewLoadingDelay: 300,
		setRouteTimeout: 5000,

		// Pagination
		itemsPerPage: itemsPerPage,
		search: {
			limit: itemsPerPage * 2,
			fullLimit: 999,
		},

		// Links
		links: {
			collection: 'https://iconify.design/icon-sets/{prefix}/',
			icon: 'https://iconify.design/icon-sets/{prefix}/{name}.html',
		},
	});

	if (instance.params && instance.params.config) {
		result.merge(instance.params.config);
	}

	return result;
};
