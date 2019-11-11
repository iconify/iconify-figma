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

const collectionFunctions = require('./collection');

/*

Collections list format:

[category]: object
    [prefix]: object
        name: string
        total: number
        author: object
            name: string
            url: string
        license: object
            title: string
            id: string
            url: string
        ... see API result
        category: category (duplicate)
        prefix: prefix (duplicate)

 */

let functions = {
    /**
     * Convert collections from API data to categorized list
     *
     * @param {object} source
     * @return {object}
     */
    convert: source => {
        let categorized = Object.create(null),
            uncategorized = Object.create(null);

        // Find all categories
        Object.keys(source).forEach(prefix => {
            let item = source[prefix];

            if (item.category === void 0 || !item.category.length) {
                uncategorized[prefix] = collectionFunctions.convertInfo(item, prefix);
                return;
            }

            if (categorized[item.category] === void 0) {
                categorized[item.category] = Object.create(null);
            }

            categorized[item.category][prefix] = collectionFunctions.convertInfo(item, prefix);
        });

        // Append uncategorized items at the end
        if (Object.keys(uncategorized).length) {
            categorized[''] = uncategorized;
        }

        return categorized;
    },

    /**
     * Get collection prefixes from converted collections list
     *
     * @param {object} data
     * @return {Array}
     */
    prefixes: data => {
        let prefixes = [];
        Object.keys(data).forEach(category => {
            prefixes = prefixes.concat(Object.keys(data[category]));
        });
        return prefixes;
    },

    /**
     * Filter collections
     *
     * @param {object} collections
     * @param {function} callback
     * @return {object}
     */
    filter: (collections, callback) => {
        let result = Object.create(null);

        Object.keys(collections).forEach(category => {
            Object.keys(collections[category]).forEach(prefix => {
                let item = collections[category][prefix];

                if (!callback(item, category, prefix)) {
                    return;
                }

                // Passed filter
                if (result[category] === void 0) {
                    result[category] = Object.create(null);
                }
                result[category][prefix] = item;
            });
        });

        return result;
    },

    /**
     * Run function for all items
     *
     * @param {object} collections
     * @param {function} callback function(item, category, prefix)
     */
    forEach: (collections, callback) => {
        Object.keys(collections).forEach(category => {
            Object.keys(collections[category]).forEach(prefix => {
                callback(collections[category][prefix], category, prefix);
            });
        });
    }
};

module.exports = functions;
