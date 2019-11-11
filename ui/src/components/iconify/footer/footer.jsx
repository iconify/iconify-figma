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

import SimpleFooter from './simple';
import FullFooter from './full';

class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0
        };
    }

    /**
     * Render component
     *
     * @return {*}
     */
    render() {
        let app = this.props.app,
            icon = app.selection.iconName;

        // No icon selected - render SimpleFooter
        if (!icon) {
            return <SimpleFooter {...this.props} />;
        }

        // Check if icon has been loaded
        if (!Iconify.iconExists(icon)) {
            Iconify.preloadImages([icon]);
            if (!this._listener) {
                this._listener = this.iconsLoaded.bind(this);
                document.addEventListener('IconifyAddedIcons', this._listener, true);
            }
            return <SimpleFooter {...this.props} />;
        }

        // Loaded
        return <FullFooter {...this.props} />;
    }

    /**
     * Unsubscribe
     */
    componentWillUnmount() {
        if (this._listener) {
            document.removeEventListener('IconifyAddedIcons', this._listener);
            this._listener = null;
        }
    }

    /**
     * New icons have been loaded. Re-render
     */
    iconsLoaded() {
        if (this._listener && !this._pendingUpdate) {
            // No more than 1 update per cycle
            this._pendingUpdate = true;
            setTimeout(() => {
                if (this._listener) {
                    this._pendingUpdate = false;
                    this.setState({
                        counter: this.state.counter + 1
                    });
                }
            });
        }
    }
}

export default Footer;
