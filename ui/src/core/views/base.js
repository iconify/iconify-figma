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

const parentBlock = require('../blocks/parent');

/**
 * Get route as object
 *
 * @param {object} view
 * @return {object}
 */
function getRoute(view) {
	let route = view.route,
		result = {
			type: view.route.type,
		};

	if (view.parent) {
		result.parent = view.parent.getRoute();
	}

	Object.keys(route.params).forEach(attr => {
		let value = route.params[attr];
		if (route.defaults[attr] === value) {
			return;
		}
		if (result.params === void 0) {
			result.params = {};
		}
		result.params[attr] = value;
	});

	return result;
}

/**
 * Check if view is ready
 *
 * @param {object} view
 * @return {boolean}
 */
function ready(view) {
	if (view.loading) {
		return false;
	}
	return view.parent ? view.parent.ready() : true;
}

/**
 * Navigate to parent view
 *
 * @param {object} view Current view
 * @param {object} parent Parent view
 * @return {object}
 */
function toParent(view, parent) {
	let views = view._app ? view._app.get('views') : null;

	if (views) {
		views.setView(parent);
	}

	return parent;
}

/**
 * Create child view
 *
 * @param {object} view
 * @param {string} type
 * @param {object} params
 * @return {object|null}
 */
function childView(view, type, params) {
	let views = view._app ? view._app.get('views') : null;

	if (views) {
		let result = views.createView(type, params, view);
		views.setView(result);
		return result;
	}

	return null;
}

/**
 * Trigger event on view
 *
 * @param view
 * @param event
 */
function triggerViewEvent(view, event) {
	let events = view._app ? view._app.get('events') : null;
	if (events) {
		events.fire(event, view);
	}
}

/**
 * Create basic view
 *
 * @param {object} view
 * @param {object} [params]
 * @param {object} [parent]
 * @return {object}
 */
module.exports = (view, params, parent) => {
	view._params = Object.assign(
		{},
		params && typeof params === 'object' ? params : {}
	);
	view.parent = parent ? parent : null;

	// Add state
	view.loading = true;
	view.empty = true;

	// Internal data
	view._data = null;

	// List of blocks
	view.blocks = Object.create(null);

	// Add parent block and action
	view.blocks.parent = parentBlock(view._app, view, {
		parent: parent,
	});
	view._parentAction = value => toParent(view, value);

	// Trigger event
	view._triggerViewUpdated = () => triggerViewEvent(view, 'view-updated');
	view._triggerViewLoaded = () => triggerViewEvent(view, 'view-loaded');

	// Function to create child view
	view.createChild = (type, params) => childView(view, type, params);

	// Public functions
	view.getRoute = () => getRoute(view);
	view.ready = () => ready(view);

	/**
	 * Check if action can be handled by iconAction()
	 *
	 * @param key
	 * @return {boolean}
	 */
	view.isBasicAction = key => {
		switch (key) {
			case 'child':
			case 'pagination':
			case 'globalSearch':
			case 'parent':
				return true;
		}
		return false;
	};

	/**
	 * Apply common action
	 *
	 * @param key
	 * @param value
	 * @param optional
	 * @return {*}
	 */
	view.basicAction = (key, value, optional) => {
		switch (key) {
			case 'child':
				// Create custom child
				return childView(view, value.type, value.params);

			case 'pagination':
				// Change pagination
				view.route.params.page = typeof value === 'number' ? value : 0;
				view._triggerViewUpdated();
				break;

			case 'globalSearch':
				// Search all icons
				let newView;
				switch (parent.type) {
					case 'collection':
					case 'custom':
						newView = parent.action('globalSearch', value, optional);
						break;

					default:
						newView = parent.action('search', value, optional);
				}
				if (optional === true) {
					// Change 'value', not 'keyword'
					view.blocks.globalSearch.value = value;
					break;
				}
				return newView;

			case 'parent':
				if (!value) {
					return null;
				}
				return view._parentAction(value);
		}

		return view;
	};

	return view;
};
