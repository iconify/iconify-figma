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

const request = require('request');
const baseAPI = require('./base');

module.exports = instance => {
    let api = baseAPI(instance);

    api._get = (uri, callback) => {
        request({
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15'
            }
        }, (error, res, data) => {
            if (error !== null) {
                console.error(error);
                callback(null);
                return;
            }

            callback(data);
        });
    };

    return api;
};
