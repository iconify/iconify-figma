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

import SearchForm from '../../parts/inputs/search-form';

const phrases = require('../../../data/phrases');
const lang = phrases.search;

class IconifySearchForm extends Component {
    render() {
        let props = this.props,
            app = props.app,
            blockName = props.block,
            view = props.view,
            block = view.blocks[blockName],
            value = typeof block.value === 'string' ? block.value : block.keyword,
            buttonTitle = lang.button,
            isNamed = false,
            placeholder, prefix, info;

        // Get placeholder
        if (blockName === 'filter') {
            placeholder = lang.collectionsPlaceholder;
        } else if (view.type === 'collection' && blockName === 'search') {
            prefix = view.prefix;
            info = app.collection(prefix);
            isNamed = true;

            placeholder = lang.namedPlaceholder.replace('{name}', info ? info.title : prefix);
        } else if (blockName === 'search' && view.type === 'custom' && lang[view.customType + 'Placeholder'] !== void 0) {
            placeholder = lang[view.customType + 'Placeholder'];
        } else {
            placeholder = lang.placeholder;
        }

        // Check for auto-focus
        let autoFocus = blockName === 'search';

        let showButton = true;
        if (isNamed) {
            buttonTitle = lang.namedButton.replace('{name}', info ? info.title : prefix);
        } else if (blockName === 'filter') {
            showButton = false;
        }

        return <SearchForm
            value={value}
            placeholder={placeholder}
            focus={autoFocus}
            button={showButton ? buttonTitle : void 0}
            onChange={this._onChange.bind(this, true)}
            onSubmit={this._onChange.bind(this, false)}
        />;
    }

    /**
     * Change value
     *
     * @param {boolean} temporary
     * @param {string} value
     * @private
     */
    _onChange(temporary, value) {
        let props = this.props,
            blockName = props.block,
            view = props.view,
            block = view.blocks[blockName];

        block.action(value, temporary);
    }
}

export default IconifySearchForm;
