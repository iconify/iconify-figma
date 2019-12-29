'use strict';

import React from 'react';

import Select from '../inputs/select';

function SelectOption(props) {
	return (
		<dl className="plugin-option plugin-option--input">
			<dt>{props.text}</dt>
			<dd>
				<Select
					options={props.options}
					value={props.value}
					onChange={props.onChange}
					className="plugin-input--underlined"
				/>
				{props.children}
				{props.hint && (
					<small className="plugin-option-hint">{props.hint}</small>
				)}
			</dd>
		</dl>
	);
}

export default SelectOption;
