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

const modifiers = ['dimmed', 'active', 'invalid'];

function OptionsPanel(props) {
    let className = 'options-panel';
    if (props.type) {
        className += ' options-panel--' + props.type;
    }
    modifiers.forEach(key => {
        if (props[key]) {
            className += ' options-panel--' + key;
        }
    });

    return <div className={className}>
        {props.title && <div className="options-panel-title">{props.title}</div>}
        {props.children}
    </div>;
}

export default OptionsPanel;
