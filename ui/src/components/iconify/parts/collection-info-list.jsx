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

import PluginBlock from '../../parts/plugin-block';
import Button from '../../parts/inputs/button';

const phrases = require('../../../data/phrases');
const lang = phrases.collectionInfo;

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

    let title = props.showTitle ? <div>{info.title}</div> : null,
        list = [];

    // Author
    if (info.author) {
        if (info.author.url) {
            list.push(<dl key="author">
                <dt>{lang.author}</dt>
                <dd><a href={info.author.url} target="_blank">{info.author.name}</a></dd>
            </dl>);
        } else {
            list.push(<dl key="author">
                <dt>{lang.author}</dt>
                <dd>{info.author.name}</dd>
            </dl>);
        }
    }

    // License
    if (info.license) {
        if (info.license.url) {
            list.push(<dl key="license">
                <dt>{lang.license}</dt>
                <dd><a href={info.license.url} target="_blank">{info.license.title}</a></dd>
            </dl>);
        } else {
            list.push(<dl key="license">
                <dt>{lang.license}</dt>
                <dd>{info.license.title}</dd>
            </dl>);
        }
    }

    // Number of icons
    list.push(<dl key="total">
        <dt>{lang.total}</dt>
        <dd>{info.total}</dd>
    </dl>);

    // Icon size
    if (info.height && props.showHeight !== false) {
        list.push(<dl key="height">
            <dt>{lang.height}</dt>
            <dd>{typeof info.height === 'object' ? info.height.join(', ') : info.height}</dd>
        </dl>);
    }

    // Palette
    /*
    if (info.palette && props.showPalette !== false) {
        list.push(<dl key="palette">
            <dt>{lang.palette}</dt>
            <dd>{lang[info.palette === 'Colorless' ? 'colorless' : 'colorful']}</dd>
        </dl>);
    }
    */

    if (props.showViewLink === true) {
        list.push(<div key="view">
            <Button type="secondary" onClick={event => {
                event.preventDefault();
                if (app.page === 'iconify') {
                    props.view.action('collections', prefix, '');
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
                });
            }} title={lang.link.replace('{title}', info.title)} />
        </div>);
    }

    return <PluginBlock type="collection-info">
        {title}
        {list}
    </PluginBlock>;
}

export default CollectionInfoList;
