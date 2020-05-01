'use strict';

import React from 'react';
import { camelCase } from './misc';

const phrases = require('../../../data/phrases');
const lang = phrases.code;

function SvelteCodeBlock(props) {
	let icon = props.icon;

	let attribs = [],
		style = [];

	if (icon.hasColor && icon.color) {
		style.push('color: ' + icon.color + ';');
	}

	if (icon.height) {
		style.push('font-size: ' + icon.height + 'px;');
	}

	if (style.length) {
		attribs.push(' style="' + style.join(' ') + '"');
	}

	if (icon.hFlip) {
		attribs.push(' hFlip={true}');
	}
	if (icon.vFlip) {
		attribs.push(' vFlip={true}');
	}

	if (icon.rotate > 0) {
		attribs.push(' rotate={' + icon.rotate + '}');
	}

	// Generate HTML code
	let svelteInstall =
			'npm install --save-dev @iconify/svelte @iconify/icons-' +
			icon.icon.prefix,
		varName = camelCase(icon.icon.name),
		svelteImport =
			"import Icon from '@iconify/svelte';\n" +
			'import ' +
			varName +
			" from '@iconify/icons-" +
			icon.icon.prefix +
			'/' +
			icon.icon.name +
			"';",
		svelteUsage = '<Icon icon={' + varName + '}' + attribs.join('') + ' />';

	return (
		<div className="plugin-code plugin-code--svelte">
			{lang.svelteCode1}
			<div className="plugin-code-sample">{svelteInstall}</div>
			{lang.svelteCode2}
			<div className="plugin-code-sample">{svelteImport}</div>
			{lang.svelteCode3}
			<div className="plugin-code-sample">{svelteUsage}</div>
			{lang.svelteCode4Start}
			<a
				href="https://github.com/iconify/iconify/tree/master/packages/svelte"
				target="_blank"
			>
				{lang.svelteCode4Link}
			</a>
			{lang.svelteCode4End}
		</div>
	);
}

export default SvelteCodeBlock;
