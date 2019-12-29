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

import ParentBlock from '../../parts/parent-block';
import Icon from '../../parts/icon-decoration';

const phrases = require('../../../data/phrases');
const lang = phrases.parent;

class IconifyParentBlock extends Component {
	render() {
		let props = this.props,
			name = props.block,
			block = props.view.blocks[name];

		if (!block || block.empty()) {
			return null;
		}

		let renderParent = parent => {
			let key = JSON.stringify(parent.getRoute()),
				title = lang.generic;

			switch (parent.type) {
				case 'collections':
					title = lang.collections;
					break;

				case 'collection':
					let info = props.app.collection(parent.prefix);
					title = lang.collection.replace(
						'{title}',
						info ? info.title : parent.prefix
					);
					break;

				case 'search':
					title = lang.search.replace('{keyword}', parent.route.params.search);
			}

			parents.unshift({
				key: key,
				onClick: this._onClick.bind(this, parent),
				title: title,
			});
			if (parent.blocks && parent.parent) {
				renderParent(parent.parent);
			}
		};

		let parents = [];
		renderParent(block.parent);

		return <ParentBlock parents={parents} />;
	}

	/**
	 * Parent link clicked
	 *
	 * @param view
	 * @param event
	 * @private
	 */
	_onClick(view, event) {
		event.preventDefault();
		this.props.view.action('parent', view);
	}
}

export default IconifyParentBlock;
