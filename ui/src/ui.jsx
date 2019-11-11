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

const React = require('react');
const ReactDOM = require('react-dom');

import Container from './components/container';

const version = 1;

class UI {
    constructor(container, params) {
        if (typeof params !== 'object') {
            params = {};
        }

        // Copy parameters
        this.container = container;
        this.params = params;

        // Expand stored parameters
        if (typeof params.stored === 'object' && params.stored.version === version) {
            ['storage', 'route', 'selection', 'custom', 'options'].forEach(attr => {
                if (params.stored[attr] !== void 0) {
                    params[attr] = params.stored[attr];
                }
            })
        }
        delete params.stored;

        // Local storage
        this.localStorage = params.storage ? params.storage : {};

        // Create UI
        ReactDOM.render(<Container
            ui={this}
            version={version}
        />, this.container);
    }

    /**
     * Close plug-in
     */
    closePlugin() {
        this.sendMessage('store', this.getParams());
        this.sendMessage('close');
    }

    /**
     * Show code for icon
     *
     * @param item
     */
    showCode(item) {
        console.log('Showing code for icon:', item);
        // @TODO change route to show item or to previous route if item is empty
    }

    /**
     * Get stored items
     *
     * @return {Array}
     */
    getStoredItems(key) {
        return this.localStorage[key] === void 0 ? [] : this.localStorage[key];
    }

    /**
     * Delete icon from recent icons list
     *
     * @param {string} key
     * @param icon
     */
    _deleteStoredIcon(key, icon) {
        if (this.localStorage[key] === void 0) {
            return;
        }

        let value1 = typeof icon === 'string' ? icon : icon.prefix + ':' + icon.name,
            value2 = typeof icon === 'string' ? icon : (icon.prefix.indexOf('-') === -1 ? icon.prefix + '-' + icon.name : value1);

        this.localStorage[key] = this.localStorage[key].filter(item => item !== value1 && item !== value2);
    }

    /**
     * Delete stored item
     *
     * @param {string} key
     * @param {string} item
     * @private
     */
    _deleteStoredItem(key, item) {
        if (this.localStorage[key] === void 0) {
            return;
        }

        this.localStorage[key] = this.localStorage[key].filter(value => value !== item);
    }

    /**
     * Delete icon from recent icons list
     *
     * @param {string} key
     * @param {string|object} icon
     */
    deleteStoredIcon(key, icon) {
        this._deleteStoredIcon(key, icon);
        this.updateStorage();
    }

    /**
     * Delete item from recent items list
     *
     * @param {string} key
     * @param {string} item
     */
    deleteStoredItem(key, item) {
        this._deleteStoredItem(key, item);
        this.updateStorage();
    }

    /**
     * Add icon to local list
     *
     * @param {string} key
     * @param {object|string} icon
     */
    storeIcon(key, icon) {
        this._deleteStoredIcon(key, icon);

        if (typeof icon !== 'string') {
            icon = icon.prefix + ':' + icon.name;
        }
        this.storeItem(key, icon);
    }

    /**
     * Add item to local list
     *
     * @param {string} key
     * @param {string} item
     */
    storeItem(key, item) {
        this._deleteStoredItem(key, item);

        if (this.localStorage[key] === void 0) {
            this.localStorage[key] = [];
        }
        this.localStorage[key].unshift(item);

        this.updateStorage();
    }

    /**
     * Update recent icons list
     */
    updateStorage() {
        this.sendMessage('store', this.getParams());
    }

    /**
     * Get parameters for storage
     *
     * @return {any}
     */
    getParams() {
        let container = this.component;

        if (container.iconify) {
            // Save route
            container.saveIconifyRoute();

            // Sync Iconify options
            ['list'].forEach(key => {
                container.options[key] = container.iconify.layout.iconify[key];
            });
        }

        let params = {
            version: version,
            route: container.route,
            selection: container.selection,
            options: container.options,
            custom: container.custom,
            storage: this.localStorage
        };

        // Copy object
        return JSON.parse(JSON.stringify(params));
    }

    /**
     * Send message to Figma
     *
     * @param {string} event
     * @param {*} [data]
     */
    sendMessage(event, data) {
        let callback = this.params.callback;
        if (typeof callback === 'function') {
            callback(event, data);
        }
    }
}

export default UI;
