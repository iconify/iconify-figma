'use strict';

import React from 'react';
import Iconify from '@iconify/iconify';

const phrases = require('../../../data/phrases');
const lang = phrases.code;

function HTMLCodeBlock(props) {
	let icon = props.icon,
		name = icon.icon.prefix + ':' + icon.icon.name;

	let version = Iconify.getVersion(),
		majorVersion = version.split('.').shift();

	let attribs = [],
		styles = [];

	if (icon.hasColor && icon.color) {
		styles.push('color: ' + icon.color + ';');
	}
	if (icon.height) {
		styles.push('font-size: ' + icon.height + 'px;');
	}

	if (styles.length) {
		attribs.push(' style="' + styles.join(' ') + '"');
	}

	if (icon.hFlip) {
		attribs.push(
			' data-flip="horizontal' + (icon.vFlip ? ',vertical' : '') + '"'
		);
	} else if (icon.vFlip) {
		attribs.push(' data-flip="vertical"');
	}

	if (icon.rotate > 0) {
		attribs.push(' data-rotate="' + icon.rotate * 90 + 'deg"');
	}

	// Generate HTML code
	let html =
			'<iconify-icon data-icon="' +
			name +
			'"' +
			attribs.join('') +
			'></iconify-icon>',
		script =
			'<script src="https://code.iconify.design/' +
			majorVersion +
			'/' +
			version +
			'/iconify.min.js"></script>';

	// Extra code for footer
	let footerCode = null;
	if (props.footer) {
		let html2 =
			'<iconify-icon data-icon="' +
			name +
			'" style="font-size: 24px;' +
			(icon.hasColor ? ' color: red;' : '') +
			'"></iconify-icon>';

		footerCode = [
			props.hasColor ? lang.htmlCodeTextColor : lang.htmlCodeText,
			// <div key="footer2" className="plugin-code-sample">{html2}</div>,
			<div key="footer3" className="plugin-code-sample">
				{html2
					.replace('<iconify-icon', '<span class="iconify" data-inline="false"')
					.replace('</iconify-icon>', '</span>')}
			</div>,
		];
	}

	return (
		<div className="plugin-code plugin-code--html">
			{lang.htmlCode1}
			<div className="plugin-code-sample">{script}</div>
			{lang.htmlCode2}
			{/*<div className="plugin-code-sample">{html}</div>*/}
			<div className="plugin-code-sample">
				{html
					.replace('<iconify-icon', '<span class="iconify" data-inline="false"')
					.replace('</iconify-icon>', '</span>')}
			</div>
			{footerCode}
			{lang.htmlCode3Start}
			<a href="https://iconify.design/docs/iconify-in-pages/" target="_blank">
				{lang.htmlCode3Link}
			</a>
			{lang.htmlCode3End}
		</div>
	);
}

export default HTMLCodeBlock;
