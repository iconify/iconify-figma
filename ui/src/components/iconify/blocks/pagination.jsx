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

import IconifyBlock from '../parts/block';
import Icon from '../../parts/icon-decoration';

const phrases = require('../../../data/phrases');
const lang = phrases.pagination;

class PaginationBlock extends Component {
    render() {
        let props = this.props,
            name = props.block,
            block = props.view.blocks[name];

        if (!block || block.empty()) {
            return null;
        }

        let pages = block.pagination(),
            pagination = [],
            prev = -1;

        // First page
        if (block.page > 0) {
            pagination.push(<a href="#" className="plugin-pagination-page plugin-pagination-page--arrow plugin-pagination-page--prev" onClick={this._onClick.bind(this, block.page - 1)} key="prev" title={lang.prev}><Icon name="arrow-left" /></a>);
        }

        // Add all pages
        pages.forEach(page => {
            if (page > (prev + 1)) {
                pagination.push(<span key={'dots' + page}>...</span>);
            }

            if (page === 'more') {
                pagination.push(<a href="#" className="plugin-pagination-page plugin-pagination-page--more" onClick={this._onClick.bind(this, 'more')} key="more">{lang.more}</a>);
                return;
            }

            pagination.push(<a href="#" className={'plugin-pagination-page' + (block.page === page ? ' plugin-pagination-page--selected' : '')} onClick={this._onClick.bind(this, page)} key={page}>{page + 1}</a>);
            prev = page;
        });

        // Next page
        if (block.page !== prev) {
            pagination.push(<a href="#" className="plugin-pagination-page plugin-pagination-page--arrow plugin-pagination-page--next" onClick={this._onClick.bind(this, block.page + 1)} key="next" title={lang.next}><Icon name="arrow-right" /></a>);

        }

        return <IconifyBlock type="pagination">{pagination}</IconifyBlock>;
    }

    /**
     * Set page
     *
     * @param {*} page
     * @param {*} event
     * @private
     */
    _onClick(page, event) {
        event.preventDefault();

        let props = this.props,
            name = props.block,
            block = props.view.blocks[name];

        block.action(page);
    }
}


export default PaginationBlock;
