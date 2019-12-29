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
const keywords = require('cyberalien-color/src/keywords');

import Input from './input';

let allKeywords = null;
const colorFunctions = ['rgb', 'rgba', 'hsl', 'hsla'];

class ColorInput extends Input {
	constructor(props) {
		super(props);

		let state = this.state;

		// Default color for sample
		let defaultColor =
			typeof props.defaultColor === 'string' && props.defaultColor.length
				? props.defaultColor
				: '#000';
		state.defaultSampleColor = defaultColor;

		// Sample color
		state.sampleColor = state.value.length ? state.value : defaultColor;

		// Recent event values
		state.lastTemporaryChange = null;
		state.lastChange = null;
	}

	/**
	 * Get properties
	 *
	 * @return {object}
	 * @private
	 */
	_getProps() {
		return Object.assign({}, this.props, {
			className:
				'plugin-input--color' +
				(this.props.className ? ' ' + this.props.className : ''),
			icon: 'color',
			spellcheck: false,
			onTemporaryChange: this._onTemporaryColorChange.bind(this),
			onChange: this._onColorChange.bind(this),
		});
	}

	/**
	 * Render icon
	 *
	 * @param {string} name
	 * @return {*}
	 * @private
	 */
	_renderIcon(name) {
		return (
			<span
				className="plugin-input-color-sample"
				style={{ backgroundColor: this.state.sampleColor }}
			/>
		);
	}

	/**
	 * Change value
	 *
	 * @param value
	 * @param permanent
	 * @private
	 */
	_changeValue(value, permanent) {
		super._changeValue(value, permanent);
	}

	/**
	 * Change value while editing
	 *
	 * @param {string} value
	 * @return {string}
	 * @private
	 */
	_onTemporaryColorChange(value) {
		let state = this.state,
			props = this.props;

		if (value === '') {
			if (
				typeof props.onTemporaryChange === 'function' &&
				state.lastTemporaryChange !== value
			) {
				props.onTemporaryChange(value);
			}
			this.setState({
				sampleColor: state.defaultSampleColor,
				lastTemporaryChange: value,
			});
			return '';
		}

		let fixedValue = this._validateColor(value, '');
		if (fixedValue !== '') {
			if (
				typeof props.onTemporaryChange === 'function' &&
				state.lastTemporaryChange !== fixedValue
			) {
				props.onTemporaryChange(fixedValue);
			}
			this.setState({
				sampleColor: fixedValue,
				lastTemporaryChange: fixedValue,
			});
		}
		return value;
	}

	/**
	 * Change value
	 *
	 * @param {string} value
	 * @private
	 */
	_onColorChange(value) {
		let state = this.state,
			props = this.props;

		// Set value to last valid color if it is not default value
		if (value.length) {
			value = this._validateColor(
				value,
				state.defaultSampleColor === state.sampleColor ? '' : state.sampleColor
			);
		}

		// Run onChange to possibly get modified value
		if (typeof props.onChange === 'function' && state.lastChange !== value) {
			let result = props.onChange(value);
			if (typeof result === 'string') {
				value = result;
			}
		}

		// Update sample and value
		if (!value.length) {
			// Value was reset to default
			this.setState({
				sampleColor: state.defaultSampleColor,
				lastChange: value,
			});
		} else {
			this.setState({
				sampleColor: value,
				lastChange: value,
			});
		}
		return value;
	}

	/**
	 * Validate color
	 *
	 * @param {string} value
	 * @param {string} defaultValue
	 * @return {string}
	 * @private
	 */
	_validateColor(value, defaultValue) {
		// Keywords
		if (allKeywords === null) {
			allKeywords = Object.keys(keywords.all);
		}
		if (allKeywords.indexOf(value.toLowerCase()) !== -1) {
			// Valid color keyword
			return value;
		}

		// 123
		if (value.match(/^[a-f0-9]+$/i)) {
			switch (value.length) {
				case 3:
				case 4:
				case 6:
				case 8:
					return '#' + value;
			}
		}

		// #123
		if (value.match(/^#[a-f0-9]+$/i)) {
			switch (value.length - 1) {
				case 3:
				case 4:
				case 6:
				case 8:
					return value;
			}
		}

		// Must be some function: rgb(), rgba(), hsl(), hsla()
		if (value.slice(-1) !== ')') {
			return defaultValue;
		}

		let parts = value.split('(');
		if (parts.length !== 2) {
			return defaultValue;
		}

		let keyword = parts.shift().toLowerCase();
		if (colorFunctions.indexOf(keyword) === -1) {
			return defaultValue;
		}

		// Number of arguments must match function length (rgb, hsl = 3, rgba, hsla = 4)
		// Or length should be 1 for whitespace syntax
		let length = parts.shift().split(',').length;
		if (length > 1 && length !== keyword.length) {
			return defaultValue;
		}

		// Validate function by creating dom element
		let node = document.createElement('div');
		node.style.color = value;
		if (node.style.color !== '') {
			return value;
		}

		return defaultValue;
	}
}

export default ColorInput;
