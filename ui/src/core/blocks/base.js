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

/**
 * Check if values are identical
 *
 * @param {string} key Item key
 * @param {*} value1
 * @param {*} value2
 * @return {boolean}
 */
function compareValues(key, value1, value2) {
    if (typeof value1 !== typeof value2) {
        return false;
    }
    switch (typeof value1) {
        case 'number':
        case 'string':
        case 'boolean':
            if (value1 !== value2) {
                return false;
            }
            break;

        default:
            if (JSON.stringify(value1) !== JSON.stringify(value2)) {
                return false;
            }
    }
    return true;
}

/**
 * Compare blocks, return true if blocks are equal
 *
 * @param {object} block
 * @param {object} block2
 * @param {function} compareValue
 * @return {boolean}
 */
function compare(block, block2, compareValue) {
    let empty = block.empty(),
        empty2 = block2.empty(),
        i, key;

    if (empty && empty2) {
        return true;
    }
    if (empty !== empty2) {
        return false;
    }

    // Both blocks are not empty. Compare each item
    for (i = block.keys.length - 1; i >= 0; i--) {
        key = block.keys[i];
        if (!compareValue(key, block[key], block2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * Copy data from block2 to block
 *
 * @param block
 * @param block2
 */
function copyFrom(block, block2) {
    block.keys.forEach(key => {
        block[key] = JSON.parse(JSON.stringify(block2[key]));
    });
}

/**
 * Convert to object
 *
 * @param block
 */
function toObject(block) {
    let result = {};
    block.keys.forEach(key => {
        result[key] = JSON.parse(JSON.stringify(block[key]));
    });
    return result;
}

/**
 * Pass action to view
 *
 * @param block
 * @param value
 * @param [optional]
 */
function action(block, value, optional) {
    if (block.view && block.view.action) {
        return block.view.action(block.name ? block.name : block.type, value, optional);
    }
    return null;
}

/**
 * Create basic block
 *
 * @param {object} block
 * @return {object}
 */
module.exports = block => {
    /**
     * Compare values
     *
     * @type {Function}
     * @private
     */
    block._compareValues = compareValues;

    /**
     * Compare with other block, return true if blocks are equal
     *
     * @param {object} block2
     * @return {boolean}
     */
    block.compare = block2 => compare(block, block2, block._compareValues);

    /**
     * Copy data from another block (block types must match)
     *
     * @param {object} block2
     */
    block.copyFrom = block2 => copyFrom(block, block2);

    /**
     * Convert to simple object
     *
     * @return {object}
     */
    block.toObject = () => toObject(block);

    /**
     * Action on block
     *
     * @param {*} value
     * @param {*} [optional]
     * @return {object}
     */
    block.action = (value, optional) => action(block, value, optional);

    return block;
};
