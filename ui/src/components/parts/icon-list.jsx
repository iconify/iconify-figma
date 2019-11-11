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

function ListIcon(props) {
    let className = 'plugin-icon-item';
    if (props.loading) {
        className += ' plugin-icon-item--pending';
    }
    if (props.selected) {
        className += ' plugin-icon-item--selected';
    }

    return <div className={className}>
        {!props.pending && props.svg && <a className="plugin-icon-item-svg" href={props.href ? props.href : '#'} title={props.tooltip} onClick={props.onClick} dangerouslySetInnerHTML={{__html: props.svg}} />}
        <div className="plugin-icon-item-data">
            <a className="plugin-icon-item-title" href={props.href ? props.href : '#'} title={props.tooltip} onClick={props.onClick}>{props.title}</a>
            {props.size && <span className="plugin-icon-item-size">{props.size}</span>}
            {props.children}
        </div>
    </div>;
}

export default ListIcon;
