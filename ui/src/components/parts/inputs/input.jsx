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

class Input extends Component {
	constructor(props) {
		super(props);

		let value =
			typeof props.value === 'string' || typeof props.value === 'number'
				? '' + props.value
				: '';

		this.state = {
			// Value in input, might be temporary
			editorValue: value,

			// Actual value
			value: value,

			// Focused state
			focused: false,
		};
	}

	/**
	 * Render input
	 *
	 * @return {*}
	 */
	render() {
		let props = this._getProps(),
			state = this.state,
			canReset = this.props.canReset !== false,
			className =
				'plugin-input' +
				(typeof props.className === 'string' ? ' ' + props.className : ''),
			wrapperClassName =
				'plugin-input-wrapper' +
				(typeof props.wrapperClassName === 'string'
					? ' ' + props.wrapperClassName
					: ''),
			resetButton = null,
			icon = null,
			value = state.editorValue;

		// Reset button
		if (canReset) {
			className += ' plugin-input--with-reset';
			if (value.length) {
				let title = props.resetTitle ? props.resetTitle : 'Reset';
				resetButton = (
					<span
						className="plugin-input-reset"
						onClick={this._onResetClick.bind(this)}
						title={title}
					>
						<Icon name="reset" />
					</span>
				);
			}
		}

		// Icon
		if (props.children) {
			// Icon is passed as child item, "iconType" property is set for icon name
			className += ' plugin-input--with-icon';
			if (typeof props.iconType === 'string') {
				className += ' plugin-input--with-icon--' + props.iconType;
				wrapperClassName += ' plugin-input-wrapper--' + props.iconType;
			}
			icon = (
				<div
					className={
						'plugin-input-icon' +
						(props.iconType ? ' plugin-input-icon--' + props.iconType : '')
					}
				>
					{props.children}
				</div>
			);
		} else if (props.icon) {
			// Icon is passed as "icon" property
			className +=
				' plugin-input--with-icon plugin-input--with-icon--' + props.icon;
			wrapperClassName += ' plugin-input-wrapper--' + props.icon;
			icon = this._renderIcon(props.icon);
		}

		// Generate attributes
		let attribs = {
			type: 'text',
			placeholder: props.placeholder,
			className: className,
			onChange: this._onChange.bind(this),
			onFocus: this._onFocus.bind(this, true),
			onBlur: this._onFocus.bind(this, false),
			value: value,
			ref: input => (this.input = input),
		};

		if (props.spellcheck === false) {
			attribs.autoComplete = 'off';
			attribs.autoCorrect = 'off';
			attribs.autoCapitalize = 'off';
			attribs.spellCheck = 'false';
		}

		return (
			<div className={wrapperClassName}>
				<input {...attribs} ref={input => (this.input = input)} />
				{icon}
				{resetButton}
			</div>
		);
	}

	/**
	 * Render icon
	 *
	 * @param {string} name
	 * @return {*}
	 */
	_renderIcon(name) {
		return (
			<div className={'plugin-input-icon plugin-input-icon--' + name}>
				<Icon name={name} />
			</div>
		);
	}

	/**
	 * Get properties
	 *
	 * @return {object}
	 * @private
	 */
	_getProps() {
		return this.props;
	}

	/**
	 * Focus input
	 */
	focus() {
		this.input.focus();
	}

	/**
	 * Focus input
	 */
	componentDidMount() {
		if (this.props.focus === true) {
			this.input.focus();
		}
	}

	/**
	 * Input value changed
	 *
	 * @param event
	 * @private
	 */
	_onChange(event) {
		this._changeValue(event.target.value, false);
	}

	/**
	 * Change value
	 *
	 * @param {string} value
	 * @param {boolean} permanent
	 * @private
	 */
	_changeValue(value, permanent) {
		let props = this._getProps(),
			state = this.state;

		if (!permanent && typeof props.onTemporaryChange === 'function') {
			// Change in editor, might not be complete
			let result = props.onTemporaryChange(value);
			if (typeof result === 'string') {
				value = result;
			}

			this.setState({
				editorValue: value,
			});
			return;
		}

		// Permanent change
		if (typeof props.onChange === 'function' && this.state.value !== value) {
			let result = props.onChange(value);
			if (typeof result === 'string') {
				value = result;
			}
		}

		this.setState({
			editorValue: value,
			value: value,
		});
	}

	/**
	 * Focus/blur
	 *
	 * @param {boolean} focused
	 * @param event
	 * @private
	 */
	_onFocus(focused, event) {
		let props = this.props,
			state = this.state;

		this.setState({
			focused: focused,
		});

		// Validate and change value
		if (!focused) {
			if (state.editorValue !== state.value) {
				this._changeValue(state.editorValue, true);
			}
			if (typeof props.onBlur === 'function') {
				props.onBlur();
			}
			return;
		}

		// Focus
		if (typeof props.onFocus === 'function') {
			props.onFocus();
		}
	}

	/**
	 * Reset value
	 *
	 * @param event
	 * @private
	 */
	_onResetClick(event) {
		event.preventDefault();
		this._changeValue('', true);
	}
}

export default Input;
