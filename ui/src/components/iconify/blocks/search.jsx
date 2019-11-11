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
import SearchForm from '../parts/search-form';

function SearchBlock(props) {
    let app = props.app,
        view = props.view,
        name = props.block,
        block = props.view.blocks[name],
        searchTitle = null;

    if (!block || block.empty()) {
        return null;
    }

    if (block.showTitle && name !== 'globalSearch') {
        if (view.type === 'collection' && name === 'search') {
            let prefix = view.prefix,
                info = app.collection(prefix),
                collectionTitle = info ? info.title : prefix;

            searchTitle = props.phrases.search.titleNamed.replace('{name}', collectionTitle);
        } else if (view.type === 'custom') {
            searchTitle = props.phrases.search['title-' + view.customType];
        } else {
            searchTitle = props.phrases.search.title;
        }
    }

    return <IconifyBlock type="search">
        {searchTitle !== null && <p>{searchTitle}</p>}
        <SearchForm {...props} />
    </IconifyBlock>;
}

export default SearchBlock;
