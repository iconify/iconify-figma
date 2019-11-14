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
import Notice from '../../parts/notice';
import IconifyBlock from '../parts/block';

import CollectionsListSection from '../../parts/collections-list-section';
import CollectionsListItem from '../../parts/collections-list-item';

const phrases = require('../../../data/phrases');
const lang = phrases.collections;

class CollectionsBlock extends Component {
    render() {
        let props = this.props,
            name = props.block,
            block = props.view.blocks[name];

        if (!block || block.empty()) {
            return <IconifyBlock type="error">
                <Notice type="error">{lang.empty}</Notice>
            </IconifyBlock>;
        }

        // Parse each category
        let sections = [],
            link = props.config.links.collection;

        Object.keys(block.collections).forEach(title => {
            let collections = block.collections[title],
                items = [];

            // Parse all items
            Object.keys(collections).forEach(prefix => {
                let item = collections[prefix];
                items.push(<CollectionsListItem
                    key={prefix}
                    index={item.index}
                    prefix={prefix}
                    title={item.title}
                    onClick={this._onClick.bind(this, prefix)}
                    href={link.replace('{prefix}', prefix)}
                    info={item.author && item.author.name ? lang.by + item.author.name : ''}
                    total={item.total}
                    height={item.height}
                    displayHeight={item.displayHeight}
                    samples={item.samples}
                />);
            });

            if (items.length) {
                sections.push(<CollectionsListSection key={title} title={block.showCategories ? title : null}>
                    {items}
                </CollectionsListSection>);
            }
        });

        return <IconifyBlock type="collections">{sections}</IconifyBlock>;
    }

    /**
     * Collection has been clicked
     *
     * @param {string} prefix
     * @param {Event} event
     * @private
     */
    _onClick(prefix, event) {
        event.preventDefault();

        let props = this.props,
            name = props.block,
            block = props.view.blocks[name];

        block.action(prefix);
    }
}

export default CollectionsBlock;
