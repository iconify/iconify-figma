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

const helpers = require('../helpers/collections');

let storage = Object.create(null);

class Collections {
    constructor(instance) {
        this._app = instance;

        // Inject startLoading() function if autoload has been disabled, so no API requests are sent until startLoading() is called
        if (this._app.params.autoload === false) {
            this._app.startLoading = () => {
                this._app.params.autoload = true;
                this.sendQuery();
                delete this._app.startLoading;
            };
        }

        let namespace = instance.namespace;
        if (storage[namespace] === void 0) {
            storage[namespace] = Object.create(null);
        }

        this._data = storage[namespace];
        this._raw = null;
        this._pendingQuery = 0;
        this._retry = 0;
    }

    /**
     * Get data
     *
     * @param {string} prefix
     * @return {null}
     */
    get(prefix) {
        return this.loaded(prefix) ? this._data[prefix] : null;
    }

    /**
     * Set data
     *
     * @param {string} prefix
     * @param {object} data
     */
    set(prefix, data) {
        this._data[prefix] = JSON.parse(JSON.stringify(data));
    }

    /**
     * Check if data for prefix is set
     *
     * @param {string} prefix
     * @return {boolean}
     */
    loaded(prefix) {
        if (this._data[prefix] !== void 0) {
            return true;
        }
        this.sendQuery();
        return false;
    }

    /**
     * Get raw API data
     *
     * @return {null|object}
     */
    raw() {
        return this._raw;
    }

    /**
     * Send API query
     */
    sendQuery() {
        if (this._app.params && this._app.params.autoload === false) {
            return;
        }

        if (this._hasPendingQuery()) {
            return;
        }

        this._pendingQuery = Date.now();

        // Send API query
        let api = this._app.get('api');
        api.load('collections', {
            version: 2
        }, data => {
            if (data === null) {
                return;
            }

            this._raw = data;

            data = helpers.convert(data);
            helpers.forEach(data, (item, category, prefix) => {
                this._data[prefix] = item;
            });

            // Fire event to notify views
            let events = this._app.get('events');
            if (events) {
                events.fire('collections-loaded', this);
            }
        });
    }

    /**
     * Check if there is a pending API query
     *
     * @return {boolean}
     * @private
     */
    _hasPendingQuery() {
        if (!this._pendingQuery) {
            return false;
        }

        // Get timer for retry, which defaults to API.retry * 2 or 5000 ms
        if (!this._retry) {
            let config = this._app.get('config');
            this._retry = config.get('API.retry') * 2;
            if (!this._retry) {
                this._retry = 5000;
            }
        }

        return this._pendingQuery + this._retry > Date.now();
    }
}

module.exports = instance => new Collections(instance);
