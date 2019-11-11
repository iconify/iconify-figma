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
"use strict";

const base = require('./base');
const route = require('../objects/route');
const helpers = require('../helpers/search');
const iconFunctions = require('./icons');

const parentBlocks = require('../blocks/parent');
const searchBlock = require('../blocks/search');
const filtersBlock = require('../blocks/filters');
const iconsBlock = require('../blocks/icons');
const paginationBlock = require('../blocks/pagination');

module.exports = (instance, params, parent) => {
    let view = base({
        _app: instance,
        type: 'search',
        more: false
    }, params, parent);

    // Add icon functions
    view = iconFunctions(view);

    /**
     * Get list of collection filters
     *
     * @return {object}
     */
    view.getCollectionFilters = () => {
        if (view.loading || !view._data.collections) {
            return [];
        }

        let result = Object.create(null);

        Object.keys(view._data.collections).forEach(prefix => {
            result[prefix] = view._data.collections[prefix].title ? view._data.collections[prefix].title : prefix;
        });

        return result;
    };

    /**
     * Get items without applying pagination
     *
     * @return {Array} Array of items
     */
    view.renderWithoutPage = () => {
        if (view.loading) {
            return [];
        }

        return view._data.icons.slice(0);
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
        if (key !== 'pagination' && view.isBasicAction(key)) {
            return view.basicAction(key, value, optional);
        }

        let childView;

        switch (key) {
            case 'pagination':
                // Change pagination
                if (value === 'more' || (view.more && value === 1)) {
                    let config = instance.get('config');

                    // Create child view of parent view if possible
                    childView = (view.parent ? view.parent : view).createChild('search', {
                        search: view.route.params.search,
                        page: view.route.params.page + 1,
                        full: true
                    });
                    if (childView && !view.parent) {
                        // Reset parent view of new view if current view has no parent
                        childView.parent = null;
                    }
                    return childView;
                }
                if (typeof value === 'number') {
                    view.route.params.page = typeof value === 'number' ? value : 0;
                    view._triggerViewUpdated();
                    break;
                }
                break;

            case 'search':
                // Search
                if (typeof value !== 'string') {
                    return null;
                }

                if (optional === true) {
                    // Change 'value', not 'keyword'
                    view.blocks.search.value = value;
                    break;
                }

                if (!value.length) {
                    // Empty string - return parent view
                    return view.parent;
                }

                // Update keyword in parent view's search window
                if (view.parent) {
                    view.parent.route.params.search = value;
                    if (view.parent.blocks && view.parent.blocks.search) {
                        view.parent.blocks.search.setKeyword(value);
                    }
                }

                // Create child view of parent view if possible
                childView = (view.parent ? view.parent : view).createChild('search', {
                    search: value
                });
                if (childView && !view.parent) {
                    // Reset parent view of new view if current view has no parent
                    childView.parent = null;
                }
                return childView;

            case 'collections':
                if (typeof value !== 'string') {
                    return null;
                }
                if (!value.length) {
                    break;
                }

                // Create child view of parent view if possible
                childView = view.createChild('collection', {
                    prefix: value,
                    search: view.route.params.keyword
                });
                return childView;
        }

        return view;
    };

    /*
        Get base prefixes
    */
    view._defaultPrefixes = null;
    if (instance.params && instance.params.prefixes) {
        view._defaultPrefixes = instance.params.prefixes;
    }

    /*
        Convert route parameters to parameters
     */
    if (view._params.routeParams) {
        ['search', 'page', 'full'].forEach(attr => {
            view._params[attr] = view._params.routeParams[attr];
        });
        delete view._params.routeParams;
    }

    /*
        Create route
     */
    let routeParams = {
        search: view._params.search,
        page: view._params.page ? view._params.page : 0,
        full: view._params.full === true
    };
    view.route = route('search', routeParams, {
        page: 0,
        full: false
    });

    /*
        Add blocks
     */
    view.blocks.parent = parentBlocks(instance, view, {
        parent: parent
    });
    view.blocks.search = searchBlock(instance, view, {
        keyword: view.route.params.search
    });
    view.blocks.collections = filtersBlock(instance, view, {
        filtersType: 'collections',
        filters: []
    });
    view.blocks.icons = iconsBlock(instance, view, {});
    view.blocks.pagination = paginationBlock(instance, view, {});

    /*
        Load data
     */
    let api = instance.get('api'),
        config = instance.get('config');

    let queryParams = {
        query: view.route.params.search,
        limit: config.get('search.fullLimit') // Set full limit first to check for API cache
    };
    if (view._defaultPrefixes) {
        queryParams.prefixes = typeof view._defaultPrefixes === 'string' ? view._defaultPrefixes : view._defaultPrefixes.join(',')
    }

    // Check if full query has been cached by API
    if (!view.route.params.full) {
        let cacheKey = api.cacheKey('search', queryParams);
        if (api.cached(cacheKey)) {
            // Full results already cached - switch to full results
            view.route.params.full = false;
        } else {
            // Load only first 2 pages
            queryParams.limit = config.get('search.limit');
        }
    }

    // Start loading if this view is active
    if (instance.startLoading !== void 0) {
        instance.startLoading();
    }

    // Load data
    api.load('search', queryParams, data => {
        view.loading = false;

        // Parse API data
        view._data = helpers.convert(data);

        // Check if result is empty
        view.empty = view._data.icons.length < 1;

        // Update collections list
        if (!view.empty && view._data.collections) {
            let collections = instance.get('collections');
            if (collections) {
                Object.keys(view._data.collections).forEach(prefix => {
                    collections.set(prefix, view._data.collections[prefix]);
                });
            }

            // Filter collections
            view.blocks.collections = filtersBlock(instance, view, {
                filtersType: 'collections',
                filters: view.getCollectionFilters()
            });
        }

        // Add "more" button to pagination
        if (!view.route.params.full && view._data.icons.length >= queryParams.limit) {
            view.more = true;
        }

        // Notify that view has been loaded
        view._triggerViewLoaded();
    });

    return view;
};
