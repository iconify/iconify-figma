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
	return !block.more && block.length <= block.perPage;
}

/**
 * Calculate maximum page number
 *
 * @param {number} perPage
 * @param {number} length
 * @return {number}
 */
function maxPage(perPage, length) {
	return perPage && length > 0 ? Math.floor((length - 1) / perPage) : 0;
}

/**
 * Get page for item
 *
 * @param {number} perPage
 * @param {number} index
 * @return {number}
 */
function getPageForItem(perPage, index) {
	return perPage && index > 0 ? Math.floor(index / perPage) : 0;
}

/**
 * Generate pagination
 *
 * @param {number} perPage
 * @param {number} length
 * @param {number} page
 * @param {boolean} [more]
 * @return {Array}
 */
function showPagination(perPage, length, page, more) {
	let total = length ? maxPage(perPage, length) + 1 : 0,
		pagination = [],
		i,
		min;

	// More page
	more = more === true ? ['more'] : [];

	if (total < 2) {
		// less than 2 pages
		return pagination.concat(more);
	}

	// show all pages
	// 3 first + total+-2 + 3 last + 2 spacers = 13
	if (total < 14) {
		for (i = 0; i < total; i++) {
			pagination.push(i);
		}
		return pagination.concat(more);
	}

	// First 3 pages
	for (i = 0; i < Math.min(total, 3); i++) {
		pagination.push(i);
	}
	if ((min = i) >= total) {
		return pagination.concat(more);
	}

	// Current +- 2 (or - 3 if only 1 page is skipped)
	for (
		i = min === page - 3 ? min : Math.max(page - 2, min);
		i < Math.min(page + 3, total);
		i++
	) {
		pagination.push(i);
	}
	if ((min = i) >= total) {
		return pagination.concat(more);
	}

	// Last 3 (or 4 if only 1 page is skipped)
	for (
		i = min === total - 4 ? total - 4 : Math.max(total - 3, min);
		i < total;
		i++
	) {
		pagination.push(i);
	}

	return pagination.concat(more);
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
	let config = instance.get('config'),
		perPage = config.get('itemsPerPage'),
		length = params.length > 0 ? params.length : 0,
		max = maxPage(perPage, length),
		page = Math.min(max, params.page > 0 ? params.page : 0);

	let block = base({
		app: instance,
		view: view,

		// Required stuff
		type: 'pagination',
		keys: ['page', 'length', 'more'],

		// Data
		page: page,
		length: length,
		perPage: perPage,
		more: params.more === true,

		// Functions
		empty: () => empty(block),
		maxPage: () => maxPage(block.perPage, block.length),
		pageForIndex: index => getPageForItem(block.perPage, index),
		pagination: () =>
			showPagination(block.perPage, block.length, block.page, block.more),
	});

	return block;
};
