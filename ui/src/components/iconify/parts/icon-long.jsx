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
                onClick={this.deleteClicked.bind(this)}
                className="plugin-icon-item-delete"
                title={props.phrases.icons['delete-' + props.view.customType]}
            ><Icon name="trash" /></a>;
        }

        if (!loaded) {
            return <ListIcon
                loading={true}
                selected={props.app.selection.iconName === name}
                title={props.title}
                onClick={this.onClick.bind(this)}
                size={props.phrases.icons.loading}
            >{deleteButton}</ListIcon>;
        }

        let icon = props.icon,
            lang = props.phrases.icons,
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
        let size = lang['size-list'].replace('{width}', iconData.width).replace('{height}', iconData.height);

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
                    onClick={this.filterClicked.bind(this, 'collections', icon.prefix)}
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
                    onClick={this.filterClicked.bind(this, filter.key, value)}
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
            selected={props.app.selection.iconName === name}
            title={props.title}
            href={link}
            tooltip={tooltip}
            onClick={this.onClick.bind(this)}
            svg={svg}
            size={size}
        >
            {filtersList}
        </ListIcon>;
    }

    /**
     * Icon clicked
     *
     * @param event
     */
    onClick(event) {
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
     */
    filterClicked(name, value, event) {
        event.preventDefault();
        this.props.view.action(name, value);
    }

    /**
     * Delete icon
     *
     * @param event
     */
    deleteClicked(event) {
        event.preventDefault();
        this.props.view.action('delete', this.props.icon)
    }
}

export default LongIcon;
