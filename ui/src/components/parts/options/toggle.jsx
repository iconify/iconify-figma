'use strict';

import React, { Component } from 'react';

class ToggleOption extends Component {
	render() {
		let props = this.props;

		return (
			<div className="plugin-option plugin-option--toggle">
				<label>
					<input
						id={props.id}
						type="checkbox"
						checked={props.value}
						onChange={this._onClick.bind(this)}
					/>
					{props.text}
					{props.children}
				</label>
				{props.hint && (
					<small className="plugin-option-hint">{props.hint}</small>
				)}
			</div>
		);
	}

	/**
	 * Box clicked
	 *
	 * @param event
	 * @private
	 */
	_onClick(event) {
		this.props.onChange(!this.props.value);
	}
}

export default ToggleOption;
