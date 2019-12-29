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

const paginationBlock = require('../blocks/pagination');

const defaultSearches = ['name', 'chars', 'aliases'];

module.exports = view => {
	/**
	 * Render blocks
	 *
	 * @returns {object}
	 */
	view.render = () => {
		if (view.loading) {
			return view.blocks;
		}

		let icons = view.renderWithoutPage();

		// Apply pagination
		view.blocks.pagination = paginationBlock(view._app, view, {
			length: icons.length,
			page: view.route.params.page,
			more: view.more === true,
		});

		let page = view.blocks.pagination.page,
			perPage = view.blocks.pagination.perPage;

		if (view.route.params.page !== page) {
			// Adjust page
			view.route.params.page = page;
		}

		icons = icons.slice(page * perPage, (page + 1) * perPage);

		// Set icons
		view.blocks.icons.icons = icons;

		return view.blocks;
	};

	/**
	 * Get page for icon
	 *
	 * @param {object} icon
	 * @return {number|boolean}
	 */
	view.getPageForIcon = icon => {
		if (view.loading) {
			return false;
		}

		let icons = view.renderWithoutPage();

		for (let i = icons.length - 1; i >= 0; i--) {
			if (icons[i].prefix === icon.prefix && icons[i].name === icon.name) {
				return view.blocks.pagination.pageForIndex(i);
			}
		}

		return false;
	};

	/**
	 * Get page for icon
	 *
	 * @param {object} icon
	 */
	view.setPageForIcon = icon => {
		let page = view.getPageForIcon(icon);
		if (page !== false && page !== view.route.params.page) {
			view.action('pagination', page);
		}
	};

	/**
	 * Search icons
	 *
	 * @param {Array} icons
	 * @param {Array} [customSearches]
	 * @return {Array}
	 */
	view.searchIcons = (icons, customSearches) => {
		let searches = defaultSearches.slice(0);
		if (customSearches instanceof Array) {
			searches = searches.concat(customSearches);
		}

		if (view.route.params.search !== '') {
			let keywords = view.route.params.search
				.toLowerCase()
				.split(' ')
				.map(keyword => keyword.trim())
				.filter(keyword => keyword.length > 0);
			keywords.forEach(keyword => {
				let exclude = false;
				if (keyword.slice(0, 1) === '-') {
					exclude = true;
					keyword = keyword.slice(1);
					if (!keyword.length) {
						return;
					}
				}

				icons = icons.filter(icon => {
					let match = false;
					searches.forEach(attr => {
						if (match || icon[attr] === void 0) {
							return;
						}
						if (typeof icon[attr] === 'string') {
							match = icon[attr].indexOf(keyword) !== -1;
							return;
						}
						if (icon[attr] instanceof Array) {
							icon[attr].forEach(value => {
								match = match || value.indexOf(keyword) !== -1;
							});
						}
					});
					return exclude ? !match : match;
				});
			});
		}

		return icons;
	};

	/**
	 * Check if action can be handled by iconAction()
	 *
	 * @param key
	 * @return {boolean}
	 */
	view.isIconsAction = key => {
		switch (key) {
			case 'search':
			case 'icons':
			case 'collections':
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
	view.iconsAction = (key, value, optional) => {
		switch (key) {
			case 'search':
				// Search
				// if (optional === true) {
				//     // Change 'value', not 'keyword'
				//     view.blocks.search.value = value;
				//     break;
				// }
				view.route.params.search = typeof value === 'string' ? value : '';
				view.blocks.search.setKeyword(view.route.params.search);
				view._triggerViewUpdated();
				break;

			case 'icons':
				// No action - should be handled by UI
				break;

			case 'collections':
				// Collections filter
				if (
					view.parent &&
					view.blocks.collections.active.indexOf(value) !== -1
				) {
					// Currently selected collection
					return view._parentAction(view.parent);
				}
				return view.parent ? view.parent.action('collections', value) : null;
		}

		return view;
	};

	return view;
};
