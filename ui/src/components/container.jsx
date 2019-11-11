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

import React, { Component } from 'react';
import Iconify from '@iconify/iconify';

const core = require('../core/search');
const iconObject = require('../core/objects/icon');

import FigmaNavigation from './header/navigation';
import IconifyContainer from './containers/iconify';
import RecentContainer from './containers/recent';
import PasteSVGContainer from './containers/paste';
import GitHubContainer from './containers/github';

const containers = {
    iconify: IconifyContainer,
    recent: RecentContainer,
    paste: PasteSVGContainer,
    github: GitHubContainer,
};

/**
 * Check if page uses Iconify instance
 *
 * @param {string} page
 * @return {boolean}
 */
const isIconifyPage = page => page === 'iconify' || page === 'recent';

/**
 * Get default layout
 *
 * @param {object} params
 * @param {object} options
 * @return {object}
 */
const defaultLayout = (params, options) => ({
    iconify: options,
    recent: {
        list: true,
        forceList: true,
        showPrefix: true
    },
    bookmarks: {
        list: true,
        forceList: true,
        showPrefix: true
    },
});

/**
 * Get default selection
 *
 * @return {{icon: null, iconName: null}}
 */
const defaultSelection = () => ({
    icon: null,
    iconName: null
});

/**
 * Get default customizations
 *
 * @return {{color: string, hFlip: boolean, vFlip: boolean, rotate: number}}
 */
const defaultCustomizations = () => ({
    color: '',
    height: '',
    hFlip: false,
    vFlip: false,
    rotate: 0
});

class Container extends Component {
    /**
     * Create component
     */
    constructor(props) {
        super(props);

        let ui = props.ui,
            params = ui.params;

        // Set state
        this.state = {
            counter: 0,
        };

        // Disable cache for icons
        Iconify.setConfig('localStorage', false);
        Iconify.setConfig('sessionStorage', false);

        // Options
        this.options = {
            list: !!(params.options && params.options.list === true),
            showPrefix: typeof params.prefix !== 'string' || !params.prefix.length
        };

        // Save customizations
        this.custom = defaultCustomizations();
        if (typeof params.custom === 'object') {
            Object.keys(this.custom).forEach(attr => {
                if (params.custom[attr] !== void 0) {
                    this.custom[attr] = params.custom[attr];
                }
            });
        }

        // Selected icon
        this.selection = defaultSelection();
        [params.icon, params.selection ? params.selection.iconName : null].forEach(icon => {
            let selectedIcon = typeof icon === 'string' ? iconObject(icon) : null;
            if (selectedIcon && typeof selectedIcon === 'object' && selectedIcon.prefix.length && selectedIcon.name.length) {
                this.selection.icon = selectedIcon;
                this.selection.iconName = selectedIcon.prefix + ':' + selectedIcon.name;
            }
        });

        // Page and routes
        this.route = params.route && params.route.page ? JSON.parse(JSON.stringify(params.route)) : {
            page: 'iconify'
        };
        this.route.recent = {
            type: 'custom',
            params: {
                customType: 'recent',
                canDelete: true
            }
        };

        // Create Iconify importer instance
        this._iconifyLoaded = false;
        if (isIconifyPage(this.route.page)) {
            this._loadIconify();
        }
    }

    /**
     * Load Iconify instance
     *
     * @private
     */
    _loadIconify() {
        let ui = this.props.ui,
            params = ui.params,
            defaultParams = {};

        let iconifyPage = 'iconify',
            autoload = false;

        switch (this.route.page) {
            case 'iconify':
                autoload = true;
                break;

            default:
                iconifyPage = this.route.page;
                break;
        }

        // Add prefix
        if (typeof params.prefix === 'string' && params.prefix.length) {
            defaultParams.prefix = params.prefix;
        }

        this.iconify = core.create(Object.assign(defaultParams, params.iconify ? params.iconify : {}, {
            autoload: autoload,
            ui_events: {
                // Iconify views
                'current-view': this._onIconifyCurrentView.bind(this),
                'current-view-updated': this._onIconifyCurrentViewUpdated.bind(this),
                'collections-loaded': this._onIconifyCollectionsLoaded.bind(this),

                // Recent icons
                'load-recent': this._onLoadFromStorage.bind(this, 'recent'),
                'delete-recent': this._onDeleteStoredIcon.bind(this, 'recent')
            },
            route: this.route[iconifyPage],
        }));

        // Save current page
        this.iconify.page = iconifyPage;

        // Pass some objects from container by reference
        this.iconify.layout = defaultLayout(params, this.options);
        this.iconify.custom = this.custom;
        this.iconify.selection = this.selection;

        // Save current view
        this.iconifyView = this.iconify.view();

        // Mark as loaded
        this._iconifyLoaded = true;
    }

