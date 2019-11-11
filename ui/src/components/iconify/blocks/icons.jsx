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

import IconifyBlock from '../parts/block';
import IconsContainer from '../../parts/icons-container';
import Icon from '../parts/icon';
import LongIcon from '../parts/icon-long';

class IconsBlock extends Component {
    constructor(props) {
        super(props);

        this._pendingReload = false;
        this.state = {
            counter: 0
        };
    }

    /**
     * Render
     *
     * @return {*}
     */
    render() {
        let props = this.props,
            name = props.block,
            block = props.view.blocks[name],
            layout = props.app.layout[props.app.page],
            Component = layout.forceList || layout.list ? LongIcon : Icon;

        if (!block || block.empty()) {
            return null;
        }

        // Pre-load all icons
        let missing = block.icons.filter(icon => !Iconify.iconExists(icon.prefix + ':' + icon.name));
        if (missing.length) {
            Iconify.preloadImages(missing.map(icon => icon.prefix + ':' + icon.name));
        }

        // Render all icons
        let icons = [];
        block.icons.forEach(icon => {
            let key = icon.prefix + ':' + icon.name;

            // Icon name
            let title = key;
            if (props.view.type === 'collection') {
                // Do not show prefix when viewing collection
                title = icon.name;
            }

            icons.push(<Component
                {...props}
                key={key}
                name={key}
                icon={icon}
                title={title}
                onClick={this.onClick.bind(this, key)}
            />);
        });

        return <IconifyBlock type="icons">
            <IconsContainer list={layout.forceList || layout.list}>
                {icons}
            </IconsContainer>
        </IconifyBlock>;
    }

    /**
     * Subscribe to event listener
     */
    componentDidMount() {
        this._listener = this.iconsLoaded.bind(this);
        document.addEventListener('IconifyAddedIcons', this._listener, true);
    }

    /**
     * Unsubscribe
     */
    componentWillUnmount() {
        document.removeEventListener('IconifyAddedIcons', this._listener);
        this._listener = null;
    }

    /**
     * New icons have been loaded. Re-render
     */
    iconsLoaded() {
        if (this._listener && !this._pendingReload) {
            // Change state only once per cycle
            this._pendingReload = true;
            setTimeout(() => {
                if (this._listener) {
                    this._pendingReload = false;
                    this.setState({
                        counter: this.state.counter + 1
                    });
                }
            });
        }
    }

    /**
     * Icon clicked
     *
     * @param name
     */
    onClick(name) {
        this.props.onSelectIcon(name);
    }
}

export default IconsBlock;
