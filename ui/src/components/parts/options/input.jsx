'use strict';

import React from 'react';

import Input from '../inputs/input';

function InputOption(props) {
	return (
		<dl className="plugin-option plugin-option--input">
			<dt>{props.text}</dt>
			<dd>
				<Input
					value={props.value}
					onTemporaryChange={value => {}}
					onChange={props.onChange}
					placeholder={props.placeholder}
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

export default InputOption;
