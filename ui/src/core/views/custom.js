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
const iconFunctions = require('./icons');
const iconObject = require('../objects/icon');

const searchBlock = require('../blocks/search');
const iconsBlock = require('../blocks/icons');
const paginationBlock = require('../blocks/pagination');

const searches = ['name', 'chars', 'aliases'];

module.exports = (instance, params, parent) => {
	let view = base(
		{
			_app: instance,
			type: 'custom',
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

		let icons = view._data.icons.slice(0);

		// Search
		icons = view.searchIcons(icons, ['prefix']);

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

		switch (key) {
			case 'delete':
				if (!view._params.canDelete) {
					break;
				}

				let icon = iconObject(value);

				// Remove icon from list
				view._data.icons = view._data.icons.filter(
					item => item.prefix !== icon.prefix || item.name !== icon.name
				);
				if (view._data.icons.length !== view.total) {
					// Update counters
					view.total = view._data.icons.length;
					view.empty = view.total < 1;

					let events = instance.get('events');

					// Fire event to notify that icon was deleted
					events.fire('delete-' + view.customType, icon);

					// Fire event to store updated list (alternative to delete- event)
					events.fire('update-' + view.customType, view._data.icons.slice(0));

					// Update view
					view._triggerViewUpdated();
				}
				break;
		}

		return view;
	};

	/*
        Convert route parameters to parameters
     */
	if (view._params.routeParams) {
		['customType', 'canDelete', 'search', 'page'].forEach(attr => {
			view._params[attr] = view._params.routeParams[attr];
		});
		delete view._params.routeParams;
	}

	// Copy customType for public access
	view.customType = view._params.customType;
	view.canDelete = view._params.canDelete === true;

	/*
        Create route
     */
	let routeParams = {
		customType: view.customType,
		search:
			typeof view._params.search === 'string'
				? view._params.search
				: parent && parent.route && parent.route.params.search
				? parent.route.params.search
				: '',
		page: typeof view._params.page === 'number' ? view._params.page : 0,
		canDelete: view.canDelete,
	};
	let routeDefaults = {
		search: '',
		page: 0,
		canDelete: false,
	};
	view.route = route('custom', routeParams, routeDefaults);

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

	view.blocks.icons = iconsBlock(instance, view, {});
	view.blocks.pagination = paginationBlock(instance, view, {});

	/*
        Load data
     */
	view.sync = () => {
		let events = instance.get('events');

		// Fire load-{customType} event with callback as parameter
		events.fire(
			'load-' + view.customType,
			data => {
				if (!(data instanceof Array)) {
					return;
				}

				view.loading = false;

				// Set data as icons array
				view._data = {
					icons: data
						.map(icon => iconObject(icon))
						.filter(icon => icon !== null),
				};

				// Empty
				view.total = view._data.icons.length;
				view.empty = view.total < 1;

				// Notify that view has been loaded
				view._triggerViewLoaded();
			},
			true
		);
	};
	view.sync();

	return view;
};
