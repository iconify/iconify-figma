'use strict';

import React from 'react';
import { camelCase } from './misc';

const phrases = require('../../../data/phrases');
const lang = phrases.code;

function VueCodeBlock(props) {
	let icon = props.icon;

	let attribs = [],
		style = [];

	if (icon.hasColor && icon.color) {
		style.push("color: '" + icon.color + "'");
	}

	if (icon.height) {
		style.push("fontSize: '" + icon.height + "px'");
	}

	if (style.length) {
		attribs.push(' :style="{' + style.join(', ') + '}"');
	}

	if (icon.hFlip) {
		attribs.push(' :horizontal-flip="true"');
	}
	if (icon.vFlip) {
		attribs.push(' :vertical-flip="true"');
	}

	if (icon.rotate > 0) {
		attribs.push(' :rotate="' + icon.rotate + '"');
	}

	// Generate HTML code
	let vueInstall =
			'npm install --save-dev @iconify/vue @iconify/icons-' + icon.icon.prefix,
		varName = camelCase(icon.icon.name),
		vueImport =
			"import IconifyIcon from '@iconify/vue';\n" +
			'import ' +
			varName +
			" from '@iconify/icons-" +
			icon.icon.prefix +
			'/' +
			icon.icon.name +
			"';",
		vueComponent =
			'export default Vue.extend({\n' +
			'\tcomponents: {\n' +
			'\t\tIconifyIcon,\n' +
			'\t},\n' +
			'\tdata() {\n' +
			'\t\treturn {\n' +
			'\t\t\ticons: {\n' +
			'\t\t\t\t' +
			varName +
			// ': ' +
			// varName +
			',\n' +
			'\t\t\t},\n' +
			'\t\t};\n' +
			'\t},\n' +
			'});',
		vueUsage =
			'<template>\n' +
			'\t<IconifyIcon :icon="icons.' +
			varName +
			'"' +
			attribs.join('') +
			' />\n' +
			'</template>';

	return (
		<div className="plugin-code plugin-code--vue">
			{lang.vueCode1}
			<div className="plugin-code-sample">{vueInstall}</div>
			{lang.vueCode2}
			<div className="plugin-code-sample">{vueImport}</div>
			{lang.vueCode3}
			<div className="plugin-code-sample">{vueComponent}</div>
			{lang.vueCode4}
			<div className="plugin-code-sample">{vueUsage}</div>
			{lang.vueCode5Start}
			<a
				href="https://github.com/iconify/iconify/tree/master/packages/vue"
				target="_blank"
			>
				{lang.vueCode5Link}
			</a>
			{lang.vueCode5End}
		</div>
	);
}

export default VueCodeBlock;
