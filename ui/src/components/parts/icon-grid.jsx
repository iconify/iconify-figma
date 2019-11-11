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

function GridIcon(props) {
    let className = 'plugin-icon-item';
    if (props.loading) {
        className += ' plugin-icon-item--pending';
    }
    if (props.selected) {
        className += ' plugin-icon-item--selected';
    }

    let linkProps = {
        className: 'plugin-icon-item-svg',
        href: props.href ? props.href : '#',
        title: props.tooltip,
        onClick: props.onClick
    };
    if (!props.loading && props.svg) {
        linkProps.dangerouslySetInnerHTML = {__html: props.svg};
    }

    return <div className={className}>
        <a {...linkProps} />
    </div>;
}

export default GridIcon;
