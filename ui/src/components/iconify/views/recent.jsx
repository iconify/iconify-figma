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

import helpers from './functions';

import ViewContainer from '../parts/view-container';
import SearchBlock from '../blocks/search';
import IconsBlock from '../blocks/icons';
import PaginationBlock from '../blocks/pagination';
import IconsHeader from '../parts/icons-header';
import FigmaFooter from '../footer/footer';

function RecentView(props) {
    let blocks = props.blocks;

    return <ViewContainer type="collection">
        {(blocks.search.keyword !== '' || !blocks.icons.empty()) && <SearchBlock {...props} block="search" />}
        <div className={helpers.iconsWrapperClass(props)}>
            <IconsHeader {...props} />
            <IconsBlock {...props} block="icons" key={helpers.iconsBlockKey(props)} />
            <PaginationBlock {...props} block="pagination" />
        </div>
        <FigmaFooter {...props} />
    </ViewContainer>;
}

export default RecentView;