    /**
     * Assign component in UI instance
     */
    componentDidMount() {
        this.props.ui.component = this;
    }

    /**
     * Unassign component in UI instance
     */
    componentWillUnmount() {
        if (this.props.ui.component === this) {
            this.props.ui.component = null;
        }
    }

    /**
     * Render container
     *
     * @return {*}
     */
    render() {
        let Content = containers[this.route.page];

        return <div className={'plugin-wrapper plugin-wrapper--' + this.route.page}>
            <FigmaNavigation route={this.route} container={this} />
            <Content container={this} route={this.route[this.route.page]}/>
        </div>;
    }

    /**
     * Change current page
     *
     * @param {string} page
     * @param {object} [route]
     */
    changePage(page, route) {
        if (page === this.route.page && route === void 0) {
            return;
        }

        // Store old Iconify route
        this.saveIconifyRoute();

        // Change route and page
        if (route !== void 0) {
            this.route[page] = route;
        }
        this.route.page = page;

        // Update Iconify instance
        if (isIconifyPage(page)) {
            if (!this._iconifyLoaded) {
                this._loadIconify();
            }

            // Continue delayed loading
            if (page === 'iconify' && this.iconify.startLoading !== void 0) {
                this.iconify.startLoading();
            }

            // Load route
            this.iconify.page = page;
            this.iconify.setRoute(this.route[page]);
        }

        // Reload
        this.update();
    }

    /**
     * Re-render container
     */
    update() {
        if (this.props.ui.component !== this || this._pendingUpdate) {
            return;
        }
        // No more than 1 update per cycle
        this._pendingUpdate = true;
        setTimeout(() => {
            if (this.props.ui.component === this) {
                this._pendingUpdate = false;
                this.setState({
                    counter: this.state.counter + 1
                });
            }
        });
    }

    /**
     * Reset all settings
     */
    resetPlugin() {
        let params = this.props.ui.params;

        // Reset route
        delete this.route.paste;
        this.route.iconify = typeof params.prefix !== 'string' || !params.prefix.length ? {
            type: 'collections'
        } : {
            type: 'collection',
            params: {
                prefix: params.prefix
            }
        };

        // Reset options
        this.options.list = false;

        // Reset custom options
        this.custom = defaultCustomizations();

        // Reset selection
        this.selection = defaultSelection();

        // Iconify layout
        if (this.iconify) {
            this.iconify.custom = this.custom;
            this.iconify.selection = this.selection;

            // Reset layout
            this.iconify.layout = defaultLayout(Object.assign({},
                this.props.ui.params, {
                    list: false
                }), this.options);

            // Reset disclosures
            this.iconify.footerCodeSection = '';
            this.iconify.expandCollectionInfo = false;
        }

        this.changePage('iconify', this.route.iconify);
    }

    /**
     * Store current Iconify route
     */
    saveIconifyRoute() {
        if (this._iconifyLoaded && this.iconify.page === this.route.page) {
            this.route[this.route.page] = this.iconify.getRoute();
        }
    }

    /**
     * Triggered when current view has been changed in Iconify - trigger re-render
     *
     * @param view
     * @private
     */
    _onIconifyCurrentView(view) {
        this.saveIconifyRoute();
        this.iconifyView = view;
        this.update();
    }

    /**
     * Triggered when current view has been updated in Iconify - trigger re-render
     *
     * @param view
     * @private
     */
    _onIconifyCurrentViewUpdated(view) {
        this.saveIconifyRoute();
        this.update();
    }

