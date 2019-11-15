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
import Draggable from '../../parts/draggable';

function FooterSample(props) {
    let style = {};
    if (props.sampleHeight) {
        style = {
            fontSize: props.sampleHeight + 'px'
        };
    }

    return <Draggable onDrag={props.onSampleDrag} offsetY={-200}>
        <div className="plugin-footer-icon-sample" dangerouslySetInnerHTML={{__html: props.svg}} style={style} />
        {
            props.width && props.height &&
            <div className="plugin-footer-icon-size">
                {props.width}<span>x</span>{props.height}
            </div>
        }
        {
            props.width && props.height && props.customHeight &&
            <div className="plugin-footer-icon-size">
                ({props.customHeight})
            </div>
        }
    </Draggable>;
}

export default FooterSample;
