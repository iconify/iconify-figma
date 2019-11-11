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

import IconifyBlock from '../parts/block';
import Button from '../../parts/inputs/button';

function CollectionInfoList(props) {
    let app = props.app,
        prefix = props.prefix;

    if (!prefix) {
        return null;
    }

    let info = app.collection(prefix);
    if (!info) {
        return null;
    }

    let phrases = props.phrases['collection-info'],
        title = props.showTitle ? <div>{info.title}</div> : null,
        list = [];

    // Author
    if (info.author) {
        if (info.author.url) {
            list.push(<dl key="author">
                <dt>{phrases.author}</dt>
                <dd><a href={info.author.url} target="_blank">{info.author.name}</a></dd>
            </dl>);
        } else {
            list.push(<dl key="author">
                <dt>{phrases.author}</dt>
                <dd>{info.author.name}</dd>
            </dl>);
        }
    }

    // License
    if (info.license) {
        if (info.license.url) {
            list.push(<dl key="license">
                <dt>{phrases.license}</dt>
                <dd><a href={info.license.url} target="_blank">{info.license.title}</a></dd>
            </dl>);
        } else {
            list.push(<dl key="license">
                <dt>{phrases.license}</dt>
                <dd>{info.license.title}</dd>
            </dl>);
        }
    }

    // Number of icons
    list.push(<dl key="total">
        <dt>{phrases.total}</dt>
        <dd>{info.total}</dd>
    </dl>);

    // Icon size
    if (info.height && props.showHeight !== false) {
        list.push(<dl key="height">
            <dt>{phrases.height}</dt>
            <dd>{typeof info.height === 'object' ? info.height.join(', ') : info.height}</dd>
        </dl>);
    }

    // Palette
    if (info.palette && props.showPalette !== false) {
        list.push(<dl key="palette">
            <dt>{phrases.palette}</dt>
            <dd>{phrases[info.palette === 'Colorless' ? 'colorless' : 'colorful']}</dd>
        </dl>);
    }

    if (props.showViewLink === true) {
        list.push(<div key="view">
            <Button type="secondary" onClick={event => {
                event.preventDefault();
                if (app.page === 'iconify') {
                    props.view.action('collections', prefix);
                    return;
                }
                props.container.changePage('iconify', {
                    type: 'collection',
                    params: {
                        prefix: prefix
                    },
                    parent: {
                        type: 'collections'
                    }
                })
            }} title={phrases.link.replace('{title}', info.title)} />
        </div>);
    }

    return <IconifyBlock type="collection-info">
        {title}
        {list}
    </IconifyBlock>;
}

export default CollectionInfoList;
