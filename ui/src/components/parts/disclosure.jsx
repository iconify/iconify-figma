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

class Disclosure extends Component {
    constructor(props) {
        super(props);

        // Set state from initial "active" property
        this.state = {
            active: typeof props.active === 'string' ? props.active : ''
        };
    }

    /**
     * Render disclosure, assuming all children are DisclosureItem instances
     *
     * @return {*}
     */
    render() {
        let active = this.state.active;

        // Clone children, add "open" and "onToggle" properties, assuming children are DisclosureItem instances
        let children = this.props.children ? (this.props.children instanceof Array ? this.props.children : [this.props.children]).map(item => React.cloneElement(item, {
            open: typeof item.props.open === 'boolean' ? item.props.open : item.key === active,
            onToggle: this._selectSection.bind(this, item.key)
        })) : null;

        return <ul className="plugin-disclosure">
            {children}
        </ul>;
    }

    /**
     * Change selection
     *
     * @param item
     * @param event
     * @private
     */
    _selectSection(item, event) {
        if (event) {
            event.preventDefault();
        }

        item = item === this.state.active ? '' : item;
        this.setState({
            active: item
        });

        if (this.props.onToggle) {
            this.props.onToggle(item);
        }
    }
}

export default Disclosure;
