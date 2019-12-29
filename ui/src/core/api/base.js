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
 * Cached data
 *
 * @type {object}
 */
let cache = {};

/**
 * Default options
 *
 * @type {object}
 */
const defaultOptions = {
	cache: true,
	retry: true,
	cacheKey: null,
	log: false,
};

module.exports = instance => {
	let api = {
		_app: instance,
		_defaultOptions: Object.assign({}, defaultOptions),
		_version: 2,

		/**
		 * Send query
		 *
		 * @param {string} query
		 * @param {object} params
		 * @param {function} callback
		 * @param {object} [options]
		 */
		load: (query, params, callback, options) => {
			options = Object.assign(
				{},
				api._defaultOptions,
				typeof options === 'object' ? options : {}
			);

			let cacheKey =
				options.cacheKey === null
					? api.cacheKey(query, params)
					: options.cacheKey;
			if (options.cache && api.cached(cacheKey)) {
				// Already cached
				callback(JSON.parse(api._cache[cacheKey]));
				return;
			}

			let loading = true,
				config = api._app.get('config');

			// Create URI
			let uri = config.get('API.URI') + query;
			if (params.version === void 0) {
				uri = api._appendToURI(uri, 'version', api._version);
			}
			Object.keys(params).forEach(param => {
				uri = api._appendToURI(uri, param, params[param]);
			});

			// Check if script should retry query on failure
			let timer = null,
				retry = options.retry ? config.get('API.retry') : false;

			let get = () => {
				let isSync = true;

				api._get(uri, data => {
					if (!loading) {
						return;
					}
					loading = false;
					if (timer !== null) {
						clearTimeout(timer);
						timer = null;
					}

					if (typeof data === 'string') {
						try {
							data = JSON.parse(data);
						} catch (err) {
							console.error('Error parsing JSON data');
							if (isSync) {
								setTimeout(() => {
									callback(null);
								});
							} else {
								callback(null);
							}
							return;
						}
					}

					if (options.cache && data !== null) {
						api._cache[cacheKey] = JSON.stringify(data);
					}

					if (isSync) {
						setTimeout(() => {
							callback(data);
						});
					} else {
						callback(data);
					}
				});

				isSync = false;
			};

			// Create timer for retry
			if (retry) {
				timer = setTimeout(() => {
					timer = null;
					if (!loading) {
						return;
					}

					// Send query again
					get();
				}, retry);
			}

			// Log query
			if (options.log) {
				console.log('Iconify API Query:', uri);
			}

			// Send query
			get();
		},

		/**
		 * Reset cache
		 */
		reset: () => (api._cache = cache[api._app.namespace] = Object.create(null)),

		/**
		 * Change default option for API call, used for debugging
		 *
		 * @param key
		 * @param value
		 */
		setDefaultOption: (key, value) => (api._defaultOptions[key] = value),

		/**
		 * Get cache key for query
		 *
		 * @param query
		 * @param params
		 * @return {string}
		 */
		cacheKey: (query, params) => query + '?' + JSON.stringify(params),

		/**
		 * Check if data has been cached
		 *
		 * @param key
		 * @return {boolean}
		 */
		cached: key => api._cache[key] !== void 0,

		/**
		 * Add parameter to URI
		 *
		 * @param {string} uri
		 * @param {string} key
		 * @param {string|number} value
		 * @return {string}
		 * @private
		 */
		_appendToURI: (uri, key, value) =>
			uri +
			(uri.indexOf('?') !== -1 ? '&' : '?') +
			key +
			'=' +
			encodeURIComponent(value),
	};

	if (cache[instance.namespace] === void 0) {
		cache[instance.namespace] = Object.create(null);
	}
	api._cache = cache[instance.namespace];

	return api;
};
