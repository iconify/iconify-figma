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

import React from 'react';

import Icon from '../icon-decoration';

const modifiers = ['disabled', 'active', 'invalid'];

function IconButton(props) {
    let className = 'plugin-icon-button';
    modifiers.forEach(key => {
        if (props[key]) {
            className += ' plugin-icon-button--' + key;
        }
    });

    return <a
        className={className}
        href={props.href ? props.href : '#'}
        onClick={props.onClick}
        title={props.title}
    ><Icon name={props.icon} /></a>;
}

export default IconButton;
