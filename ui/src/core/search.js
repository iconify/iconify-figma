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

const iconObject = require('./objects/icon');

/**
 * Search core
 *
 * @return {object}
 */
let Search = {
    config: require('./data/config'),
    collections: require('./data/collections'),
    events: require('./events'),
    views: require('./views/views'),

    /**
     * Clean up parameters
     *
     * @param params
     */
    normalizeParams: params => {
        // Prefix
        params.prefix = typeof params.prefix === 'string' && params.prefix.length ? params.prefix : null;

        // Multiple prefixes
        params.prefixes = !params.prefix && params.prefixes instanceof Array && params.prefixes.length ? params.prefixes.slice(0) : null;
    },

    /**
     * Create new instance, set basic data
     *
     * @param {object} params
     * @private
     */
    init: params => {
        // Normalize parameters
        if (typeof params !== 'object') {
            params = {};
        }
        Search.normalizeParams(params);

        // Create instance, set default data
        let instance = {
            // Namespace for stored data. Some modules share data among sessions, but data is tied to namespace to avoid
            // data sharing when its not needed.
            namespace: typeof params.namespace === 'string' ? params.namespace : 'iconify',

            // Storage for initialized object
            _data: {},

            // Get function by name
            get: name => {
                if (instance._data[name] === void 0) {
                    instance._data[name] = Search[name] === void 0 ? null : Search[name](instance)
                }
                return instance._data[name];
            },

            // Store parameters
            params: params,

            /**
             * Get current view
             *
             * @return {object}
             */
            view: () => {
                let views = instance.get('views');

                return views ? views.getVisibleView() : null;
            },

            /**
             * Apply action to currently visible view
             *
             * @param {string} action
             * @param {*} value
             * @param {*} [extra] Extra option used for some actions
             * @return {object|null}
             */
            action: (action, value, extra) => {
                let view = instance.view();

                return view ? view.action(action, value, extra) : null;
            },

            /**
             * Get current route
             *
             * @return {string}
             */
            toString: () => {
                let views = instance.get('views');
                return views ? JSON.stringify(views.getRoute()) : '';
            },

            /**
             * Set route
             *
             * @param {string} data
             */
            fromString: data => {
                let views = instance.get('views');
                if (!views) {
                    return;
                }

                if (!data.length) {
                    // Home
                    views.home();
                    return;
                }

                views.setRoute(JSON.parse(data));
            },

            /**
             * Get current route
             *
             * @return {object|null}
             */
            getRoute: () => {
                let views = instance.get('views');
                return views ? views.getRoute() : null;
            },

            /**
             * Navigate to home page
             *
             * @return {object|null} view
             */
            home: () => {
                let views = instance.get('views');
                return views ? views.home() : null;
            },

            /**
             * Set route
             *
             * @param {object|string} route
             * @return {object|null} view
             */
            setRoute: route => {
                let views = instance.get('views');
                return views ? views.setRoute(route) : null;
            },

            /**
             * Get collection info
             *
             * @param {string} prefix
             * @return {object|null}
             */
            collection: prefix => {
                let collections = instance.get('collections');
                return collections ? collections.get(prefix) : null;
            },
        };

        return instance;
    },

    /**
     * Setup instance
     *
     * @param {object} instance
     * @return {object} instance
     * @private
     */
    setup: instance => {
        // Subscribe to events
        ['events', 'ui_events'].forEach(prop => {
            if (typeof instance.params[prop] === 'object') {
                let events = instance.get('events');
                Object.keys(instance.params[prop]).forEach(event => {
                    let item = instance.params[prop][event];

                    if (typeof item === 'function') {
                        events.subscribe(event, item, event);
                        return;
                    }

                    if (typeof item === 'object') {
                        if (item instanceof Array) {
                            item.forEach((item2, index) => {
                                if (typeof item2 === 'function') {
                                    events.subscribe(event, item2, event + index);
                                }
                            });
                            return;
                        }
                        Object.keys(item).forEach(key2 => {
                            let item2 = item[key2];
                            if (typeof item2 === 'function') {
                                events.subscribe(event, item2, event + key2);
                            }
                        });
                    }
                });
            }
        });

        // Set home page
        let views = instance.get('views');
        views.home();

        // Query instead of route
        if (typeof instance.params.query === 'string' && instance.params.query.length) {
            delete instance.params.route;
            views.getVisibleView().action('search', instance.params.query);
        }

        // Load route
        if (typeof instance.params.route === 'string') {
            try {
                instance.params.route = JSON.parse(instance.params.route);
            } catch (err) {
            }
        }
        if (typeof instance.params.route === 'object') {
            views.setRoute(instance.params.route);
        }

        return instance;
    },

    /**
     * Create instance
     *
     * @param {object} params
     * @return {object}
     */
    create: params => Search.setup(Search.init(params))
};

if (process.env.SEARCH_ENV === 'browser') {
    Search.api = require('./api/browser');
} else {
    Search.api = require('./api/node');
}

module.exports = Search;
