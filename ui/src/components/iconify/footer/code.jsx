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

import FooterBlock from './block';
import Disclosure from '../../parts/disclosure';
import DisclosureItem from '../../parts/disclosure-item';
import HTMLCodeBlock from '../../parts/code/html';
import ReactCodeBlock from '../../parts/code/react';

const phrases = require('../../../data/phrases');
const lang = phrases.code;

class FooterCode extends Component {
	render() {
		let props = this.props,
			section = props.app.footerCodeSection,
			app = props.app,
			transformations = props.transformations;

		// Generate object for code blocks
		let icon = {
			icon: app.options.icon,
			hasColor: props.hasColor,
			color: transformations.color,
			height: transformations.height,
			hFlip: transformations.hFlip,
			vFlip: transformations.vFlip,
			rotate: transformations.rotate,
		};

		return (
			<FooterBlock type="code" title={lang.code}>
				<Disclosure
					active={section}
					onToggle={this._onChangeSection.bind(this)}
				>
					<DisclosureItem key="html" title={lang.htmlTitle}>
						<HTMLCodeBlock icon={icon} footer={true} />
					</DisclosureItem>
					<DisclosureItem key="react" title={lang.reactTitle}>
						<ReactCodeBlock icon={icon} footer={true} />
					</DisclosureItem>
				</Disclosure>
			</FooterBlock>
		);
	}

	/**
	 * Remember current section selection
	 *
	 * @param section
	 * @private
	 */
	_onChangeSection(section) {
		this.props.app.footerCodeSection = section;
	}
}

export default FooterCode;
