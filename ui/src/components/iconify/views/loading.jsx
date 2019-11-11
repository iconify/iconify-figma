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

import ViewContainer from '../parts/view-container';
import ParentBlock from '../blocks/parent';
import SearchBlock from '../blocks/search';
import Footer from '../footer/footer';
import Notice from '../../parts/notice';

function LoadingView(props) {
    return <ViewContainer type="loading">
        {props.view && <SearchBlock {...props} block="search" />}
        {props.view && <ParentBlock {...props} block="parent" />}

        <Notice>{props.phrases.loading.ui}</Notice>

        {/*<Footer {...props} />*/}
    </ViewContainer>;
}

export default LoadingView;
