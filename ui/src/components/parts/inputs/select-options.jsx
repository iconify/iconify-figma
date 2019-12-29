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

import Icon from '../icon-decoration';

class SelectOptions extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hover: '' + props.value,
		};
	}

	/**
	 * Render options
	 *
	 * @return {*}
	 */
	render() {
		let props = this.props,
			value = '' + props.value,
			hover = this.state.hover;

		let options = Object.keys(props.options).map(key => {
			let className = 'plugin-select-option';
			if (key === value) {
				className += ' plugin-select-option--selected';
			}
			if (key === hover) {
				className += ' plugin-select-option--hover';
			}

			return (
				<li
					key={key}
					className={className}
					onClick={this._onClick.bind(this, key)}
					onMouseOver={this.setHover.bind(this, key)}
				>
					{key === value && <Icon name="check" />}
					{props.options[key]}
				</li>
			);
		});

		return <ul className="plugin-select-options">{options}</ul>;
	}

	/**
	 * Check other inputs for focus
	 */
	componentDidMount() {
		this._keyEvent = this._handleKeyboard.bind(this);
		document.addEventListener('keydown', this._keyEvent);
	}

	/**
	 * Remove event listener
	 */
	componentWillUnmount() {
		if (this._keyEvent !== void 0) {
			document.removeEventListener('keydown', this._keyEvent);
		}
	}

	/**
	 * Handle up/down keys
	 *
	 * @param event
	 * @private
	 */
	_handleKeyboard(event) {
		if (!event || !event.keyCode) {
			return;
		}

		if (event.keyCode !== 40 && event.keyCode !== 38) {
			// down = 40, up = 38
			return;
		}

		let keys = Object.keys(this.props.options),
			index = keys.indexOf('' + this.props.value),
			newIndex = index;

		event.preventDefault();
		switch (event.keyCode) {
			case 38:
				// Select previous index
				newIndex =
					index === -1 ? keys.length - 1 : index > 0 ? index - 1 : index;
				break;

			case 40:
				// Select next index
				newIndex =
					index === -1 ? 0 : index < keys.length - 1 ? index + 1 : index;
		}

		if (newIndex !== index) {
			let value = keys[newIndex];
			this.setHover(value);
			if (value !== this.props.value && this.props.onChange) {
				this.props.onChange(value, true);
			}
		}
	}

	/**
	 * Change hover item
	 *
	 * @param key
	 */
	setHover(key) {
		this.setState({
			hover: key,
		});
	}

	/**
	 * Option clicked
	 *
	 * @param {string} key
	 * @param {*} event
	 * @private
	 */
	_onClick(key, event) {
		event.preventDefault();
		if (this.props.onChange) {
			this.props.onChange(key);
		}
	}
}

export default SelectOptions;
