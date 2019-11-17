"use strict";

import React from 'react';

const phrases = require('../../../data/phrases');
const lang = phrases.code;

function camelCase(iconName) {
    let name = '';
    let parts = iconName.split('-');
    parts.forEach(function(part, index) {
        name += index ? part.slice(0, 1).toUpperCase() + part.slice(1) : part
    });
    if (name.charCodeAt(0) < 97 || name.charCodeAt(0) > 122) {
        // Not a-z - add "icon" at start
        name = 'icon' + name.slice(0, 1).toUpperCase() + name.slice(1);
    } else if (parts.length < 2) {
        // Add "Icon" to avoid reserved keywords
        name += 'Icon';
    }
    return name;
}

function ReactCodeBlock(props) {
    let icon = props.icon;

    let attribs = [],
        style = [];

    if (icon.hasColor && icon.color) {
        style.push('color: \'' + icon.color + '\'');
    }

    if (icon.height) {
        style.push('fontSize: \'' + icon.height + 'px\'');
    }

    if (style.length) {
        attribs.push(' style={{' + style.join(', ') + '}}');
    }

    if (icon.hFlip) {
        attribs.push(' hFlip={true}');
    }
    if (icon.vFlip) {
        attribs.push(' vFlip={true}');
    }

    if (icon.rotate > 0) {
        attribs.push(' rotate="' + (icon.rotate * 90) + 'deg"');
    }

    // Generate HTML code
    let reactInstall = 'npm install --save-dev @iconify/react @iconify/icons-' + icon.icon.prefix,
        varName = camelCase(icon.icon.name),
        reactImport1 = 'import { Icon, InlineIcon } from \'@iconify/react\';\n',
        reactImport2 = 'import ' + varName + ' from \'@iconify/icons-' + icon.icon.prefix + '/' + icon.icon.name + '\';',
        reactUsage = '<Icon icon={' + varName + '}' + attribs.join('') + ' />';

    return <div className="plugin-code plugin-code--react">
        {lang.reactCode1}
        <div className="plugin-code-sample">{reactInstall}</div>
        {lang.reactCode2}
        <div className="plugin-code-sample">{reactImport1}<br />{reactImport2}</div>
        {lang.reactCode3}
        <div className="plugin-code-sample">{reactUsage}</div>
        {lang.reactCode4Start}<a href="https://github.com/iconify/iconify-react" target="_blank">{lang.reactCode4Link}</a>{lang.reactCode4End}
    </div>;
}

export default ReactCodeBlock;
