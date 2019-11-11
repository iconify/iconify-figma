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
const helpers = require('../helpers/collections');

const parentBlocks = require('../blocks/parent');
const searchBlock = require('../blocks/search');
const filterBlock = require('../blocks/filter');
const filtersBlock = require('../blocks/filters');
const collectionsBlock = require('../blocks/collections');

module.exports = (instance, params, parent) => {
    let view = base({
        _app: instance,
        type: 'collections'
    }, params, parent);

    /**
     * Render blocks
     *
     * @returns {object}
     */
    view.render = () => {
        // Check if data is still loading
        if (view.loading) {
            return view.blocks;
        }

        let data = JSON.parse(JSON.stringify(view._data)),
            categories = Object.keys(data),
            showCategories = categories.length > 1;

        // Enable all categories
        view.blocks.categories.enableAll();

        // Filter by keyword
        view.blocks.filter.keyword = view.route.params.filter;
        if (view.route.params.filter) {
            let filter = view.route.params.filter.toLowerCase(),
                activeCategories = {},
                keys = ['prefix', 'author', 'title', 'license', 'category', 'palette', 'height'];

            data = helpers.filter(data, (item, category, prefix) => {
                for (let i = keys.length - 1; i >= 0; i--) {
                    let key = keys[i];
                    if (item[key] === void 0) {
                        continue;
                    }

                    let test = (typeof item[key] === 'string' ? item[key] : JSON.stringify(item[key])).toLowerCase();
                    if (test.indexOf(filter) !== -1) {
                        activeCategories[item.category] = true;
                        return true;
                    }
                }
                return false;
            });

            if (Object.keys(activeCategories).length < categories.length) {
                // Mark unused categories as disabled
                categories.forEach(category => {
                    if (activeCategories[category] === void 0) {
                        view.blocks.categories.disable(category);
                    }
                });
            }
        }

        // Filter data by active category and update categories block
        if (view.route.params.category !== null) {
            let filter = view.route.params.category;
            categories.forEach(category => {
                if (category !== filter) {
                    delete data[category];
                }
            });
            view.blocks.categories.active = [filter];
        } else {
            view.blocks.categories.active = [];
        }

        // Update collections block by replacing whole block
        view.blocks.collections = collectionsBlock(instance, view, {
            showCategories: showCategories,
            collections: data
        });

        return view.blocks;
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

        let block;

        switch (key) {
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
                view.route.params.search = value;
                view.blocks.search.setKeyword(value);
                if (!value.length) {
                    // Reset keyword - render current view
                    return view;
                }
                return view.createChild('search', {
                    search: value
                });

            case 'collections':
                // Change collection
                if (typeof value !== 'string') {
                    return null;
                }

                // Reset search
                view.route.params.search = '';
                view.blocks.search.setKeyword('');

                // Create child view
                return view.createChild('collection', {
                    prefix: value
                });

            case 'filter':
                // Filter collections
                if (typeof value !== 'string') {
                    return;
                }
                view.route.params.filter = value;
                view._triggerViewUpdated();
                break;

            case 'categories':
                // Change category
                block = view.blocks.categories;
                if (!block) {
                    return null;
                }
                block.toggle(value);
                view.route.params.category = block.getActive();
                view._triggerViewUpdated();
                break;
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
        ['filter', 'category', 'search'].forEach(attr => {
            view._params[attr] = view._params.routeParams[attr];
        });
        delete view._params.routeParams;
    }

    /*
        Create route
     */
    let routeParams = {
        category: typeof view._params.category === 'string' ? view._params.category : null,
        filter: typeof view._params.filter === 'string' ? view._params.filter : '',
        search: typeof view._params.search === 'string' ? view._params.search : ''
    };
    view.route = route('collections', routeParams, {
        category: null,
        filter: '',
        search: ''
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
    view.blocks.filter = filterBlock(instance, view, {
        keyword: view.route.params.filter
    });
    view.blocks.categories = filtersBlock(instance, view, {
        filtersType: 'categories',
        filters: []
    });
    view.blocks.collections = collectionsBlock(instance, view, {
        showCategories: false,
        collections: {}
    });

    /*
        Load data
     */
    let load = callback => {
        let collections = instance.get('collections'),
            data;

        let getFromAPI = () => {
            let api = instance.get('api');
            api.load('collections', {}, data => {
                callback(data);
            });
        };

        // Check if collections are loaded
        if (collections) {
            if ((data = collections.raw()) !== null) {
                callback(data);
                return;
            }

            // Use collections storage to load data
            let events = instance.get('events');
            if (events) {
                // Subscribe to event
                events.subscribe('collections-loaded', () => {
                    events.unsubscribe('collections-loaded', 'collections');

                    if ((data = collections.raw()) !== null) {
                        callback(data);
                    } else {
                        getFromAPI();
                    }
                }, 'collections');

                // Send API query
                collections.sendQuery();
                return;
            }
        }

        // Load from API
        getFromAPI();
    };

    load(data => {
        view.loading = false;

        // Parse API data
        view._data = helpers.convert(data);

        // Update collections list
        let collections = instance.get('collections');
        if (collections) {
            helpers.forEach(view._data, (item, category, prefix) => {
                collections.set(prefix, item);
            });
        }

        // Filter prefixes
        if (view._defaultPrefixes) {
            view._data = helpers.filter(view._data, (item, category, prefix) => {
                for (let i = view._defaultPrefixes.length - 1; i >= 0; i--) {
                    let prefix2 = view._defaultPrefixes[i];
                    if (prefix.slice(0, prefix2.length) === prefix2) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Check for categories
        let categories = Object.keys(view._data);
        if (!categories.length) {
            // Nothing to show
            view.empty = true;
            view._hasCategories = false;
        } else {
            view.empty = false;
            view._hasCategories = categories.length > 1;
        }
        view.blocks.categories = filtersBlock(instance, view, {
            filtersType: 'categories',
            filters: categories
        });

        // Assign indexes
        let index = 0;
        categories.forEach(category => {
            Object.keys(view._data[category]).forEach(prefix => {
                view._data[category][prefix].index = index;
                index ++;
            });
        });

        // Notify that view has been loaded
        view._triggerViewLoaded();
    });

    return view;
};
