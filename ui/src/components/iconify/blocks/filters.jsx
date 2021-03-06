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

import React, { Component } from 'react';

import PluginBlock from '../../parts/plugin-block';
import Filter from '../../parts/filter';

const phrases = require('../../../data/phrases');
const lang = phrases.filters;

class FiltersBlock extends Component {
	render() {
		let props = this.props,
			blockName = props.block,
			block = props.view.blocks[blockName];

		if (!block || block.empty()) {
			return null;
		}

		// Get all filters
		let activeFilters = block.active,
			hasActive = activeFilters.length > 0,
			filters = [],
			hasDisabled =
				block.disabled instanceof Array && block.disabled.length > 0;

		Object.keys(block.filters).forEach((key, index) => {
			let title = block.filters[key],
				selected = hasActive && activeFilters.indexOf(key) !== -1;

			if (title === '') {
				title = lang.uncategorized;
			}

			filters.push(
				<Filter
					key={key}
					index={index + block.index}
					selected={hasActive && selected}
					unselected={hasActive && !selected}
					disabled={hasDisabled && block.disabled.indexOf(key) !== -1}
					onClick={this._onClick.bind(this, key)}
					title={title}
				/>
			);
		});

		// Get title
		let title = null;

		if (lang[block.filtersType] !== void 0) {
			let view = props.view;
			// Do not show title if view has only 1 filter type
			// Always show title for collections
			if (
				blockName === 'collections' ||
				!view ||
				view.multipleFilters !== false
			) {
				title = <p>{lang[block.filtersType]}</p>;
			}
		}

		return (
			<PluginBlock
				type="filters"
				filtersType={[block.filtersType, hasActive ? 'active' : 'inactive']}
			>
				{title}
				{filters}
			</PluginBlock>
		);
	}

	/**
	 * Toggle filter
	 *
	 * @param {string} name
	 * @param {Event} event
	 * @private
	 */
	_onClick(name, event) {
		event.preventDefault();

		let props = this.props,
			blockName = props.block,
			block = props.view.blocks[blockName];

		block.action(name);
	}
}

export default FiltersBlock;
