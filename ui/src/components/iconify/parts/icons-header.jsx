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

import React, { Component } from 'react';

import IconifyBlock from '../parts/block';
import Icon from '../../parts/icon-decoration';
import Header from '../../parts/icons-header';
import Notice from '../../parts/notice';

const phrases = require('../../../data/phrases');

class IconsHeader extends Component {
    render() {
        let props = this.props,
            lang = phrases.icons,
            view = props.view,
            layout = props.app.layout[props.app.page],
            pagination = view.blocks.pagination,
            isError = pagination.length === 0,
            text;

        // Generate text
        switch (view.type) {
            case 'search':
                if (lang['header-search-' + pagination.length] !== void 0) {
                    text = lang['header-search-' + pagination.length];
                } else {
                    text = (pagination.more ? lang['header-search-more'] : lang['header-search-full']);
                    if (!pagination.more && pagination.length === props.config.search.fullLimit) {
                        text = lang['header-search-max'];
                    }
                }
                break;

            default:
                if (view.type === 'collection' || view.type === 'custom') {
                    if (!pagination.length && view.route.params.search.length && lang['header-empty-filter'] !== void 0) {
                        text = lang['header-empty-filter'];
                        break;
                    }
                }

                if (view.type === 'custom') {
                    if (lang['header-custom-' + view.customType + '-' + pagination.length] !== void 0) {
                        text = lang['header-custom-' + view.customType + '-' + pagination.length];
                        break;
                    }
                }

                if (lang['header-count-' + pagination.length] !== void 0) {
                    text = lang['header-count-' + pagination.length];
                    break;
                }

                text = lang['header-count'];
        }
        text = text
            .replace('{count}', pagination.length)
            .replace('{start}', pagination.page * pagination.perPage)
            .replace('{end}', Math.min((pagination.page + 1) * pagination.perPage, pagination.length) - 1);

        // Check mode
        let headerProps = {};
        if (!layout.forceList) {
            let newMode = layout.list ? 'grid' : 'list';
            headerProps.layout = newMode;
            headerProps.onLayoutChange = this.changeMode.bind(this);
            headerProps.layoutTitle = lang.mode;
        }

        return <IconifyBlock type="icons-header">
            {isError && <Notice type="error">{text}</Notice>}
            {!isError && <Header {...headerProps}>{text}</Header>}
        </IconifyBlock>;
    }

    /**
     * Change display mode
     */
    changeMode() {
        let app = this.props.app,
            layout = app.layout[app.page];

        this.props.onLayoutChange('list', !layout.list);
    }
}

export default IconsHeader;
