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

function FilterBlock(props) {
    let name = props.block,
        block = props.view.blocks[name];

    if (!block || block.empty()) {
        return null;
    }

    return <IconifyBlock type="filter">
        <SearchForm {...props} />
    </IconifyBlock>;
}

export default FilterBlock;
