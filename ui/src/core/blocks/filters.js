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

/**
 * Check if block is empty
 *
 * @param {object} block
 * @return {boolean}
 */
function empty(block) {
	return Object.keys(block.filters).length < 2;
}

/**
 * Toggle filter
 *
 * @param {object} block
 * @param {string} key
 * @param {boolean} [setValue]
 */
function toggle(block, key, setValue) {
	if (typeof setValue === 'boolean') {
		let isSet = block.active.indexOf(key) !== -1;
		if (isSet === setValue) {
			return isSet;
		}
	}

	// Unset filter
	if (block.active.indexOf(key) !== -1) {
		block.active = block.active.filter(item => item !== key);
		return false;
	}

	// Change filter
	if (!block.multiple) {
		block.active = [key];
		return true;
	}

	// Add filter
	block.active.push(key);
	if (block.active.length === Object.keys(block.filters).length) {
		block.active = [];
		return false;
	}
	return true;
}

/**
 * Convert filters to object
 *
 * @param {object} filters
 * @return {object}
 */
function setFilters(filters) {
	if (typeof filters !== 'object') {
		return Object.create(null);
	}

	if (filters instanceof Array) {
		let result = Object.create(null);
		filters.forEach(key => {
			result[key] = key;
		});
		return result;
	}

	return filters;
}

/**
 * Set active value from string
 *
 * @param block
 * @param value
 */
function setActive(block, value) {
	if (typeof value === 'string') {
		value = value.split(',');
	} else if (!(value instanceof Array)) {
		value = [];
	}

	if (value.length) {
		let keys = Object.keys(block.filters);
		value = value.filter(item => keys.indexOf(item) !== -1);
	}

	block.active = block.multiple
		? value
		: value.length > 1
		? [value.shift()]
		: value;
}

/**
 * Get active value as string
 *
 * @param block
 * @return {string|null}
 */
function getActive(block) {
	return block.active.length ? block.active.join(',') : null;
}

/**
 * Mark filter as disabled
 *
 * @param block
 * @param key
 */
function disable(block, key) {
	if (!(block.disabled instanceof Array)) {
		block.disabled = [key];
		return;
	}
	if (block.disabled.indexOf(key) === -1) {
		block.disabled.push(key);
	}
}

/**
 * Create block
 *
 * @param {object} instance Search object
 * @param {object} view Parent view
 * @param {object} params Block parameters
 * @return {Object|block}
 */
module.exports = (instance, view, params) => {
	let filtersType =
		typeof params.filtersType === 'string' ? params.filtersType : '';

	let block = base({
		app: instance,
		view: view,

		// Required stuff
		type: 'filters',
		keys: ['filtersType', 'filters', 'active', 'multiple', 'index'],
		name: filtersType,

		// Data
		filtersType: filtersType,
		filters: setFilters(params.filters),
		active: params.active instanceof Array ? params.active.slice(0) : [],
		multiple: params.multiple === true,
		index: typeof params.index === 'number' ? params.index : 0,
		disabled:
			typeof params.disabled === 'object' && params.disabled instanceof Array
				? params.disabled.slice(0)
				: [],

		// Functions
		empty: () => empty(block),
		setFilters: filters => {
			block.filters = setFilters(filters);
		},
		toggle: key => toggle(block, key),
		select: key => toggle(block, key, true),
		deselect: key => toggle(block, key, false),
		getActive: () => getActive(block),
		enableAll: () => (block.disabled = []),
		disable: key => disable(block, key),
	});

	if (params.setActive !== void 0) {
		// Set active filter from parameter
		setActive(block, params.setActive);
	}

	return block;
};
