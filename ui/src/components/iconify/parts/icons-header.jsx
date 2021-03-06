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
import Header from '../../parts/icons-header';
import Notice from '../../parts/notice';

const phrases = require('../../../data/phrases');
const lang = phrases.icons;

class IconsHeader extends Component {
	render() {
		let props = this.props,
			view = props.view,
			options = props.app.options,
			pagination = view.blocks.pagination,
			isError = pagination.length === 0,
			text;

		// Generate text
		switch (view.type) {
			case 'search':
				if (lang.headerSearch[pagination.length] !== void 0) {
					text = lang.headerSearch[pagination.length];
				} else {
					text = pagination.more
						? lang.headerSearch.more
						: lang.headerSearch.full;
					if (
						!pagination.more &&
						pagination.length === props.config.search.fullLimit
					) {
						text = lang.headerSearch.max;
					}
				}
				break;

			default:
				if (view.type === 'collection' || view.type === 'custom') {
					if (
						!pagination.length &&
						view.route.params.search.length &&
						lang.headerEmptyFilter !== void 0
					) {
						text = lang.headerEmptyFilter;
						break;
					}
				}

				if (view.type === 'custom') {
					if (
						lang.headerCustom[view.customType + pagination.length] !== void 0
					) {
						text = lang.headerCustom[view.customType + pagination.length];
						break;
					}
				}

				if (lang.headerCount[pagination.length] !== void 0) {
					text = lang.headerCount[pagination.length];
					break;
				}

				text = lang.headerCount.default;
		}
		text = text
			.replace('{count}', pagination.length)
			.replace('{start}', pagination.page * pagination.perPage)
			.replace(
				'{end}',
				Math.min(
					(pagination.page + 1) * pagination.perPage,
					pagination.length
				) - 1
			);

		// Check mode
		let headerProps = {};
		if (!options.forceList) {
			let newMode = options.list ? 'grid' : 'list';
			headerProps.layout = newMode;
			headerProps.onLayoutChange = this._onModeChange.bind(this);
			headerProps.layoutTitle = lang.mode;
		}

		return (
			<PluginBlock type="icons-header">
				{isError && <Notice type="error">{text}</Notice>}
				{!isError && <Header {...headerProps}>{text}</Header>}
			</PluginBlock>
		);
	}

	/**
	 * Change display mode
	 *
	 * @private
	 */
	_onModeChange() {
		let options = this.props.app.options;

		if (options.forceList) {
			return;
		}

		options.list = !options.list;
		options.triggerChange();
	}
}

export default IconsHeader;
