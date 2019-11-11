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
 * Route object
 *
 * @param {string} type
 * @param {object} [params]
 * @param {object} [defaults]
 * @return {{type: string, params: object, defaults: object}}
 */
module.exports = (type, params, defaults) => {
    let route = {
        type: type,
        params: Object.assign({}, params && typeof params === 'object' ? params : {}),
        defaults: typeof defaults === 'object' ? defaults : {}
    };
    Object.keys(route.defaults).forEach(attr => {
        if (route.params[attr] === void 0) {
            route.params[attr] = route.defaults[attr];
        }
    });
    return route;
};
