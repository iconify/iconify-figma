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
import GridIcon from '../../parts/icon-grid';

const phrases = require('../../../data/phrases');
const lang = phrases.icons;

class ShortIcon extends Component {
    render() {
        let props = this.props,
            name = props.name,
            icon = props.icon,
            loaded = Iconify.iconExists(name);

        // Generate link and tooltip
        let link = props.config.links.icon.replace('{prefix}', icon.prefix).replace('{name}', icon.name);

        if (!loaded) {
            return <GridIcon
                loading={true}
                selected={props.selected}
                href={link}
                onClick={this._onClick.bind(this)}
                tooltip={name + '\n' + lang.loading}
            />;
        }

        let iconData = Iconify.getIcon(name);

        let tooltip = [
            lang.name.replace('{name}', props.title),
            lang.size.replace('{width}', iconData.width).replace('{height}', iconData.height),
            lang.palette.replace('{palette}', iconData.body.indexOf('currentColor') === -1 ? lang.colors : lang.colorless)
        ];
        tooltip = tooltip.join('\n');

        // Generate SVG
        let svg = Iconify.getSVG(name, {
            'data-width': '1em',
            'data-height': '1em',
            'data-inline': false
        });

        return <GridIcon
            selected={props.selected}
            href={link}
            tooltip={tooltip}
            onClick={this._onClick.bind(this)}
            onDrag={this._onDrag.bind(this)}
            svg={svg}
        />;
    }

    /**
     * Icon dragged
     *
     * @param {object} props
     * @private
     */
    _onDrag(props) {
        this.props.container.dropIconifyIcon({
            isSample: false,
            iconName: this.props.name,
        }, props);
    }

    /**
     * Icon clicked
     *
     * @param event
     * @private
     */
    _onClick(event) {
        event.preventDefault();
        if (this.props.onClick) {
            this.props.onClick(this.props.icon);
        }
    }
}

export default ShortIcon;
