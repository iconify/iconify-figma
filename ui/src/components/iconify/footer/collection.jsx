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

import Disclosure from '../../parts/disclosure';
import DisclosureItem from '../../parts/disclosure-item';
import CollectionInfo from '../parts/collection-info-list';

function FooterCollection(props) {
    let app = props.app,
        prefix = app.selection.icon.prefix;

    if (!prefix) {
        return null;
    }

    let info = app.collection(prefix);
    if (!info) {
        return null;
    }

    return <Disclosure active={app.expandCollectionInfo ? 'info' : ''}>
        <DisclosureItem key="info" title={'About ' + info.title} onToggle={() => app.expandCollectionInfo = !app.expandCollectionInfo}>
            <CollectionInfo {...props} prefix={prefix} showTitle={false} showPalette={false} showViewLink={true} />
        </DisclosureItem>
    </Disclosure>;
}

export default FooterCollection;
