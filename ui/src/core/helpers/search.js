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

const collectionHelpers = require('./collection');
const iconObject = require('../objects/icon');

/*

Search results format:

total: number, total number of results
start: number, start index
limit: number, search limit
icons: Array of icons
collections: object

 */

let functions = {
    /**
     * Convert search results from API data
     *
     * @param {object} source
     * @return {{total: number, limit: number, start: number, icons: Array, collections: object}}
     */
    convert: source => {
        let result = Object.create(null);

        ['total', 'limit', 'start'].forEach(key => {
            result[key] = source[key];
        });

        // Convert icons
        result.icons = source.icons.map(icon => iconObject(icon));

        // Convert collections
        if (source.collections) {
            result.collections = Object.create(null);
            Object.keys(source.collections).forEach(prefix => {
                result.collections[prefix] = collectionHelpers.convertInfo(source.collections[prefix], prefix);
            });
        }

        return result;
    }
};

module.exports = functions;
