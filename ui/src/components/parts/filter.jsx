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

const maxIndex = 11;

function Filter(props) {
    let className = 'plugin-filter';

    if (props.disabled) {
        className += ' plugin-filter--disabled';
    }

    if (props.selected) {
        className += ' plugin-filter--selected';
    } else if (props.unselected) {
        // Other filter in block is selected
        className += ' plugin-filter--unselected';
    }

    if (props.index) {
        className += ' plugin-filter--' + (props.index % maxIndex);
    }

    return <a
        href={props.href ? props.href : '#'}
        onClick={props.onClick ? props.onClick : void 0}
        className={className}
    >{props.title}</a>
}

export default Filter;
