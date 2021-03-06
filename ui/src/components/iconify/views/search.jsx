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
import FiltersBlock from '../blocks/filters';
import IconsBlock from '../blocks/icons';
import PaginationBlock from '../blocks/pagination';
import IconsHeader from '../parts/icons-header';
import SearchError from '../parts/search-error';
import FigmaFooter from '../footer/footer';

function SearchView(props) {
	let blocks = props.blocks;

	return (
		<ViewContainer type="search">
			<SearchBlock {...props} block="search" />
			<ParentBlock {...props} block="parent" />
			<FiltersBlock {...props} block="collections" />
			{!blocks.icons.empty() && (
				<div className={helpers.iconsWrapperClass(props)}>
					<IconsHeader {...props} />
					<IconsBlock
						{...props}
						block="icons"
						key={helpers.iconsBlockKey(props)}
					/>
					<PaginationBlock {...props} block="pagination" />
				</div>
			)}
			{blocks.icons.empty() && <SearchError {...props} block="error" />}
			<FigmaFooter {...props} />
		</ViewContainer>
	);
}

export default SearchView;
