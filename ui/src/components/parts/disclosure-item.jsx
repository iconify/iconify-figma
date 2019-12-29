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

import Icon from './icon-decoration';

const activeClass = 'plugin-disclosure-item plugin-disclosure-item--expanded';
const inactiveClass = 'plugin-disclosure-item';

function DisclosureItem(props) {
	let labelProps = {
		className: 'plugin-disclosure-label',
	};
	if (typeof props.onToggle === 'function') {
		labelProps.onClick = props.onToggle;
	}

	return (
		<li className={props.open ? activeClass : inactiveClass}>
			<div {...labelProps}>
				<Icon name="chevron-right" />
				{props.title}
			</div>
			<div className="plugin-disclosure-content">{props.children}</div>
		</li>
	);
}

export default DisclosureItem;
