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

const base = require('./base');

/**
 * Dummy empty() function because search block is never empty
 *
 * @return {boolean}
 */
function empty() {
    return false;
}

/**
 * Create block
 *
 * @param {object} instance Search object
 * @param {object} view Parent view
 * @param {object} params Block parameters
 * @return {Object|block}
 */
module.exports = (instance, view, params) => {
    let keyword = typeof params.keyword === 'string' ? params.keyword : '';

    let block = base({
        app: instance,
        view: view,

        // Required stuff
        type: 'search',
        keys: ['keyword', 'value', 'prefix'],
        name: typeof params.name === 'string' ? params.name : null,

        // Data
        keyword: keyword,
        value: typeof params.value === 'string' ? params.value : keyword,
        prefix: typeof params.prefix === 'string' ? params.prefix : '',
        showTitle: params.showTitle === true,

        /**
         * Set keyword
         *
         * @param {string} value
         */
        setKeyword: value => {
            block.keyword = block.value = value;
        }
    });

    // Check if block is empty
    block.empty = empty;

    return block;
};
