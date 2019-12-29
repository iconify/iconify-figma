/**
 * This file is part of the @iconify/figma package.
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

import Button from '../parts/inputs/button';
import CloseButton from '../parts/inputs/close-button';
import FooterButtons from '../iconify/footer/buttons';
import Draggable from '../parts/draggable';

const phrases = require('../../data/phrases');
const lang = phrases.paste;

class PasteContainer extends Component {
	constructor(props) {
		super(props);

		let route = props.container.route;

		this.state = {
			value: typeof route.paste === 'string' ? route.paste : '',
			isFont: false,
			focused: false,
		};
	}

	/**
	 * Render component
	 *
	 * @return {*}
	 */
	render() {
		let container = this.props.container,
			isEmpty = this._isEmpty(),
			isValid = false,
			extraButtons = [],
			inputClassName = 'plugin-input plugin-input--outlined',
			notices = [],
			sample = null;

		if (!isEmpty) {
			isValid = this._isValid();

			if (isValid !== true && !this.state.focused) {
				inputClassName += ' plugin-input--invalid';
				notices.push(
					<p
						key="invalid"
						className="plugin-paste-notice plugin-paste-notice--error"
					>
						{typeof isValid === 'string' ? isValid : lang.invalidSVG}
					</p>
				);
			}

			if (this.state.isFont) {
				notices.push(
					<p
						key="font"
						className="plugin-paste-notice plugin-paste-notice--warning"
					>
						{lang.fontNotice}
					</p>
				);
			}

			if (isValid === true) {
				extraButtons.push(
					<Button
						key="submit"
						type="primary"
						title={lang.importButton}
						onClick={this._onSubmit.bind(this)}
					/>
				);

				let sampleSource =
					'data:image/svg+xml;base64,' + window.btoa(this._cleanup());
				sample = (
					<div className="plugin-paste-sample">
						Sample:
						<br />
						<Draggable onDrag={this._onDrag.bind(this)}>
							<img src={sampleSource} />
						</Draggable>
					</div>
				);
			}

			extraButtons.push(
				<Button
					key="clear"
					type="secondary"
					title={lang.clearButton}
					onClick={this._onClear.bind(this)}
				/>
			);
		}

		// Merge notices
		if (notices.length) {
			notices = <div className="plugin-paste-notices">{notices}</div>;
		}

		return (
			<div className="plugin-content">
				<form onSubmit={this._onSubmit.bind(this)}>
					<p>{lang.text1}</p>
					<p className="plugin-paste-comment">{lang.text2}</p>
					<textarea
						onFocus={this._onFocus.bind(this, true)}
						onBlur={this._onFocus.bind(this, false)}
						className={inputClassName}
						value={this.state.value}
						onChange={this._onChange.bind(this)}
						ref={input => (this.input = input)}
					/>
					{notices}
					{sample}
					<FooterButtons>
						{extraButtons}
						<CloseButton container={container} />
					</FooterButtons>
				</form>
			</div>
		);
	}

	/**
	 * Focus textarea
	 */
	componentDidMount() {
		this.input.focus();
	}

	/**
	 * Change value in state
	 *
	 * @param {string} value
	 * @private
	 */
	_setValue(value) {
		this.setState({
			value: value,
			isFont:
				value.indexOf('<font') !== -1 && value.indexOf('<missing-glyph') !== -1,
		});
	}

	/**
	 * Save current value in route and state
	 *
	 * @param {string} value
	 * @private
	 */
	_saveValue(value) {
		this.props.container.route.paste = value;
		this._setValue(value);
	}

	/**
	 * Change value
	 *
	 * @param event
	 * @private
	 */
	_onChange(event) {
		this._setValue(event.target.value);
	}

	/**
	 * Icon was dropped
	 *
	 * @param props
	 * @private
	 */
	_onDrag(props) {
		if (this._isEmpty() || this._isValid() !== true) {
			return;
		}

		let value = this._cleanup();
		this.props.container.importSVG(value, props);
	}

	/**
	 * Focus input
	 *
	 * @param focused
	 * @param event
	 * @private
	 */
	_onFocus(focused, event) {
		if (!focused && this._isValid() === true) {
			this._saveValue(this._cleanup());
		}

		this.setState({
			focused: focused,
		});
	}

	/**
	 * Submit form
	 *
	 * @param event
	 * @private
	 */
	_onSubmit(event) {
		event.preventDefault();
		if (this._isEmpty() || this._isValid() !== true) {
			return;
		}

		let value = this._cleanup();
		this.props.container.importSVG(value);
	}

	/**
	 * Clear value
	 *
	 * @param event
	 * @private
	 */
	_onClear(event) {
		event.preventDefault();
		this._saveValue('');
	}

	/**
	 * Check if form is empty
	 *
	 * @return {boolean}
	 * @private
	 */
	_isEmpty() {
		return !this.state.value.trim().length;
	}

	/**
	 * Check if SVG is valid
	 *
	 * @return {boolean|string}
	 * @private
	 */
	_isValid() {
		let value = this.state.value.trim(),
			valueLC = value.toLowerCase();

		if (
			valueLC.indexOf('<foreignobject') !== -1 ||
			valueLC.indexOf('<script') !== -1
		) {
			return lang.foreignObject;
		}

		value = this._cleanup();
		if (value.indexOf('<svg') === -1 || value.indexOf('</svg>') === -1) {
			return false;
		}

		return true;
	}

	/**
	 * Clean up SVG code.
	 *
	 * Some code was borrowed from Iconify Tools's svg.js
	 *
	 * @return {string}
	 * @private
	 */
	_cleanup() {
		let content = this.state.value.trim(),
			code = content;

		// Remove junk for URI
		['url(', ';', ')', '"', "'"].forEach(str => {
			if (code.slice(0, str.length) === str) {
				code = code.slice(str.length).trim();
			}
			if (code.slice(0 - str.length) === str) {
				code = code.slice(0, code.length - str.length);
			}
		});

		// Decode URI
		if (code.slice(0, 5) === 'data:') {
			// Remove data:
			code = code.slice(5);

			// Remove content-type, without testing it (content will be validated later)
			let parts = code.split(',');
			let contentType = parts.shift();
			code = parts.join(',');

			// Decode URI
			contentType = contentType.split(';');
			if (contentType.pop().toLowerCase() === 'base64') {
				try {
					code = window.atob(code);
				} catch (err) {
					code = null;
				}
			} else if (code.toLowerCase().indexOf('%3c') !== -1) {
				code = window.decodeURIComponent(code);
			}

			// Check it
			if (code.indexOf('<svg') !== -1 && code.indexOf('</svg>') !== -1) {
				content = code;
			}
		}

		// Remove junk
		function remove(str1, str2, append) {
			let start = 0,
				end;

			while ((start = content.indexOf(str1, start)) !== -1) {
				end = content.indexOf(str2, start + str1.length);
				if (end === -1) {
					return;
				}
				content =
					content.slice(0, start) + append + content.slice(end + str2.length);
				start = start + append.length;
			}
		}

		// Remove comments
		remove('<!--', '-->', '');

		// Remove doctype and XML declaration
		remove('<?xml', '?>', '');
		remove('<!DOCTYPE svg', '<svg', '<svg');

		// Remove Adobe Illustrator junk
		remove(
			'xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"',
			'',
			''
		);
		remove('xml:space="preserve"', '', '');
		remove('<foreignObject', '</foreignObject>', '');

		remove('<i:pgf', '</i:pgf>', '');

		// Entypo stuff
		remove('enable-background="', '"', '');

		return content.trim();
	}
}

export default PasteContainer;
