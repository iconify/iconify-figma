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

const base = require('./base');
const route = require('../objects/route');
const helpers = require('../helpers/collection');
const filters = require('../data/icon-filters');
const iconFunctions = require('./icons');

const searchBlock = require('../blocks/search');
const filtersBlock = require('../blocks/filters');
const iconsBlock = require('../blocks/icons');
const paginationBlock = require('../blocks/pagination');

module.exports = (instance, params, parent) => {
	let view = base(
		{
			_app: instance,
			type: 'collection',
			prefix: params.prefix,
			multipleFilters: false,
		},
		params,
		parent
	);

	// Add icon functions
	view = iconFunctions(view);

	/**
	 * Get items without applying pagination
	 *
	 * @return {Array} Array of items
	 */
	view.renderWithoutPage = () => {
		if (view.loading) {
			return [];
		}

		// Update collections filter
		if (
			!view.blocks.collections &&
			view.parent &&
			view.parent.type === 'search'
		) {
			view.blocks.collections.setFilters(view.parent.getCollectionFilters());
		}

		let icons = view._data.icons.slice(0);

		// Search
		icons = view.searchIcons(icons);

		// Toggle filter visibility
		filters.forEach(filter => {
			if (!view.blocks[filter.key] || view.blocks[filter.key].empty()) {
				return;
			}

			let block = view.blocks[filter.key];
			block.enableAll();

			// Check each filter
			Object.keys(block.filters).forEach(match => {
				// Find matching icons
				let key = filter.icon,
					i,
					value;

				for (i = icons.length - 1; i >= 0; i--) {
					value = icons[i][key];

					if (value === void 0 || value === null) {
						continue;
					}

					if (typeof value === 'string') {
						if (value === match) {
							return;
						}
						continue;
					}
					if (value instanceof Array) {
						if (key === 'tags' && match === '' && !value.length) {
							// Uncategorized
							return;
						}
						if (value.indexOf(match) !== -1) {
							return;
						}
					}
				}

				// No matches
				block.disable(match);
			});

			// No matches
			// if (block.disabled.length >= Object.keys(block.filters).length) {
			//     block.enableAll();
			// }
		});

		// Apply filters
		filters.forEach(filter => {
			if (view.route.params[filter.route] === null) {
				return;
			}
			let match = view.route.params[filter.route];

			icons = icons.filter(icon => {
				let value = icon[filter.icon];

				if (value === void 0 || value === null) {
					return false;
				}
				if (typeof value === 'string') {
					return value === match;
				}
				if (value instanceof Array) {
					if (!value.length && match === '' && filter.icon === 'tags') {
						// Uncategorized
						return true;
					}
					return value.indexOf(match) !== -1;
				}
				return false;
			});
		});

		return icons;
	};

	/**
	 * Apply action
	 *
	 * @param {string} key Action key
	 * @param {*} value Action value, type is specific to action
	 * @param {*} [optional] Optional parameter
	 * @return {object|null} View to display, might be different than current view. Null on error
	 */
	view.action = (key, value, optional) => {
		if (view.isBasicAction(key)) {
			return view.basicAction(key, value, optional);
		}
		if (view.isIconsAction(key)) {
			return view.iconsAction(key, value, optional);
		}

		let block;

		switch (key) {
			default:
				// Filter
				let filter = filters.filter(item => item.key === key);
				if (!filter.length) {
					break;
				}

				filter = filter[0];
				block = view.blocks[filter.key];

				// Change filter
				if (!block) {
					return null;
				}

				let activeCounter = block.active.length;

				block.toggle(value);
				view.route.params[filter.route] = block.getActive();
				if (block.active.length !== activeCounter) {
					// Reset pagination
					view.route.params.page = 0;
				}
				view._triggerViewUpdated();
		}

		return view;
	};

	/*
        Convert route parameters to parameters
     */
	if (view._params.routeParams) {
		['prefix', 'search', 'page'].forEach(attr => {
			view._params[attr] = view._params.routeParams[attr];
			if (attr === 'prefix') {
				view.prefix = view._params.routeParams[attr];
			}
		});
		filters.forEach(filter => {
			view._params[filter.route] = view._params.routeParams[filter.route];
		});
		delete view._params.routeParams;
	}

	/*
        Create route
     */
	let routeParams = {
		prefix: view._params.prefix,
		search:
			typeof view._params.search === 'string'
				? view._params.search
				: parent && parent.route && parent.route.params.search
				? parent.route.params.search
				: '',
		page: typeof view._params.page === 'number' ? view._params.page : 0,
	};
	let routeDefaults = {
		search: '',
		page: 0,
	};
	filters.forEach(filter => {
		routeParams[filter.route] =
			typeof view._params[filter.route] === 'string'
				? view._params[filter.route]
				: null;
		routeDefaults[filter.route] = null;
	});
	view.route = route('collection', routeParams, routeDefaults);

	/*
        Add blocks
     */
	let hasDoubleSearch = false;
	if (view.parent) {
		// && view.parent.type === 'search') {
		hasDoubleSearch = true;
		view.blocks.globalSearch = searchBlock(instance, view, {
			name: 'globalSearch',
			keyword: view.parent.route.params.search,
			showTitle: true,
		});
	}

	view.blocks.search = searchBlock(instance, view, {
		keyword: view.route.params.search,
		prefix: view.prefix,
		showTitle: hasDoubleSearch,
	});

	view.blocks.collections =
		view.parent && view.parent.type === 'search'
			? filtersBlock(instance, view, {
					filtersType: 'collections',
					filters: view.parent.getCollectionFilters(),
					active: [view.prefix],
			  })
			: null;

	filters.forEach(filter => {
		view.blocks[filter.key] = filtersBlock(instance, view, {
			filtersType: filter.key,
			filters: [],
		});
	});

	view.blocks.icons = iconsBlock(instance, view, {});
	view.blocks.pagination = paginationBlock(instance, view, {});

	// Start loading if this view is active
	if (instance.startLoading !== void 0) {
		instance.startLoading();
	}

	/*
        Load data
     */
	let api = instance.get('api');
	api.load(
		'collection',
		{
			prefix: view.prefix,
			info: true,
			chars: true,
			aliases: true,
		},
		data => {
			let filtersCount =
					view.blocks.collections && !view.blocks.collections.empty() ? 1 : 0,
				index = 0;

			view.loading = false;

			// Parse API data
			view._data = helpers.convert(data);

			// Set filters
			filters.forEach(filter => {
				if (view._data[filter.key]) {
					view.blocks[filter.key] = filtersBlock(instance, view, {
						filtersType: filter.key,
						filters: view._data[filter.key],
						setActive: view.route.params[filter.route],
						index: index,
					});
					view.route.params[filter.route] = view.blocks[filter.key].getActive();

					filtersCount++;
					index += Object.keys(view.blocks[filter.key].filters).length;
				} else {
					view.route.params[filter.route] = null;
				}
			});

			// Filters count
			view.multipleFilters = filtersCount > 1;

			// Empty
			view.total = view._data.icons.length;
			view.empty = view.total < 1;

			// Notify that view has been loaded
			view._triggerViewLoaded();
		}
	);

	return view;
};
