'use strict';

import React from 'react';

import LayerToggle from './layer-toggle';
import Icon from './icon-decoration';

function Layer(props) {
	// Class name
	let className = 'plugin-layer';
	if (props.level) {
		className += ' plugin-layer--' + props.level;
	}
	if (props.toggle) {
		className += ' plugin-layer--with-toggle';
	}
	if (props.selected) {
		className += ' plugin-layer--selected';
	}

	// Icon
	let icon = props.icon ? props.icon : 'none';

	return (
		<div className={className}>
			<a
				href={props.href ? props.href : '#'}
				onClick={event => {
					event.preventDefault();
					if (props.onClick) {
						props.onClick();
					}
				}}
			>
				{!props.skipToggle && (
					<LayerToggle
						toggle={props.toggle}
						open={props.open}
						onToggle={props.onToggle}
					/>
				)}
				<span className={'plugin-layer-icon plugin-layer-icon--' + icon}>
					<Icon name={'layer-' + icon} />
				</span>
				<span className="plugin-layer-title">{props.title}</span>
			</a>
			{(!props.toggle || props.open) && props.children}
		</div>
	);
}

export default Layer;
