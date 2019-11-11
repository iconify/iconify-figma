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

import IconHeight from './icon-height';

const maxIndex = 11;

function CollectionsListItem(props) {
    if (!props.title) {
        return null;
    }

    // Resolve title
    let title = props.title;
    if (props.href || props.onClick) {
        title = <a
            href={props.href ? props.href : '#'}
            onClick={props.onClick ? props.onClick : void 0}
            target={props.target ? props.target : void 0}
        >{title}</a>
    } else {
        title = <span>{title}</span>
    }

    // Generate samples
    let samplesClassName = 'plugin-collections-data-samples',
        samples = null;

    if (props.samples instanceof Array) {
        if (typeof props.displayHeight === 'number') {
            samplesClassName += ' ' + samplesClassName + '--' + props.displayHeight;
        } else if (typeof props.height === 'number') {
            samplesClassName += ' ' + samplesClassName + '--' + props.height;
        }
        samples = [];
        props.samples.forEach((sample, index) => {
            if (index > 2) {
                return;
            }
            samples.push(<span className="iconify" data-inline="false" data-icon={(props.prefix ? props.prefix + ':' : '') + sample} key={sample}/>);
        });
    } else {
        samples = null;
    }


    return <div className={'plugin-collections-item' + (props.index ? ' plugin-collections-item--' + (props.index % maxIndex) : '') + (props.prefix ? ' plugin-collections-item--' + props.prefix : '')}>
        <div className="plugin-collections-text">
            {title}
            <small>{props.info ? props.info : ''}</small>
        </div>
        <div className="plugin-collections-data">
            {samples && <div className={samplesClassName}>{samples}</div>}
            {props.height && <div className="plugin-collections-data-height"><IconHeight text={'' + (typeof props.height === 'number' ? '|' + props.height : '|' + props.height.join(', '))} /></div>}
            {props.total && <div className="plugin-collections-data-total"><IconHeight text={'' + props.total} /></div>}
        </div>
    </div>
}

export default CollectionsListItem;
