'use strict';

import React from 'react';

import Icon from './icon-decoration';

function LayerToggle(props) {
	if (!props.toggle) {
		return <span className="plugin-layer-toggle plugin-layer-toggle--none" />;
	}

	return (
		<span
			className={
				'plugin-layer-toggle plugin-layer-toggle--' +
				(props.open ? 'open' : 'close')
			}
		>
			<Icon
				name={'layer-' + (props.open ? 'open' : 'close')}
				onClick={event => {
					event.preventDefault();
					if (props.onToggle) {
						props.onToggle();
					}
				}}
			/>
		</span>
	);
}

export default LayerToggle;
