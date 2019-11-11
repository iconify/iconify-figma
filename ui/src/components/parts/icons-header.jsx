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

import Icon from './icon-decoration';

function IconsHeader(props) {
    let modesToggle = null;
    if (props.layout !== void 0) {
        modesToggle = <div className="plugin-icons-list-header-modes">
            <a href="#" onClick={(event) => {
                event.preventDefault();
                props.onLayoutChange(props.layout);
            }} title={props.layoutTitle}><Icon name={'layout-' + props.layout} /></a>
        </div>;
    }

    return <div className="plugin-icons-list-header">
        <div className="plugin-icons-list-header-text">{props.children}</div>
        {modesToggle}
    </div>;
}

export default IconsHeader;
