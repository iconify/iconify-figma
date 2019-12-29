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

import Input from './input';
import Button from './button';

class SearchForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	/**
	 * Render component
	 *
	 * @return {*}
	 */
	render() {
		let props = this.props,
			value = this.state.value,
			empty = !value.length;

		return (
			<form
				className={
					'plugin-search-form' + (empty ? ' plugin-search-form--empty' : '')
				}
				onSubmit={this.submit.bind(this)}
			>
				<Input
					icon="search"
					focus={props.focus}
					onChange={this.changeValue.bind(this)}
					ref={input => (this.input = input)}
					placeholder={props.placeholder}
					value={value}
				/>
				{props.button && (
					<Button
						name="search"
						type="primary"
						title={props.button}
						onClick={this.submit.bind(this)}
					/>
				)}
			</form>
		);
	}

	/**
	 * Change value
	 *
	 * @param {string} value
	 */
	changeValue(value) {
		let props = this.props;

		this.setState({
			value: value,
		});

		if (props.onChange) {
			props.onChange(value);
		}
	}

	/**
	 * Submit form
	 *
	 * @param event
	 */
	submit(event) {
		let props = this.props,
			value = this.state.value.trim();

		event.preventDefault();

		if (!value.length) {
			this.input.focus();
			return;
		}

		if (props.onSubmit) {
			props.onSubmit(value);
		}
	}
}

export default SearchForm;
