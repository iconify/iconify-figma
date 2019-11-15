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

import filters from '../../../core/data/icon-filters';

import ListIcon from '../../parts/icon-list';
import Icon from '../../parts/icon-decoration';
import Filter from '../../parts/filter';

const phrases = require('../../../data/phrases');
const lang = phrases.icons;

class LongIcon extends Component {
    render() {
        let props = this.props,
            name = props.name,
            loaded = Iconify.iconExists(name),
            deleteButton = null;

        // Delete button
        if (props.view.type === 'custom' && props.view.canDelete) {
            deleteButton = <a
                href="#"
                key="delete"
                onClick={this._onDeleteClick.bind(this)}
                className="plugin-icon-item-delete"
                title={lang.delete}
            ><Icon name="trash" /></a>;
        }

        if (!loaded) {
            return <ListIcon
                loading={true}
                selected={props.selected}
                title={props.title}
                onClick={this._onClick.bind(this)}
                size={lang.loading}
            >{deleteButton}</ListIcon>;
        }

        let icon = props.icon,
            iconData = Iconify.getIcon(name);

        // Generate link and tooltip
        let link = props.config.links.icon.replace('{prefix}', icon.prefix).replace('{name}', icon.name);

        let tooltip = [
            lang.name.replace('{prefix}', icon.prefix).replace('{name}', icon.name),
            lang.size.replace('{width}', iconData.width).replace('{height}', iconData.height),
            lang.palette.replace('{palette}', iconData.body.indexOf('currentColor') === -1 ? lang.colors : lang.colorless)
        ];
        tooltip = tooltip.join('\n');

        // Text
        let size = lang.sizeList.replace('{width}', iconData.width).replace('{height}', iconData.height);

        // Filters/tags
        let filtersList = [];

        if (props.view.type === 'search') {
            // Add collection
            let block = props.view.blocks.collections;
            if (block.filters[icon.prefix] !== void 0) {
                filtersList.push(<Filter
                    key={icon.prefix}
                    title={block.filters[icon.prefix]}
                    index={Object.keys(block.filters).indexOf(icon.prefix)}
                    onClick={this._onFilterClick.bind(this, 'collections', icon.prefix)}
                />);
            }
        }

        filters.forEach(filter => {
            let key = filter.icon;
            if (icon[key] === void 0 || icon[key] === null) {
                return;
            }

            let routeValue = props.view.route.params[filter.route];

            (typeof icon[key] === 'string' ? [icon[key]] : icon[key]).forEach(value => {
                if (value === routeValue) {
                    return;
                }
                let block = props.view.blocks[filter.key];
                filtersList.push(<Filter
                    key={filter.key + '-' + value}
                    title={value}
                    index={block.index + Object.keys(block.filters).indexOf(value)}
                    onClick={this._onFilterClick.bind(this, filter.key, value)}
                />);
            });
        });

        // Delete button
        if (props.view.type === 'custom' && props.view.canDelete) {
            filtersList.push(deleteButton);
        }

        // Generate SVG
        let svg = Iconify.getSVG(name, {
            'data-width': '1em',
            'data-height': '1em',
            'data-inline': false
        });

        return <ListIcon
            selected={props.selected}
            title={props.title}
            href={link}
            tooltip={tooltip}
            onClick={this._onClick.bind(this)}
            onDrag={this._onDrag.bind(this)}
            svg={svg}
            size={size}
        >
            {filtersList}
        </ListIcon>;
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

    /**
     * Filter clicked
     *
     * @param {string} name
     * @param {string} value
     * @param event
     * @private
     */
    _onFilterClick(name, value, event) {
        event.preventDefault();
        this.props.view.action(name, value);
    }

    /**
     * Delete icon
     *
     * @param event
     * @private
     */
    _onDeleteClick(event) {
        event.preventDefault();
        this.props.view.action('delete', this.props.icon)
    }
}

export default LongIcon;
