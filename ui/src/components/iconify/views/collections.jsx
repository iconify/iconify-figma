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
'use strict';

import React from 'react';

import helpers from './functions';

import ViewContainer from '../parts/view-container';
import ParentBlock from '../blocks/parent';
import SearchBlock from '../blocks/search';
import FilterBlock from '../blocks/filter';
import FiltersBlock from '../blocks/filters';
import CollectionsBlock from '../blocks/collections';
import FigmaFooter from '../footer/footer';

function CollectionsView(props) {
	let blocks = props.blocks;

	return (
		<ViewContainer type="collections">
			<ParentBlock {...props} block="parent" />
			<SearchBlock {...props} block="search" />
			{!blocks.categories.empty() && !blocks.filter.empty() && (
				<div className={helpers.wrapperClass(props, 'collections-header')}>
					<FiltersBlock {...props} block="categories" />
					<FilterBlock {...props} block="filter" />
				</div>
			)}
			<CollectionsBlock {...props} block="collections" />
			{/*<FigmaFooter {...props} />*/}
		</ViewContainer>
	);
}

export default CollectionsView;
