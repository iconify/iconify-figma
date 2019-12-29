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
import Iconify from '@iconify/iconify';

import FooterButtons from './buttons';
import FooterContainer from './container';

import PluginBlock from '../../parts/plugin-block';
import Button from '../../parts/inputs/button';
import CloseButton from '../../parts/inputs/close-button';

import FooterCode from './code';
import FooterOptions from './options';
import FooterCollection from './collection';
import FooterSample from './sample';
import FooterIconName from './icon-name';
import FooterNodeOptions from './node';
import FooterBlock from './block';

const phrases = require('../../../data/phrases');
const lang = phrases.footer;

class FullFooter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			counter: 0,
		};
	}

	render() {
		let props = this.props,
			container = props.container;

		let app = props.app,
			iconName = props.iconName,
			data = Iconify.getIcon(iconName),
			options = app.options,
			transformations = options.getIconTransformations(true),
			sample = FullFooter.renderSample(iconName, transformations),
			sampleHeight = container.scaleDownIcon(
				data.height,
				data.width,
				transformations.rotate
			),
			sampleLimit = 128,
			hasColor = sample.indexOf('currentColor') !== -1;

		// Change color in sample
		if (hasColor && transformations.color !== '') {
			sample = sample.replace(/currentColor/g, transformations.color);
		}

		// Big sample
		let bigSampleHeight = 64,
			ratio = data.width / data.height,
			customHeight = false;

		if (transformations.rotate % 2 === 1) {
			ratio = 1 / ratio;
		}

		if (typeof transformations.height === 'number') {
			bigSampleHeight = transformations.height;
			customHeight = true;
			sampleLimit = 200;
		} else {
			bigSampleHeight = sampleHeight * 16;
		}

		while (bigSampleHeight * ratio > sampleLimit) {
			bigSampleHeight = bigSampleHeight / 2;
		}

		// Render sample
		return (
			<PluginBlock type="footer">
				{this.renderIconName()}
				<FooterContainer>
					<FooterSample
						svg={sample}
						sampleHeight={bigSampleHeight}
						width={data.width}
						height={data.height}
						customHeight={customHeight ? bigSampleHeight : void 0}
						onSampleDrag={this._onSampleDrag.bind(this)}
					/>
					<div>
						{this.renderCollection()}
						<FooterOptions
							key={iconName}
							{...props}
							showColor={hasColor}
							sampleHeight={sampleHeight}
							onOptionChange={this._onOptionsChange.bind(this)}
							transformations={transformations}
						/>
						<FooterCode
							{...props}
							hasColor={hasColor}
							transformations={transformations}
						/>
						<FooterNodeOptions
							{...props}
							onOptionChange={this._onOptionsChange.bind(this)}
						/>
					</div>
				</FooterContainer>

				<FooterButtons>
					<Button
						type="primary"
						title={lang.submit}
						onClick={container.importIconifyIcon.bind(container)}
					/>
					<CloseButton container={container} />
				</FooterButtons>
			</PluginBlock>
		);
	}

	/**
	 * Render icon name block
	 *
	 * @return {*}
	 */
	renderIconName() {
		let props = this.props;

		let app = props.app,
			options = app.options,
			iconName = props.iconName,
			showPrefix =
				!props.view ||
				props.view.type !== 'collection' ||
				props.view.prefix !== options.icon.prefix,
			text = showPrefix ? iconName : options.icon.name,
			data = Iconify.getIcon(iconName),
			sampleHeight = props.container.scaleDownIcon(data.height), // ignore other attributes because rotation is not applied
			sample = FullFooter.renderSample(iconName, {});

		return (
			<FooterIconName text={text} sampleHeight={sampleHeight} sample={sample} />
		);
	}

	/**
	 * Render collection information
	 *
	 * @return {*}
	 */
	renderCollection() {
		let view = this.props.view;
		return view.type !== 'collection' ? (
			<FooterCollection {...this.props} />
		) : null;
	}

	/**
	 * Component mounted
	 */
	componentDidMount() {
		this._mounted = true;
	}

	/**
	 * Component unmounted
	 */
	componentWillUnmount() {
		this._mounted = false;
	}

	/**
	 * Sample was dragged
	 *
	 * @param {object} coords
	 * @private
	 */
	_onSampleDrag(coords) {
		this.props.container.dropIconifyIcon(
			{
				isSample: true,
			},
			coords
		);
	}

	/**
	 * Options have changed
	 *
	 * @private
	 */
	_onOptionsChange(key, value) {
		let options = this.props.app.options;
		options[key] = value;

		if (this._mounted && !this._pendingUpdate) {
			// No more than 1 update per cycle
			this._pendingUpdate = true;
			setTimeout(() => {
				if (this._mounted) {
					this._pendingUpdate = false;
					this.setState({
						counter: this.state.counter + 1,
					});
				}
			});
		}
	}

	/**
	 * Get sample SVG
	 *
	 * @param name
	 * @param changes
	 * @return {string|boolean}
	 */
	static renderSample(name, changes) {
		let props = {
			'data-height': '1em',
			'data-inline': false,
		};

		if (changes.rotate) {
			props['data-rotate'] = changes.rotate;
		}

		if (changes.hFlip) {
			props['data-flip'] = 'horizontal' + (changes.vFlip ? ',vertical' : '');
		} else if (changes.vFlip) {
			props['data-flip'] = 'vertical';
		}

		return Iconify.getSVG(name, props);
	}
}

export default FullFooter;