    /**
     * Triggered when collections list has been loaded - trigger re-render
     *
     * @private
     */
    _onIconifyCollectionsLoaded() {
        this.update();
    }

    /**
     * Load locally stored data
     *
     * @param {string} key
     * @param {function} callback
     * @private
     */
    _onLoadFromStorage(key, callback) {
        callback(this.props.ui.getStoredItems(key));
    }

    /**
     * Delete locally stored icon
     *
     * @param {string} key
     * @param {object|string} icon
     * @private
     */
    _onDeleteStoredIcon(key, icon) {
        this.props.ui.deleteStoredIcon(key, icon);
    }

    /**
     * Close plugin
     *
     * @param [event]
     */
    closePlugin(event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        this.props.ui.closePlugin();
    }

    /**
     * Import currently selected Iconify icon
     *
     * @param [event]
     */
    importIconifyIcon(event) {
        let ico = this.iconify,
            selection = this.selection;

        if (event && event.preventDefault) {
            event.preventDefault();
        }

        // Get selected icon
        if (!selection.icon) {
            return;
        }

        // Get icon data
        let iconData = Iconify.getIcon(selection.iconName);
        if (!iconData) {
            return;
        }

        // Add icon to recent list
        let ui = this.props.ui;
        ui.storeIcon('recent', selection.icon);

        if (this.route.page === 'recent' && this.iconifyView && this.iconifyView.sync) {
            this.iconifyView.sync();
        }

        // Create icon data
        let data = {
            name: selection.iconName,
            props: Object.assign({}, ico.custom),
            height: ico.custom.height ? ico.custom.height : this.scaleDownIcon(iconData.height, iconData.width, ico.custom.rotate),
            color: ico.custom.color === '' ? '#000' : ico.custom.color
        };
        delete data.props.height;
        delete data.props.color;

        // Get SVG
        let svgProps = {
            'data-inline': false,
            'data-height': data.height,
            'data-rotate': data.props.rotate,
        };
        if (data.hFlip) {
            svgProps['data-flip'] = 'horizontal' + (data.props.vFlip ? ',vertical' : '');
        } else if (data.props.vFlip) {
            svgProps['data-flip'] = 'vertical';
        }
        data.svg = Iconify.getSVG(data.name, svgProps).replace(/currentColor/g, data.color);

        // Send message to UI
        this.props.ui.sendMessage('import-iconify', data);
    }

    /**
     * Import SVG to Figma
     *
     * @param {string} code
     */
    importSVG(code) {
        this.props.ui.sendMessage('import-svg', {
            svg: code
        });
    }

    /**
     * Check if contains is available for page
     *
     * @param {string} page
     * @return {boolean}
     */
    hasContainer(page) {
        return containers[page] !== void 0;
    }

    /**
     * Scale down icon
     *
     * @param {number} height
     * @param {number} [width]
     * @param {number} [rotate]
     * @return {number}
     */
    scaleDownIcon(height, width, rotate) {
        let lastHeight = height,
            swapped = false;

        if (typeof width === 'number' && width !== height && (rotate % 2) === 1) {
            // Swap width/height
            swapped = true;

            let lastWidth = height;
            lastHeight = width;

            width = lastWidth;
            height = lastHeight;
        }

        // Scale by 2 until size <= 26
        while (height > 26) {
            height = height / 2;
            if (Math.round(height) !== height) {
                break;
            }

            // Check if width can be scaled as well
            if (typeof width === 'number') {
                width = width / 2;
                if (Math.round(width) !== width) {
                    break;
                }
            }

            lastHeight = height;
        }

        // Try to scale down by 5
        if (height > 70) {
            let failed = false;

            height = height / 5;
            if (Math.round(height) !== height) {
                failed = true;
            }

            if (!failed && typeof width === 'number') {
                width = width / 5;
                if (Math.round(width) !== width) {
                    failed = true;
                }
            }

            if (!failed) {
                lastHeight = height;
            }
        }

        return lastHeight;
    }
}

export default Container;
