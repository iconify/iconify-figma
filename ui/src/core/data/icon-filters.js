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

const filters = [{
    route: 'tag', // entry in view.route
    icon: 'tags', // entry in icon object
    key: 'tags' // filter type, block name
}, {
    route: 'themePrefix',
    icon: 'themePrefix',
    key: 'themePrefixes'
}, {
    route: 'themeSuffix',
    icon: 'themeSuffix',
    key: 'themeSuffixes'
}];

module.exports = filters;
